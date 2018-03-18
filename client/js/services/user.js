angular.module('MasterApp')
  .factory('User',
  ['Account', '$rootScope', '$auth',
  function(Account, $rootScope, $auth) {
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
          if ($auth.isAuthenticated()) {
            $rootScope.alertMessage = err.data.message;
          }
        });
      }
    }
  }]);
