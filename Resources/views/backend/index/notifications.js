//{block name="backend/index/application" append}
    if(typeof(Notification) !== "undefined") {
        var mailarchiveOptions = {
            lastMail: '{url controller=Mailarchive action=lastMail}',
            getNewMails: '{url controller=Mailarchive action=getNewMails}',
            currentMail: 0
        };

        Notification.requestPermission();

        Ext.Ajax.request({
            url: mailarchiveOptions.lastMail,
            success: function(response){
                var obj = JSON.parse(response.responseText);
                mailarchiveOptions.currentMail = obj.id;

                setInterval(function () {
                    Ext.Ajax.request({
                        url: mailarchiveOptions.getNewMails,
                        params: {
                            id: mailarchiveOptions.currentMail
                        },
                        success: function (response) {
                            var mailResponse = JSON.parse(response.responseText);

                            mailResponse.mails.forEach(function (mail) {
                                var title = "New mail to " + mail.receiverAddress;
                                var options = {
                                    body: mail.subject,
                                    tag: "Mailarchive"
                                };
                                var notification = new Notification(title, options);
                                notification.addEventListener('click', function() {
                                    Shopware.app.Application.addSubApplication({
                                        name: 'Shopware.apps.Mailarchive',
                                        params: {
                                            id: mail.id
                                        }
                                    });
                                    window.focus();
                                    notification.close();
                                });

                                mailarchiveOptions.currentMail = mail.id;
                            });
                        }
                    });

                }, 30000);
            }
        });
    }
//{/block}