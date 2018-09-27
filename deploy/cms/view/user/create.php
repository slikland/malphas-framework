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

            <!-- VIEW DASHBOARD -->
            <section id="userCreate" class="section page-content">
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

                    <?php if(empty($user)) : ?>
                        <form id="formUserCreate" action="javascript:void(0);" data-action="<?php echo baseUrl('user/insert'); ?>" method="POST">
                    <?php else : ?>
                        <form id="formUserCreate" action="javascript:void(0);" data-action="<?php echo baseUrl('user/update/' . $user['id']); ?>" method="POST">
                    <?php endif; ?>

                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">Nome Completo</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userName" name="name" class="input is-medium" type="text" placeholder=". . ."
                                                   value="<?php echo !empty($user['name']) ? $user['name'] : ''; ?>" required>
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
                                    </div>
                                </div>
                            </div>



                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">E-mail</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userEmail" name="email" class="input is-medium" type="email" placeholder=". . ."
                                                   value="<?php echo !empty($user['email']) ? $user['email'] : ''; ?>" required>
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
                                    </div>
                                </div>
                            </div>



                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">Permissão</label>
                                </div>
                                <div class="field-body">

                                    <div class="field">
                                        <div class="control has-icons-left">
                                            <div class="select is-medium is-fullwidth">
                                                <select id="userPermissions" name="cms_role_id" type="select" required>
                                                    <option value="" selected>Escolha a Permissão</option>
                                                    <option value="1">Super Admin</option>
                                                    <option value="2">Admin</option>
                                                </select>
                                            </div>
                                            <span class="icon is-medium is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                        </div>
                                    </div>

                                </div>
                            </div>





                            <div class="field is-horizontal">
                                <div class="field-label is-medium">
                                    <label class="label">Senha</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userPassword" name="password" class="input is-medium" type="password" placeholder="Minimo de 8 caracteres" <?php echo empty($user) ? 'required' : ''; ?>>
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
                                    </div>
                                    <div class="field">
                                        <div class="control has-icons-left has-icons-right">
                                            <input id="userConfirmPassword" name="password_confirm" class="input is-medium" type="password" placeholder="Repetir Senha" <?php echo empty($user) ? 'required' : ''; ?>>
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
                                            <button id="formSubmit" class="button is-medium is-primary">
                                                <?php echo empty($user) ? 'CRIAR NOVO USUÁRIO' : 'EDITAR USUÁRIO'; ?>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>

                    </div>

                </div>
            </section>
            <!-- VIEW DASHBOARD -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>