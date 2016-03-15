/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Get the URL of the error page to which an error should redirect.
 */

define(function (require, exports, module) {
  'use strict';

  var Constants = require('lib/constants');

  /**
   * Get the URL of the error page to which an error should redirect.
   *
   * @param {Error} error - error for which to get error page URL
   * @param {object} translator - translator to translate error
   */
  module.exports = function (error, translator) {
    if (error.getErrorPageUrl) {
      return error.getErrorPageUrl(translator);
    }

    return Constants.INTERNAL_ERROR_PAGE;
  };
});
