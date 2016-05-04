/**
 * Handles cache request and privdes basic method for cache
 */
(function() {
  angular.module('nd')
    .factory('CachedRequestHandler', CachedRequestHandlerFactory);

  /* @ngInject */
  function CachedRequestHandlerFactory(
    ErrorStore,
    DelegatorService,
    $http,
    CacheFactory,
    $q,
    $log,
    apiCache,
    APPLICATION
  ) {
    var CachedRequestHandler,
    cacheFactory = CacheFactory;

    CachedRequestHandler = {
      find: find,
      extractResponseData: extractResponseData,
      initAndCache: initAndCache,
      getObjectStore: getObjectStore,
      getById: getById,
      cacheObjects: cacheObjects,
      query: query,
      querySingle: querySingle,
      getURL: getURL,
      resourceClass: null,
      buildPlaceholder: buildPlaceholder
    };

    // Add "hidden" methods ($http, $get, etc..) to avoid further need
    // to inject DelegatorService in the services that use this
    angular.forEach(
      ['http', 'get', 'post', 'put', 'remove'],
      function(name) {
        var basicName = '$' + name,
            unwrappedName = name,
            basicMethod = angular.bind(DelegatorService, DelegatorService[name]);

        // defines .$get, .$post, etc...
        CachedRequestHandler[basicName] = basicMethod;
        // defines .get, .post, etc...
        CachedRequestHandler[unwrappedName] = unwrappedMethod;

        function unwrappedMethod() {
          return basicMethod.apply(this, arguments).then(
            angular.bind(this, this.extractResponseData)
          );
        }
      }
    );

    return CachedRequestHandler;

    function find(id, params) {
      var self = this,
          dfd = $q.defer(),
          context = {},
          url,
          cachedObj;

      if (angular.isObject(id)) {
        angular.extend(context, id);
      } else {
        context.id = id;
      }

      angular.extend(context, params);
      id = context.id;
      url = buildFindURL(this, context);

      dfd.$needResolve = true;
      cachedObj = retrieveFromCache(this, id, dfd, true, this.buildPlaceholder(id));

      cachedObj.$loadInProgress = true;

      this.$get(url).then(
        function(response) {
          self.initAndCache(response, context).then(function(item) {
            updateReference(item, cachedObj, dfd);
          });
        },
        function(error) { handleError(dfd, error); }
      );

      return dfd.promise;
    }

    function query(url, querySingleton, initContext) {
      var self = this;
      var dfd = $q.defer();
      dfd.$needResolve = true;
      var cachedObj = retrieveFromCache(self, url, dfd, querySingleton);

      cachedObj.$loadInProgress = true;

      this.$get(url).then(function(resp) {
        self.initAndCache(resp, initContext).then(function(item) {
          updateReference(item, cachedObj, dfd);
        });

      }, function(err) {
        handleError(dfd, err);
      });

      return dfd.promise;
    }

    function querySingle(url, initContext) {
      return this.query(url, true, initContext);
    }

    function updateReference(newData, ref, dfd) {
      if (angular.isArray(ref)) {
        ref.length = 0;
        Array.prototype.push.apply(ref, newData);
      } else {
        angular.extend(ref, newData || {});
      }

      ref.$loadInProgress = false;
      if (dfd.$needResolve) {
        dfd.resolve(ref);
      }
    }

    function retrieveFromCache(service, objKey, dfd, singular, placeholder) {
      var objStore = service.getObjectStore();
      var cachedObj = objStore.get(objKey);

      if (angular.isObject(cachedObj)) {
        // $log.debug('resolved request for ' + objKey + ' from cache');
        dfd.resolve(cachedObj);
        dfd.$needResolve = false;
      } else {
        if (singular) {
          cachedObj = placeholder || service.buildPlaceholder();
        } else {
          cachedObj = [];
        }
      }
      return cachedObj;
    }

    function initAndCache(response, initContext) {
      return this.extractResponseData(response, initContext).then(
        angular.bind(this, this.cacheObjects)
      );
    }

    function extractResponseData(response, initContext) {
      var service = this,
          isArray = angular.isArray(response.data),
          dataItems = _.flattenDeep([response.data]),
          initializer = this.initializeInstance;

      if (!angular.isFunction(initializer)) {
        initializer = _.identity;
      }

      return $q.all(dataItems.map(callInitializer)).then(onSuccess, onError);

      function callInitializer(item) {
        return initializer.call(service, item, initContext);
      }

      function onSuccess(initializedDataItems) {
        return isArray ? initializedDataItems : initializedDataItems[0];
      }

      function onError(errorData) {
        if (angular.isFunction(service.handleDeserializationError)) {
          return service.handleDeserializationError(errorData);
        } else {
          return $q.reject(errorData);
        }
      }
    }

    function cacheObjects(objects) {
      var objectStore = this.getObjectStore();

      _.flattenDeep([objects]).forEach(
        function(object) {
          if (angular.isString(object.id)) {
            objectStore.put(object.id, object);
          }
        }
      );

      return objects;
    }

    function getById(id, params) {
      var url;

      if (angular.isFunction(this.baseURL)) {
        params = angular.extend({id: id}, params);
        url = this.baseURL.call(this, params);
      } else {
        url = this.baseURL + (id || '').toString();
      }

      return this.$get(url);
    }

    function getURL(url) {
      return DelegatorService.get(url);
    }

    function getObjectStore() {
      var cache;
      var cacheName;

      if (this.modelName) {
        cacheName = APPLICATION.cache + '.' + this.modelName;
        cache = cacheFactory.get(cacheName) || cacheFactory(cacheName);
      } else {
        cache = apiCache;
      }

      return cache;
    }

    // if the service defines its own error handler, use it
    // if not just add the error to store.
    function handleError(dfd, err) {
      dfd.reject(err);
      if (angular.isFunction(this.handleHTTPError)) {
        this.handleHTTPError(err);
      } else {
        ErrorStore.add(err);
      }
    }

    function buildPlaceholder() {
      var placeholder;

      if (this.resourceClass) {
        placeholder = this.resourceClass.wrap.apply(this.resourceClass, arguments);
      } else {
        placeholder = {};
        angular.forEach(
          arguments,
          function(argument) {
            if (angular.isObject(argument)) {
              angular.extend(placeholder, argument);
            } else {
              placeholder.id = placeholder.id || argument;
            }
          }
        );
      }

      return placeholder;
    }

    function buildFindURL(service, params) {
      var baseURL = service.baseURL || '',
          findURL;

      if (angular.isFunction(baseURL)) {
        findURL = baseURL.call(service, params);
      } else {
        findURL = baseURL.toString() + params.id;
      }

      return findURL;
    }
  }
})();
