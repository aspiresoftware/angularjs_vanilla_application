/**
 * Created By: Noopur N. Dabhi
 * This directive provides view for input[type]=password
 */
(function() {
  angular.module('nd')
    .directive('ndPassword', password);

  function password() {
    return {
      restrict: 'E',
      // Add ndClass if using class
      // prefix is added based on module, for ex, 'nd'Lable
      scope: {
        ndLable: '@',
        ndId: '@',
        ngModel: '=',
        ndRequired: '='
      },
      templateUrl: 'components/fields/input/password/password.template.html'
    };
  }
})();
