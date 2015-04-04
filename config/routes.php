<?php
/**
 * Description : Allowed routes
 *
 * PHP version 5
 *
 * @category Config_-_Routes
 * @package  No
 * @author   Maxime GROSSET <contact@mail.com>
 * @license  tag in file comment
 * @link     No
 */

$_routes = array();

// Modules - Views - App
// ---------------------
$_routes += array(
    'nba' => array(
        'isView' => true,
        'title' => 'Nba',
        'assets' => array(
            'js' => array(
                'view/nba/start'
            ),
            'css' => array(
            ),
        ),
    ),
);

// API - Scripts
// -------------
$_routes += array(
    'getRandomFolder_s' => array(
        'isScript' => true,
        'path' => '/api/script/getRandomFolder.php'
    ),
);

// Static - Views - Errors
// -----------------------
$_routes += array(
    'status_403' => array(
        'isView' => true,
        'path' => '/public/errors/status_403.phtml',
        'title' => 'Error 403',
        'dont_check_auth' => true,
    ),
    'status_404' => array(
        'isView' => true,
        'path' => '/public/errors/status_404.phtml',
        'title' => 'Error 404',
        'dont_check_auth' => true,
    ),
);
