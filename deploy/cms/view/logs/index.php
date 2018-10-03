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

                        <?php if(!empty($logs)) : ?>

                            <table id="tableContent"
                               class="table is-fullwidth"
                               data-action="<?php echo baseUrl('role/'); ?>"
                               data-redirect="<?php echo baseUrl('role/'); ?>">
                                <thead>
                                    <tr>
                                        <th class="has-text-centered first">ID</th>
                                        <th>Log</th>
                                        <th>IP</th>
                                        <th>Usuário</th>
                                        <th>Criado em :</th>
                                        <th class="last">Ação</th>
                                    </tr>
                                </thead>

                                <tfoot>
                                    <tr>
                                        <th class="has-text-centered first"></th>
                                        <th>Log</th>
                                        <th>IP</th>
                                        <th>Usuário</th>
                                        <th>Criado em :</th>
                                        <th class="last">Ação</th>
                                    </tr>
                                </tfoot>

                                <tbody>
                                <?php foreach ($logs as $key => $value) : ?>
                                    <tr>
                                        <th class="has-text-centered"><?php echo $key; ?></th>
                                        <th><?php echo $value; ?></th>
                                        <th>192.168.0.777</th>
                                        <th>Fulâno</th>
                                        <th>03/10/2018 - 15:50</th>
                                        <th>
                                            <a class="button is-dark" href="#/">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                        </th>
                                    </tr>
                                <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>

                </div>
            </section>
            <!-- VIEW ROLE -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>