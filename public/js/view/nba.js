
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
            root: null,
            basePath: '',
            initialRange: {
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
        range: {
            min: 0,
            max: 0
        },

        /**
         *
         */
        hasBasePathFocus: false,

        /**
         *
         */
        init: function (options) {
            $.extend(true, this.options, this.defaultOptions, options || {});

            $.extend(true, this.range, this.options.initialRange);

            this.buildSkeleton();

            this.attachEvents();
        },

        /**
         *
         */
        buildSkeleton: function () {
            var mainCtn, topCtn, middleCtn, bottomCtn, loadingCtn, basePathCtn,
                basePath, optsBtn, randomNumCtn, rangeMaxNumCtn, randomPathCtn,
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
            randomNumCtn = els.randomNum = $('<span>', {
                'class': 'random_num',
                text: '-'
            });

            rangeMaxNumCtn = els.rangeMaxNum = $('<span>', {
                'class': 'range_max_num',
                text: '-'
            });

            $('<div>', {
                'class': 'random_num_ctn'
            }).append(
                randomNumCtn,
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

            // Bottom
            // ------
            historyCtn = els.history = $('<div>', {
                'class': 'history'
            });

            $('<div>', {'class': 'history_ctn'}).append(
                $('<div>', {
                    'class': 'label',
                    text: 'History :'
                }),
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
                // console.log(keyPressed);
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
                randomPathCtn = els.randomPath,
                randomPathCtnTemp = els.randomPathTemp;

            that.showLoading();

            that.basePath = $.trim(els.basePath.val());

            xhr = $.ajax({
                url: '/?r=getRandomNum_s',
                type: 'POST',
                dataType: 'json',
                async: true,
                data: {
                    basePath: that.basePath,
                    range: that.range
                }
            });

            xhr.done(function (json) {
                var error, randomPathCtnWidth, randomFolder;

                that.hideLoading();

                if (json.error) {
                    error = json.error;
                    // console.log('Error : ' + (error.message || 'no error message available'));
                    // console.log(error);

                    // if (error.mandatoryFieldsMissing) {
                    //     // info.html('Mandatory fields are missing.');
                    // } else if (error.wrongBasePath) {
                    //     message = 'Wrong base path.';
                    //     // info.html(message);
                    // } else {
                    //     message = 'Unknown error.';
                    //     // info.html(message);
                    // }
                    // return false;
                }

                if (json.success) {
                    els.randomNum.text(json.nba);
                    els.rangeMaxNum.text(json.rangeMaxNum);

                    randomFolder = that.basePath + '/' + json.randomFolder;

                    randomPathCtnTemp.show();
                    randomPathCtn.hide();
                    randomPathCtnTemp.text(randomFolder);
                    randomPathCtnWidth = randomPathCtnTemp.width();
                    randomPathCtnTemp.hide();

                    randomPathCtn.css('width', randomPathCtnWidth + 2);
                    randomPathCtn.val(randomFolder);
                    randomPathCtn.show();
                    randomPathCtn.select();

                    // that.addHistory(json);
                }
            });


            // xhr.fail(function (jqXHR, textStatus) {
            //     // console.log('error getRandomNum() : ' +
            //     //     textStatus + ' / responseText : ' + jqXHR.responseText);
            // });
        },

        /**
         *
         */
        // addHistory: function (data) {

        // },

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
