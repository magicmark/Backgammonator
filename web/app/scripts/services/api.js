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

    var doHTTP = function (type, path, data)  {

      var req, d;

      d = $q.defer();

      req = {
        method: type,
        url: 'http://localhost:5000' + path,
        headers: {
         'Content-Type': "application/json; charset=utf-8"
        }
      };

      if (data) {
        req.data = data;
      }

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
      },
      askForMove: function (position) {
        return doHTTP('GET', '/move', position)
      }
    };

  });
