<?php

namespace TinectMailArchive\Subscriber;

use Enlight\Event\SubscriberInterface;
use Enlight_Components_Mail;
use Symfony\Component\DependencyInjection\ContainerInterface;
use TinectMailArchive\Components\DatabaseMailTransport;

/**
 * Class ControllerPathSubscriber
 * @package TinectMailArchive\Subscriber
 */
class OnMailSubscriber implements SubscriberInterface
{

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * ControllerPathSubscriber constructor.
     * @param $container
     */
    public function __construct($container)
    {
        $this->container = $container;
    }

    /**
     * Returns an array of event names this subscriber wants to listen to.
     *
     * The array keys are event names and the value can be:
     *
     *  * The method name to call (position defaults to 0)
     *  * An array composed of the method name to call and the priority
     *  * An array of arrays composed of the method names to call and respective
     *    priorities, or 0 if unset
     *
     * For instance:
     *
     * <code>
     * return array(
     *     'eventName0' => 'callback0',
     *     'eventName1' => array('callback1'),
     *     'eventName2' => array('callback2', 10),
     *     'eventName3' => array(
     *         array('callback3_0', 5),
     *         array('callback3_1'),
     *         array('callback3_2')
     *     )
     * );
     *
     * </code>
     *
     * @return array The event names to listen to
     */
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

        if ($args->get('transport') instanceof DatabaseMailTransport) {
            return;
        }

        $mailsave = clone $mail;

        $transport = $this->container->get('tinect_mail_archive.components.database_mail_transport');
        $mailsave->send($transport);

    }
}