
/*global
    define
*/

define('App/Cmp/History', [
    'jquery',
    'js!jquery-ui'
], function ($) {
    'use strict';


    var HistoryCmp = {

        /**
         *
         */
        defaultOption: {

        },

        /**
         *
         */
        options: {},

        /**
         *
         */
        init: function (options) {
            $.extend(true, this.options, this.defaultOptions, options || {});
        }
    };

    return HistoryCmp;
});
