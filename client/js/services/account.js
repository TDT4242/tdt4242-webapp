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
      }
    }
  }]);
