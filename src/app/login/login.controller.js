/**
 * Created By: Noopur N. Dabhi
 * defined business logic regarding login
 */
(function() {
  angular.module('nd')
    .controller('LoginController', loginController);

  function loginController(
    $scope,
    modelFactory,
    User,
    LoginService,
    Session
    ) {

    // create user instance
    $scope.user = modelFactory.create('user', User);

    $scope.login = login;

    /**
     * Authenticate user
     */
    function login() {
      var authPromise = LoginService.authentication($scope.user);
      /*return authPromise;*/
      authPromise.then(loginSuccess, failure);
    }

    /**
     * On success add user in session
     */
    function loginSuccess (result) {
      $scope.user.accessToken = result.accessToken;
      $scope.user.refreshToken = result.refreshToken;
      $scope.user.expireDate = result.expireDate;
      $scope.user.status = result.status;
      //Create a new user session
      Session.create($scope.user);
    }

    /**
     * handles failure in authentication
     */
    function failure (error) {
      console.log(error);
    }
  }
})();
