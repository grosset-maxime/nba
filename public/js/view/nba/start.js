
/*global
    curl, configApp
*/

curl([
    'jquery',
    'Appx/Nba/Nba'
], function ($, Nba) {
    'use strict';

    function initView () {
        Nba.init({
            basePath: configApp.basePath,
            repPath: configApp.repPath
        });
    }

    initView();
});
