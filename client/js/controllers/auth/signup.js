angular.module('MasterApp')
  .controller('SignupCtrl',['$scope', '$state', '$rootScope', '$localStorage', '$auth', '$http', 'User',
  function($scope, $state, $rootScope, $localStorage, $auth, $http, User) {
    console.log('SignupCtrl');
    
    $scope.login = function() {
      $http.put('/api/auth/signup', {
        first_name: $scope.data.first_name,
        last_name: $scope.data.last_name,
        email: $scope.data.email,
        password: $scope.data.password,
        password_again: $scope.data.password
      }).then(function(response) {
        console.log(response);
        $auth.setToken(response.data.token);
        $state.go('master.browse');
        User.hideAlert();
      }).catch(function(err) {
        console.log(err);
        User.showAlert(err.data.message, null);
      });
    }
  }]);
