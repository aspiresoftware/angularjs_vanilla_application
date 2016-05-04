/**
 * Created By: Noopur N. Dabhi
 * This directive provides view for input[type]=text
 */
(function() {
  angular.module('nd')
    .directive('ndTextBox', textBox);

  function textBox() {
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
      templateUrl: 'components/fields/input/textbox/textbox.template.html'
    };
  }
})();
