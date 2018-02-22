angular.module('MasterApp')
  .controller('LoginCtrl',['$scope', '$state', '$rootScope', '$localStorage', '$auth', '$http',
  function($scope, $state, $rootScope, $localStorage, $auth, $http) {
    console.log('LoginCtrl');
    $scope.data = {
      email: '',
      password: ''
    }

    $scope.login = function() {
      $http.post('/api/auth/login', {
        email: $scope.data.email,
        password: $scope.data.password
      }).then(function(response) {
        console.log(response);
        $auth.setToken(response.data.token);
        $state.go('master.browse');
        $scope.hideAlert();
      }).catch(function(err) {
        console.log(err);
        $scope.showAlert(err.data.message, null);
      });
    }

    $scope.showAlert = function(message, cb) {
      $rootScope.alertMessage = message;
      $rootScope.alertCb = cb;
    }
    $scope.hideAlert = function() {
      $rootScope.alertMessage = null;
      if ($rootScope.alertCb) {
        $rootScope.alertCb();
      }
    }

  }]);
