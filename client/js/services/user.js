angular.module('MasterApp')
  .factory('User',
  ['Account', '$rootScope', '$auth',
  function(Account, $rootScope, $auth) {
    return {
      updateUser: function() {
        Account.getUser({}).then(function(response) {
          $rootScope.user = response.data.data.user;
          $rootScope.products = response.data.data.products;
          $rootScope.orders = response.data.data.orders;
          $rootScope.deals = response.data.data.deals;

          for (var i = 0; i < $rootScope.user.cart_products.length; i++) {
            $rootScope.user.cart_products[i].newQuantity = JSON.parse(JSON.stringify($rootScope.user.cart_products[i].quantity));
          }
        }).catch(function(err) {
          console.log(err);
          if ($auth.isAuthenticated()) {
            $rootScope.alertMessage = err.data.message;
          }
        });
      },
      getPrice: function(quantity, price, deal) {
        if (!deal) {
          return roundIt(price * quantity)
        }
        if (deal.percentage) {
          return roundIt(price * quantity * (1 - deal.percentage * 0.01));
        }
        if (deal.x && quantity >= deal.x) {
          var numberOfDeals = Math.floor(quantity/deal.x)
          var numberOfFreeProducts = quantity - (deal.y * numberOfDeals)

          return roundIt((quantity - numberOfFreeProducts) * price)
        }
        return roundIt(price * quantity)
      },
      showSuccess: function(message, cb) {
        $rootScope.successMessage = message;
        $rootScope.alertMessage = null;
        $rootScope.successCb = cb;
      },
      hideSuccess: function() {
        $rootScope.successMessage = null;
        if ($rootScope.successCb) {
          $rootScope.successCb();
        }
      },
      showAlert: function(message, cb) {
        $rootScope.alertMessage = message;
        $rootScope.successMessage = null;
        $rootScope.alertCb = cb;
      },
      hideAlert: function() {
        $rootScope.alertMessage = null;
        if ($rootScope.alertCb) {
          $rootScope.alertCb();
        }
      }
    }
  }]);
  
  
  function roundIt(number) {
    return Math.floor(number * 100)/100;
  }
