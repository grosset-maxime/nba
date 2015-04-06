<?php
/**
 * Random Folder engine.
 *
 * PHP version 5
 *
 * @category Class
 * @package  No
 * @author   Maxime GROSSET <contact@mail.com>
 * @license  tag in file comment
 * @link     No
 */

namespace RandomFolder;

// PM
require_once dirname(__FILE__) . '/../../vendors/PM/class/Root.class.php';
require_once dirname(__FILE__) . '/../../vendors/PM/class/ExceptionExtended.class.php';


// PHP
use \DirectoryIterator;
use \Exception;

// DS
use PM\Root;
use PM\ExceptionExtended;


/**
 * Class RandomPic.
 *
 * @category Class
 * @package  No
 * @author   Maxime GROSSET <contact@mail.com>
 * @license  tag in file comment
 * @link     No
 */
class RandomFolder extends Root
{
    protected $WIN_SEP = '\\';
    protected $UNIX_SEP = '/';

    protected $basePath = ''; // Base path to get the random folder.
    protected $randomNum = null; // Random folder index.
    protected $nbFolders = 0; // Nb folder into the base path.
    protected $randomFolder = ''; // Random folder name.



    /**
     * RandomPic constructor.
     *
     * @param {array} $options : RandomFolder options.
     * * param {String} options.basePath : Folder to get the random folder.
     */
    public function __construct(array $options = array())
    {
        parent::__construct($options);
    }

    /**
     * replaceWinSlaches
     *
     * @param {String} $s : String to replace antislashes by slashes.
     *
     * @return {String} String with win antislashes replaced by slashes.
     */
    protected function replaceWinSlaches($s)
    {
        return str_replace($this->WIN_SEP, $this->UNIX_SEP, $s);
    }

    /**
     * Get a random folder.
     *
     * @return {Array} Folder information.
     */
    public function getRandomFolder()
    {
        // Init vars
        $dir;
        $result;
        $e;
        $item;
        $dirName;
        $min;
        $max;
        $errorMessage;
        $listDir = array();

        try {
            $dir = new DirectoryIterator($this->basePath);
        } catch (Exception $e) {
            throw new ExceptionExtended(
                array(
                    'publicMessage' => 'Folder "' . $this->basePath . '" is not accessible.',
                    'message' => $e->getMessage(),
                    'severity' => ExceptionExtended::SEVERITY_ERROR
                )
            );
        }

        foreach ($dir as $item) {
            set_time_limit(30);

            $dirName = $item->getFilename();

            if (!$item->isDir()
                || $item->isDot()
                || $dirName === '@eaDir' // Syno folder
                || preg_match('/^[\.].*/i', $dirName)
                || preg_match('/^(thumb)(s)?[\.](db)$/i', $dirName)
            ) {
                continue;
            }

            $listDir[] = $dirName;
        }

        $min = 1;
        $max = $this->nbFolders = count($listDir);

        if ($max <= 0) {
            $errorMessage = 'Folder "' . $this->basePath . '" contains no folder.';
            throw new ExceptionExtended(
                array(
                    'publicMessage' => $errorMessage,
                    'message' => $errorMessage,
                    'severity' => ExceptionExtended::SEVERITY_ERROR
                )
            );
        }

        $this->randomNum = mt_rand($min, $max);
        $this->randomFolder = $listDir[$this->randomNum - 1];

        $result = array(
            'basePath' => $this->basePath,
            'randomNum' => $this->randomNum,
            'randomFolder' => $this->randomFolder,
            'nbFolders' => $this->nbFolders
        );

        return $result;
    } // End function getRandomFolder()

    /**
     * Getter base path.
     *
     * @return {String} $basePath : Base path.
     */
    public function getBasePath()
    {
        return $this->basePath;
    }

    /**
     * Setter base path.
     *
     * @param {String} $basePath : Base path.
     *
     * @return null
     */
    public function setBasePath($basePath = '')
    {
        // Init vars.
        $errorMessage;

        $basePath = $this->replaceWinSlaches($basePath);

        $basePath = rtrim($basePath, $this->UNIX_SEP);

        try {
            if (!file_exists($basePath)) {
                throw new Exception();
            }

            new DirectoryIterator($basePath);

        } catch (Exception $e) {
            $errorMessage = 'Wrong base path: ' . $basePath;

            throw new ExceptionExtended(
                array(
                    'publicMessage' => $errorMessage,
                    'message' => $e->getMessage() ? $e->getMessage : $errorMessage,
                    'severity' => ExceptionExtended::SEVERITY_ERROR
                )
            );
        }

        $this->basePath = $basePath;
    } // End function setBasePath()
} // End Class RandomFolder
