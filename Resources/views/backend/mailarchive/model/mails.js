Ext.define('Shopware.apps.Mailarchive.model.Mails', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer'
        },
        {
            name: 'created',
            type: 'date'
        },
        {
            name: 'senderAddress',
            type: 'string'
        },
        {
            name: 'receiverAddress',
            type: 'string'
        },
        {
            name: 'subject',
            type: 'string'
        },
        {
            name: 'bodyText',
            type: 'string'
        },
        {
            name: 'bodyHtml',
            type: 'string'
        }
    ],

    proxy:{
        type:'ajax',

        url: '{url controller=Mailarchive action=delete}'
    }

});