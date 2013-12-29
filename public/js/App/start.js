
/*global
    curl
*/

curl([
    'jquery',
    'PM/Core/Core'
], function ($, PM) {
    'use strict';

    function init () {
        PM.setDebug(true);
    }

    init();
});
