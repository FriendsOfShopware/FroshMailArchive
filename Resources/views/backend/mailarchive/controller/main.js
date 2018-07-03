Ext.define('Shopware.apps.Mailarchive.controller.Main', {
    extend: 'Enlight.app.Controller',

    init: function() {
        var me = this,
            showId = 0;

        if (me.subApplication.params && me.subApplication.params.id) {
            showId = me.subApplication.params.id;
        }

        me.mainWindow = me.getView('list.Window').create({
            showId: showId
        }).show();
    }
});