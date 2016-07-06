/**
 * TreeStateful plugin for ExtJs 5.1
 *
 * @site https://github.com/szhigunov/ExtJsStatefulTree
 * @author Sergey Zhigunov <i.sergey.zhigunov@gmail.com>
 * @copyright 2015 Sergey Zhigunov
 * @version 1.0.0
 *
 * * Fork of TreeStateful plugin for ExtJs 4.1 by AlexTiTanium
 * 
 * Andrey Ilyukhin <ai@bocp.ru>:
 * I need stateful-tree with m2m relations between nodes, so i make some changes in original code.
 *
 * Changes:
 *  1. Removed checking stateful property, simply delete plugin from tree if you don't need stateful behaviour.
 *  2. Removed extra loop in getState() method, we can make ids array in first loop.
 *  3. Some minor changes and refactoring.
 *
 *  https://github.com/andryushka/ExtJsStatefulTree
 *
 * MIT LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

Ext.define('Ext.ux.TreeStateful', {
  alias: 'plugin.treestateful',

    extend: 'Ext.AbstractPlugin',
    // add stateEvents and override TreeView methods
    init: function(view) {
        var me = this;
        view.addStateEvents(['afteritemcollapse', 'afteritemexpand']);

        view.getState = me.getState;
        view.saveState = me.saveState;

        if (view.getStore().isLoading()) {
            view.getStore().on("load", me.applyState, view);
        } else { // не понятно зачем это нужно
            Ext.callback(me.applyState, view);
        }
    },

    saveState: function() {
        var me = this;
        var stateId = me.getStateId();

        if (stateId) Ext.state.Manager.set(stateId, me.getState());
    },

    getState: function() {
        var ids = [];

        this.getStore().getRoot().cascadeBy({
            after: function(node) {
                if (node.isExpanded()) {
                    if (node.getId() == 'root') return;
                    ids.push(node.get("id")); // we use overridden getId() in model, direct access here
                }
            }
        });
        return ids;
    },

    applyState: function(view) {
        var me = this;
        var stateId = this.getStateId();
        var store = this.getStore();
        var node;

        if (stateId) {
            state = Ext.state.Manager.get(stateId);
            if (state) {
                Ext.each(state, function(id) {
                    node = store.getNodeById(id);
                    if (node && !node.isExpanded()) {
                        node.expand();
                    }
                });
            }
        }
    }
});
