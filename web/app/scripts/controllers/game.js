'use strict';

/**
 * @ngdoc function
 * @name backgammonatorApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the backgammonatorApp
 */
angular.module('backgammonatorApp')
  .controller('GameCtrl', function ($scope, $timeout) {

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

    interact('.draggable').draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "self",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // snap: {
        //   targets: [{ x: 500, y: 90 }],
        //   endOnly: true
        // },

        // call this function on every dragmove event
        onmove: function (event) {
          var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // translate the element
          target.style.webkitTransform =
          target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        // call this function on every dragend event
        onend: function (event) {


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
          event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
          var checkerId = event.relatedTarget.getAttribute("id").substring(7);
          var arrowId   = event.target.getAttribute("id").substring(5);


          if ($scope.checkers[checkerId].isLegalMove(arrowId)) {
            console.log("highlighing" + arrowId);
            $scope.arrows[arrowId].styles.highlight = true;
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
          var arrowId   = event.target.getAttribute("id").substring(5);
          $scope.arrows[arrowId].styles.highlight = false;
          // // remove the drop feedback style
          // event.target.classList.remove('drop-target');
          // event.relatedTarget.classList.remove('can-drop');
          // event.relatedTarget.textContent = 'Dragged out';
        },
        ondrop: function (event) {
          event.relatedTarget.textContent = 'Dropped';

        },
        ondropdeactivate: function (event) {
          // remove active dropzone feedback
          event.target.classList.remove('drop-active');
          event.target.classList.remove('drop-target');
        }
      });













    function Checker (_id, _arrow, _player, _x, _y) {
      this.id        = _id;
      this.player    = _player;
      this.currArrow = _arrow;
      this.position  = {
        x: _x,
        y: _y
      }

      this.goToArrow = function (_arrow) {

      }

      this.getStyle = function () {
        return [ 
          "left: " + this.position.x + "px",
          "top: "  + this.position.y + "px"
        ].join("; ");
      }

      this.isLegalMove = function () {
        return true;
      }

      $scope.arrows[_arrow].checkers.push(_id);

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

      this.getNextPosition = function () {
        var yPos;

        if (me.type == 'top') {
          yPos = this.position.y - 270 + (this.checkers.length * 12);
        } else {
          yPos = this.position.y - (50 + this.checkers.length * 12);
        }

        return {
          x: this.position.x - 25,
          y: yPos
        }
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




  });
