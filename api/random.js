'use strict';

var Mechanics = require("./mechanics.js");

var initialPosition = undefined;

// MDN JS Docs
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var chooseRandom = function () {
  var die1, die2;

  die1 = getRandomInt(1, 7);
  die2 = getRandomInt(1, 7);

  var position = initialPosition || Mechanics.initPos();
  var availablePositions = Mechanics.createPositions(position, die1, die2);
  return availablePositions[getRandomInt(0, availablePositions.length)].getNewPosition();
};

module.exports = {
  // Random AI 
  setUp: function (players) {
    Mechanics.setPlayers({
      computer: players.computer,
      opponent: players.opponent
    });
  },
  setInitPosition: function (_initPos) {
    initialPosition = _initPos;
  },
  nextMove: chooseRandom
}