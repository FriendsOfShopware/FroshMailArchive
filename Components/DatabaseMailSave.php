<?php


namespace FroshMailArchive\Components;

use DateTime;
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

        $mailHeaders = [];

        foreach ((array) $mail->getHeaders() as $name => $header) {
            if ($header[0]) {
                $mailHeaders[] = $name . ': ' . $header[0];
            }
        }

        $mailHeaders[] = 'Date: '.date(DateTime::RFC2822);
        $mailHeaders[] = 'Content-Type: multipart/alternative;';
        $mailHeaders[] = ' boundary="' . $mail->getMime()->boundary() . '"';
        $mailHeaders[] = 'MIME-Version: 1.0';

        $mailHeaders = \array_filter($mailHeaders);

        $eml = \implode(PHP_EOL, $mailHeaders) . PHP_EOL;
        $eml .= $mail->getMime()->boundaryLine();
        $eml .= 'Content-Type: text/html; charset=utf-8' . PHP_EOL;
        $eml .= 'Content-Transfer-Encoding: base64' . PHP_EOL . PHP_EOL;
        $eml .= \chunk_split(\base64_encode($mail->getPlainBody()), 74, PHP_EOL) . PHP_EOL;
        $eml .= $mail->getMime()->boundaryLine();

        $this->connection->insert('s_plugin_tinectmailarchive', [
            'created' => date('Y-m-d H:i:s'),
            'senderAddress' => $mail->getFrom(),
            'receiverAddress' => implode(',', $mail->getRecipients()),
            'subject' => iconv_mime_decode($mail->getSubject()),
            'bodyText' => $mail->getPlainBodyText(),
            'bodyHtml' => $mail->getPlainBody(),
            'eml' => $eml,
        ]);

        $insertId = $this->connection->lastInsertId();
        foreach ($attachments as $attachment) {
            $attachment['mail_id'] = $insertId;
            $this->connection->insert('s_plugin_tinectmailarchive_attachments', $attachment);
        }
    }
}
