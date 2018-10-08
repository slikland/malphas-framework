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

        <!-- VIEW ROLE -->
        <section id="role" class="section page-content">
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

                <div class="box">

                    <form id="formCrudAjax"
                          class="form-crud is-form-create"
                          action="javascript:void(0);"
                          data-redirect="<?php echo baseUrl('mediamanager'); ?>"
                          data-action="<?php if(empty($media)) {
                              echo baseUrl('mediamanager/insert/');
                          } else {
                              echo baseUrl('mediamanager/update/' . $media['id']);
                          } ?>"
                          method="POST">

                        <div class="field is-horizontal">
                            <div class="field-label is-medium">
                                <label class="label">Arquivo</label>
                            </div>
                            <div class="field-body">
                            <?php if(!empty($media['name'])) :

                                switch ($media['ext']) {
                                    case 'jpg':
                                    case 'jpeg':
                                    case 'png':
                                    case 'gif':
                                        ?> <a href="<?php echo baseUrlUpload($media['name']); ?>" target="_blank"><img src="<?php echo baseUrlUpload($media['name']); ?>"></a> <?php
                                        break;

                                    default :
                                        ?>
                                    <span style="font-size: 100px; display: inline-block; margin-right: 30px;">
                                        <i class="file-manager-type <?php echo mediaIcon($media['ext']); ?>"></i>
                                    </span>
                                    <span>
                                        <strong style="display: block; margin-top: 30px; margin-bottom: 10px;">Tamanho : <?php echo \core\Utils\File::convertByteToMega(($media['size'])); ?></strong>
                                        <a class="button is-success" href="<?php echo baseUrlUpload($media['name']); ?>" target="_blank">
                                            <i class="fas fa-download"></i>
                                            <span>DOWLOAD</span>
                                        </a>
                                    </span>
                                        <?php
                                        break;
                                }

                                else : ?>
                                <div class="field">
                                    <div class="file">
                                        <label class="file-label">
                                            <input class="file-input" type="file" name="resume">
                                            <span class="file-cta">
                                                <span class="file-icon">
                                                    <i class="fas fa-upload"></i>
                                                </span>
                                                <span class="file-label">
                                                    Selecione um Arquivo até 8MB
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                    <p class="help is-danger"></p>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-medium">
                                <label class="label">Nome do Arquivo</label>
                            </div>
                            <div class="field-body">
                                <div class="field has-addons">
                                    <div class="control has-icons-right is-expanded">
                                        <input id="fileName"
                                               name="name"
                                               class="input is-medium"
                                               type="text"
                                               placeholder=". . ."
                                               value="<?php echo !empty($media['name']) ? \core\Utils\File::getName($media['name']) : ''; ?>">

                                        <span class="icon is-medium is-right icon-success" style="display: none;">
                                            <i class="fa fa-check"></i>
                                        </span>
                                        <span class="icon is-medium is-right icon-error" style="display: none;">
                                            <i class="fa fa-times"></i>
                                        </span>
                                    </div>
                                    <?php if(!empty($media['ext'])) : ?>
                                    <p class="control">
                                        <a class="button is-static is-medium">
                                            <input type="hidden" name="ext" value="<?php echo $media['ext']; ?>">
                                            .<?php echo $media['ext']; ?>
                                        </a>
                                    </p>
                                    <?php endif; ?>
                                    <p class="help is-danger"></p>

                                </div>
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-label is-medium">
                                <label class="label">Descrição do Arquivo</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control has-icons-right">
                                        <textarea id="fileDescription" name="description" class="textarea" placeholder=". . ."><?php echo !empty($media['description']) ? $media['description'] : ''; ?></textarea>
                                        <span class="icon is-medium is-right icon-success" style="display: none;">
                                            <i class="fa fa-check"></i>
                                        </span>
                                        <span class="icon is-medium is-right icon-error" style="display: none;">
                                            <i class="fa fa-times"></i>
                                        </span>
                                    </div>
                                    <p class="help is-danger"></p>
                                </div>
                            </div>
                        </div>
                        <?php if(!empty($media['created_at'])) : ?>
                        <div class="field is-horizontal">
                            <div class="field-label is-medium">
                                <label class="label">Criado em :</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <strong style="display: block; margin-top: 5px;" class="is-size-4">
                                            <?php echo dateFormatBR($media['created_at']); ?>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                        <?php if(!empty($media['updated_at'])) : ?>
                        <div class="field is-horizontal">
                            <div class="field-label is-medium">
                                <label class="label">Editado em :</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <strong style="display: block; margin-top: 5px;" class="is-size-4">
                                            <?php echo dateFormatBR($media['updated_at']); ?>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>




                        <div class="field is-horizontal" style="margin-top: 30px;">
                            <div class="field-label">
                                <!-- Left empty for spacing -->
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control has-text-right">
                                        <a class="button is-medium" href="<?php echo baseUrl('mediamanager/'); ?>">
                                            CANCELAR
                                        </a>
                                        <button id="formBtnSubmit" class="button is-medium is-dark">
                                            <?php echo empty($role) ? 'ADICIONAR NOVO ARQUIVO' : 'EDITAR ARQUIVO'; ?>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

            </div>
        </section>
        <!-- VIEW ROLE -->


        <?php inc('_common/footer.php'); ?>
    </div>

    <?php inc('_common/content-after.php'); ?>
    </body>
</html>