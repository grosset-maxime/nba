
/*global
    define
*/

define([
    'jquery',

    // PM
    'PM/Core',
    'PM/Utils/Client',

    // App
    'App/Cmp/History',

    // Non AMD
    'js!jquery-ui'
], function ($, PM, Client, History) {
    'use strict';

    var Nba = {

        /**
         *
         */
        defaultOptions: {
            root: null,
            basePath: '',
            range: {
                min: 0,
                max: 0
            }
        },

        /**
         *
         */
        options: {},

        /**
         *
         */
        randomNum: 0,

        /**
         *
         */
        hasBasePathFocus: false,

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
            var mainCtn, topCtn, middleCtn, bottomCtn, loadingCtn, basePathCtn,
                basePath, optsBtn, randomNum, rangeMaxNumCtn, randomPathCtn,
                historyCtn, randomPathCtnTemp,
                that = this,
                els = {};

            that.els = els;

            mainCtn = $('<div>', {'class': 'nba flex_col'});

            topCtn = $('<div>', {'class': 'top flex_row'});
            middleCtn = $('<div>', {'class': 'middle flex_col'});
            bottomCtn = $('<div>', {'class': 'bottom flex_col'});

            // Top
            // ---
            basePath = els.basePath = $('<input/>', {
                'class': 'selector',
                type: 'text',
                placeholder: 'Enter your base path here...',
                on: {
                    focus: function () {
                        that.hasBasePathFocus = true;
                    },
                    blur: function () {
                        that.hasBasePathFocus = false;
                    },
                    keyup: function (e) {
                        // Press ENTER
                        if (e.which === 13) {
                            that.getRandomNum();
                        }
                    }
                }
            });

            basePathCtn = $('<div>', {
                'class': 'base_path_ctn flex_row'
            }).append(
                $('<span>', {
                    'class': 'label',
                    text: 'Base path :'
                }),
                $('<span>', {
                    'class': 'selector_ctn'
                }).append(basePath),
                $('<span>', {
                    'class': 'generate_btn_ctn',
                    html: $('<div>', {
                        'class': 'generate_btn',
                        text: 'Generate',
                        on: {
                            click: that.getRandomNum.bind(that)
                        }
                    }).button()
                })
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

            $('<div>', {'class': 'history_ctn'}).append(
                $('<div>', {
                    'class': 'label'
                }).append(
                    $('<span>', {
                        'class': 'label',
                        text: 'History :'
                    }),
                    $('<span>', {
                        'class': ''
                    })
                ),
                historyCtn
            ).appendTo(bottomCtn);

            mainCtn.append(
                topCtn,
                middleCtn,
                bottomCtn
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
            var that = this;

            $(document).on('keydown', function (e) {
                var keyPressed = e.which,
                    doPreventDefault = false;
                // PM.log(keyPressed);
                switch (keyPressed) {
                case 27: // ESC
                    that.els.basePath.val('');
                    break;
                case 13: // ENTER
                case 32: // SPACE
                    if (!that.hasBasePathFocus) {
                        that.getRandomNum();
                    }
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
        getRandomNum: function () {
            var xhr,
                that = this,
                els = that.els,
                options = that.options;

            that.showLoading();

            options.basePath = $.trim(els.basePath.val());

            xhr = $.ajax({
                url: '/?r=getRandomNum_s',
                type: 'POST',
                dataType: 'json',
                async: true,
                data: {
                    basePath: options.basePath,
                    range: options.range
                }
            });

            xhr.done(function (json) {
                var error,
                    message = '';

                that.hideLoading();

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
                    that.setRandomView($.extend(true, json, {
                        basePath: options.basePath
                    }));
                    that.addHistory(json);
                }
            });

            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                var message = 'Nba.getRandomNum()';
                PM.logAjaxFail(jqXHR, textStatus, errorThrown, message);
            });
        },

        /**
         *
         */
        setRandomView: function (data) {
            var osSeparator, randomFolder, randomPathCtnWidth,
                els = this.els,
                randomPathCtn = els.randomPath,
                randomPathCtnTemp = els.randomPathTemp;

            if (data.isHistory) {
                els.randomNumCtn.addClass('is_history');
            } else {
                els.randomNumCtn.removeClass('is_history');
            }

            els.randomNum.text(data.nba);
            els.rangeMaxNum.text(data.rangeMax);

            osSeparator = Client.OS.win ? '\\' : '/';

            randomFolder = data.basePath + osSeparator + data.randomFolder;

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
        addHistory: function (data) {
            var history,
                that = this;

            history = new History({
                nba: data.nba,
                rangeMax: data.rangeMax,
                basePath: this.options.basePath,
                randomFolder: data.randomFolder,
                events: {
                    click: function () {
                        that.setRandomView($.extend(true, {}, this.options, {
                            isHistory: true
                        }));
                    }
                }
            });

            history.inject(this.els.history, 'top');
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
