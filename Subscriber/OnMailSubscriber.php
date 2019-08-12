<?php

namespace FroshMailArchive\Subscriber;

use Enlight\Event\SubscriberInterface;
use Enlight_Components_Mail;
use FroshMailArchive\Components\DatabaseMailSave;

/**
 * Class ControllerPathSubscriber
 */
class OnMailSubscriber implements SubscriberInterface
{
    /**
     * @var DatabaseMailSave
     */
    private $mailSave;

    /**
     * @param DatabaseMailSave $mailSave
     */
    public function __construct(DatabaseMailSave $mailSave)
    {
        $this->mailSave = $mailSave;
    }

    public static function getSubscribedEvents()
    {
        return [
            'Enlight_Components_Mail_Send' => ['onMail', 9999],
        ];
    }

    public function onMail(\Enlight_Event_EventArgs $args)
    {
        /** @var Enlight_Components_Mail $mail */
        $mail = $args->get('mail');

        $this->resolveStreams($mail);

        $this->mailSave->save(clone $mail);
    }

    private function resolveStreams(Enlight_Components_Mail $mail)
    {
        $parts = $mail->getParts();

        /**
         * @var string $key
         *
         * @var \Zend_Mime_Part $part
         */
        foreach ($parts as $key => $part) {
            if ($part->disposition === 'attachment' && $part->isStream()) {
                $attachment = $mail->createAttachment($part->getRawContent());
                $attachment->filename = $part->filename;
                $attachment->disposition = $part->disposition;
                $attachment->type = $part->type;

                $parts[$key] = $attachment;
            }
        }

        $mail->setParts($parts);
    }
}
