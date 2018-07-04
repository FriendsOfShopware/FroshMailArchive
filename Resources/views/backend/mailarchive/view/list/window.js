Ext.define('Shopware.apps.Mailarchive.view.list.Window', {
    extend: 'Enlight.app.Window',
    title : 'Mailarchive',
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    width: 1200,

    initComponent: function () {
        var me = this;

        me.items = [
            Ext.create('Shopware.apps.Mailarchive.view.list.Mailgrid', {
                flex: 0.6,
                showId: me.showId
            }),
            Ext.create('Ext.container.Container', {
                layout: 'fit',
                itemId: 'mail-container',
                flex: 1,
                maxWidth: 800
            })
        ];

        me.callParent(arguments);
    }
});