angular.module('MasterApp')
  .controller('AdminHomeCtrl',['$scope', '$state', '$rootScope', '$localStorage', '$auth', '$http', 'Account', 'User',
  function($scope, $state, $rootScope, $localStorage, $auth, $http, Account, User) {
    $scope.data = {
      products: [],
      deals: [],
      orders: [],
      brands: [],
      materials: [],
      categories: [],
      users: [],
      statuses: [{value:0},{value:1},{value:2}],
      showAddProduct: false,
      showAddDeal: false,
      newProductValidationErrorMessage: null,
      newDealValidationErrorMessage: null
    };
    
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
    
    // Transform order status value to text
    $scope.getStatusDescription = function(status) {
      if (status == 0) {
        return 'Received';
      } else if (status == 1) {
        return 'In progress';
      } else if (status == 2) {
        return 'Order shipped';
      }
    }

    $scope.showAddProduct = function(show) {
      $scope.data.showAddProduct = show;
    }

    $scope.showAddDeal = function(show) {
      $scope.data.showAddDeal = show;
    }
    
    // Tranform deal to descriptive text
    $scope.getDealDescription = function(deal) {
      if (deal.percentage !== null) {
        return deal.percentage + ' % off';
      } else {
        return deal.x + ' for ' + deal.y;
      }
    }

    // Make updateOrder API request
    $scope.updateOrder = function(order_id) {
      Account.updateOrder({
        order_id: order_id
      }).then(function(response) {
        $scope.data.orders = response.data.data.orders;
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      })
    }
    
    // Make editStockQuantity API request
    $scope.editStockQuantity = function(product) {
      Account.editStockQuantity({
        product_id: product._id,
        stock_quantity: product.new_quantity
      }).then(function(response) {
        $scope.data.products = response.data.data.products;
        for (var i = 0; i < $scope.data.products.length; i++) {
          $scope.data.products[i].new_quantity = JSON.parse(JSON.stringify($scope.data.products[i].stock_quantity));
        }
      }).catch(function(err) {
        User.showAlert(err.data.message, null);
      })
    }

    // Validate new product parameters and make addNewProduct API request
    $scope.addNewProduct = function() {
      if ($scope.validateNewProduct()) {

        Account.addNewProduct({
          name: $scope.data.newProductName,
          short_description: $scope.data.newProductShortDescription,
          price: $scope.data.newProductPrice,
          stock_quantity: $scope.data.newProductStockQuantity,
          brand_id: $scope.data.newProductBrand._id,
          category_id: $scope.data.newProductCategory._id,
          material_id: $scope.data.newProductMaterial._id
        }).then(function(response) {
          $scope.data.products = response.data.data.products;
          for (var i = 0; i < $scope.data.products.length; i++) {
            $scope.data.products[i].new_quantity = JSON.parse(JSON.stringify($scope.data.products[i].stock_quantity));
          }
          $scope.data.newProductName = null;
          $scope.data.newProductShortDescription = null;
          $scope.data.newProductPrice = null;
          $scope.data.newProductStockQuantity = null;
          $scope.data.newProductBrand = null;
          $scope.data.newProductCategory = null;
          $scope.data.newProductMaterial = null;
        }).catch(function(err) {
          User.showAlert(err.data.message, null);
        })
      }
    }

    // Validate new deal parameters and make addNewDeal API request
    $scope.addNewDeal = function() {
      if ($scope.validateNewDeal()) {
        Account.addNewDeal({
          product_id: $scope.data.newDealProduct._id,
          type: $scope.data.newDealType,
          percentage: $scope.data.percentage,
          x: $scope.data.x,
          y: $scope.data.y
        }).then(function(response) {
          $scope.data.deals = response.data.data.deals;
          $scope.data.newDealProduct = null;
          $scope.data.newDealType = null;
          $scope.data.percentage = null;
          $scope.data.x = null;
          $scope.data.y = null;
        }).catch(function(err) {
          User.showAlert(err.data.message, null);
        })
      }
    }

    // Make sure new product parameters are valid
    $scope.validateNewProduct = function() {
      $scope.data.newProductValidationErrorMessage = null;
      if (typeof $scope.data.newProductName != 'string' || $scope.data.newProductName.trim() == '') {
        $scope.showValidationAlert('newProduct', 'Please enter a name for the product.')
        return false;
      } else if (typeof $scope.data.newProductShortDescription != 'string' || $scope.data.newProductShortDescription.trim() == '') {
        $scope.showValidationAlert('newProduct', 'Please enter a short description for the product..')
        return false;
      } else if (typeof $scope.data.newProductPrice != 'number' || $scope.data.newProductPrice <= 0) {
        $scope.showValidationAlert('newProduct', 'Please enter a price for the product (must be above 0).')
        return false;
      } else if (typeof $scope.data.newProductStockQuantity != 'number' || $scope.data.newProductStockQuantity < 0) {
        $scope.showValidationAlert('newProduct', 'Please enter the stock quantity for this product (cannot be smaller than 0).')
        return false;
      } else if (!$scope.data.newProductBrand) {
        $scope.showValidationAlert('newProduct', 'Please select the brand for this product.')
        return false;
      } else if (!$scope.data.newProductCategory) {
        $scope.showValidationAlert('newProduct', 'Please select the category for this product.')
        return false;
      } else if (!$scope.data.newProductMaterial) {
        $scope.showValidationAlert('newProduct', 'Please select the material for this product.')
        return false;
      }
      return true;
    }

    // Make sure new deal parameters are valid
    $scope.validateNewDeal = function() {
      $scope.data.newDealValidationErrorMessage = null;
      if (!$scope.data.newDealProduct) {
        $scope.showValidationAlert('newDeal', 'Please select a product for the deal.')
        return false;
      } else if (!$scope.data.newDealType) {
        $scope.showValidationAlert('newDeal', 'Please select a type for the deal.')
        return false;
      }
      if ($scope.data.newDealType == 1) {
        if (typeof $scope.data.percentage != 'number' || $scope.data.percentage <= 0 || $scope.data.percentage >= 100) {
          $scope.showValidationAlert('newDeal', 'Please select enter a valid percentage number for this deal.')
          return false;
        }
      } else if ($scope.data.newDealType == 2) {
        if (typeof $scope.data.x != 'number' || typeof $scope.data.y != 'number') {
          $scope.showValidationAlert('newDeal', 'Please select enter valid numbers for the X for Y deal.')
          return false;
        }
        if ($scope.data.x < 2 || $scope.data.y < 1) {
          $scope.showValidationAlert('newDeal', 'x must be larger than 1 and y must be larger than 0.')
          return false;
        }
      }
      return true;

    }
    
    // Initialize controller by getting the admin data
    Account.getAdmin({}).then(function(response) {
      $scope.data = response.data.data;
      for (var i = 0; i < $scope.data.products.length; i++) {
        $scope.data.products[i].new_quantity = JSON.parse(JSON.stringify($scope.data.products[i].stock_quantity));
      }
    }).catch(function(err) {
      User.showAlert(err.data.message, null);
    })
    
    // Generic method to get item from items given the id
    $scope.getItemById = function(items, id) {
      for (var i = 0; i < items.length; i++) {
        if (items[i]._id == id) {
          return items[i];
        }
      }
      return null;
    }

    // Get descriptive string for all categories for a product
    $scope.getProductCategories = function(product) {
      var returnString = "";
      var counter = 0;
      for (var i = 0; i < $scope.data.categories.length; i++) {
        if (product.categories.indexOf($scope.data.categories[i]._id) != -1) {
          if (counter == 0) {
            returnString += $scope.data.categories[i].name;
          } else {
            returnString += ', ' + $scope.data.categories[i].name;
          }
          counter++;
        }
      }
      return returnString;
    }
    
    // Alert method 
    $scope.showValidationAlert = function(type, message) {
      if (type == 'newProduct') {
        $scope.data.newProductValidationErrorMessage = message;
      } else if (type == 'newDeal') {
        $scope.data.newDealValidationErrorMessage = message;
      }
    }
    // Alert method 
    $scope.hideValidationAlert = function(type, message, cb) {
      if (type == 'newProduct') {
        $scope.data.newProductValidationErrorMessage = null;
      } else if (type == 'newDeal') {
        $scope.data.newDealValidationErrorMessage = null;
      }
    }
  }]);
