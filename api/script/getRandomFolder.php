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

$logError = array(
    'mandatory_fields' => array(
        'basePath' => '= ' . $basePath
    ),
    'optional_fields' => array(
    ),
);

$jsonResult = array(
    'success' => false
);

$folders = array();
$nbFolders = 0;
$randomNum = 0;
$randomFolder = '';


if (!$basePath) {
    $jsonResult['error'] = $logError;
    $jsonResult['error']['mandatoryFieldsMissing'] = true;
    print json_encode($jsonResult);
    die;
}

if (!file_exists($basePath)) {
    $jsonResult['error'] = $logError;
    $jsonResult['error']['wrongBasePath'] = true;
    $jsonResult['error']['message'] = 'Wrong base path, it doesn\'t exist.';
    print json_encode($jsonResult);
    die;
}


$folders = getFolderList($basePath);

$nbFolders = count($folders);

if (!$nbFolders) {
    $jsonResult['error'] = $logError;
    $jsonResult['error']['noFolder'] = true;
    $jsonResult['error']['message'] = 'Path contains no folder.';
    print json_encode($jsonResult);
    die;
}

$randomNum = mt_rand(1, $nbFolders);

$randomFolder = $folders[$randomNum - 1];

$jsonResult['success']      = true;
$jsonResult['basePath']     = $basePath;
$jsonResult['randomNum']    = $randomNum;
$jsonResult['randomFolder'] = $randomFolder;
$jsonResult['nbFolders']    = $nbFolders;
// $jsonResult['folders'] = $folders;

print json_encode($jsonResult);
exit;
