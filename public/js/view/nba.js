
/*global
    define
*/

define([
    'jquery',
    'js!jquery-ui'
], function ($) {
    'use strict';


    var Nba = {

        /**
         *
         */
        defaultOption: {
            root: null
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

            this.buildSkeleton();

            this.attachEvents();
        },

        /**
         *
         */
        buildSkeleton: function () {
            var mainCtn, loadingCtn,
                that = this,
                els = {};

            that.els = els;

            mainCtn = $('<div>', {
                'class': 'nba'
            });

            // Loading
            // -------
            loadingCtn = that.loadingCtn = $('<div>', {
                'class': 'ctn_loading'
            }).append(
                $('<span>', {
                    'class': 'el_loading_1 el_loading'
                }),
                $('<span>', {
                    'class': 'el_loading_2 el_loading'
                }),
                $('<span>', {
                        'class': 'el_loading_3 el_loading'
                    })
            );

            if (that.options.root) {
                that.options.root.append(mainCtn);
            } else {
                $(document.body).append(mainCtn);
            }
        },

        /**
         *
         */
        attachEvents: function () {
            this.attachKeyboardShorcuts();
        },

        /**
         *
         */
        attachKeyboardShorcuts: function () {
            // var that = this;

            $(document).on('keydown', function (e) {
                var keyPressed = e.which,
                    doPreventDefault = false;
                // console.log(keyPressed);
                switch (keyPressed) {
                case 27: // ESC
                    break;
                case 32: // SPACE
                    break;
                }

                if (doPreventDefault) {
                    e.preventDefault();
                }
            });
        },

        /**
         *
         */
        showLoading: function () {
            this.loadingCtn.stop().fadeIn('fast');
        },

        /**
         *
         */
        hideLoading: function () {
            this.loadingCtn.stop().fadeOut('fast');
        }
    };

    return Nba;
});
