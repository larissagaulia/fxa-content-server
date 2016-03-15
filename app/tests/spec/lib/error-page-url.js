/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  var AuthErrors = require('lib/auth-errors');
  var chai = require('chai');
  var Constants = require('lib/constants');
  var getErrorPageUrl = require('lib/error-page-url');
  var OAuthErrors = require('lib/oauth-errors');

  var assert = chai.assert;

  describe('lib/error-page-url', function () {
    var badRequestPageErrors = [
      AuthErrors.toInvalidParameterError('paramName'),
      AuthErrors.toMissingParameterError('paramName'),
      OAuthErrors.toInvalidParameterError('paramName'),
      OAuthErrors.toMissingParameterError('paramName'),
      OAuthErrors.toError('UNKNOWN_CLIENT')
    ];

    badRequestPageErrors.forEach(function (err) {
      it('redirects to BAD_REQUEST_PAGE for ' + err.message, function () {
        var errorPageUrl = getErrorPageUrl(err);
        assert.include(errorPageUrl, Constants.BAD_REQUEST_PAGE);
      });
    });

    it('returns INTERNAL_ERROR_PAGE by default', function () {
      var errorPageUrl =
        getErrorPageUrl(OAuthErrors.toError('INVALID_ASSERTION'));
      assert.include(errorPageUrl, Constants.INTERNAL_ERROR_PAGE);
    });
  });
});
