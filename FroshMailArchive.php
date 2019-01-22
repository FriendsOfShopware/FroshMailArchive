<?php

namespace FroshMailArchive;

use Doctrine\ORM\Tools\SchemaTool;
use FroshMailArchive\Models\Attachment;
use FroshMailArchive\Models\Mails;
use Shopware\Components\Plugin;
use Shopware\Components\Plugin\Context\ActivateContext;
use Shopware\Components\Plugin\Context\InstallContext;
use Shopware\Components\Plugin\Context\UpdateContext;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class FroshMailArchive extends Plugin
{
    public function activate(ActivateContext $context)
    {
        $context->scheduleClearCache(InstallContext::CACHE_LIST_DEFAULT);
    }

    public function update(UpdateContext $context)
    {
        $this->updateDatabase();
        $context->scheduleClearCache(InstallContext::CACHE_LIST_DEFAULT);
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
        $container->setParameter('frosh_mail_archive.plugin_dir', $this->getPath());
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
