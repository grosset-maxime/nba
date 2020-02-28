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
    ROOT_DIR,
*/

require_once ROOT_DIR . '/api/class/RandomFolder/RandomFolder.class.php';
require_once ROOT_DIR . '/api/vendors/PM/class/ExceptionExtended.class.php';

// DS
use PM\ExceptionExtended;

// RandomPic
use RandomFolder\RandomFolder;


// Init vars.
$basePath;
$logError;
$jsonResult;
$RandomPic; // Instance of RandomPic class.

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);
$basePath = !empty($data->basePath) ? trim($data->basePath) : '';

if (empty($basePath)) {
    $basePath = !empty($_POST['basePath']) ? trim($_POST['basePath']) : '';
}

$logError = array(
    'mandatoryFields' => array(
        'basePath' => '= ' . $basePath
    ),
    'optionalFields' => array(
    ),
);

$jsonResult = array(
    'success' => false
);


try {

    $RandomFolder = new RandomFolder(
        array('basePath' => $basePath)
    );

    $jsonResult = $RandomFolder->getRandomFolder();

} catch (ExceptionExtended $e) {
    $jsonResult['error'] = $logError;
    $jsonResult['error']['message'] = $e->getMessage();
    $jsonResult['error']['publicMessage'] = $e->getPublicMessage();
    $jsonResult['error']['severity'] = $e->getSeverity();
    print json_encode($jsonResult);
    die;
} catch (Exception $e) {
    $jsonResult['error'] = $logError;
    $jsonResult['error']['message'] = $e->getMessage();
    $jsonResult['error']['publicMessage'] = 'Unexpected error.';
    $jsonResult['error']['severity'] = ExceptionExtended::SEVERITY_ERROR;
    print json_encode($jsonResult);
    die;
}

$jsonResult['success'] = true;

header('Content-type: application/json');
header('Accept: application/json');
print json_encode($jsonResult);
exit;

