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
            <section id="user" class="section page-content">
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

                    <?php if(!empty($users)) : ?>
                    <div class="columns">
                        <div class="column">
                            <div class="select">
                                <select>
                                    <option>Ação em massa</option>
                                    <option>Deletar</option>
                                </select>
                            </div>
                        </div>
                        <div class="column has-text-right">
                            <a class="button is-primary" href="<?php echo baseUrl(); ?>">
                                <strong>Criar novo Usuário</strong>
                            </a>
                        </div>
                    </div>
                    <?php endif; ?>

                    <div class="box">
                        <?php if(empty($users)) : ?>
                        <div class="notification">
                            <p class="has-text-centered">
                                <strong>Nenhum usurário cadastrado</strong>
                                <br>
                                <a class="button is-primary" href="<?php echo baseUrl(); ?>">
                                    <strong>CRIAR PRIMEIRO USUÁRIO</strong>
                                </a>
                            </p>
                        </div>

                        <?php else : ?>

                        <table class="table is-fullwidth">

                            <thead>
                                <tr>
                                    <th style="width: 20px;">
                                        <input type="checkbox" name="">
                                    </th>
                                    <th style="width: 50px;">ID</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Permissão</th>
                                    <th style="width: 130px;">Ação</th>

                                </tr>
                            </thead>


                            <tfoot>
                                <tr>
                                    <th>
                                        <input type="checkbox" name="">
                                    </th>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Permissão</th>
                                    <th>Ação</th>

                                </tr>
                            </tfoot>


                            <tbody>
                                <tr>
                                    <th>
                                        <input type="checkbox" name="">
                                    </th>
                                    <th>43</th>
                                    <th>Admin Slikland</th>
                                    <th>
                                        <a class="link-mailto" href="mailto:admin@slikland.com">admin@slikland.com</a>
                                    </th>
                                    <th>Administrador</th>
                                    <th>
                                        <a class="edit-user button is-warning">
                                            <i class="fa fa-edit"></i>
                                        </a>
                                        <a class="delete-user button is-danger">
                                            <i class="fa fa-times"></i>
                                        </a>
                                    </th>
                                </tr>
                            </tbody>


                        </table>
                        <?php endif; ?>
                    </div>

                </div>
            </section>
            <!-- VIEW DASHBOARD -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>