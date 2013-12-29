<?php
/**
 * Description : Static assets to load.
 *
 * PHP version 5
 *
 * @category Config_-_Assets
 * @package  No
 * @author   Maxime GROSSET <contact@mail.com>
 * @license  tag in file comment
 * @link     No
 */

$_assets = array(
    // JS
    // --
    'js' => array(
        // Vendors
        'vendor/jquery/jquery-2.0.0',
        'vendor/jquery-inherit/jquery-inherit',
        '/vendor/curl/curl',

        // PF
        // 'PM/Core/Core',

        // // PF Utils
        // 'PM/Utils/String',
        // 'PM/Utils/Utils',

        // // PM Start (must be the last)
        // 'PM/Start',
    ),

    // CSS
    // ---
    'css' => array(
        // Vendors
        'vendor/jquery-ui/jquery-ui',

        // Screen (must be the last)
        'screen',
    ),
);
