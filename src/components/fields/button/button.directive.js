/**
 * Created By: Noopur N. Dabhi
 * This directive provides view for button
 */
(function() {
  angular.module('nd')
    .directive('ndButton', button);

  function button() {
    return {
      restrict: 'E',
      // Add ndClass if using class
      // prefix is added based on module, for ex, 'nd'Lable
      scope: {
        ndLable: '@',
        ndClick: '&'
      },
      templateUrl: 'components/fields/button/button.template.html',
      link: link
    };

    function link(scope) {
      scope.clickButton = function() {
        scope.ndClick();
        /*promise.$promise.then(function(user) {
          console.log(user);
        });*/
      };
    }
  }
})();
