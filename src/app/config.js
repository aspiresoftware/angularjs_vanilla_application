/**
 * Created By: Noopur N. Dabhi
 * This file contains constants
 */
(function() {
  'use strict';

  angular.module('nd')
  .constant('APPLICATION', {
    host: 'http://192.168.1.29:80/api/v1',
    username: 'username',
    cache: 'appCache',
    paramCache: 'appParamCache',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    sessionName: 'myAppSession'
  })
  .constant('REST_URL', {
    login: '/user/login/?format=json'
  })
  .constant('PAGE_URL', {
    root: '/',
    error404: '/404'
  })
  .constant('TEMPLATE_URL', {
    login: 'app/login/login.html',
    error404: 'app/common/html/404.html'
  })
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    badRequest: 'bad-request',
    notFound: 'not-found',
    requestTimeout: 'request-timeout',
    upgradeRequired: 'upgrade-required',
    unprocessableEntity: 'unprocessable-entity',
    tooManyRequests: 'too-many-requests',
    notImplemented: 'not-implemented',
    internalServerError: 'internal-server-error',
    serviceUnavailable: 'service-unavailable',
    gatewayTimeout: 'gateway-timeout',
    proxyErrors: 'proxy-errors',
    networkIssue: 'networkIssue'
  })
  .constant('AUTH_MESSAGE', {
    notAuthenticated: 'You have entered an invalid email address and/or password.' +
      ' Please try again.',
    notAuthenticatedPasswordChanged: 'Your user name or password has been changed.' +
      ' Please log in again.',
    notAuthorized: 'You do not have access to perform that action.',
    badRequest: 'The server wasn\'t able to process your request. Please try again. (400)',
    notFound: 'The endpoint is not valid, or a resource represented by the' +
      ' request does not exist. (404)',
    requestTimeout: 'The server was not able to complete your request in the ' +
      'time allotted. This could be due to server load, and may be retried in the future. (408)',
    unprocessableEntity: null,
    tooManyRequests: 'An unhandled error has occurred. Please contact eBackpack. (429)',
    notImplemented: 'This functionality is not yet implemented. Please contact' +
      ' eBackpack for more information. (501)',
    internalServerError: 'An unhandled error has occurred, and eBackpack' +
      ' has been notified. (500)',
    serviceUnavailable: 'The service is temporarily unavailable. Please try again later. (503)',
    gatewayTimeout: 'The request was unable to be processed in time. This may' +
      ' be due to network availability. Please try again later. (504)',
    proxyErrors: 'The service is temporarily unavailable or the request was' +
      ' unable to be processed in time. This may be due to network availability.' +
      ' Please try again later. (520)',
    networkIssue: 'Please check your network connection and try again. (0)',
    notFoundRequest: 'The account associated with this email address cannot be' +
      ' found. Please correct your email address or create a new account.',
    alredyAssociatedEmail: 'An account is already associated with this email address.' +
      ' Please log in to add this child to your existing account.'
  });
})();
