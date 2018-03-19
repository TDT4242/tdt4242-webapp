angular.module('MasterApp')
  .controller('CartCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'User',
  function($scope, $state, $rootScope, $localStorage, User) {
    console.log('CartCtrl');
    
    User.updateUser();
    
    $scope.getCartProducts = function() {
      if ($rootScope.user) {
        return $rootScope.user.cart_products;
      } else {
        return [];
      }
    }
    
    $scope.getProduct = function(cartProduct) {
      for (var i = 0; i < $rootScope.products.length; i++) {
        if ($rootScope.products[i]._id == cartProduct.product) {
          return $rootScope.products[i];
        }
      }
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
