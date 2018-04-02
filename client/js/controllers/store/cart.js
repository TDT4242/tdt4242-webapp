angular.module('MasterApp')
  .controller('CartCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'User', 'Account', 'User',
  function($scope, $state, $rootScope, $localStorage, User, Account, User) {

    // Controller only uses data from the $rootScope, therefore uses the global updateUser method to make sure controller is updated with latest data
    User.updateUser();

    // Transform iso to readable date
    $scope.getDateFromIso = function(iso) {
      var d = new Date(iso);
      var date = d.getDate(); if (date < 10) {date='0'+date;}
      var month = d.getMonth()+1; if (month < 10) {month='0'+month;}
      var year = d.getFullYear(); if (year < 10) {year='0'+year;}
      
      var minute = d.getMinutes(); if (minute < 10) {minute='0'+minute;}
      var hour = d.getHours(); if (hour < 10) {hour='0'+hour;}

      return date + '.' + month + '.' + year + ', ' + hour + ':' + minute;
    }
    
    // Get number of items in cart
    $scope.getCartCount = function() {
      if ($rootScope.user) {
        var totalCount = 0;
        for (var i = 0; i < $rootScope.user.cart_products.length; i++) {
          totalCount += $rootScope.user.cart_products[i].quantity;
        }
        return totalCount;
      } else {
        return null;
      }
    }
    
    // Get total cost of items in cart
    $scope.getCartCost = function() {
      if ($rootScope.user) {
        var totalCost = 0;
        for (var i = 0; i < $rootScope.user.cart_products.length; i++) {
          var deal = $scope.getProductDeal($rootScope.user.cart_products[i].product);
          var product = $scope.getProduct($rootScope.user.cart_products[i]);
          totalCost += User.getPrice($rootScope.user.cart_products[i].quantity, product.price, deal);
        }
        return totalCost;
      } else {
        return null;
      }
    }
    
    // Get product price given the applied deal
    $scope.getProductPrice = function(cartProduct) {
      if ($rootScope.user) {
        var deal = $scope.getProductDeal(cartProduct.product);
        var product = $scope.getProduct(cartProduct);
        return User.getPrice(cartProduct.quantity, product.price, deal)
      } else {
        return null;
      }
    }
    
    // Get deal (if any) for the given product id
    $scope.getProductDeal = function(product_id) {
      if ($rootScope.user) {
        for (var i = 0; i < $rootScope.deals.length; i++) {
          if ($rootScope.deals[i].product == product_id) {
            return $rootScope.deals[i];
          }
        }
        return null;
      } else {
        return null;
      }
    }
    
    // Get number of items for the given order
    $scope.getNumberOfItems = function(order) {
      var counter = 0;
      for (var i = 0; i < order.products.length; i++) {
        counter += order.products[i].quantity;
      }
      return counter;
    }
    
    // Get total cost for all products, only used on orders
    $scope.getOrderCost = function(products) {
      var cost = 0;
      for (var i = 0; i < products.length; i++) {
        cost += products[i].price;
      }
      return cost;
    }
    
    // Transform order status value to texts
    $scope.getStatusDescription = function(status) {
      if (status == 0) {
        return 'Received';
      } else if (status == 1) {
        return 'In progress';
      } else if (status == 2) {
        return 'Order shipped';
      }
    }
    
    // Get all products in cart
    $scope.getCartProducts = function() {
      if ($rootScope.user) {
        return $rootScope.user.cart_products;
      } else {
        return [];
      }
    }
    
    // Get all orders in cart
    $scope.getOrders = function() {
      if ($rootScope.user) {
        return $rootScope.orders;
      } else {
        return [];
      }
    }
    
    // Get given product given the cartProduct
    $scope.getProduct = function(cartProduct) {
      for (var i = 0; i < $rootScope.products.length; i++) {
        if ($rootScope.products[i]._id == cartProduct.product) {
          return $rootScope.products[i];
        }
      }
    }
    
    // Make deleteProductFromCart API request
    $scope.deleteProductFromCart = function(id) {
      Account.deleteProductFromCart({
        cart_product_id: id
      }).then(function(response) {
        User.updateUser();
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }

    // Make updateProductInCart API request
    $scope.updateProductInCart = function(id, quantity) {
      Account.updateProductInCart({
        cart_product_id: id,
        quantity: quantity
      }).then(function(response) {
        User.updateUser();
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }

    // Make checkout API request
    $scope.checkout = function() {
      Account.checkout({}).then(function(response) {
        User.updateUser();
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }

  }]);
