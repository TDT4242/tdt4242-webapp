angular.module('MasterApp')
  .controller('HomeCtrl',['$scope', '$state', '$rootScope', '$localStorage',
  function($scope, $state, $rootScope, $localStorage) {
    console.log('HomeCtrl');
    $scope.data = {
      sidebarCollapsed: false
    }

    $scope.goHome = function() {
      $state.go('faq.home');
    }

    $scope.toggleSidebar = function() {
      $scope.data.sidebarCollapsed = !$scope.data.sidebarCollapsed;
    }
    
    $scope.showAlert = function(message, cb) {
      $rootScope.alertMessage = message;
      $rootScope.successMessage = null;
      $rootScope.alertCb = cb;
    }
    $scope.hideAlert = function() {
      $rootScope.alertMessage = null;
      if ($rootScope.alertCb) {
        $rootScope.alertCb();
      }
    }
    $scope.showSuccess = function(message, cb) {
      $rootScope.successMessage = message;
      $rootScope.alertMessage = null;
      $rootScope.successCb = cb;
    }
    $scope.hideSuccess = function() {
      $rootScope.successMessage = null;
      if ($rootScope.successCb) {
        $rootScope.successCb();
      }
    }
  }]);
