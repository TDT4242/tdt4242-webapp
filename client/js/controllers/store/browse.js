angular.module('MasterApp')
  .controller('BrowseCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'Account', '$sce', 'User',
  function($scope, $state, $rootScope, $localStorage, Account, $sce, User) {
    $scope.data = {
      products: [],
      brands: [],
      deals: [],
      categories: [],
      materials: [],
      cart: [],
      searchText: '',
      upperPriceLimit: undefined,
      lowerPriceLimit: undefined,
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
    // Generic method to get item from items given the id
    $scope.getItemById = function(collection, id) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i]._id == id) {
          return collection[i];
        }
      }
    }
    
    // Getting price of product after applying the deal (if it exists)
    $scope.getProductPrice = function(product) {
      for (var i = 0; i < $scope.data.deals.length; i++) {
        if ($scope.data.deals[i].product == product._id) {
          return User.getPrice(1, product.price, $scope.data.deals[i]);
        }
      }
      return User.getPrice(1, product.price, null);
    }

    // Tranform deal to descriptive text, trustAsHtml used for being able to pass css in angular ng-html
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

    // Generic method for getting the ids of all items passed as parameters
    $scope.getIdsForItems = function(items) {
      var ids = [];
      for (var i = 0; i < items.length; i++) {
        ids.push(items[i]._id);
      }
      return ids;
    }

    // Figure out if product with given id already is in the cart
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
    
    // Get all items based on added filtering by using the searchProducts API request
    $scope.filterProducts = function() {
      var priceFilter = -1;
      if ($scope.data.priceFilter) {
        priceFilter = $scope.data.priceFilter.type;
      }
      Account.searchProducts({
        searchText: $scope.data.searchText,
        upperPriceLimit: $scope.data.upperPriceLimit,
        lowerPriceLimit: $scope.data.lowerPriceLimit,
        priceFilter: priceFilter,
        brands: $scope.getIdsForItems($scope.data.filterBrands),
        categories: $scope.getIdsForItems($scope.data.filterCategories),
        materials: $scope.getIdsForItems($scope.data.filterMaterials)
      }).then(function(response) {
        $scope.data.products = response.data.data.products;
        if (response.data.data.status == 2036) {
          alert(response.data.data.message);
        }
      }).catch(function(err) {
        User.showAlert(err.data.message, null);  
      });
    }

    // Add product to cart by making addToCart API request
    $scope.addToCart = function(product) {
      Account.addToCart({
        product_id: product._id,
        quantity: 1
      }).then(function(response) {
        $rootScope.user = response.data.data.user;
        $scope.data.cart = response.data.data.cart;
        User.updateUser();
        User.showSuccess("Item was added to your cart!", null);
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }

    // Initialize controller with data given NO parameters in the filtering (in practice, all products returned)
    Account.searchProducts({
      priceFilter: -1,
      brands: $scope.getIdsForItems($scope.data.filterBrands),
      categories: $scope.getIdsForItems($scope.data.filterCategories),
      materials: $scope.getIdsForItems($scope.data.filterMaterials)
    }).then(function(response) {
      $scope.data.products = response.data.data.products;
      $scope.data.brands = response.data.data.brands;
      $scope.data.categories = response.data.data.categories;
      $scope.data.materials = response.data.data.materials;
      $scope.data.deals = response.data.data.deals;

    }).catch(function(err) {
      User.showAlert(err.data.message, null);
    });

  }]);
