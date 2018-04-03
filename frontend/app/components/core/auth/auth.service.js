/**
 * Frontend client application auth module;
 * Service to handle authentication (login, logout, JWTToken storage and refresh)
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .factory('authService', AuthService)
    .run(['authService', (authService) => authService.stateSecurization()]);

  AuthService.$inject = ['$http', 'store', '$q', '$rootScope', '$transitions', 'helper', 'SECURITY', 'AUTH_EVENTS', 'API'];

  function AuthService($http, store, $q, $rootScope, $transitions, helper, SECURITY, AUTH_EVENTS, API) {
    let refreshRequestLoading = false;

    return {
      getToken: getToken,
      getRefreshToken: getRefreshToken,
      isAuthorized: isAuthorized,
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      refreshToken: refreshToken,
      stateSecurization: stateSecurization
    };

    function getToken() {
      return store.get(SECURITY.ACCESS_TOKEN);
    }

    function getRefreshToken() {
      return store.get(SECURITY.REFRESH_TOKEN);
    }

    function isAuthorized(authorizedRoles) {
      if (!SECURITY.ACTIVATED) return true;
      if (!isLoggedIn()) return false;
      if (!Array.isArray(authorizedRoles)) authorizedRoles = [authorizedRoles];
      let userRoles = helper.getUserRolesFromToken(getToken());
      return authorizedRoles.some(role => userRoles.indexOf(role) >= 0);
    };

    function isLoggedIn() {
      return store.get(SECURITY.ACCESS_TOKEN) !== null;
    }

    function login(user) {
      return $http.post(`${API.URL}${API.BASE}/login`, user)
        .then(response => {
          store.set(SECURITY.ACCESS_TOKEN, response.accessToken);
          store.set(SECURITY.REFRESH_TOKEN, response.refreshToken);
          return $q.resolve();
        });
    }

    function logout() {
      return $http.get(`${API.URL}${API.BASE}/logout`)
        .then(response => {
          store.remove(SECURITY.ACCESS_TOKEN);
          store.remove(SECURITY.REFRESH_TOKEN);
          return $q.resolve();
        });
    }

    function refreshToken() {
      if (!refreshRequestLoading) {
        refreshRequestLoading = true;
        return $http.get(`${API.URL}${API.BASE}/refresh`)
          .then(response => {
            store.set(SECURITY.ACCESS_TOKEN, response.accessToken);
            return $q.resolve();
          })
          .finally(() => refreshRequestLoading = false);
      } else $q.reject(new Error('Concurrent refresh token request'));
    }

    function stateSecurization() {
      if (SECURITY.ACTIVATED) $transitions.onStart({ to: '*' }, trans => {
        const toState = trans.$to();
        if (toState.data && toState.data.authorizedRoles) {
          if (!isLoggedIn()) {
            $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, trans);
            return false;
          } else if (!isAuthorized(toState.data.authorizedRoles)) {
            $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHORIZED, trans);
            return false;
          }
        }
      });
    }
  }
})();
