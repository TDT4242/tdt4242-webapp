angular.module('MasterApp')
  .controller('LoginCtrl',['$scope', '$state', '$rootScope', '$localStorage', '$auth', '$http', 'User',
  function($scope, $state, $rootScope, $localStorage, $auth, $http, User) {
    $scope.data = {
      email: '',
      password: ''
    }

    $scope.login = function() {
      $http.post('/api/auth/login', {
        email: $scope.data.email,
        password: $scope.data.password
      }).then(function(response) {
        $auth.setToken(response.data.token);
        $state.go('master.browse');
        User.hideAlert();
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }
  }]);
