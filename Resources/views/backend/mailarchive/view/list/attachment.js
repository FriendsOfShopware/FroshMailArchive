Ext.define('Shopware.apps.Mailarchive.view.list.Attachment', {
    extend: 'Ext.grid.Panel',
    title: '{s namespace="froshmailarchive" name="label_attachments"}Attachments{/s}',
    height: '100%',
    layout: 'fit',

    initComponent: function () {
        var me = this;

        me.store = Ext.create('Shopware.apps.Mailarchive.store.Attachment');
        me.store.getProxy().extraParams.mailId = me.mailId;

        me.store.on('load', function () {
            me.setTitle('{s namespace="froshmailarchive" name="label_attachments"}Attachments{/s} (' + me.store.count().toString() + ')');
        });

        me.columns = [
            {
                text: '{s namespace="froshmailarchive" name="label_filename"}File name{/s}',
                dataIndex: 'fileName',
                flex: 1
            },
            Ext.create('Ext.grid.column.Action', {
                width: 30,
                items: [
                    {
                        iconCls: 'sprite-drive-download',
                        tooltip: '{s namespace="froshmailarchive" name="action_download"}Download{/s}',
                        handler: function (view, rowIndex, colIndex, item) {
                            var store = view.getStore(),
                                record = store.getAt(rowIndex);

                            window.open('{url action=downloadAttachment}?id=' + record.get('id'));
                        }
                    }
                ]
            })
        ];

        me.callParent(arguments);
    }
});