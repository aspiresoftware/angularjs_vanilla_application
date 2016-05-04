/**
 * Created By: Noopur N. Dabhi
 * Creates cache
 */
(function() {
  'use strict';
  angular.module('nd')
    .factory('paramCache', ParamCacheFactory);

  /* @ngInject */
  function ParamCacheFactory(
    CacheFactory,
    APPLICATION
  ) {
    var paramCache,
    cacheFactory  = CacheFactory,
    cacheName = APPLICATION.paramCache,
    cacheOptions = {
      maxAge: 25000, // expired items in 25  seconds
      recycleFreq: 10000
    };

    paramCache = cacheFactory.get(cacheName);
    paramCache = paramCache || cacheFactory(cacheName, cacheOptions);

    return paramCache;
  }
})();
