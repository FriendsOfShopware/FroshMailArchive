Ext.define('Shopware.apps.Mailarchive.view.list.Mailgrid', {
    extend: 'Ext.grid.Panel',

    initComponent: function () {
        var me = this;

        me.store = Ext.create('Shopware.apps.Mailarchive.store.Mails');

        if (me.showId) {
            me.store.on('load', function () {
                me.store.each(function (record) {
                    if (parseInt(record.get('id')) === parseInt(me.showId)) {
                        me.onClickMail(record);
                    }
                })
            });
        }

        me.columns = [
            {
                text: 'Send-Date',
                dataIndex: 'created',
                flex: 1,
                renderer: function (value, metaData, record) {
                    if (value === Ext.undefined) {
                        return value;
                    }

                    return Ext.util.Format.date(value) + ' ' + Ext.util.Format.date(value, timeFormat);
                }
            },
            {
                text: 'From',
                dataIndex: 'senderAddress',
                flex: 1
            },
            {
                text: 'To',
                dataIndex: 'receiverAddress',
                flex: 1
            },
            {
                text: 'Subject',
                dataIndex: 'subject',
                flex: 1.5
            },
            Ext.create('Ext.grid.column.Action', {
                width: 60,
                items: [
                    {
                        iconCls: 'sprite-drive-download',
                        tooltip: 'Download',
                        action: 'download',
                        handler: function (view, rowIndex) {
                            var store = view.getStore(),
                                record = store.getAt(rowIndex),
                                link = "{url action=download}"
                                    + "?id=" + record.raw.id;
                            window.open(link, '_blank');
                        }
                    },
                    {
                        iconCls: 'sprite-minus-circle-frame',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, item) {
                            var store = view.getStore(),
                                record = store.getAt(rowIndex);
                            store.remove(record);
                            record.destroy();
                        }
                    }
                ]
            })
        ];

        me.pagingbar = me.getPagingBar();
        me.toolbar = me.getToolbar();
        me.dockedItems = [me.pagingbar, me.toolbar];

        me.callParent(arguments);

        me.on('select', function (grid, record) {
            me.onClickMail(record);
        })
    },

    onClickMail: function (record) {
        var me = this;
        me.up('window').setTitle('Mailarchive ' +
            Ext.util.Format.date(record.raw.created) + ' ' + Ext.util.Format.date(record.raw.created, timeFormat) +
            ' ' + record.raw.senderAddress +
            ' => ' + record.raw.receiverAddress +
            ' "' + record.raw.subject + '"');
        var container = me.up('window').down('[itemId="mail-container"]');
        container.removeAll();

        container.add(Ext.create('Shopware.apps.Mailarchive.view.list.Preview', {
            record: record
        }));
    },


    getPagingBar: function () {
        var me = this;

        return Ext.create('Ext.toolbar.Paging', {
            store: me.store,
            dock: 'bottom',
            displayInfo: true
        });

    },

    getToolbar: function () {
        var me = this;

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            ui: 'shopware-ui',
            items: me.createToolbarItems()
        });

        return me.toolbar;
    },

    createToolbarItems: function () {
        var me = this, items = [];

        items.push(Ext.create('Ext.button.Button', {
            text: 'Clear Archive',
            iconCls: 'sprite-minus-circle-frame',
            handler: function () {
                Ext.Ajax.request({
                    url: '{url action=clear}',
                    success: function (response) {
                        me.store.load();
                    }
                });
            }
        }));

        items.push('->');

        items.push(Ext.create('Ext.form.field.Text', {
            cls: 'searchfield',
            width: 170,
            emptyText: 'Search',
            enableKeyEvents: true,
            checkChangeBuffer: 500,
            listeners: {
                change: function (field, value) {
                    if (value.length === 0) {
                        me.store.clearFilter();
                    } else {
                        me.store.clearFilter(true);
                        me.store.filter({
                            property: 'search',
                            value: value
                        });
                    }
                }
            }
        }));

        return items;
    }
});