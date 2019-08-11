<?php


namespace FroshMailArchive\Components;

use Doctrine\DBAL\Connection;
use Enlight_Components_Mail;

/**
 * Class DatabaseMailTransport
 */
class DatabaseMailSave
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * DatabaseMailTransport constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function save(Enlight_Components_Mail $mail)
    {
        $attachments = [];
        if ($mail->hasAttachments) {
            $parts = $mail->getParts();

            /** @var \Zend_Mime_Part $part */
            foreach ($parts as $part) {
                if ($part->disposition === 'attachment') {
                    $attachments[] = [
                        'file_name' => $part->filename,
                        'content' => $part->getContent(),
                    ];
                }
            }
        }


        $this->connection->insert('s_plugin_tinectmailarchive', [
            'created' => date('Y-m-d H:i:s'),
            'senderAddress' => $mail->getFrom(),
            'receiverAddress' => implode(',', $mail->getRecipients()),
            'subject' => iconv_mime_decode($mail->getSubject()),
            'bodyText' => $mail->getPlainBodyText(),
            'bodyHtml' => $mail->getPlainBody(),
            'eml' => $mail->header . PHP_EOL . $this->body,
        ]);

        $insertId = $this->connection->lastInsertId();
        foreach ($attachments as $attachment) {
            $attachment['mail_id'] = $insertId;
            $this->connection->insert('s_plugin_tinectmailarchive_attachments', $attachment);
        }
    }
}
