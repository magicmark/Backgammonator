'use strict';

/**
 * @ngdoc function
 * @name backgammonatorApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the backgammonatorApp
 */
angular.module('backgammonatorApp')
  .controller('NavCtrl', function ($scope, $location) {

    var activeButtons = {
      'home' : true,
      'playcomputer': false
    };

    $scope.isActive = function (page) {
      return activeButtons[page];
    };

    $scope.changePage = function (page) {
      activeButtons.home = false;
      activeButtons.playcomputer = false;
      activeButtons[page] = true;
      $location.path("/" + page);
    }

  });
