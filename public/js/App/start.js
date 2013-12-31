
/*global
    curl
*/

curl([
    'jquery',
    'PM/Core'
], function ($, PM) {
    'use strict';

    function init () {
        PM.setDebug(true);
    }

    init();
});
