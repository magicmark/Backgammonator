'use strict';

/**
 * @ngdoc overview
 * @name backgammonatorApp
 * @description
 * # backgammonatorApp
 *
 * Main module of the application.
 */
angular
  .module('backgammonatorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/FindGame', {
        templateUrl: 'views/findgame.html',
        controller: 'FindgameCtrl'
      })
      .when('/playcomputer', {
        templateUrl: 'views/playcomputer.html',
        controller: 'PlaycomputerCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
