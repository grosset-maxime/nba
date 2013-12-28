
/*global
    curl
*/

curl([
    'jquery',
    'View/nba'
], function ($, Nba) {
    'use strict';

    function initView () {
        Nba.init();
    }

    initView();
});
