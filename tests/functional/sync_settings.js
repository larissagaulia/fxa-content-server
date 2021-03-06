/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern',
  'intern!object',
  'tests/lib/helpers',
  'tests/functional/lib/helpers',
  'tests/functional/lib/fx-desktop'
], function (intern, registerSuite, TestHelpers, FunctionalHelpers,
  FxDesktopHelpers) {
  var thenify = FunctionalHelpers.thenify;

  var click = FunctionalHelpers.click;
  var clearBrowserState = thenify(FunctionalHelpers.clearBrowserState);
  var createUser = FunctionalHelpers.createUser;
  var fillOutChangePassword = thenify(FunctionalHelpers.fillOutChangePassword);
  var fillOutDeleteAccount = thenify(FunctionalHelpers.fillOutDeleteAccount);
  var fillOutSignIn = thenify(FunctionalHelpers.fillOutSignIn);
  var listenForFxaCommands = FxDesktopHelpers.listenForFxaCommands;
  var noSuchElement = FunctionalHelpers.noSuchElement;
  var openPage = thenify(FunctionalHelpers.openPage);
  var testElementExists = FunctionalHelpers.testElementExists;
  var testIsBrowserNotifiedOfLogin = thenify(FxDesktopHelpers.testIsBrowserNotifiedOfLogin);
  var testIsBrowserNotifiedOfMessage = thenify(FxDesktopHelpers.testIsBrowserNotifiedOfMessage);
  var visibleByQSA = FunctionalHelpers.visibleByQSA;

  var config = intern.config;
  var SIGNIN_URL = config.fxaContentRoot + 'signin?context=fx_desktop_v1&service=sync';
  var SETTINGS_URL = config.fxaContentRoot + 'settings?context=fx_desktop_v1&service=sync';

  var FIRST_PASSWORD = 'password';
  var SECOND_PASSWORD = 'new_password';
  var email;


  registerSuite({
    name: 'Firefox Desktop Sync v1 settings',

    beforeEach: function () {
      email = TestHelpers.createEmail();

      return this.remote
        .then(createUser(email, FIRST_PASSWORD, { preVerified: true }))
        .then(clearBrowserState(this))
        .then(openPage(this, SIGNIN_URL, '#fxa-signin-header'))
        .execute(listenForFxaCommands)
        .then(fillOutSignIn(this, email, FIRST_PASSWORD))
        .then(testIsBrowserNotifiedOfLogin(this, email, { checkVerified: true }))
        .then(openPage(this, SETTINGS_URL, '#fxa-settings-header'))
        .execute(listenForFxaCommands);
    },


    'sign in, change the password': function () {
      return this.remote
        .then(click('#change-password .settings-unit-toggle'))
        .then(visibleByQSA('#change-password .settings-unit-details'))

        .then(fillOutChangePassword(this, FIRST_PASSWORD, SECOND_PASSWORD))
        .then(testIsBrowserNotifiedOfMessage(this, 'change_password'));
    },

    'sign in, delete the account': function () {
      return this.remote
        .then(click('#delete-account .settings-unit-toggle'))
        .then(visibleByQSA('#delete-account .settings-unit-details'))

        .then(fillOutDeleteAccount(this, FIRST_PASSWORD))
        .then(testIsBrowserNotifiedOfMessage(this, 'delete_account'))

        .then(testElementExists('#fxa-signup-header'));
    },

    'sign in, no way to sign out': function () {
      return this.remote
        // make sure the sign out element doesn't exist
        .then(noSuchElement(this, '#signout'));
    }
  });
});
