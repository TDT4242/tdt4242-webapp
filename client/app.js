angular.module('MasterApp', ['ui.router', 'ui.bootstrap', 'ngStorage', 'satellizer'])

  .config(function($provide, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $stateProvider
      .state('master', {
        url: '/',
        templateUrl: '/partials/master.html',
        abstract: true,
        controller: 'MasterCtrl',
        resolve: {
          authenticated: authenticated
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '/partials/auth/signup.html',
        controller: 'SignupCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/partials/auth/login.html',
        controller: 'LoginCtrl'
      })
      .state('master.browse', {
        url: 'store/browse',
        templateUrl: '/partials/store/browse.html',
        controller: 'BrowseCtrl'
      })
      .state('master.cart', {
        url: 'store/cart',
        templateUrl: '/partials/store/cart.html',
        controller: 'CartCtrl'
      })
      .state('master.settings', {
        url: 'user/settings',
        templateUrl: '/partials/user/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('master.saved', {
        url: 'user/saved',
        templateUrl: '/partials/user/saved.html',
        controller: 'SavedCtrl'
      })
      ;

      function authenticated($q, $location, $auth, $localStorage, $rootScope, $state) {
        var deferred = $q.defer();
        if (!$auth.isAuthenticated()) {
          $state.go('login');
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      }


    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');

  });
