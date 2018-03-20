angular.module('MasterApp')
  .controller('HomeCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'User',
  function($scope, $state, $rootScope, $localStorage, User) {
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
  }]);
