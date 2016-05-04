/**
 * Created By: Noopur N. Dabhi
 * Create instances of the model
 */
(function () {
  'use strict';

  angular.module('nd')
    .factory('modelFactory', modelFactory);

  /* @ngInject */
  function modelFactory () {
    return {
      create: create
    };

    /**
     * Create model instance using lodash
     * @param  {String} objectName Name of the instance
     * @param  {Object} modelData  Model
     */
    function create (objectName, modelData) {
      return _.create(objectName, modelData);
    }
  }
})();
