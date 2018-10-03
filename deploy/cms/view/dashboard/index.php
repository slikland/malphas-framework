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
            <section id="dashboard" class="section page-content">
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

                    <div id="dashboardGrid">

                        <div class="dashboard-grid-item is-half">
                            <div class="message">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Usuários</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">
                                    <div class="has-text-centered">
                                        <p style="font-size: 100px;line-height: 100px;"><?php echo $totalUser; ?></p>
                                        <p>TOTAL USÁRIOS</p>
                                        <p>
                                            <a class="button is-small is-dark">VER TODOS</a>
                                            <a class="button is-small is-info">ADICIONAR</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item is-half">
                            <div class="message">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Permissões</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">
                                    <div class="has-text-centered">
                                        <p style="font-size: 100px;line-height: 100px;"><?php echo $totalRole; ?></p>
                                        <p>TOTAL PERMISSÕES</p>
                                        <p>
                                            <a class="button is-small is-dark">VER TODOS</a>
                                            <a class="button is-small is-info">ADICIONAR</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item is-full">
                            <div class="message is-dark">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item">
                            <div class="message">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item is-double">
                            <div class="message is-warning">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item">
                            <div class="message is-link">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item">
                            <div class="message is-info">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item">
                            <div class="message is-primary">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item is-double">
                            <div class="message is-danger">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                        <div class="dashboard-grid-item">
                            <div class="message is-success">
                                <div class="dashboard-grid-handle message-header">
                                    <i class="fas fa-grip-vertical"></i>
                                    <p>Titulo</p>
                                    <span>
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                                </div>
                                <div class="message-body">. . . .</div>
                            </div>
                        </div>

                    </div>

                    <div style="clear: both;"></div>
                </div>
            </section>
            <!-- VIEW DASHBOARD -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>