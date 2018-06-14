<?php
declare(strict_types=1);

namespace Silktide\HTMLCS;

/**
 * Class HTMLCodeSniffer.
 *
 * Simple wrapper class to make it easier to access code sniffer from PHP applications.
 *
 * @package Silktide\HTMLCodeSniffer
 */
class HTMLCS {

    /**
     * Get the path to code sniffer.
     * @return string
     */
    public static function getPath() : string {
        return __DIR__ . DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'build'.DIRECTORY_SEPARATOR.'HTMLCS.js';
    }

    /**
     * Get the contents of the code sniffer file.
     * @return string
     */
    public static function getFile() : string {
        return file_get_contents(self::getPath());
    }
}

