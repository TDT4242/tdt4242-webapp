angular.module('MasterApp')
  .factory('User',
  ['Account', '$rootScope', '$auth', '$timeout',
  function(Account, $rootScope, $auth, $timeout) {
    var alertMessageTimeout = 10000;
    return {
      // Update $rootScope with latest user details
      updateUser: function() {
        Account.getUser({}).then(function(response) {
          $rootScope.user = response.data.data.user;
          $rootScope.products = response.data.data.products;
          $rootScope.orders = response.data.data.orders;
          $rootScope.deals = response.data.data.deals;
          // Make sure newQuantity does not point to old quantity if its changed
          for (var i = 0; i < $rootScope.user.cart_products.length; i++) {
            $rootScope.user.cart_products[i].newQuantity = JSON.parse(JSON.stringify($rootScope.user.cart_products[i].quantity));
          }
        }).catch(function(err) {
          if ($auth.isAuthenticated()) {
            $rootScope.alertMessage = err.data.message;
          }
        });
      },
      // Get price for product given applied deal
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
      // Handle success and alert messages 
      showSuccess: function(message, cb) {
        $rootScope.successMessage = message;
        $rootScope.alertMessage = null;
        $rootScope.successCb = cb;
        
        // remove message after 2 seconds if not replaced by a new one
        var dateSet = Date.now();
        $rootScope.successMessageDate = dateSet;
        $timeout(function() {
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
          if ($rootScope.alertMessageDate == dateSet) {
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
  
  // Round number to closest 2 decimals
  function roundIt(number) {
    return Math.floor(number * 100)/100;
  }
