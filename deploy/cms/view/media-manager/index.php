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
                                    <a id="" class="button">
                                        <i class="far fa-square"></i>
                                    </a>
                                    <a id="" class="button">
                                        <i class="fas fa-sync-alt"></i>
                                    </a>
                                    <a id="" class="button blocked">
                                        <i class="fas fa-trash-alt"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="column has-text-right">
                                <a id="addFileDragAndDrop" href="#/" class="button is-info"">
                                    <strong>ADICIONAR VÁRIOS ARQUIVOS</strong>
                                </a>
                                <a href="./ajax-image-add" class="button is-dark" rel="modal:open">
                                    <strong>ADICIONAR UM ARQUIVO</strong>
                                </a>
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
                            <div id="uploadDropMediaManagerThumbs"><!-- DINAMIC THUMBS --></div>
                        </div>

                    </div>


                    <?php if(!empty($files)) : ?>
                    <div id="gerenciadorMedia" class="box">
                        <ul id="fileManagerList">
                            <?php foreach ($files as $key => $value) : ?>
                                <li class="file-manager-item">
                                    <i class="file-manager-type fa fa-<?=($value['type'] === 'file')? 'file' : 'file-' . $value['type']; ?>"></i>
                                    <a href="./ajax-image" class="file-manager-view" rel="modal:open">
                                        <i class="fa fa-eye"></i>
                                    </a>
                                    <div class="file-manager-action">
                                        <a href="#/" class="file-manager-delete">
                                            <i class="fa fa-times"></i>
                                        </a>
                                        <a href="./ajax-image-edit"
                                           class="file-manager-edit"
                                           rel="modal:open">
                                            <i class="fa fa-edit"></i>
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