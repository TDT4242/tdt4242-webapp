angular.module('MasterApp')
  .factory('Account',
  ['$http',
  function($http) {
    return {
      // USER SPECIFIC
      searchProducts: function(data) {
        return $http.post('/api/store/search', data);
      },
      addToCart: function(data) {
        return $http.put('/api/user/addToCart', data);
      },
      deleteProductFromCart: function(data) {
        return $http.put('/api/user/deleteProductFromCart', data);
      },
      updateProductInCart: function(data) {
        return $http.put('/api/user/updateProductInCart', data);
      },
      checkout: function(data) {
        return $http.put('/api/user/checkout', data);
      },
      getUser: function(data) {
        return $http.post('/api/user/get', data);
      },
      getAdmin: function(data) {
        return $http.post('/api/admin/get', data);
      },
      addNewProduct: function(data) {
        return $http.put('/api/admin/add-product', data);
      },
      addNewDeal: function(data) {
        return $http.put('/api/admin/add-deal', data);
      },
      editStockQuantity: function(data) {
        return $http.put('/api/admin/edit-stock-quantity', data);
      }
    }
  }]);
