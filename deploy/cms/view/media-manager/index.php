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
            <section id="gerenciadorMedia" class="section page-content">
                <div class="container is-fluid">

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

                    <div id="gerenciadorMedia" class="box">

                        <div class="columns">
                            <div class="column">


                            </div>
                            <div class="column has-text-right">
                                <a id="addFileDragAndDrop" href="#/" class="button is-info"">
                                <strong>Adicionar Vários Arquivos</strong>
                                </a>
                                <a href="./ajax-image-add" class="button is-dark" rel="modal:open">
                                    <strong>Adicionar um Arquivo</strong>
                                </a>
                            </div>
                        </div>

                        <div id="uploadDragDrop">
                            <div id="uploadDragDropIcon">
                                <i class="fas fa-upload"></i>
                                <span>Arraste e solte aqui os arquivos</span>
                            </div>
                        </div>

                        <ul id="fileManagerList">
                            <?php

                            $fileList = array(

                                array(
                                    'name' => '',
                                    'path' => '',
                                    'alt' => '',
                                    'type' => 'file',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),

                                ),
                                array(
                                    'type' => 'word'
                                ),
                                array(
                                    'type' => 'powerpoint'
                                ),
                                array(
                                    'type' => 'medical'
                                ),
                                array(
                                    'type' => 'image'
                                ),
                                array(
                                    'type' => 'code'
                                ),
                                array(
                                    'type' => 'audio'
                                ),
                                array(
                                    'type' => 'video'
                                ),
                                array(
                                    'type' => 'archive'
                                ),
                                array(
                                    'type' => 'pdf'
                                ),
                                array(
                                    'type' => 'signature'
                                ),
                                array(
                                    'type' => 'excel'
                                ),
                                array(
                                    'type' => 'contract'
                                ),
                                array(
                                    'type' => 'alt'
                                ),
                                array(
                                    'type' => 'download'
                                ),
                                array(
                                    'type' => 'upload'
                                ),
                                array(
                                    'type' => 'invoice'
                                ),
                                array(
                                    'type' => 'invoice-dollar'
                                )
                            );

                            shuffle($fileList);

                            foreach ($fileList as $key => $value) :

                                ?>

                                <li class="file-manager-item">


                                    <i class="file-manager-type fa fa-<?=($value['type'] === 'file')? 'file' : 'file-' . $value['type']; ?>"></i>
                                    <a href="./ajax-image" class="file-manager-view" rel="modal:open">
                                        <i class="fa fa-eye"></i>
                                    </a>
                                    <div class="file-manager-action">
                                        <a href="#/" class="file-manager-delete">
                                            <i class="fa fa-times"></i>
                                        </a>
                                        <a href="./ajax-image-edit" class="file-manager-edit" rel="modal:open">
                                            <i class="fa fa-edit"></i>
                                        </a>
                                    </div>
                                </li>

                            <?php endforeach; ?>
                        </ul>

                    </div>

                </div>
            </section>
            <!-- VIEW GERENCIADOR DE MEDIA -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>