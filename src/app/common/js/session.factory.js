/**
 * Created By: Noopur N. Dabhi
 * @return {[type]} [description]
 */
(function() {
  'use strict';
  angular.module('nd')
    .factory('Session', SessionFactory);

  /* @ngInject */
  function SessionFactory(
    /*$cordovaDevice,*/
    $injector,
    $location,
    $log,
    $rootScope,
    $window,
    APPLICATION,
    AUTH_EVENTS,
    PAGE_URL,
    OfflineStorage,
    SessionStorage
  ) {
    var baseDataStorage = OfflineStorage;
    //var baseAuthStorage = $cordovaDevice.isMobile ? OfflineStorage : SessionStorage;
    var baseAuthStorage = SessionStorage;
    var storage = {
      data: baseDataStorage.storedObject(APPLICATION.sessionName),
      auth: baseAuthStorage.storedObject(APPLICATION.sessionName + 'Auth')
    };

    var Session = {
      create: create,
      logout: logout,
      setValue: setValue,
      getValue: getValue,
      remove: remove,
      updateAuth: updateAuth
    };

    defineStorageAccessor(storage.auth, 'accessToken', APPLICATION.accessToken);
    defineStorageAccessor(storage.auth, 'refreshToken', APPLICATION.refreshToken);
    defineStorageAccessor(storage.data, 'username', APPLICATION.username);

    Object.defineProperty(
      Session,
      'isLoggedIn',
      {get: function() { return Session.accessToken ? true : false; }}
    );

    return Session;

    /**
     * Create Session
     */
    function create(user) {
      var tokens = {};
      var data = {};

      tokens[APPLICATION.accessToken] = user.accessToken;
      tokens[APPLICATION.refreshToken] = user.refreshToken;
      data[APPLICATION.username] = user.username;

      storage.auth.update(tokens);
      storage.data.update(data);

      //ErrorReporter.setUser(me);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

      return Session;
    }

    /**
     * Clear token from session
     */
    function logout(options) {
      options = angular.extend({redirect: true}, options || {});

      storage.auth.clear();
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

      $injector.get('apiCache').removeAll();

      if (options.redirect) {
        $location.path(PAGE_URL.root);
      }

      return Session;
    }

    /**
     * Update auth tokens
     */
    function updateAuth(authData) {
      authData = authData || {};

      var updates = _.pick(
        authData,
        [APPLICATION.accessToken, APPLICATION.refreshToken]
      );

      return storage.auth.update(updates);
    }

    /**
     * Get value of the key stored in session
     */
    function getValue(key) {
      return storageForKey(key).getItem(key);
    }

    /**
     * Set value of the key stored in session
     */
    function setValue(key, value) {
      storageForKey(key).setItem(key, value);
    }

    /**
     * Remove Session
     */
    function remove() {
      angular.forEach(
        storage,
        function(storedObject) {
          storedObject.clear();
        }
      );

      //ErrorReporter.resetUser();
    }

    function storageForKey(key) {
      switch (key) {
        case APPLICATION.accessToken:
          return storage.auth;
        case APPLICATION.refreshToken:
          return storage.auth;
        default:
          return storage.data;
      }
    }

    function defineStorageAccessor(storage, name, key) {
      Object.defineProperty(
        Session,
        name,
        {
          get: function() { return storage.getItem(key); },
          set: function(value) { storage.setItem(key, value); }
        }
      );
    }
  }
})();
