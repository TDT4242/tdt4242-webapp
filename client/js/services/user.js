angular.module('MasterApp')
  .factory('User',
  ['Account', '$rootScope', '$auth', '$timeout',
  function(Account, $rootScope, $auth, $timeout) {
    var alertMessageTimeout = 10000;
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
        
        // remove message after 2 seconds if not replaced by a new one
        var dateSet = Date.now();
        $rootScope.successMessageDate = dateSet;
        $timeout(function() {
          console.log('in here', dateSet, $rootScope.successMessageDate)
          if ($rootScope.successMessageDate == dateSet) {
            $rootScope.successMessage = null;
          }
        }, alertMessageTimeout);
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
        
        // remove message after 2 seconds if not replaced by a new one
        var dateSet = Date.now();
        $rootScope.alertMessageDate = dateSet;
        $timeout(function() {
          console.log('in here', dateSet, $rootScope.alertMessageDate)
          if ($rootScope.alertMessageDate == dateSet) {
            console.log('yes')
            $rootScope.alertMessage = null;
          }
        }, alertMessageTimeout);
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
