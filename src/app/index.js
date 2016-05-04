/**
 * Created By: Noopur N. Dabhi
 * Main js files where modules are injected
 */
(function() {
  'use strict';
  // Create module for generated templates to live
  angular.module('nd', [
    'ngLodash',
    'ngResource',
    'ui.router',
    'angular-cache'
  ]);
})();
