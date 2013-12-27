
/*global
    curl
*/

curl([
    'jquery',
    'View/nba'
], function ($, Nba) {
    'use strict';

    function initView () {
        var ctn = $('<div>').appendTo(document.body);

        Nba.init({
            root: ctn
        });
    }

    initView();
});
