/**
 * Created By: Noopur N. Dabhi
 * Implements cache
 */
(function() {
  'use strict';
  angular.module('nd')
    .factory('apiCache', ApiCacheFactory);

  /* @ngInject */
  function ApiCacheFactory(
    CacheFactory,
    paramCache,
    DelegatorService,
    APPLICATION
  ) {
    var apiCache,
    cacheFactory = CacheFactory;
    var cacheName = APPLICATION.cache;
    var cacheOptions = {onExpire: onExpire};

    apiCache = cacheFactory.get(cacheName);
    apiCache = apiCache || cacheFactory(cacheName, cacheOptions);

    return apiCache;

    function onExpire(key) {
      DelegatorService.get(key, paramCache.get(key), true);
    }
  }
})();
