angular.module('MasterApp')
  .controller('MasterCtrl',['$scope', '$state', '$rootScope', '$localStorage', '$auth',
  function($scope, $state, $rootScope, $localStorage, $auth) {
    console.log('MasterCtrl');
    $scope.data = {
      sidebarCollapsed: false
    }

    $scope.goHome = function() {
      $state.go('master.home');
    }

    $scope.toggleSidebar = function() {
      $scope.data.sidebarCollapsed = !$scope.data.sidebarCollapsed;
    }
    
    $scope.logout = function() {
      console.log('here');
      $auth.removeToken();
      $state.go('login');
    }
    
    $scope.hideAlert = function() {
      $rootScope.alertMessage = null;
      if ($rootScope.alertCb) {
        $rootScope.alertCb();
      }
    }
  }]);
