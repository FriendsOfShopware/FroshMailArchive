<?php

namespace TinectMailArchive;

use Doctrine\ORM\Tools\SchemaTool;
use Shopware\Components\Plugin;
use Shopware\Components\Plugin\Context\ActivateContext;
use Shopware\Components\Plugin\Context\InstallContext;
use Shopware\Components\Plugin\Context\UpdateContext;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use TinectMailArchive\Models\Attachment;
use TinectMailArchive\Models\Mails;

class TinectMailArchive extends Plugin
{

    public function update(UpdateContext $context)
    {
        $this->updateDatabase();
    }

    public function install(InstallContext $context)
    {
        $this->updateDatabase();
    }

    /**
     * @param ContainerBuilder $container
     */
    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->setParameter('tinect_mail_archive.plugin_dir', $this->getPath());
    }

    private function updateDatabase()
    {
        $tool = new SchemaTool($this->container->get('models'));
        $tool->updateSchema([
            $this->container->get('models')->getClassMetadata(Mails::class),
            $this->container->get('models')->getClassMetadata(Attachment::class),
        ], true);
    }

}
