/**
 * Created By: Noopur N. Dabhi
 * Configure hhtp interceptor
 */
(function() {
  angular.module('nd')
    .config(config$ResourceProvider)
    .run(registerAuthEventListeners);

  /* @ngInject */
  function config$ResourceProvider(
    $httpProvider
  ) {
    // Use $applyAsync to improve performance of multiple HTTP requests
    // resolving very close to the same time.
    $httpProvider.useApplyAsync(true);

    // Configuration of http provider
    // registered interceptor for http provider
    $httpProvider.interceptors.push(
      /* @ngInject */
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    );
  }

  /**
   * Register event for different response status
   */
  /* @ngInject */
  function registerAuthEventListeners(
    $rootScope,
    AUTH_EVENTS,
    Session,
    Utility,
    AUTH_MESSAGE
    ) {
    //hendled 400: AUTH_EVENTS.badRequest
    $rootScope.$on(AUTH_EVENTS.badRequest, function onBadRequest(ev, resp, badRequest) {
      if (resp && resp.data && resp.data.error && resp.data.error.message) {
        badRequest = resp.data.error.message;
      }
      Utility.responseCommonHandler(badRequest);
    });

    //hendled 401: AUTH_EVENTS.notAuthenticated
    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function onNotAuthenticated() {
      var message = Session.isLoggedIn ?
        AUTH_MESSAGE.notAuthenticatedPasswordChanged :
        AUTH_MESSAGE.notAuthenticated;

      Session.logout();
      Utility.responseCommonHandler(message);
    });

    //hendled 403: AUTH_EVENTS.notAuthorized
    $rootScope.$on(AUTH_EVENTS.notAuthorized, function onNotAuthorized(ev, resp, forbiddenRequest) {
      Utility.responseCommonHandler(forbiddenRequest);
    });

    //hendled 404: AUTH_EVENTS.notFound
    $rootScope.$on(AUTH_EVENTS.notFound, function onNotFound(ev, resp, notFoundRequest) {
      Utility.responseCommonHandler(notFoundRequest);
    });

    //hendled 408: AUTH_EVENTS.requestTimeout
    $rootScope.$on(AUTH_EVENTS.requestTimeout, function onRequestTimeout(ev, resp, requestTimeout) {
      Utility.responseCommonHandler(requestTimeout);
    });

    // Handle 415: AUTH_EVENTS.upgradeRequired
    var displayedUpgradeNotice = false;
    $rootScope.$on(AUTH_EVENTS.upgradeRequired, function onUpgradeRequired(ev, resp) {
      if (displayedUpgradeNotice) {
        return;
      }
      displayedUpgradeNotice = true;

      if (resp && resp.data) {
        resp = resp.data;
      }

      var message;
      if (resp.error && resp.error.message) {
        message = resp.error.message;
      } else {
        message = 'This version of the application is no longer supported. ' +
          'Please upgrade to the latest version.';
      }

      Utility.responseCommonHandler(message);
    });

    //hendled 422: AUTH_EVENTS.unprocessableEntity
    $rootScope.$on(AUTH_EVENTS.unprocessableEntity, function onUnprocessableEntity(event, resp) {
      Utility.responseCommonHandler('unprocessableEntity');
    });

    //hendled 429: AUTH_EVENTS.tooManyRequests
    $rootScope.$on(
      AUTH_EVENTS.tooManyRequests,
      function onTooManyRequests(ev, resp, tooManyRequests) {
        Utility.responseCommonHandler(tooManyRequests);
      }
    );

    //hendled 500: AUTH_EVENTS.internalServerError
    $rootScope.$on(
      AUTH_EVENTS.internalServerError,
      function onServerError(ev, resp, internalServerError) {
        Utility.responseCommonHandler(internalServerError);
      }
    );

    //hendled 501: AUTH_EVENTS.notImplemented
    $rootScope.$on(AUTH_EVENTS.notImplemented, function onNotImplemented(ev, resp, notImplemented) {
      Utility.responseCommonHandler(notImplemented);
    });

    //hendled 503: AUTH_EVENTS.serviceUnavailable
    $rootScope.$on(
      AUTH_EVENTS.serviceUnavailable,
      function onServiceUnavailable(event, resp, serviceUnavailable) {
        Utility.responseCommonHandler(serviceUnavailable);
      }
    );

    //hendled 504: AUTH_EVENTS.gatewayTimeout
    $rootScope.$on(
      AUTH_EVENTS.gatewayTimeout,
      function onGatewayTimeout(event, resp, gatewayTimeout) {
        Utility.responseCommonHandler(gatewayTimeout);
      }
    );

    //hendled 520-524: AUTH_EVENTS.proxyErrors
    $rootScope.$on(AUTH_EVENTS.proxyErrors, function onProxyErrors(event, resp, proxyErrors) {
      Utility.responseCommonHandler(proxyErrors);
    });

    //hendled 0: AUTH_EVENTS.networkIssue
    $rootScope.$on(AUTH_EVENTS.networkIssue, function onNetworkIssue(event, resp, networkIssue) {
      Utility.responseCommonHandler(networkIssue);
    });
  }
})();
