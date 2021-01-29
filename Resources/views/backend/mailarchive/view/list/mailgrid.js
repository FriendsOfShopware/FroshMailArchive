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
                text: '{s namespace="froshmailarchive" name="label_senddate"}Send-date{/s}',
                dataIndex: 'created',
                flex: 1,
                renderer: function (value, metaData, record) {
                    if (value === Ext.undefined) {
                        return value;
                    }

                    var dateformat = Ext.util.Format.date(value) + ' ' + Ext.util.Format.date(value, timeFormat);
                    metaData.tdAttr = 'data-qtip="' + dateformat + '"';
                    return dateformat;
                }
            },
            {
                text: '{s namespace="froshmailarchive" name="label_frommail"}Sender{/s}',
                dataIndex: 'senderAddress',
                flex: 1,
                renderer: function (value, metaData, record) {
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: '{s namespace="froshmailarchive" name="label_tomail"}Receivers{/s}',
                dataIndex: 'receiverAddress',
                flex: 1,
                renderer: function (value, metaData, record) {
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: '{s namespace="froshmailarchive" name="label_subject"}Subject{/s}',
                dataIndex: 'subject',
                flex: 1.5,
                renderer: function (value, metaData, record) {
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            Ext.create('Ext.grid.column.Action', {
                width: 90,
                items: [
                    {
                        iconCls: 'sprite-drive-download',
                        tooltip: '{s namespace="froshmailarchive" name="action_download"}Download{/s}',
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
                        iconCls: 'sprite-mail-send',
                        tooltip: '{s namespace="froshmailarchive" name="action_resend"}Resend{/s}',
                        handler: function (view, rowIndex, colIndex, item) {
                            var store = view.getStore(),
                                record = store.getAt(rowIndex),
                                link = "{url action=resend}";
                            Ext.Ajax.request({
                                url: link,
                                method: 'POST',
                                async: false,
                                params: {
                                    id: record.raw.id
                                },
                                success: function (response, operation) {
                                    Shopware.Notification.createGrowlMessage('{s namespace="froshmailarchive" name=send_success_title}Success sending mail{/s}');
                                    store.load();
                                },
                                error: function () {
                                    Shopware.Notification.createGrowlMessage('{s namespace="froshmailarchive" name=send_error_title}Error sending mail{/s}');
                                }
                            });
                        }
                    },
                    {
                        iconCls: 'sprite-minus-circle-frame',
                        tooltip: '{s namespace="froshmailarchive" name="action_delete"}Delete{/s}',
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
            text: '{s namespace="froshmailarchive" name="action_cleararchive"}Clear Archive{/s}',
            iconCls: 'sprite-minus-circle-frame',
            handler: function () {
                Ext.MessageBox.confirm('', '{s namespace="froshmailarchive" name="label_suretoclear"}Are you sure you want to clear the archive?{/s}', function (apply) {
                    if (apply !== 'yes') {
                        return;
                    }
                    Ext.Ajax.request({
                        url: '{url action=clear}',
                        success: function (response) {
                            me.store.load();
                        }
                    });
                });
            }
        }));

        items.push('->');

        items.push(Ext.create('Ext.form.field.Text', {
            cls: 'searchfield',
            width: 170,
            emptyText: '{s namespace="froshmailarchive" name="label_search"}search...{/s}',
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