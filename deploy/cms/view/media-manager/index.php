<!doctype html>
<html class="no-js" lang="pt-br">
    <head>
        <?php inc('_common/head-meta.php'); ?>
    </head>
    <body class="loading">
        <?php
            inc('_common/content-before.php');
            inc('_common/navbar-top.php');
            inc('_common/sidebar.php');
        ?>
        <div id="wrap" class="transitions">

            <!-- VIEW GERENCIADOR DE MEDIA -->
            <section id="mediaManager" class="section page-content">
                <div class="container is-fluid">

                    <!-- REFACTORY TEMPLATE -->
                    <div class="header">
                        <nav class="breadcrumb has-arrow-separator is-small" aria-label="breadcrumbs">
                            <ul>
                                <li>
                                    <a href="dashboard.html"><?php echo title(); ?></a>
                                </li>
                                <li class="is-active">
                                    <a href="#" aria-current="dashboard"><?php echo $pageTitle; ?></a>
                                </li>
                            </ul>
                        </nav>
                        <h2 class="is-size-4">
                            <strong><?php echo $pageTitle; ?></strong>
                            <span><?php echo $pageSubTitle; ?></span>
                        </h2>
                        <hr>
                    </div>
                    <!-- REFACTORY TEMPLATE -->

                    <?php if(!empty($files)) : ?>
                    <div id="actionMediaManager">
                        <div class="columns">
                            <div class="column">
                                <div id="severalAction" class="">
                                    <a id="actionMediaManagerSelectAll"
                                       class="button">
                                        <i class="far fa-square"></i>
                                    </a>
                                    <a id="actionMediaManagerDeleteSelectedRows"
                                       class="button blocked">
                                        <i class="fas fa-trash-alt"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="column has-text-right">
                                <a id="addFileDragAndDrop" href="#/"
                                   class="button is-info"">
                                    <strong>ADICIONAR VÁRIOS ARQUIVOS</strong>
                                </a>
                                <!-- <a href="<?php echo baseUrl('mediamanager/create/'); ?>"
                                   class="button is-dark">
                                    <strong>ADICIONAR UM ARQUIVO</strong>
                                </a> -->
                            </div>
                        </div>
                        <?php endif; ?>

                        <div id="uploadDropMediaManager" class="transitions">
                            <div id="uploadDropMediaManagerIcon">
                                <i class="fas fa-upload"></i>
                                <p>Arraste e solte aqui os arquivos</p>
                                <progress id="uploadDropMediaManagerProgress"
                                          class="progress is-small transitions"
                                          value="0" max="100">0%</progress>
                            </div>
                        </div>

                    </div>


                    <?php if(!empty($files)) : ?>
                    <div id="gerenciadorMedia" class="box">
                        <form id="formSearcMedia" action="javascript:void(0);">
                            <div class="field">
                                <div class="control is-medium is-expanded">
                                    <input id="formSearcMediaInput"
                                           class="input is-medium"
                                           type="text"
                                           placeholder="Procurar arquivos">
                                </div>
                            </div>
                        </form>
                        <ul id="fileManagerList">
                            <?php foreach ($files as $key => $value) : ?>
                                <li class="file-manager-item"
                                    data-id="<?php echo $value['id']; ?>"
                                    data-search-item="<?php echo $value['description']; ?>, <?php echo $value['ext']; ?>, <?php echo $value['name']; ?>">
                                    <span class="file-manager-checkbox">
                                        <input type="checkbox" value="<?php echo $value['id']; ?>">
                                    </span>
                                    <i class="file-manager-type <?php echo mediaIcon($value['ext']); ?>"></i>
                                    <hr>
                                    <p class="file-manager-name">
                                        <i class="<?php echo mediaIcon($value['ext']); ?>"></i>
                                        <span><?php echo $value['name']; ?></span>
                                    </p>
                                    <div class="file-manager-action">
                                        <a href="<?php echo baseUrlUpload($value['name']); ?>"
                                           class="file-manager-download" target="_blank">
                                            <i class="fas fa-download"></i>
                                        </a>

                                        <a href="<?php echo baseUrl("mediamanager/edit/{$value['id']}"); ?>"
                                           class="file-manager-edit">
                                            <i class="fas fa-edit"></i>
                                        </a>

                                        <a href="<?php echo baseUrl("mediamanager/delete/{$value['id']}"); ?>"
                                           class="file-manager-delete">
                                            <i class="fas fa-times"></i>
                                        </a>
                                    </div>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <?php endif; ?>

                </div>
            </section>
            <!-- VIEW GERENCIADOR DE MEDIA -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>