/**
 * Created By: Noopur N. Dabhi
 * Utility for common funcionalities
 */

(function() {
  angular.module('nd')
    .factory('Utility', Utility);

  function Utility() {
    return {
      pruneEmpty: pruneEmpty,
      snakeToCamelCase: snakeToCamelCase,
      snakeToCamelCaseReplacer: snakeToCamelCaseReplacer,
      camelToSnakeCase: camelToSnakeCase,
      camelToSnakeCaseReplacer: camelToSnakeCaseReplacer,
      responseCommonHandler: responseCommonHandler
    };

    /**
     * Empty object by keys whose value is undefined/null/empty
     */
    function pruneEmpty(obj) {
      return (function prune(current) {
        _.forOwn(current, function (value, key) {
          if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
            (_.isString(value) && _.isEmpty(value)) ||
            (_.isObject(value) && _.isEmpty(prune(value)))) {

            delete current[key];
          }
        });
        // remove any leftover undefined values from the delete
        // operation on an array
        if (_.isArray(current)) {
          _.pull(current, undefined);
        }
        return current;

      }(_.cloneDeep(obj)));
    }

    /**
     * Convert keys of an object to snake case to camel case
     */
    function snakeToCamelCase(response) {
      //Convert response keys from snake to camel case
      if (typeof response !== 'object') {
        return response;
      }
      for (var prop in response) {
        if (response.hasOwnProperty(prop)) {
          var replacedKey = prop.replace(/(\_\w)/g, snakeToCamelCaseReplacer);
          response[replacedKey] = snakeToCamelCase(response[prop]);
          if (prop.indexOf('_') > -1) {
            delete response[prop];
          }
        }
      }
      return response;
    }

    /**
     * Convert keys of an object to snake case to camle case
     */
    function snakeToCamelCaseReplacer(input) {
      return input[1].toUpperCase();
    }


    /**
     * Convert keys of an object to camel case to snake case
     */
    function camelToSnakeCase(requestParams) {
      //Convert response keys from camel to snake case
      if (typeof requestParams !== 'object') {
        return requestParams;
      }
      for (var prop in requestParams) {
        if (requestParams.hasOwnProperty(prop)) {
          var replacedKey = prop.replace(/([A-Z])/g, camelToSnakeCaseReplacer);
          requestParams[replacedKey] = camelToSnakeCase(requestParams[prop]);
          if (prop.toLowerCase() !== prop) {
            delete requestParams[prop];
          }
        }
      }
      return requestParams;
    }

    /**
     * Convert keys of an object to camel case to snake case
     */
    function camelToSnakeCaseReplacer(input) {
      return '_' + input.toLowerCase();
    }

    function responseCommonHandler(data) {
      console.log(data);
    }
  }
})();
