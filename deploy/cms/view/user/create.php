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
            <!-- VIEW USER CREATE EDIT -->
            <section id="userCreate" class="section page-content">
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

                    <div class="box">

                        <!-- FORM SUBMIT -->
                        <form id="formCrudAjax"
                              class="form-crud is-form-create"
                              action="javascript:void(0);"
                              data-redirect="<?php echo baseUrl('user'); ?>"
                              data-action="<?php if(empty($user)) {
                                  echo baseUrl('user/insert/');
                              } else {
                                  echo baseUrl('user/update/' . $user['id']);
                              } ?>"
                              method="POST">

                            <!-- INPUT -->
                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">Nome Completo</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userName"
                                                   name="name"
                                                   class="input is-medium"
                                                   type="text"
                                                   placeholder=". . ."
                                                   value="<?php echo !empty($user['name']) ? $user['name'] : ''; ?>">

                                            <span class="icon is-medium is-left">
                                                <i class="fa fa-address-card"></i>
                                            </span>

                                            <span class="icon is-medium is-right icon-success" style="display: none;">
                                                <i class="fa fa-check"></i>
                                            </span>
                                            <span class="icon is-medium is-right icon-error" style="display: none;">
                                                <i class="fa fa-times"></i>
                                            </span>
                                        </div>
                                        <p class="help"></p>
                                    </div>
                                </div>
                            </div>


                            <!-- INPUT -->
                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">E-mail</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userEmail"
                                                   name="email"
                                                   class="input is-medium"
                                                   type="text"
                                                   placeholder=". . ."
                                                   value="<?php echo !empty($user['email']) ? $user['email'] : ''; ?>">

                                            <span class="icon is-medium is-left">
                                                <i class="fa fa-envelope"></i>
                                            </span>
                                                <span class="icon is-medium is-right icon-success" style="display: none;">
                                                <i class="fa fa-check"></i>
                                            </span>
                                                <span class="icon is-medium is-right icon-error" style="display: none;">
                                                <i class="fa fa-times"></i>
                                            </span>
                                        </div>
                                        <p class="help"></p>
                                    </div>
                                </div>
                            </div>


                            <!-- INPUT -->
                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">Permissão</label>
                                </div>
                                <div class="field-body">

                                    <div class="field">
                                        <div class="control has-icons-left">
                                            <?php if(!empty($roles)) : ?>
                                            <div class="select is-medium is-fullwidth">
                                                <select id="userPermissions" name="cms_role_id" type="select">
                                                    <option value="">Escolha a Permissão</option>
                                                    <?php foreach ($roles as $value) : ?>
                                                    <option value="<?php echo $value['id']; ?>" <?php if(!empty($user) && $value['id'] == $user['cms_role_id']) { echo 'selected'; } ?>>
                                                        <?php echo $value['name']; ?>
                                                    </option>
                                                    <?php endforeach; ?>
                                                </select>
                                            </div>
                                            <span class="icon is-medium is-left">
                                                <i class="fa fa-key"></i>
                                            </span>
                                            <?php endif; ?>
                                        </div>
                                        <p class="help"></p>

                                    </div>

                                </div>
                            </div>


                            <!-- INPUT -->
                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">Senha</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userPassword"
                                                   name="password"
                                                   class="input is-medium"
                                                   type="password"
                                                   placeholder="Minimo de 6 caracteres"
                                                   <?php echo empty($user) ? '' : ''; ?>>

                                            <span class="icon is-medium is-left">
                                                <i class="fa fa-lock"></i>
                                            </span>
                                            <span class="icon is-medium is-right icon-success" style="display: none;">
                                                <i class="fa fa-check"></i>
                                            </span>
                                            <span class="icon is-medium is-right icon-error" style="display: none;">
                                                <i class="fa fa-times"></i>
                                            </span>
                                        </div>
                                        <p class="help"></p>
                                    </div>
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userConfirmPassword"
                                                   name="password_confirm"
                                                   class="input is-medium"
                                                   type="password"
                                                   placeholder="Repetir Senha"
                                                   <?php echo empty($user) ? '' : ''; ?>>

                                            <span class="icon is-medium is-left">
                                                <i class="fa fa-lock"></i>
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
                                    <div class="field">
                                        <div class="control">
                                            <a id="generatePass" class="button is-medium is-warning is-fullwidth">
                                                <strong>Gerar Senha</strong>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <!-- INPUT -->
                            <div class="field is-horizontal" style="margin-top: 30px;">
                                <div class="field-label">
                                    <!-- Left empty for spacing -->
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-text-right">
                                            <a class="button is-medium" href="<?php echo baseUrl('user/'); ?>">
                                                CANCELAR
                                            </a>
                                            <button id="formBtnSubmit" class="button is-form-submit is-medium is-dark">
                                                <?php echo empty($user) ? 'CRIAR NOVO USUÁRIO' : 'EDITAR USUÁRIO'; ?>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>
                        <!-- FORM SUBMIT -->

                    </div>
                </div>
            </section>
            <!-- VIEW USER CREATE EDIT -->

            <?php inc('_common/footer.php'); ?>
        </div>
        <?php inc('_common/content-after.php'); ?>
    </body>
</html>