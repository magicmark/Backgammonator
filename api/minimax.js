'use strict';

module.exports = function (_initPos) {
  // Minimax AI  

  var initialPosition;

  function evaluatePosition (position) {
    var rank = 0;
    for (i in arrows) {
      arrow = arrows[i];
      // if arrow is pinning any opponent checkers, ++
    }
    return 10;
  }

  function possibleMoves (position) {

  }

  function Position () {
    this.dice = [];
    this.arrows = [];
    this.checkers = [];
    this._ranking = undefined;
    this.getValue = function () { 
      if (this._ranking) return this._ranking;
      this._ranking = evaluatePosition(this);
      return this._ranking;
    };

    this.createChildren = function () {
      this.children = possibleMoves(this);
    }

    this.children = [];
  };

  function Arrow (_id) {
    this.id = _id;
    this.checkers = [];
  }

  function Checker (_id, _player) {
    this.id = _id;
    this.player = _player;
  }

  initialPosition = _initPos || new Position();

  // Set Up Arrows
  for (var i = 0; i <= 23; i++) {
    initialPosition.arrows.push(new Arrow(i));
  }

  // Set Up Checkers
  for (var i = 0; i < 15; i++) {
    initialPosition.checkers.push(new Checker(i, 1);
    initialPosition.arrows[0].checkers.push(i);
  }

  for (var i = 14; i >= 0; i--) {
    initialPosition.checkers.push(new Checker(15+i, 2);
    initialPosition.arrows[23].checkers.push(i);
  }

  /*
  function minimax(node, depth, maximizingPlayer)
    if depth = 0 or node is a terminal node
        return the heuristic value of node
    if maximizingPlayer
        bestValue := -∞
        for each child of node
            val := minimax(child, depth - 1, FALSE)
            bestValue := max(bestValue, val)
        return bestValue
    else
        bestValue := +∞
        for each child of node
            val := minimax(child, depth - 1, TRUE)
            bestValue := min(bestValue, val)
        return bestValue

  (* Initial call for maximizing player *)
  minimax(origin, depth, TRUE)
  */

  // http://en.wikipedia.org/wiki/Minimax
  function minimax (node, depth, maximizingPlayer) {
    var bestNode = undefined;

    if (depth == 0) {
      return node;
    }

    node.createChildren();

    if (maximizingPlayer) {

      for (i in node.children) {
        var child = minimax(node.children[i], depth - 1, false);
        if (!bestNode || child.getValue() > bestNode.getValue()) bestNode = child;
      }
      return bestNode;

    } else {

      for (i in node.children) {
        var child = minimax(node.children[i], depth - 1, true);
        if (!bestNode || child.getValue() < bestNode.getValue()) bestNode = child;
      }
      return bestNode;
    
    }

  }

  function getBestMove () {
    return minimax(initialPosition, 4, true);
  }

  return {
    nextMove: 
  }

};