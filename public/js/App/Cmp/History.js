
/*global
    define
*/

define('App/Cmp/History', [
    'jquery',

    // PM
    'PM/Core',
    'PM/Cmp/Abstract',

    // Non AMD
    'js!jquery-inherit'
], function ($, PM, Abstract) {
    'use strict';

    var HistoryCmp = $.inherit(Abstract, {

        /**
         *
         */
        defaultOptions: {
            className: '',
            nba: 0,
            rangeMax: 0,
            basePath: '',
            randomFolder: '',
            events: {
                click: null
            }
        },

        /**
         *
         */
        __constructor: function (options) {
            this.__base(options);
        },

        /**
         *
         */
        build: function () {
            var that = this,
                els = that.els,
                options = that.options,
                ctn;

            ctn = els.container = $('<div>', {
                'class': 'history_cmp ' + options.className,
                title: options.randomFolder,
                on: {
                    click: function () {
                        var click = options.events.click;

                        if ($.isFunction(click)) {
                            click.call(that);
                        }
                    }
                }
            }).append(
                $('<span>', {
                    'class': 'random_num',
                    text: options.nba
                }),
                $('<span>', {
                    'class': 'separator',
                    text: '/'
                }),
                $('<span>', {
                    'class': 'range_max',
                    text: options.rangeMax
                })
            );
        },

        /**
         *
         */
        inject: function (element, where) {
            this.build();
            this.__base(element, where);
        }
    });

    return HistoryCmp;
});
