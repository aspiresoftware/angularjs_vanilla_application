/**
 * Created By: Noopur N. Dabhi
 * Modify login related urls and send it to delegator service
 */
(function() {
  angular.module('nd')
    .factory('LoginService', LoginService);

  function LoginService (
    REST_URL,
    DelegatorService,
    urlTemplate,
    CachedRequestHandler
    ) {

    var loginService, urls;

    // define urls using urlTemplate
    urls = {
      loginUrl: urlTemplate(REST_URL.login, {}, {type: 'post'})
    };

    // Creates new instance of login service
    loginService = angular.extend(
      {},
      CachedRequestHandler,
      {
        modelName: 'user',
        baseURL: urls.base,
        urls: urls
      },
      {
        authentication: authentication,
        refreshToken: refreshToken
      });

    return loginService;

    /**
     * Authenticate user
     */
    function authentication (user) {
      return DelegatorService.post(urls.loginUrl, user);
    }

    /**
     * Refresh authentication token
     */
    function refreshToken(refreshTokenValue) {
      var params  = {grantType: 'access_token', refreshToken: refreshTokenValue};
      var config  = {noDelay: true};

      return DelegatorService.post(REST_URL.authentication, params, config);
    }
  }
})();
