/**
 * Created By: Noopur N. Dabhi
 * This factory refreshes authetication token
 */
(function() {
  'use strict';
  angular.module('nd')
    .factory('AuthRefresher', AuthRefresher);

  /* @ngInject */
  function AuthRefresher(
    $log,
    $location,
    $q,
    APPLICATION,
    PAGE_URL,
    DelegatorService,
    LoginService,
    Session
  ) {
    $log = $log.context('AuthRefresher');
    // variable to check whether refreshing process is alredy running or not
    var lockedForRefresh = false;

    return {
      refresh: refresh,
      interceptSessionExpired: interceptSessionExpired
    };

    /**
     * Refresh authentication token based on refresh token
     */
    function refresh(refreshToken) {
      var refreshPromise;

      if (lockedForRefresh) {
        return $q.reject('refresh already in progress');
      }

      lock();
      $log.debug('running token refresh request');

      if (angular.isUndefined(refreshToken)) {
        refreshToken = Session.refreshToken;
      }

      // Refresh authentication token
      refreshPromise = LoginService.refreshToken(refreshToken)
        .then(onRefreshSuccess, onRefreshFail)
        .finally(unlock);

      return refreshPromise;
    }

    /**
     * Collec all requests which fails having status 419 and queue them
     */
    function interceptSessionExpired(httpResponse) {
      $log.debug('intercepting sessionExpired request');

      if (!lockedForRefresh) {
        refresh();
      }

      // queues the request pending refresh success
      return DelegatorService.http(httpResponse.config);
    }

    /**
     * When auhtentication token is refreshed, execute delayed queue of requests
     */
    function onRefreshSuccess(result) {
      var tokenData = result.data;
      $log.debug('Successfully got new access token');

      Session.updateAuth(tokenData);
      DelegatorService.executeDelayedRequests();

      return result;
    }

    /**
     * When refreshing of authentication token fails, it displays error
     */
    function onRefreshFail(result) {
      $log.error('Failure in getting token');

      DelegatorService.failDelayedRequests(result);
      $location.url(PAGE_URL.root);

      return result;
    }

    /**
     * Lock auth refreshing process
     */
    function lock() {
      lockedForRefresh = true;
      DelegatorService.synchronize(true);
    }

    /**
     * Unlock auth refreshing process
     */
    function unlock() {
      lockedForRefresh = false;
      DelegatorService.synchronize(false);
    }
  }
})();
