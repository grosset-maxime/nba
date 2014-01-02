<?php
/**
 * Description :
 * Return : JSON
 *
 * PHP version 5
 *
 * @category Script_-_Json
 * @package  No
 * @author   Maxime GROSSET <contact@mail.com>
 * @license  tag in file comment
 * @link     No
 */

/*global
    ROOT_DIR
*/

/**
 * Get folder list from the given path.
 *
 * @param string $path - Path to list folder.
 *
 * @return string[] $listDir - List of folder name.
 */
function getFolderList($path)
{
    $listDir = array();
    $nbRep = 0;
    if (is_dir($path) && $handler = opendir($path)) {
        while (($sub = readdir($handler))) {
            if ($sub !== '.' && $sub !== '..' && $sub !== 'Thumb.db' && $sub !== 'Thumbs.db' && $sub !== '.DS_Store') {
                if (is_dir($path . '/' . $sub)) {
                    $listDir[] = $sub;
                }
            }
        }
        closedir($handler);
    }

    return $listDir;
}

$basePath = !empty($_POST['basePath']) ? trim($_POST['basePath']) : '';
$range = !empty($_POST['range']) ? $_POST['range'] : array();

$logError = array(
    'mandatory_fields' => array(
    ),
    'optional_fields' => array(
        'basePath' => '= ' . $basePath
    ),
);

$jsonResult = array(
    'success' => false
);

$folders = array();
$nbFolder = 0;
$nba = 0;
$randomFolder = '';

if ($basePath && !file_exists($basePath) && !$range['min'] && !$range['max']) {
    $jsonResult['error'] = $logError;
    $jsonResult['error']['wrongBasePath'] = true;
    $jsonResult['error']['message'] = 'Wrong base path, it doesn\'t exist.';
    print json_encode($jsonResult);
    die;
}

if ($basePath) {
    $folders = getFolderList($basePath);
}

$nbFolder = count($folders);
if ($nbFolder && !$range['max']) {
    $range['max'] = $nbFolder;
}

if (!$range['min']) {
    $range['min'] = 0;
}

$nba = mt_rand($range['min'], $range['max']);

if ($nbFolder) {
    $randomFolder = $folders[$nba];
}

$nba++;

$jsonResult['success'] = true;
$jsonResult['nba'] = $nba;
$jsonResult['randomFolder'] = $randomFolder;
$jsonResult['rangeMax'] = $nbFolder;

print json_encode($jsonResult);
exit;
