<?php
$pathApp = 'http://local.slikland.com/slikland-cms-lab/';
$pageArea = array(

    array(
        'id' => 1,
        'label' => 'Dashboard',
        'path' => baseUrl('dashboard/'),
        'icon' => 'tachometer-alt',
        'child' => array(),
    ),
    array(
        'id' => 2,
        'label' => 'Gerenciador de Media',
        'path' => baseUrl('mediamanager/'),
        'icon' => 'image',
        'child' => array(),
    ),
    array(
        'id' => 3,
        'label' => 'Usuários',
        'path' => '#/open-submenu',
        'icon' => 'users',
        'child' => array(
            array(
                'id' => 4,
                'label' => 'Todos os Usuários',
                'path' => baseUrl('user'),
                'icon' => 'list-ul',
                'child' => array(),
            ),
            array(
                'id' => 6,
                'label' => 'Grupos de Usuário',
                'path' => baseUrl('user/gruposusuarios'),
                'icon' => 'user-lock',
                'child' => array(),
            )
        ),
    ),
    array(
        'id' => 7,
        'label' => 'Configurações',
        'path' => '#/open-submenu',
        'icon' => 'cog',
        'child' => array(
            array(
                'id' => 8,
                'label' => 'Interface',
                'path' => baseUrl('configuracoes/interface'),
                'icon' => 'object-group',
                'child' => array(),
            )
        ),
    ),
    array(
        'id' => 9,
        'label' => 'Logs',
        'path' => baseUrl('logs'),
        'icon' => 'circle',
        'child' => array(),
    )

);

?>

<div id="sidebarBackDrop" class="transitions"></div>
<div id="sidebar" class="transitions">


    <form id="sidebarSearch" action="javascript:void(0);">
        <p class="control has-icons-right">

            <input id="sidebarSearchInput"
                   class="input"
                   type="text"
                   placeholder="Pesquisar . . ."
                   autocomplete="off">

        </p>
    </form>

    <pre class="is-size-7" style="display: none;">
        <?php print_r($pageArea); ?>
    </pre>

    <aside class="menu">
        <hr style="margin: 0 0 5px 0;">
        <ul id="sidebarMenu" class="menu-list">
            <?php
            // FAZER FUNCAO RECURSIVA
            // VARIOS NIVEIS DE MENU
            if(!empty($pageArea)) : foreach ($pageArea as $item) : ?>

                <li class="sidebar-menu-item <?php if(!empty($item['child'])) { echo 'sidebar-has-submenu'; } ?>" data-search-item="<?php echo $item['label']; ?>">
                    <a class="sidebar-menu-link" href="<?php echo $item['path']; ?>">
                        <i class="fa fa-<?php echo $item['icon']; ?>"></i>
                        <span class="sidebar-menu-text"><?php echo $item['label']; ?></span>
                        <?php if(!empty($item['child'])) : ?>
                            <i class="sidebar-arrow-submenu fa fa-angle-down"></i>
                        <?php endif; ?>
                    </a>
                    <?php if(!empty($item['child'])) : ?>
                        <ul class="sidebar-submenu">
                            <?php foreach ($item['child'] as $item) : ?>
                                <li class="sidebar-submenu-item" data-search-item="<?php echo $item['label']; ?>">
                                    <a class="sidebar-submenu-link" href="<?php echo $item['path']; ?>">
                                        <i class="fa fa-<?php echo $item['icon']; ?>"></i>
                                        <span class="sidebar-submenu-text"><?php echo $item['label']; ?></span>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </li>
            <?php endforeach; endif; ?>

            <li class="sidebar-menu-item" >
                <hr>
            </li>

            <li>
                <div class="content has-text-centered">
                    <p class="is-size-7">
                        <strong>Slikland</strong>CMS 2.0
                    </p>
                </div>
            </li>

        </ul>

    </aside>

</div>

<script type="text/javascript">

    var $sidebarMenu = $('#sidebarMenu');
    var $sidebarMenuItem = $('#sidebarMenu li');
    var $sidebarMenuLink = $('#sidebarMenu li a');
    var sidebarSearchKeyupInterval = 0;

    var sidebarSearchKeyupEnd = function() {

        $('#sidebarSearch .control').removeClass('is-loading');

        $sidebarMenuItem.each(function(index, element) {
            var $this = $(element);
            var str = $this.find('a span').text().toLowerCase();

            if($this.attr('data-search-item') !== undefined) {
                if(str.indexOf($('#sidebarSearchInput').val().toLowerCase()) !== -1) {
                    console.log(str.indexOf($('#sidebarSearchInput').val()));
                    $this.find('a').css({ opacity : 1});
                    //$this.toggleClass('is-opened');
                    //$this.find('.sidebar-submenu').slideToggle(250);
                }
            }
        });

        clearInterval(sidebarSearchKeyupInterval);
    };


    $('.sidebar-menu-item.sidebar-has-submenu').each(function(index, element) {

        $(this).on('click', function() {
            var $this = $(this);

            // $('.sidebar-menu-item .sidebar-submenu').removeClass('is-opened');
            // $('.sidebar-menu-item .sidebar-submenu').slideUp(250);

            $this.toggleClass('is-opened');
            $this.find('.sidebar-submenu').slideToggle(250);

        });



    });


    $('#sidebarSearchInput').on('keyup', function(event) {

        $('#sidebarSearch .control').addClass('is-loading');

        // console.log('altKey', event.altKey);
        // console.log('shiftKey', event.shiftKey);
        // console.log('metaKey', event.metaKey);
        // console.log('key', event.key);
        // console.log('keyCode', event.keyCode);
        // console.log('which', event.which);
        // console.log('---------');

        $sidebarMenuLink.css({ opacity : 0.3});
        $('.sidebar-menu-item .sidebar-submenu').slideDown(250);

        if(event.keyCode === 27) {
            $sidebarMenuLink.css({ opacity : 1});
            return $('#sidebarSearchInput').blur();
        }

        clearInterval(sidebarSearchKeyupInterval);
        sidebarSearchKeyupInterval = setInterval(sidebarSearchKeyupEnd, 100);
    });

    $('#sidebarSearchInput').blur(function() {
        $('.sidebar-menu-item .sidebar-submenu').slideUp(250);
        $('#sidebarSearch .control').removeClass('is-loading');
        $sidebarMenuLink.css({ opacity : 1});

    });

</script>