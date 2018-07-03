<?php

namespace TinectMailArchive\Components;

use Doctrine\DBAL\Connection;

/**
 * Class DatabaseMailTransport
 * @package TinectMailArchive\Components
 */
class DatabaseMailTransport extends \Zend_Mail_Transport_Abstract
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * DatabaseMailTransport constructor.
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * Send an email independent from the used transport
     *
     * The requisite information for the email will be found in the following
     * properties:
     *
     * - {@link $recipients} - list of recipients (string)
     * - {@link $header} - message header
     * - {@link $body} - message body
     */
    protected function _sendMail()
    {
        $attachments = [];
        if ($this->_mail->hasAttachments) {
            $parts = $this->_mail->getParts();

            /** @var \Zend_Mime_Part $part */
            foreach ($parts as $part) {
                if ($part->disposition === 'attachment') {
                    $attachments[] = [
                        'file_name' => $part->filename,
                        'content' => $part->getContent()
                    ];
                }
            }
        }

        $this->connection->insert('s_plugin_tinectmailarchive', [
            'created' => date('Y-m-d H:i:s'),
            'senderAddress' => $this->_mail->getFrom(),
            'receiverAddress' => implode(',', $this->_mail->getRecipients()),
            'subject' => iconv_mime_decode($this->_mail->getSubject()),
            'bodyText' => $this->_mail->getPlainBodyText(),
            'bodyHtml' => $this->_mail->getPlainBody(),
            'eml' => $this->header . $this->EOL . $this->body
        ]);

        $insertId = $this->connection->lastInsertId();
        foreach ($attachments as $attachment) {
            $attachment['mail_id'] = $insertId;
            $this->connection->insert('s_plugin_tinectmailarchive_attachments', $attachment);
        }
    }
}