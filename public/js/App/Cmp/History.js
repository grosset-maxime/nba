
/*global
    define
*/

define('Appx/Cmp/History', [
    'jquery',

    // PM
    'PM/Core',
    'PM/Cmp/Abstract',

    // Non AMD
    'js!jquery-inherit'
], function ($, PM, Abstract) {
    'use strict';

    var HistoryCmp, staticObj,
        VIEW_NUM = 'num',
        VIEW_FOLDER = 'folder';

    staticObj = {
        VIEW_NUM: VIEW_NUM,
        VIEW_FOLDER: VIEW_FOLDER
    };

    HistoryCmp = $.inherit(Abstract, {

        /**
         * @property {Object} defaultOptions - Default options values.
         */
        defaultOptions: {
            className: '',
            nba: 0,
            rangeMax: 0,
            basePath: '',
            randomFolder: '',
            view: VIEW_NUM,
            events: {
                click: null
            }
        },

        /**
         * @constructor History.
         * @param {Object} options                - Options values.
         * @param {String} [options.className]    - Class name to add to Cmp.
         * @param {Int}    [options.nba]          - Random num.
         * @param {Int}    [options.rangeMax]     - Maximal range for random num.
         * @param {String} [options.basePath]     - Base path for the random folder.
         * @param {String} [options.randomFolder] - Random Folder name.
         * @param {String} [options.view]         - Display view ('num' or 'folder').
         * @param {String} [options.events]       - Available events for the Cmp.
         *
         * @param {Function} [options.events.click] - Fired on click on the Cmp.
         */
        __constructor: function (options) {
            this.__base(options);
        },

        /**
         * Build the DOM of the Cmp.
         */
        build: function () {
            var ctn,
                that = this,
                els = that.els,
                options = that.options;

            // Main ctn.
            ctn = els.container = $('<div>', {
                'class': 'history_cmp ' + options.className,
                on: {
                    click: function () {
                        var clickFun = options.events.click;

                        if ($.isFunction(clickFun)) {
                            clickFun.call(that);
                        }
                    }
                }
            });

            // Random num view.
            els.randomNum = $('<div>', {
                'class': 'random_num',
                title: options.randomFolder,
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
            ).appendTo(ctn).hide();

            // Random folder view.
            els.randomFolder = $('<div>', {
                'class': 'random_folder',
                text: options.randomFolder,
                title: options.nba + ' / ' + options.rangeMax,
            }).appendTo(ctn).hide();

            // Show the view define by options.
            that.showView(options.view);
        },

        /**
         * Inject the Cmp into the DOM.
         * @param {Element} element - DOM Element where to inject the Cmp.
         * @param {String}  where   - Position inside the Element.
         */
        inject: function (element, where) {
            this.build();
            this.__base(element, where);
        },

        /**
         * Toggle view ('num' or 'folder').
         */
        toggleView: function () {
            if (this.options.view === VIEW_NUM) {
                this.showFolderNameView();
            } else {
                this.showRandomNumView();
            }
        },

        /**
         * Show folder name view (hide random num view).
         */
        showFolderNameView: function () {
            var els = this.els;

            els.randomNum.hide();
            els.randomFolder.show();
            this.options.view = VIEW_FOLDER;
        },

        /**
         * Show random num view (hide random folder view).
         */
        showRandomNumView: function () {
            var els = this.els;

            els.randomNum.show();
            els.randomFolder.hide();
            this.options.view = VIEW_NUM;
        },

        /**
         * Show view passed in parameter.
         * @param {String} view - Name of the view to show.
         */
        showView: function (view) {
            switch (view.toLowerCase()) {
            case VIEW_FOLDER:
                this.showFolderNameView();
                break;
            default:
            case VIEW_NUM:
                this.showRandomNumView();
                break;
            }
        }
    }, staticObj);

    return HistoryCmp;
});
