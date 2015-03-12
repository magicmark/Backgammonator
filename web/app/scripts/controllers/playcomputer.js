'use strict';

/**
 * @ngdoc function
 * @name backgammonatorApp.controller:PlaycomputerCtrl
 * @description
 * # PlaycomputerCtrl
 * Controller of the backgammonatorApp
 */
angular.module('backgammonatorApp')
  .controller('PlaycomputerCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.playingGame = false;


    var init = function init() {
      $scope.playingGame = false;
    };

    init();

    $scope.startNewGame = function () {
      $scope.playingGame = true;
    };

  });
