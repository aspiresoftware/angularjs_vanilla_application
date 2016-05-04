/**
 * Created By: Noopur N. Dabhi
 * Configure Cache Factory
 */
(function() {
  angular.module('nd')
    .config(configCache);

  /* @ngInject */
  function configCache(
    CacheFactoryProvider
  ) {
    angular.extend(
      CacheFactoryProvider.defaults,
      {
        maxAge: 20000, // expired items in 20  seconds
        recycleFreq: 5000, // check for expired items every 5 seconds
        deleteOnExpire: 'aggressive',
        onExpire: function (key, value) {
          var _this = this; // "this" is the cache in which the item expired
          angular.injector(['ng']).get('$http').get(key).success(function (data) {
            _this.put(key, data);
          });
        }
      }
    );
  }
})();
