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

            <!-- VIEW ERROR 404 -->
            <section id="error404" class="section page-content">
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

                    <form id="formSearchAdmin" action="javascript:void(0);" method="post">
                        <div class="field is-large has-addons">
                            <div class="control is-expanded">
                                <input id="inputSearchAdmin" class="input is-large" type="text" placeholder="O que você estava procurando?">
                            </div>
                            <div class="control">
                                <a class="button is-large is-dark">
                                    <span>Pesquisar</span>
                                </a>
                            </div>
                        </div>
                    </form>
                    <style type="text/css">
                        #formSearchAdmin {
                            width: 80%;
                            margin: 70px auto 0 auto;
                        }
                    </style>
                    <script type="text/javascript">

                        $('#inputSearchAdmin').focus();

                    </script>


                </div>
            </section>



            <!-- VIEW ERROR 404 -->


            <?php inc('_common/footer.php'); ?>
        </div>

        <?php inc('_common/content-after.php'); ?>
    </body>
</html>