/**
 * Created By: Noopur N. Dabhi
 * Provides caching methods
 */
(function() {
  'use strict';
  angular.module('nd')
    .factory('CacheFunctions', CacheFunctions);

  /* @ngInject */
  //Function for updating the cache memory for the particular urls
  function CacheFunctions(
    $log,
    apiCache,
    APPLICATION,
    DelegatorService
  ) {
    $log = $log.context('CacheFunctions');

    return {
      updateCache: updateCache,
      removeCache: removeCache
    };

    /**
     * Method for the updation(add new object to the cache data present)
     * of the cache based on the given user data
     * (i.e add the user given data to the cached copy)
     */
    function updateCache(url, jsondata) {
      $log.debug('inside the updateCache() Method');
      DelegatorService.get(url).then(success, failure);
      function success(result) {
        $log.debug(result);
        //For original data
        result.data.push(jsondata);
        //remove the cache data
        apiCache.remove(APPLICATION.host + url);
        //Update the cache data to add the json data to the response
        apiCache.put(APPLICATION.host + url, result);
      }
      function failure() {
        $log.debug('failure in getting data from' + url);
      }
    }

    /**
     * Method for the updation(i.e delete the data from the cache) of the cache
     * based on the given user data
     * (i.e add the user given data to the cached copy)
     */
    function removeCache(url, jsondata, successCallback, failureCallback) {
      $log.debug('inside the updateCache() Method');
      DelegatorService.get(url).then(success, failure);

      function success(result) {
        $log.debug(result);
        var newCacheData = {};
        newCacheData.data = [];
        //Get the data verified with the json array and remove from the json
        //(i.e delete from the json)
        angular.forEach(result.data, function(rawData) {
          if (rawData !== jsondata) {
            newCacheData.data.push(rawData);
          }
        });
        //remove the cache data
        apiCache.remove(APPLICATION.host + url);
        //append the new cache data for this key
        apiCache.put(APPLICATION.host + url, newCacheData);
        if (successCallback) {
          successCallback(apiCache.get(APPLICATION.host + url));
        }
      }

      /**
       * Handles failure
       */
      function failure() {
        $log.debug('failure in getting data from' + url);
        if (failureCallback) {
          failureCallback();
        }
      }
    }
  }
})();
