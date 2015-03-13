'use strict';

/**
 * @ngdoc service
 * @name backgammonatorApp.api
 * @description
 * # api
 * Service in the backgammonatorApp.
 */
angular.module('backgammonatorApp')
  .service('API', function ($http, $q) {

    var doHTTP = function (type, path)  {

      var req, d;

      d = $q.defer();

      req = {
        method: type,
        url: 'http://localhost:5000' + path
        // headers: {
        //  'Content-Type': undefined
        // },
        // data: { test: 'test' },
      };

      $http(req).success(function(data, status, headers, config) {
        d.resolve(data);
      }).
      error(function(data, status, headers, config) {
        d.reject();
      });

      return d.promise;
    };


    return {
      rollDice : function () {
        return doHTTP('POST', '/rollDice');
      }
    };

  });
