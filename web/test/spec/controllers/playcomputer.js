'use strict';

describe('Controller: PlaycomputerCtrl', function () {

  // load the controller's module
  beforeEach(module('backgammonatorApp'));

  var PlaycomputerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaycomputerCtrl = $controller('PlaycomputerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
