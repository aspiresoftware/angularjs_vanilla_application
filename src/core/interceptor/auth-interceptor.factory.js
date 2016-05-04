/**
 * Created By: Noopur N. Dabhi
 * Interceptor for requests
 */
(function() {
  'use strict';
  angular.module('nd')
    .factory('AuthInterceptor', AuthInterceptor);

  /* @ngInject */
  function AuthInterceptor(
    $injector,
    $q,
    $rootScope,
    AUTH_EVENTS,
    AUTH_MESSAGE
  ) {
    return {
      responseError: function(response) {
        var statusEvents = {
          0: AUTH_EVENTS.networkIssue,
          400: AUTH_EVENTS.badRequest,
          401: AUTH_EVENTS.notAuthenticated,
          403: AUTH_EVENTS.notAuthorized,
          404: AUTH_EVENTS.notFound,
          408: AUTH_EVENTS.requestTimeout,
          415: AUTH_EVENTS.upgradeRequired,
          419: AUTH_EVENTS.sessionTimeout,
          422: AUTH_EVENTS.unprocessableEntity,
          429: AUTH_EVENTS.tooManyRequests,
          440: AUTH_EVENTS.sessionTimeout,
          500: AUTH_EVENTS.internalServerError,
          501: AUTH_EVENTS.notImplemented,
          503: AUTH_EVENTS.serviceUnavailable,
          504: AUTH_EVENTS.gatewayTimeout,
          520: AUTH_EVENTS.proxyErrors,
          521: AUTH_EVENTS.proxyErrors,
          522: AUTH_EVENTS.proxyErrors,
          523: AUTH_EVENTS.proxyErrors,
          524: AUTH_EVENTS.proxyErrors
        };

        var statusMessage = {
          0: AUTH_MESSAGE.networkIssue,
          400: AUTH_MESSAGE.badRequest,
          401: AUTH_MESSAGE.notAuthenticated,
          403: AUTH_MESSAGE.notAuthorized,
          404: AUTH_MESSAGE.notFound,
          408: AUTH_MESSAGE.requestTimeout,
          419: AUTH_MESSAGE.sessionTimeout,
          422: AUTH_MESSAGE.unprocessableEntity,
          429: AUTH_MESSAGE.tooManyRequests,
          440: AUTH_MESSAGE.sessionTimeout,
          500: AUTH_MESSAGE.internalServerError,
          501: AUTH_MESSAGE.notImplemented,
          503: AUTH_MESSAGE.serviceUnavailable,
          504: AUTH_MESSAGE.gatewayTimeout,
          520: AUTH_MESSAGE.proxyErrors,
          521: AUTH_MESSAGE.proxyErrors,
          522: AUTH_MESSAGE.proxyErrors,
          523: AUTH_MESSAGE.proxyErrors,
          524: AUTH_MESSAGE.proxyErrors
        };

        var eventName = statusEvents[response.status];

        var errorMsg = statusMessage[response.status];
        if (response && response.data && response.data.error && response.data.error.message) {
          errorMsg = response.data.error.message;
        }

        $rootScope.$broadcast(eventName, response, errorMsg);

        if (eventName === AUTH_EVENTS.sessionTimeout) {
          return $injector.get('AuthRefresher').interceptSessionExpired(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  }
})();
