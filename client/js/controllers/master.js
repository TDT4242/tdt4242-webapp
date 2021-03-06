angular.module('MasterApp')
  .controller('MasterCtrl',['$scope', '$state', '$rootScope', '$localStorage', '$auth', 'Account', 'User',
  function($scope, $state, $rootScope, $localStorage, $auth, Account, User) {
    $scope.data = {
      sidebarCollapsed: false
    }
    

    $scope.goHome = function() {
      $state.go('master.home');
    }

    $scope.toggleSidebar = function() {
      $scope.data.sidebarCollapsed = !$scope.data.sidebarCollapsed;
    }
    
    $scope.isAdministrator = function() {
      if ($rootScope.user && $rootScope.user.permissions.indexOf(1) != -1) {
        return true;
      } else {
        return false;
      }
    }
    
    $scope.logout = function() {
      $auth.removeToken();
      User.hideAlert();
      User.hideSuccess();
      $state.go('login');
    }
    
    $scope.getNumberOfItems = function() {
      if ($rootScope.user) {
        return '('+$rootScope.user.cart_products.length+')';
      } else {
        return '';
      }
    }
  
    if ($auth.isAuthenticated()) {
      User.updateUser();
    }
  }]);
