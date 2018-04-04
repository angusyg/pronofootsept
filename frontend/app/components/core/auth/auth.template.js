/**
 * Frontend client application auth module;
 * Templates for authentication
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .run(['$templateCache', ($templateCache) => {
      $templateCache.put('AUTH-DIRECTIVE',
        `<div class="modal-header">
          <h4 class="modal-title mx-auto" id="modal-header">
            <img src="{{'APP_LOGO' | translate}}" class="rounded mx-auto d-block" alt="avatar">{{'APP_NAME' | translate}}
          </h4>
        </div>
        <form name="authForm" ng-submit="auth.login()">
          <div class="modal-body" id="modal-body">
            <div class="form-group">
              <div class="input-group" tooltip-placement="right" uib-tooltip="{{'AUTH_BAD_LOGIN' | translate}}" tooltip-class="fe-error" tooltip-is-open="auth.error === 1" tooltip-trigger="'none'" ng-class="{'shake': auth.error === 1}">
                <div class="input-group-prepend">
                  <div class="input-group-text" id="icon-login"><i class="material-icons">person</i></div>
                </div>
                <input name="login" type="text" class="form-control form-control-sm" id="login" placeholder="Login" required ng-model="auth.user.login">
              </div>
            </div>
            <div class="form-group">
              <div class="input-group" tooltip-placement="right" uib-tooltip="{{'AUTH_BAD_PASSWORD' | translate}}" tooltip-class="fe-error" tooltip-is-open="auth.error === 2" tooltip-trigger="'none'" ng-class="{'shake': auth.error === 2}">
                <div class="input-group-prepend">
                  <div class="input-group-text" id="icon-password"><i class="material-icons">lock</i></div>
                </div>
                <input name="password" type="password" class="form-control form-control-sm" id="password" placeholder="Mot de passe" required ng-model="auth.user.password">
              </div>
            </div>
          </div>
          <div class="modal-footer" tooltip-placement="bottom" uib-tooltip="{{'AUTH_ERROR' | translate}}" tooltip-class="fe-error" tooltip-is-open="auth.error === 0" tooltip-trigger="'none'">
            <button class="btn btn-primary" type="submit" ng-disabled="authForm.$invalid">{{'AUTH_BTN_CONNEXION' | translate}}</button>
          </div>
        </form>`
      );
    }]);
})();
