
/*global
    curl
*/

curl([
    'jquery',
    'App/Nba/Nba'
], function ($, Nba) {
    'use strict';

    function initView () {
        Nba.init();
    }

    initView();
});
