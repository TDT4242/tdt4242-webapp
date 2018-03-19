angular.module('MasterApp')
  .controller('CartCtrl',['$scope', '$state', '$rootScope', '$localStorage', 'User', 'Account',
  function($scope, $state, $rootScope, $localStorage, User, Account) {
    console.log('CartCtrl');

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
        console.log(response);
        User.updateUser();
      }).catch(function(err) {
        console.log(err);
        $scope.showAlert(err.data.message, null);
      });
    }

    $scope.updateProductInCart = function(id, quantity) {
      Account.updateProductInCart({
        cart_product_id: id,
        quantity: quantity
      }).then(function(response) {
        console.log(response);
        User.updateUser();
      }).catch(function(err) {
        console.log(err);
        $scope.showAlert(err.data.message, null);
      });
    }

    $scope.checkout = function() {
      Account.checkout({}).then(function(response) {
        User.updateUser();
      }).catch(function(err) {
        console.log(err);
        $scope.showAlert(err.data.message, null);
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
