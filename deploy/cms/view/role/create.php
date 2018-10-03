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
                          data-redirect="<?php echo baseUrl('role'); ?>"
                          data-action="<?php if(empty($role)) {
                              echo baseUrl('role/insert/');
                          } else {
                              echo baseUrl('role/update/' . $role['id']);
                          } ?>"
                          method="POST">

                        <div class="field is-horizontal">
                            <div class="field-label is-medium">
                                <label class="label">Nome do Grupo</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control has-icons-left has-icons-right">
                                        <input id="groupName" name="name" class="input is-medium" type="text" placeholder=". . ." value="<?php echo !empty($role['name']) ? $role['name'] : ''; ?>">
                                        <span class="icon is-medium is-left">
                                            <i class="fa fa-layer-group"></i>
                                        </span>
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


                        <div class="field is-horizontal" style="margin-top: 30px;">
                            <div class="field-label">
                                <!-- Left empty for spacing -->
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control has-text-right">
                                        <a class="button is-medium" href="<?php echo baseUrl('role/'); ?>">
                                            CANCELAR
                                        </a>
                                        <button id="formBtnSubmit" class="button is-medium is-dark">
                                            <?php echo empty($role) ? 'CRIAR NOVO GRUPO USUÁRIO' : 'EDITAR GRUPO USUÁRIO'; ?>
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