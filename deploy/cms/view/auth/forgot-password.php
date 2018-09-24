<!doctype html>
<html class="no-js" lang="pt-br">
    <head>
        <?php inc('_common/head-meta-auth.php'); ?>
    </head>

    <body class="loading">
        <?php inc('_common/update-browser.php'); ?>

        <section id="forgot" class="hero is-dark is-fullheight">
            <div class="hero-body">
                <div class="container">

                    <div id="forgotBox" class="">

                        <h1 class="has-text-centered">
                            <strong><?php echo title(); ?></strong>
                        </h1>

                        <div id="authNotification" class="notification" style="display: none;">
                            <button class="notification-close delete"></button>
                            <p></p>
                        </div>

                        <form id="formForgot"
                              action="javascript:void(0);"
                              data-action="https://api.diegosanches.me/login/forgot/"
                              method="POST">

                            <div class="field">

                                <p class="control has-icons-left has-icons-right">

                                    <input id="forgotEmail"
                                           class="input is-medium"
                                           name="forgotEmail"
                                           type="email"
                                           placeholder="Email"
                                           autocomplete="off"
                                           required="required">

                                    <span class="icon is-small is-left">
                                        <i class="fa fa-envelope"></i>
                                    </span>
                                    <span class="icon is-small is-right icon-success" style="display: none;">
                                        <i class="fa fa-check"></i>
                                    </span>
                                    <span class="icon is-small is-right icon-error" style="display: none;">
                                        <i class="fa fa-times"></i>
                                    </span>
                                </p>

                            </div>
                            <div class="field">
                                <p class="control">
                                    <button id="forgotSubmit" class="button is-medium is-success is-fullwidth is-submit">
                                        <span>Recuperar senha</span>
                                    </button>
                                </p>
                            </div>
                        </form>

                        <p class="has-text-centered" style="margin-top: 10px;">
                            <a href="<?php echo baseUrl(); ?>">voltar ao login</a>
                        </p>

                    </div>
                </div>
            </div>
        </section>
        <?php inc('_common/footer-auth.php'); ?>
    </body>
</html>