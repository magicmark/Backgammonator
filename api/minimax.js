'use strict';

var Mechanics = require("./mechanics.js");
var initialPosition = undefined;

function evaluatePosition (position) {
  var rank = 0;
  for (var i in position.arrows) {
    var arrow = position.arrows[i];
    if (position.checkers[arrow.checkers[arrow.checkers.length-1]].player == 0) {
      rank += 5;
      rank += i; // TODO: Set this correctly
    }
  }
  return 10;
}

Mechanics.useEvaluator(evaluatePosition);
Mechanics.setPlayers({
  computer: 0,
  opponent: 5
});

var getValue = Mechanics.getValue;

function minimax (node, depth, maximizingPlayer) {
  var bestNode = undefined;

  if (depth == 0) {
    return node;
  }

  Mechanics.createChildren(node);

  if (maximizingPlayer) {

    for (var i in node.children) {
      var child = minimax(node.children[i], depth - 1, false);
      if (!bestNode || getValue(child) > getValue(bestNode)) bestNode = child;
    }
    return bestNode;

  } else {

    for (var i in node.children) {
      var child = minimax(node.children[i], depth - 1, true);
      if (!bestNode || getValue(child) < getValue(bestNode)) bestNode = child;
    }
    return bestNode;
  
  }

}

module.exports = {
  setInitPosition: function (_initPos) {
    initialPosition = _initPos;
  },
  nextMove: function () {
    return minimax(initialPosition || Mechanics.initPos(), 2, true);
  }
};

