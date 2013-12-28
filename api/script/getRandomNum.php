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
 * HasFolder
 *
 * @param {string} $folder : folder to scan
 *
 * @return {bool} $hasFolder : true if the folder has folder else false
 */
function hasFolder($folder)
{
    $hasFolder = false;
    $dir = new DirectoryIterator($folder);
    foreach ($dir as $file) {
        set_time_limit(30);
        if ($file->isDot()) {
            continue;
        }

        if ($file->isDir() && !preg_match('/^[\.].*/i', $file->getFilename())) {
            $hasFolder = true;
            break;
        } else if ($file->isFile() && !preg_match('/^[\.].*/i', $file->getFilename())) {
            break;
        }
    }
    return $hasFolder;
}

/**
 * getRandomFile
 *
 * @param {string} $folder : folder to scan
 *
 * @return {file} $file : Random file
 */
function getRandomFile($folder)
{
    $listPic = array();
    $dir = new DirectoryIterator($folder);
    foreach ($dir as $file) {
        set_time_limit(30);
        if ($file->isDot() || preg_match('/^[\.].*/i', $file->getFilename())
            || preg_match('/^(thumb)(s)?[\.](db)$/i', $file->getFilename())
            || $file->isDir()
        ) {
            continue;
        }

        if ($file->isFile()) {
            $listPic[] = $file->getFilename();
        }
    }

    $min = 0;
    $max = count($listPic) - 1;

    if ($max < 0) {
        return null;
    }

    $nb = mt_rand($min, $max);
    return $listPic[$nb];
}

/**
 * getRandomFolder
 *
 * @param {string} $folder : folder to scan
 *
 * @return {string}  : Random folder path
 */
function getRandomFolder($folder)
{
    $listFolder = array();
    $dir = new DirectoryIterator($folder);
    foreach ($dir as $file) {
        set_time_limit(30);
        if ($file->isDot() || preg_match('/^[\.].*/i', $file->getFilename())
            || preg_match('/^(thumb)(s)?[\.](db)$/i', $file->getFilename())
        ) {
            continue;
        }

        if ($file->isDir()) {
            $listFolder[] = $file->getPathname();
        }
    }

    $min = 0;
    $max = count($listFolder) - 1;

    if ($max < 0) {
        return null;
    }

    $nb = mt_rand($min, $max);
    return $listFolder[$nb];
}

/**
 * searchRandomPic
 *
 * @param {string} $folder : folder to scan
 *
 * @return null
 */
function searchRandomPic($folder)
{
    global $levelCurent, $levelMax, $fileName, $publicPathPic, $absolutePathFolder;

    $hasFolder = hasFolder($folder);

    if ($hasFolder && $levelCurent < $levelMax) {
        $levelCurent++;
        searchRandomPic(getRandomFolder($folder));
    } else {
        $fileName = getRandomFile($folder);
        $absolutePathFolder = $folder;
        $publicPathPic = substr($folder, strpos(str_replace('\\', '/', $folder), '/pic/'));
    }
}

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

// $src = $publicPathPic . '/' . $fileName;
// $src = str_replace('\\', '/', $src);

// list($width, $height) = getimagesize($absolutePathFolder . '/' . $fileName);

$jsonResult['success'] = true;
$jsonResult['nba'] = $nba;
$jsonResult['randomFolder'] = $randomFolder;
$jsonResult['rangeMaxNum'] = $nbFolder;


print json_encode($jsonResult);
exit;
