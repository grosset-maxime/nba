
/*global
    curl
*/

curl([
    'jquery',
    'Appx/Nba/Nba'
], function ($, Nba) {
    'use strict';

    function initView () {
        Nba.init();
    }

    initView();
});
