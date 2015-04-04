/* global
    define
*/

define([
    'jquery',

    // PM
    'PM/Core'
],
function ($, PM) {
    'use strict';


    var Action;

    Action = {
        /**
         * @param {Object}   options - Options.
         * @param {String}   options.basePath - Base path.
         * @param {Function} options.success  - Success callback.
         * @param {Function} options.failure  - Failure callback.
         * @param {Function} options.complete - Complete callback.
         */
        getRandomFolder: function (options) {
            var complete, failure;

            options = options || {};
            complete = options.complete || function () {};
            failure = options.failure || function () {};

            $.ajax({
                url: '/?r=getRandomFolder_s',
                type: 'POST',
                dataType: 'json',
                async: true,
                data: {
                    basePath: options.basePath
                },
                success: options.success,
                error: function (jqXHR, textStatus, errorThrown) {
                    var message = 'GetRandomAction.getRandomFolder()';
                    PM.logAjaxFail(jqXHR, textStatus, errorThrown, message);

                    failure(errorThrown);
                },
                complete: complete
            });
        },
    };

    return Action;
});
