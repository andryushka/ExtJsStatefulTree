Changes:
--------
1. get("id") instead getId() (i need this)
2. refactoring: remove extra loop in getState(), remove checking stateful property and other
3. tested with ExtJs 6

Plugin for Sencha ExtJS 5.1 for saving Ext.tree.Panel (treepanel) folders collapsed / expanded state.

How to use:
===========

First you need init state provider:

    Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
      expires: new Date(new Date().getTime()+(1000*60*60*24*7)) //7 days from now
    }));

Your tree view:

    Ext.define('app.view.Tree', {
      extend:'Ext.tree.Panel',
      title: 'Stateful tree',
    
      viewConfig: {
    
        stateful: true,   // Require
        stateId: 'my_id', //Require, your tree id 
        
        plugins:  [ Ext.create('Ext.ux.TreeStateful') ] // TreeStateful plugin
      },
      store: 'productsTreeStore' // store id
    });



Known issues:
-----------

 -  Report if you find any issues
