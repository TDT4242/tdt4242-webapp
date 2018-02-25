angular.module('MasterApp')
  .controller('BrowseCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'Account', '$sce', 'User',
  function($scope, $state, $rootScope, $localStorage, Account, $sce, User) {
    console.log('BrowseCtrl');
    $scope.data = {
      products: [],
      brands: [],
      deals: [],
      categories: [],
      materials: [],
      cart: [],
      filterBrands: [],
      filterCategories: [],
      filterMaterials: [],
      priceFilters: [{
        name: "None",
        type: -1
      },
      {
        name: "Low to high",
        type: 1
      },
      {
        name: "High to low",
        type: 2
      }]
    }

    $scope.getItemById = function(collection, id) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i]._id == id) {
          return collection[i];
        }
      }
    }
    
    $scope.getDealDescription = function(product) {
      for (var i = 0; i < $scope.data.deals.length; i++) {
        if ($scope.data.deals[i].product == product._id) {
          if ($scope.data.deals[i].percentage) {
            return $sce.trustAsHtml('<div style = "color:red;font-weight:bold;">' + $scope.data.deals[i].percentage + '% off!</div>');
          } else if ($scope.data.deals[i].x) {
            return $sce.trustAsHtml('<div style = "color:red;font-weight:bold;">' + $scope.data.deals[i].x + ' for ' + $scope.data.deals[i].y + '!</div>');
          }
        }
      }
      return $sce.trustAsHtml('<div style = "color:white;">SuperStore</div>');
    }
    
    $scope.getIdsForItems = function(items) {
      var ids = [];
      for (var i = 0; i < items.length; i++) {
        ids.push(items[i]._id);
      }
      return ids;
    }
    
    $scope.filterProducts = function() {
      var priceFilter = -1;
      if ($scope.data.priceFilter) {
        priceFilter = $scope.data.priceFilter.type;
      }
      console.log(priceFilter);
      Account.searchProducts({
        priceFilter: priceFilter,
        brands: $scope.getIdsForItems($scope.data.filterBrands),
        categories: $scope.getIdsForItems($scope.data.filterCategories),
        materials: $scope.getIdsForItems($scope.data.filterMaterials)
      }).then(function(response) {
        console.log(response);
        $scope.data.products = response.data.data.products;
      }).catch(function(err) {
        $scope.showAlert(err.data.message, null);
      });
    }

    $scope.addToCart = function(product) {
      Account.addToCart({
        product_id: product._id,
        quantity: 1
      }).then(function(response) {
        console.log(response);
        $rootScope.user = response.data.data.user;
        $scope.data.cart = response.data.data.cart;
        User.updateUser();
        $rootScope.successMessage = "Item was added to your cart!"
      }).catch(function(err) {
        console.log(err);
        $scope.showAlert(err.data.message, null);
      });
    }

    Account.searchProducts({
      priceFilter: -1,
      brands: $scope.getIdsForItems($scope.data.filterBrands),
      categories: $scope.getIdsForItems($scope.data.filterCategories),
      materials: $scope.getIdsForItems($scope.data.filterMaterials)
    }).then(function(response) {
      console.log(response);
      $scope.data.products = response.data.data.products;
      $scope.data.brands = response.data.data.brands;
      $scope.data.categories = response.data.data.categories;
      $scope.data.materials = response.data.data.materials;
      $scope.data.deals = response.data.data.deals;

    }).catch(function(err) {
      console.log(err);
      $scope.showAlert(err.data.message, null);
    });
    
    
    $scope.productIsInCart = function(product_id) {
      if ($rootScope.user) {
        for (var i = 0; i < $rootScope.user.cart_products.length; i++) {
          if ($rootScope.user.cart_products[i].product == product_id) {
            return true;
          }
        }
      }
      return false;
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
