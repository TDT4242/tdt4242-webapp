angular.module('MasterApp')
  .factory('User',
  ['Account', '$rootScope',
  function(Account, $rootScope) {
    return {
      updateUser: function() {
        Account.getUser({}).then(function(response) {
          $rootScope.user = response.data.data.user;
          $rootScope.products = response.data.data.products;
          for (var i = 0; i < $rootScope.user.cart_products.length; i++) {
            $rootScope.user.cart_products[i].newQuantity = JSON.parse(JSON.stringify($rootScope.user.cart_products[i].quantity));
          }
        }).catch(function(err) {
          console.log(err);
          $rootScope.alertMessage = err.data.message;
        });
      }
    }
  }]);
