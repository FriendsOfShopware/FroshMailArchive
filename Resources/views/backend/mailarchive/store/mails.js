Ext.define('Shopware.apps.Mailarchive.store.Mails', {
    extend:'Ext.data.Store',
    model: 'Shopware.apps.Mailarchive.model.Mails',
    autoLoad: true,
    remoteSort: true,
    remoteFilter: true,

    sorters: [{
        property: 'created',
        direction: 'DESC'
    }],

    proxy:{
        type:'ajax',

        url: '{url controller=Mailarchive action=list}',

        reader:{
            type:'json',
            root:'data',
            totalProperty:'total'
        }
    }
});