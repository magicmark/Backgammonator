'use strict';

module.exports = function () {
  // Random AI  

  var arrows = [];
  var checkers = [];

  function Arrow (_id) {
    this.id = _id;
    this.checkers = [];
  }

  function Checker (_id, _player) {
    this.id = _id;
    this.player = _player;
  }


  // Set Up Arrows
  for (var i = 0; i <= 23; i++) {
    arrows.push(new Arrow(i));
  }

  // Set Up Checkers
  for (var i = 0; i < 15; i++) {
    checkers.push(new Checker(i, 1);
    arrows[0].checkers.push(i);
  }

  for (var i = 14; i >= 0; i--) {
    checkers.push(new Checker(15+i, 2);
    arrows[23].checkers.push(i);
  }

  return {
    start
  }

};