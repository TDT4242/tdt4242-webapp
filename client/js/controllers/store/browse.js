angular.module('MasterApp')
  .controller('BrowseCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'Account',
  function($scope, $state, $rootScope, $localStorage, Account) {
    console.log('BrowseCtrl');
    $scope.data = {
      products: [],
      brands: [],
      categories: [],
      materials: [],
      cart: []
    }

    $scope.getItemById = function(collection, id) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i]._id == id) {
          return collection[i];
        }
      }
    }

    $scope.addToCart = function(product) {
      Account.addToCart({
        product_id: product._id,
        quantity: 1
      }).then(function(response) {
        console.log(response);
        $scope.data.cart = response.data.data.cart;
      }).catch(function(err) {
        console.log(err);
        $scope.showAlert(err.data.message, null);
      });
    }

    Account.searchProducts({}).then(function(response) {
      console.log(response);
      $scope.data.products = response.data.data.products;
      $scope.data.brands = response.data.data.brands;
      $scope.data.categories = response.data.data.categories;
      $scope.data.materials = response.data.data.materials;
    }).catch(function(err) {
      console.log(err);
      $scope.showAlert(err.data.message, null);
    });

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
