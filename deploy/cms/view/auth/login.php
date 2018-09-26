<!doctype html>
<html class="no-js" lang="pt-br">
    <head>
        <?php inc('auth/head-meta.php'); ?>
    </head>

    <body class="loading">
        <!--[if lte IE 9]>
        <p class="browserupgrade">Você está usando um navegador <strong>muito antigo</strong>. Por favor<a href="https://browsehappy.com/">atualize seu navegador</a> para ter uma melhor experiência..</p>
        <![endif]-->

        <section id="login" class="hero is-dark is-fullheight">
            <div class="hero-body">
                <div class="container">

                    <div id="loginBox" class="">

                        <h1 class="has-text-centered">
                            <strong><?php echo title(); ?></strong>
                        </h1>

                        <div id="authNotification" class="notification" style="display: none;">
                            <button class="notification-close delete"></button>
                            <p><?php if(!empty($message)) { echo $message; } ?></p>
                        </div>

                        <form id="formLogin"
                              action="javascript:void(0);"
                              data-action="https://api.diegosanches.me/login/"
                              method="POST">

                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input id="loginEmail"
                                           class="input is-medium"
                                           name="loginEmail"
                                           type="email"
                                           placeholder="Email"
                                           autocomplete="off"
                                           required="required" >

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
                                <p class="control has-icons-left has-icons-right">

                                    <input id="loginPass"
                                           name="loginPass"
                                           class="input is-medium"
                                           type="password"
                                           placeholder="Password"
                                           autocomplete="off"
                                           required="required"
                                           minlength="6">

                                    <span class="icon is-small is-left">
                                        <i class="fa fa-lock"></i>
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
                                    <button id="loginSubmit" class="button is-medium is-success is-fullwidth is-submit">
                                        <span>Login</span>
                                    </button>
                                </p>
                            </div>

                        </form>

                        <p class="has-text-centered" style="margin-top: 10px;">
                            <a href="<?php echo baseUrl('auth/forgotpassword'); ?>">esqueci a senha</a>
                        </p>

                    </div>
                </div>
            </div>
        </section>
        <?php inc('auth/footer.php'); ?>
    </body>
</html>