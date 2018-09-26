<nav id="navbarTop" class="transitions navbar is-dark">

    <div class="navbar-brand">
        <a id="navbarTopBrand" class="navbar-item is-size-4" href="<?php echo baseUrl('dashboard'); ?>">
            <strong>Slikland</strong>
            <span>CMS</span>
        </a>
        <div id="navbarTopBurger" class="navbar-burger burger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>


    <div id="" class="navbar-menu">

        <div class="navbar-end">
            <div id="navbarTopAccount" class="navbar-item has-dropdown is-hoverable transitions">
                <a class="navbar-link" href="">
                    <img id="navbarTopAccountPicture" src="https://api.adorable.io/avatars/100/Diego">
                    <span>Diego Sanches</span>
                </a>

                <div class="navbar-dropdown is-boxed" style="">

                    <a class="navbar-item" href="minha-conta">
                        <i class="fa fa-user"></i>
                        <span>Minha Conta</span>
                    </a>

                    <hr class="navbar-divider">

                    <a class="navbar-item" href="<?php echo baseUrl('auth/logout'); ?>">
                        <i class="fa fa-arrow-left"></i>
                        <span>Sair</span>
                    </a>

                </div>
            </div>

            <a href="" class="navbar-item is-size-5">
                <i class="fa fa-question-circle" style="margin-right: 0; opacity: 0.5;"></i>
            </a>

            <a href="" class="navbar-item is-size-5">
                <i class="fa fa-ellipsis-v" style="margin-right: 0; opacity: 0.5;"></i>
            </a>

        </div>

    </div>

</nav>