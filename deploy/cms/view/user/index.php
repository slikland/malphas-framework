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

            <!-- VIEW USER -->
            <section id="user" class="section page-content">
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

                    <?php if(count($users) > 1) : ?>

                    <div id="actionTableContent" class="columns">
                        <!-- REFACTORY TEMPLATE -->
                        <div class="column">
                            <div id="severalAction" class="">
                                <a id="actionTableContentSelectAllRows" class="button">
                                    <i class="far fa-square"></i>
                                </a>
                                <a id="actionTableContentRefreshTable" class="button">
                                    <i class="fas fa-sync-alt"></i>
                                </a>
                                <a id="actionTableContentDeleteSelectedRows" class="button blocked">
                                    <i class="fas fa-trash-alt"></i>
                                </a>
                            </div>
                        </div>
                        <!-- REFACTORY TEMPLATE -->

                        <div class="column has-text-right">
                            <a id="actionCreateNewRegister"
                               class="button is-dark"
                               href="<?php echo baseUrl('user/create'); ?>">
                                <strong>CRIAR NOVO USUÁRIO</strong>
                            </a>
                        </div>
                    </div>
                    <?php endif; ?>


                    <div class="box">

                        <?php if(count($users) <= 1) : ?>
                        <div class="notification">
                            <p class="has-text-centered">
                                <strong class="is-size-4">Nenhum usuário cadastrado</strong>
                                <br>
                                <br>
                                <a class="button is-primary is-medium"
                                   href="<?php echo baseUrl('user/create'); ?>">
                                    <strong>CRIAR PRIMEIRO USUÁRIO</strong>
                                </a>
                            </p>
                        </div>
                        <?php else : ?>
                        <table id="tableContent"
                               class="table is-fullwidth"
                               data-action="<?php echo baseUrl('user/'); ?>"
                               data-redirect="<?php echo baseUrl('user/'); ?>">
                            <thead>
                                <tr>
                                    <th class="first"></th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Permissão</th>
                                    <th>Criado em :</th>
                                    <th>Atualizado em :</th>
                                    <th class="last">Ação</th>
                                </tr>
                            </thead>

                            <tfoot>
                                <tr>
                                    <th class="first"></th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Permissão</th>
                                    <th>Criado em :</th>
                                    <th>Atualizado em :</th>
                                    <th>Ação</th>
                                </tr>
                            </tfoot>

                            <tbody>
                            <?php foreach ($users as $user) :
                                if($user->id != '1') : ?>
                                <tr>
                                    <th>
                                        <label class="label">
                                            <input class="table-content-select-this-row"
                                                   type="checkbox"
                                                   name="id[]"
                                                   value="<?php echo $user->id; ?>">
                                        </label>
                                    </th>
                                    <th><?php echo $user->name; ?></th>
                                    <th>
                                        <a class="link-mailto"href="mailto:<?php echo $user->email; ?>">
                                            <?php echo $user->email; ?>
                                        </a>
                                    </th>
                                    <th><?php echo $user->cms_role_id; ?></th>
                                    <th><?php echo dateFormatBR($user->created_at); ?></th>
                                    <th><?php echo dateFormatBR($user->updated_at); ?></th>
                                    <th>
                                        <a class="button is-warning"
                                           href="<?php echo baseUrl("user/edit/{$user->id}"); ?>">
                                            <i class="fa fa-edit"></i>
                                        </a>
                                        <a class="table-content-delete-this-register button is-danger"
                                           href="<?php echo baseUrl("user/delete/{$user->id}"); ?>">
                                            <i class="fa fa-times"></i>
                                        </a>
                                    </th>
                                </tr>
                            <?php endif; endforeach; ?>
                            </tbody>


                        </table>
                        <?php endif; ?>
                    </div>

                </div>
            </section>
            <!-- VIEW USER -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>