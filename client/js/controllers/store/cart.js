angular.module('MasterApp')
  .controller('CartCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'User', 'Account', 'User',
  function($scope, $state, $rootScope, $localStorage, User, Account, User) {

    User.updateUser();

    $scope.getDateFromIso = function(iso) {
      var d = new Date(iso);
      var date = d.getDate(); if (date < 10) {date='0'+date;}
      var month = d.getMonth()+1; if (month < 10) {month='0'+month;}
      var year = d.getFullYear(); if (year < 10) {year='0'+year;}
      
      var minute = d.getMinutes(); if (minute < 10) {minute='0'+minute;}
      var hour = d.getHours(); if (hour < 10) {hour='0'+hour;}

      return date + '.' + month + '.' + year + ', ' + hour + ':' + minute;
    }
    
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
    
    $scope.getProductPrice = function(cartProduct) {
      if ($rootScope.user) {
        var deal = $scope.getProductDeal(cartProduct.product);
        var product = $scope.getProduct(cartProduct);
        return User.getPrice(cartProduct.quantity, product.price, deal)
      } else {
        return null;
      }
    }
    
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
    
    $scope.getNumberOfItems = function(order) {
      var counter = 0;
      for (var i = 0; i < order.products.length; i++) {
        counter += order.products[i].quantity;
      }
      return counter;
    }
    
    $scope.getOrderCost = function(products) {
      var cost = 0;
      for (var i = 0; i < products.length; i++) {
        cost += products[i].price;
      }
      return cost;
    }
    
    $scope.getStatusDescription = function(status) {
      if (status == 0) {
        return 'Received';
      } else if (status == 1) {
        return 'In progress';
      } else if (status == 2) {
        return 'Order shipped';
      }
    }
    
    $scope.deleteProductFromCart = function(id) {
      Account.deleteProductFromCart({
        cart_product_id: id
      }).then(function(response) {
        User.updateUser();
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }

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

    $scope.checkout = function() {
      Account.checkout({}).then(function(response) {
        User.updateUser();
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      });
    }

    $scope.getCartProducts = function() {
      if ($rootScope.user) {
        return $rootScope.user.cart_products;
      } else {
        return [];
      }
    }
    $scope.getOrders = function() {
      if ($rootScope.user) {
        return $rootScope.orders;
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
  }]);
