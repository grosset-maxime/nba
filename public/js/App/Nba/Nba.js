
/*global
    define
*/

define([
    'jquery',

    // PM
    'PM/Core',
    'PM/Utils/Client',

    // App
    'Appx/Cmp/History',
    'Appx/Actions/GetRandomAction',

    // Non AMD
    'js!jquery-ui'
], function (
    $,

    PM,
    Client,

    History,
    GetRandomAction
) {
    'use strict';

    var Nba,
        currentHistoryView = History.VIEW_NUM;

    Nba = {

        /**
         * @property {Object} defaultOptions - Default options values.
         */
        defaultOptions: {
            root: null,
            basePath: ''
        },

        /**
         *
         */
        options: {},

        /**
         *
         */
        basePath: '',

        /**
         *
         */
        nbRandomNum: 0,

        /**
         *
         */
        hasBasePathFocus: false,

        /**
         *
         */
        histories: [],

        /**
         *
         */
        init: function (options) {
            var that = this;

            $.extend(true, that.options, that.defaultOptions, options || {});

            that.basePath = that.options.basePath;

            that.buildSkeleton();

            that.attachKeyboardShorcuts();

            if (that.basePath) {
                that.getRandomFolder();
            }
        },

        /**
         *
         */
        buildSkeleton: function () {
            var mainCtn, topCtn, middleCtn, bottomCtn, loadingCtn, basePathCtn,
                basePath, optsBtn, randomNum, rangeMaxNumCtn, randomPathCtn,
                historyCtn, randomPathCtnTemp, repPath, repPathCtn,
                that = this,
                els = {};

            that.els = els;

            mainCtn = $('<div>', {'class': 'nba flex_col'});

            topCtn =  $('<div>', {'class': 'top'});
            middleCtn = $('<div>', {'class': 'middle flex_col'});
            bottomCtn = $('<div>', {'class': 'bottom flex_col'});

            // Top
            // ---
            basePath = els.basePath = $('<input/>', {
                'class': 'base_path_input',
                type: 'text',
                placeholder: 'Enter your base path here...',
                value: that.basePath,
                on: {
                    focus: function () {
                        that.hasBasePathFocus = true;
                    },
                    blur: function () {
                        that.hasBasePathFocus = false;
                    },
                    keyup: function (e) {
                        var keyPressed = e.which;

                        // PM.log(keyPressed);
                        switch (keyPressed) {
                        case 27: // ESC
                            $(this).val('');
                            break;
                        case 13: // ENTER
                            $(this).blur();
                            that.getRandomFolder();
                            break;
                        }
                    }
                }
            });

            repPath = els.repPath = $('<input/>', {
                'class': 'rep_path_input',
                type: 'text',
                placeholder: 'Replacement path',
                on: {
                    focus: function () {
                        that.hasBasePathFocus = true;
                    },
                    blur: function () {
                        that.hasBasePathFocus = false;
                    },
                    keyup: function (e) {
                        var keyPressed = e.which;

                        // PM.log(keyPressed);
                        switch (keyPressed) {
                        case 27: // ESC
                            $(this).val('');
                            break;
                        case 13: // ENTER
                            $(this).blur();
                            that.getRandomFolder();
                            break;
                        }
                    }
                }
            });

            // Loading
            loadingCtn = els.loadingCtn = $('<div>', {
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

            basePathCtn = $('<div>', {
                'class': 'base_path_ctn flex_row'
            }).append(
                $('<span>', {
                    'class': 'label',
                    text: 'Base path :'
                }),
                $('<span>', {
                    'class': 'base_path_input_ctn'
                }).append(
                    basePath,
                    loadingCtn
                ),
                $('<span>', {
                    'class': 'generate_btn_ctn',
                    html: $('<div>', {
                        'class': 'generate_btn',
                        text: 'Generate',
                        on: {
                            click: that.getRandomFolder.bind(that)
                        }
                    }).button()
                })
            ).appendTo(topCtn);

            repPathCtn = $('<div>', {
                'class': 'rep_path_ctn flex_row'
            }).append(
                $('<span>', {
                    'class': 'label',
                    text: 'Replacement path :'
                }),
                $('<span>', {
                    'class': 'rep_path_input_ctn'
                }).append(repPath)
            ).appendTo(topCtn);


            optsBtn = $('<div>', {
                'class': 'opts_btn'
            });

            $('<div>', {
                'class': 'opts_btn_ctn',
                html: optsBtn
            }).appendTo(topCtn);

            // Middle
            // ------
            randomNum = els.randomNum = $('<span>', {
                'class': 'random_num',
                text: '-'
            });

            rangeMaxNumCtn = els.rangeMaxNum = $('<span>', {
                'class': 'range_max_num',
                text: '-'
            });

            els.randomNumCtn = $('<div>', {
                'class': 'random_num_ctn'
            }).append(
                randomNum,
                $('<span>', {
                    'class': 'separator',
                    text: '/'
                }),
                rangeMaxNumCtn
            ).appendTo(middleCtn);

            // Use to calculate text width
            randomPathCtnTemp = els.randomPathTemp = $('<div>', {
                'class': 'random_path_temp'
            });

            randomPathCtn = els.randomPath = $('<input/>', {
                'class': 'random_path',
                type: 'text',
                readOnly: true,
                on: {
                    focus: function () {
                        var that = this;

                        that.select();
                        setTimeout(function () {
                            that.select();
                        }, 10);
                    },
                    click: function () {
                        this.select();
                    }
                }
            });

            $('<div>', {
                'class': 'random_path_ctn',
                html: randomPathCtn
            }).append(
                randomPathCtnTemp,
                randomPathCtn
            ).appendTo(middleCtn);

            middleCtn.click(function () {
                randomPathCtn.select();
            });

            // Bottom
            // ------
            historyCtn = els.history = $('<div>', {
                'class': 'histories'
            });

            els.nbRandomNum = $('<span>', {
                'class': 'nb_random_num'
            });

            els.clearHistoryBtn = $('<span>', {
                'class': 'clear_btn small',
                text: 'Clear',
                on: {
                    click: that.clearHistory.bind(that)
                }
            }).button().hide();

            els.showRandomFolderBtn = $('<span>', {
                'class': 'folder_name_btn small',
                text: 'Toggle view',
                on: {
                    click: that.toggleHistoryView.bind(that)
                }
            }).button().hide();

            $('<div>', {'class': 'history_ctn'}).append(
                $('<div>', {
                    'class': 'label'
                }).append(
                    $('<span>', {
                        'class': 'label',
                        text: 'History :'
                    }),
                    els.nbRandomNum,
                    els.showRandomFolderBtn,
                    els.clearHistoryBtn
                ),
                historyCtn
            ).appendTo(bottomCtn);

            mainCtn.append(
                topCtn,
                middleCtn,
                bottomCtn
            );

            mainCtn.appendTo(that.options.root || document.body);

            // Set focus on base path input
            basePath.focus();
        },

        /**
         *
         */
        attachKeyboardShorcuts: function () {
            var that = this;

            $(document).on('keydown', function (e) {
                var keyPressed = e.which,
                    doPreventDefault = false;

                // PM.log(keyPressed);
                switch (keyPressed) {
                // case 27: // ESC
                //     break;
                case 13: // ENTER
                case 32: // SPACE
                    if (!that.hasBasePathFocus) {
                        that.getRandomFolder();
                    }
                    break;
                }

                if (doPreventDefault) {
                    e.preventDefault();
                }
            });
        },

        getBasePathInput: function () {
            return $.trim(this.els.basePath.val());
        },

        getRepPathInput: function () {
            return $.trim(this.els.repPath.val());
        },

        /**
         *
         */
        getRandomFolder: function () {
            var basePath,
                that = this;

            function onGetRandomFolder (json) {
                var error, repPath,
                    message = '';

                if (json.error) {
                    error = json.error;
                    PM.log('Error : ' + (error.message || 'no error message available'));
                    PM.log(error);

                    if (error.mandatoryFieldsMissing) {
                        message = 'Mandatory fields are missing.';
                    } else if (error.wrongBasePath) {
                        message = 'Wrong base path.';
                    } else {
                        message = 'Unknown error.';
                    }

                    PM.log(message);
                    return false;
                }

                if (json.success) {

                    that.nbRandomNum++;

                    repPath = that.getRepPathInput();

                    if (repPath) {
                        json.basePath = repPath;
                    }
                    // json.basePath = that.basePath;

                    that.setRandomView(json);
                    that.addHistory(json);

                    // PM.log(json.folders);
                }
            }

            basePath = that.basePath = that.getBasePathInput();

            if (!basePath) {
                that.els.basePath.focus();
                return;
            }

            that.showLoading();

            GetRandomAction.getRandomFolder({
                basePath: basePath,
                success: onGetRandomFolder,
                failure: function () {

                },
                complete: function () {
                    that.hideLoading();
                }
            });
        },

        /**
         * @param {Object}  options           - Options.
         * @param {Boolean} options.isHistory - .
         * @param {Integer} options.randomNum - .
         * @param {Integer} options.max - .
         * @param {String}  options.randomFolder - .
         * @param {String}  options.basePath - .
         */
        setRandomView: function (options) {
            var osSeparator, randomFolder, randomPathCtnWidth,
                els = this.els,
                randomPathCtn = els.randomPath,
                randomPathCtnTemp = els.randomPathTemp;

            if (options.isHistory) {
                els.randomNumCtn.addClass('is_history');
            } else {
                els.randomNumCtn.removeClass('is_history');
            }

            els.randomNum.text(options.randomNum);
            els.rangeMaxNum.text(options.nbFolders || options.max);

            osSeparator = Client.OS.win ? '\\' : '/';

            randomFolder = options.basePath + osSeparator + options.randomFolder;

            randomPathCtnTemp.show();
            randomPathCtn.hide();
            randomPathCtnTemp.text(randomFolder);
            randomPathCtnWidth = randomPathCtnTemp.width();
            randomPathCtnTemp.hide();

            randomPathCtn.css('width', randomPathCtnWidth + 2);
            randomPathCtn.val(randomFolder);
            randomPathCtn.show();
            randomPathCtn.select();
        },

        /**
         *
         */
        addHistory: function (options) {
            var history,
                that = this,
                els = that.els;

            options = options || {};

            history = new History({
                randomNum: options.randomNum,
                max: options.nbFolders || options.max,
                basePath: options.basePath,
                randomFolder: options.randomFolder,
                view: currentHistoryView,
                events: {
                    click: function () {
                        that.setRandomView($.extend(true, {}, this.options, {
                            isHistory: true
                        }));
                    }
                }
            });

            history.inject(els.history, 'top');

            that.histories.push(history);

            els.nbRandomNum.text('(' + that.nbRandomNum + ')');

            els.showRandomFolderBtn.show();
            els.clearHistoryBtn.show();

            $(document.body).scrollTop(0);
        },

        /**
         *
         */
        clearHistory: function () {
            var i, nbH,
                els = this.els;

            for(i = 0, nbH = this.histories.length; i < nbH; i++) {
                this.histories[i].destroy();
            }

            this.nbRandomNum = 0;
            els.nbRandomNum.text('');

            els.showRandomFolderBtn.hide();
            els.clearHistoryBtn.hide();
        },

        /**
         *
         */
        toggleHistoryView: function () {
            var i, nbH;

            if (currentHistoryView === History.VIEW_NUM) {
                currentHistoryView = History.VIEW_FOLDER;
            } else {
                currentHistoryView = History.VIEW_NUM;
            }

            for(i = 0, nbH = this.histories.length; i < nbH; i++) {
                this.histories[i].showView(currentHistoryView);
            }
        },

        /**
         *
         */
        showLoading: function () {
            this.els.loadingCtn.stop().fadeIn('fast');
        },

        /**
         *
         */
        hideLoading: function () {
            this.els.loadingCtn.stop().fadeOut('fast');
        }
    };

    return Nba;
});
