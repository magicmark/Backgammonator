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
          relativePoints: [{ x: 0  , y: 0   }],
          endOnly: true
        },

        onstart: function (event) {
          var checkerId = event.target.getAttribute("id").substring(7);
          //$scope.checkers[checkerId].anchor = {x: event.clientX0, y: event.clientY0};
          console.log('setting anchor as ', {x: event.clientX0, y: event.clientY0});
        },

        onmove: goToPoint,
        // call this function on every dragend event
        onend: function (event) {
          var checkerId = event.target.getAttribute("id").substring(7);
          console.log('ended' + checkerId);


        }
      });


      interact('.arrow').dropzone({
        // only accept elements matching this CSS selector
        accept: '.counter',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.1,

        // listen for drop related events:

        ondropactivate: function (event) {

          // add active dropzone feedback
          console.log('yoyo');
          event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
          var checkerId = event.relatedTarget.getAttribute("id").substring(7);
          var arrowId   = event.target.getAttribute("id").substring(5);

          console.log("canDrop" + checkerId);

          if ($scope.checkers[checkerId].isLegalMove(arrowId)) {
            console.log("highlighing" + arrowId);
            console.log("canDrop" + checkerId);
            $scope.checkers[checkerId].styles.canDrop = true;
            $scope.arrows[arrowId].styles.highlight   = true;
            $scope.$apply();
          }

          // console.log(arrowId);
          // var draggableElement = event.relatedTarget,
          //     dropzoneElement = event.target;

          // // feedback the possibility of a drop
          // dropzoneElement.classList.add('drop-target');
          // draggableElement.classList.add('can-drop');
          // draggableElement.textContent = 'Dragged in';
        },
        ondragleave: function (event) {
          var checkerId = event.relatedTarget.getAttribute("id").substring(7);
          var arrowId   = event.target.getAttribute("id").substring(5);
          $scope.arrows[arrowId].styles.highlight = false;
          $scope.checkers[checkerId].styles.canDrop = false;
          $scope.$apply();
        },
        ondrop: function (event) {
          var arrowId   = event.target.getAttribute("id").substring(5);
          var checkerId = event.relatedTarget.getAttribute("id").substring(7);
          console.log('dropped on ' , arrowId);
          var oldPos = $scope.checkers[checkerId].anchor;
          console.log('going to ', oldPos);
          snap(checkerId, oldPos.x, oldPos.y);
        },
        ondropdeactivate: function (event) {
          // // remove active dropzone feedback
          // event.target.classList.remove('drop-active');
          // event.target.classList.remove('drop-target');
        }
      });



    function Checker (_id, _arrow, _player, _x, _y) {
      this.id        = _id;
      this.player    = _player;
      this.currArrow = _arrow;

      this.anchor = { x: _x, y: _y };

      this.styles = {
        canDrop: false
      };

      this.moveToArrow = function (_arrow) {

      };

      this.isLegalMove = function () {
        return true;
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

      this.getNextPosition = function () {
        return this.getPosition(this.checkers.length);
      }

      this.position = getPosition(document.querySelector("#arrow" + _id));

    }

    var setUpCheckers = function () {
      $scope.checkers = [];
      for (var i = 0; i < 15; i++) {
        var nextPos = $scope.arrows[0].getNextPosition();
        $scope.checkers.push(new Checker(i, 0, 1, nextPos.x, nextPos.y));
      }

      for (var i = 14; i >= 0; i--) {
        var nextPos = $scope.arrows[23].getNextPosition();
        $scope.checkers.push(new Checker(15+i, 23, 2, nextPos.x, nextPos.y));
      }
    };

    var setUpArrows = function () {
      $scope.arrows = [];
      for (var i = 0; i <= 23; i++) {
        $scope.arrows.push(new Arrow(i));
      }
    };

    var init = function init() {
      $scope.playingGame = false;
      setUpArrows();
      setUpCheckers();
    };

    // We have to make sure DOM is loaded...
    $timeout(init, 10);


    $scope.controls = {
      shouldShowDice: function () {
        return true;
      },
      roll: function () {
        API.rollDice().then(function (result) {
          console.log(result);
        });
      }
    };



  });
