Ext.define('Shopware.apps.Mailarchive.store.Attachment', {
    extend:'Ext.data.Store',
    model: 'Shopware.apps.Mailarchive.model.Attachment',

    autoLoad: true,
    remoteSort: true,
    remoteFilter: true,

    proxy:{
        type:'ajax',

        url: '{url controller=Mailarchive action=getAttachments}',

        reader:{
            type:'json',
            root:'data',
            totalProperty:'total'
        }
    }
});