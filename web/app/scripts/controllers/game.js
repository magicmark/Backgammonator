'use strict';

/**
 * @ngdoc function
 * @name backgammonatorApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the backgammonatorApp
 */
angular.module('backgammonatorApp')
  .controller('GameCtrl', function ($scope, $timeout, API) {

    // http://www.kirupa.com/html5/get_element_position_using_javascript.htm
    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;
      
        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

    var goToPoint = function goToPoint(event) {
      var x, y, checkerId;

      checkerId = event.target.getAttribute("id").substring(7);

      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      event.target.style.webkitTransform =
      event.target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      updatePosition(checkerId, x, y);

    };

    var snap = function snap (counterId, _x, _y) {
      move("#counter" + counterId).to(_x, _y).end();
      updatePosition(counterId, _x, _y);
      $scope.checkers[counterId].anchor = { x: _x, y: _y}
    }

    var updatePosition = function updatePosition (counterId, _x, _y) {
      document.querySelector("#counter" + counterId).setAttribute('data-x', _x);
      document.querySelector("#counter" + counterId).setAttribute('data-y', _y);
    };

    interact('.draggable').draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        snap: {
          relativePoints: [{ x: 0  , y: 0 }],
          endOnly: true
        },
        onmove: goToPoint,
      });

    interact('.arrow').dropzone({
      accept: '.counter',
      overlap: 0.1,

      ondragenter: function (event) {
        var checkerId = event.relatedTarget.getAttribute("id").substring(7);
        var arrowId   = event.target.getAttribute("id").substring(5);

        if ($scope.checkers[checkerId].isLegalMove(arrowId)) {
          $scope.arrows[arrowId].styles.highlight = true;
          $scope.$apply();
        }

      },
      ondragleave: function (event) {
        var arrowId   = event.target.getAttribute("id").substring(5);
        $scope.arrows[arrowId].styles.highlight = false;
        $scope.$apply();
      },
      ondrop: function (event) {
        var arrowId   = event.target.getAttribute("id").substring(5);
        var checkerId = event.relatedTarget.getAttribute("id").substring(7);

        handleCheckerDrop(arrowId, checkerId);
      },
      ondropdeactivate: function (event) {
        var arrowId   = event.target.getAttribute("id").substring(5);
        $scope.arrows[arrowId].styles.highlight = false;
        $scope.$apply();
      }
    });

    var handleCheckerDrop = function handleCheckerDrop (arrowId, checkerId) {
      if ($scope.checkers[checkerId].isLegalMove(arrowId)) {
        // Is legal. Do move.
        var arrowsDiff = $scope.checkers[checkerId].moveToArrow($scope.arrows[arrowId]);
        $scope.movesMade++;
        if (arrowsDiff == $scope.dice[0] + $scope.dice[1]) $scope.movesMade++;
        if ($scope.movesMade == 2) {
          makeComputerMove();
        }
      } else {
        // Is illegal. Snap back to anchor.
        var oldPos = $scope.checkers[checkerId].anchor;
        snap(checkerId, oldPos.x, oldPos.y);
      }
      $scope.$apply();
    };


    function Checker (_id, _arrow, _player, _x, _y) {
      this.id        = _id;
      this.player    = _player;
      this.currArrow = _arrow; // the id of the arrow

      this.anchor = { x: _x, y: _y };

      this.styles = {
        canDrop: false
      };

      this.getCurrArrow = function () {
        return $scope.arrows[this.currArrow];
      }

      this.isLegalMove = function (arrowId) {

        if (!$scope.canMove) {
          // Game isn't ready to allow moves yet
          return false;
        }

        if (arrowId < this.currArrow) {
          // We can't move backwards!
          return false
        }

        if ( 
          (arrowId != (this.currArrow + $scope.dice[0] + $scope.dice[1])) &&
          (arrowId != (this.currArrow + $scope.dice[0])) &&
          (arrowId != (this.currArrow + $scope.dice[1]))) {
          // Not a valid move with the given dice roll
          return false;
        }

        // Already made a move
        if (arrowId == this.currArrow + $scope.dice[0] + $scope.dice[1]) {
          if ($scope.movesMade == 1) {
            return false;
          }
        }

        var arrow = $scope.arrows[arrowId];
        if (!arrow.checkers.length) {
          // Empty array of checkers, so valid move
          return true
        }

        var topCheckerID = arrow.getTopCheckerID();
        if ($scope.checkers[topCheckerID].player != 5) {
          // Top checker isn't mine, so we can't go on it
          return false
        }

        return true;
      };

      this.moveToArrow = function (arrowToMoveTo) {

        var arrowDiff = Math.abs(arrowToMoveTo.id -  this.currArrow);

        // Animate
        snap(this.id, arrowToMoveTo.getNextPosition().x, arrowToMoveTo.getNextPosition().y);


        var thisCheckerIndex = this.getCurrArrow().checkers.indexOf(this.id); // where is this checker in the array of checkers?
        this.getCurrArrow().checkers.splice(thisCheckerIndex, 1);

        arrowToMoveTo.checkers.push(this.id);
        this.currArrow = arrowToMoveTo.id;

        return arrowDiff;
      };

      $scope.arrows[_arrow].checkers.push(_id);

      $timeout(function () {
        snap(_id, _x, _y);
      }, 15);
    }

    function Arrow (_id) {
      var me = this;
      this.id       = _id;
      this.position = {};
      this.type = (_id >= 12) ? 'bottom' : 'top';

      this.checkers = [];

      this.styles = {
        highlight: false
      }

      this.moveTopTo = function (arrowToMoveTo) {
        $scope.checkers[this.getTopCheckerID()].moveToArrow(arrowToMoveTo);
      }

      this.getPosition = function (n) {
        var yPos;

        yPos = 
          (me.type == 'top') ? 
          this.position.y - 270 + (n * 12) :
          yPos = this.position.y - (50 + n * 12);
        
        return {
          x: this.position.x - 25 - 160,
          y: yPos - 103
        }
      }

      this.getTopCheckerID = function () {
        if (!this.checkers.length) return undefined;
        return this.checkers[this.checkers.length-1];
      }

      this.getNextPosition = function () {
        return this.getPosition(this.checkers.length || 0);
      }

      this.position = getPosition(document.querySelector("#arrow" + _id));

    }

    var setUpCheckers = function () {
      $scope.checkers = [];
      for (var i = 0; i < 15; i++) {
        var nextPos = $scope.arrows[0].getNextPosition();
        $scope.checkers.push(new Checker(i, 0, 5, nextPos.x, nextPos.y));
      }

      for (var i = 15; i < 30; i++) {
        var nextPos = $scope.arrows[23].getNextPosition();
        $scope.checkers.push(new Checker(i, 23, 0, nextPos.x, nextPos.y));
      }

    };

    var setUpArrows = function () {
      $scope.arrows = [];
      for (var i = 0; i <= 23; i++) {
        $scope.arrows.push(new Arrow(i));
      }
    };

    var init = function init() {
      $scope.canMove = false;
      $scope.movesMade = 0;
      $scope.dice = [];
      $scope.playingGame = false;
      $scope.dicerollmessage = "To start game, roll dice!";
      setUpArrows();
      setUpCheckers();
    };

    // We have to make sure DOM is loaded...
    $timeout(init, 10);


    // return a position that can be read by API
    var ng2api = function () {
      var position = {
        checkers: {},
        arrows: [],
        me: 0
      };

      for (var i in $scope.checkers) {
        position.checkers[$scope.checkers[i].id] = { player: $scope.checkers[i].player }
      }

      for (var i in $scope.arrows) {
        var arrow = {
          id: $scope.arrows[i].id,
          checkers: $scope.arrows[i].checkers
        }
        position.arrows.push(arrow);
      }

      return position;
    }

    var makeComputerMove = function () {
      $scope.movesMade = 0;
      $scope.canMove = false;
      $scope.dicerollmessage = "Waiting for server...";
      API.askForMove(ng2api()).then(function (result) {
        console.dir(result);
        $scope.dicerollmessage = "Computer rolled: " + JSON.stringify(result.dice, null, 2) + "!";

        var arrowToMoveFrom, arrowToMoveTo, move;

        for (var i in result.moves) {
          move = result.moves[i];

          arrowToMoveFrom = $scope.arrows[move.from];
          arrowToMoveTo   = $scope.arrows[move.to];

          // TOD: Make this anonymous or something
          closureMakeMove(i, arrowToMoveFrom, arrowToMoveTo);

        }

      });

    }

    function closureMakeMove(i, arrowToMoveFrom, arrowToMoveTo) {
      $timeout(function () {
        arrowToMoveFrom.moveTopTo(arrowToMoveTo);
      }, i * 500);
    }


    $scope.controls = {
      shouldShowDice: function () {
        return true;
      },
      roll: function () {
        API.rollDice().then(function (result) {
          $scope.dice = result.results;
          $scope.canMove = true;
          $scope.dicerollmessage = "You rolled: " + JSON.stringify(result.results, null, 2) + "!";
          bootbox.alert($scope.dicerollmessage);
        })
      }
      

    };



  });
