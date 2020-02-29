<?php
define('ROOT_DIR', dirname(dirname(__FILE__)));

ini_set('log_errors', 'on');
ini_set('error_log', ROOT_DIR . '/log/php/php_error.log');

$_r = $_SERVER['REQUEST_URI'];

$_routes = array();

$_routes += array(
    '/api/getRandomFolder' => array(
        'path' => '/api/script/getRandomFolder_json.php'
    ),
);

if (!empty($_routes[$_r]['path'])) {
    include_once ROOT_DIR . $_routes[$_r]['path'];
} else {
    error_log('### Does not exist:' . $_r);
}
exit;