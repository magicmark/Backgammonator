var evaluationFunction;
var computer;
var opponent;

var createChildren = function (pos) {
  pos.children = generatePossibleMoves(pos).map(function (move) {
    return move.getNewPosition();
  });
};

var getValue = function(pos) {
  if (pos._ranking) return pos._ranking;
  pos._ranking = evaluationFunction(pos);
  return pos._ranking; 
}



function possibleArrows(position) {
  var posssibleArrows = [];

  for (var i in position.arrows) {
    var arrow = position.arrows[i];
    if (arrow.checkers.length) {
      var topCheckerID = arrow.checkers[arrow.checkers.length-1];
      var topChecker = position.checkers[topCheckerID];
      if (topChecker.player == position.me) {
        posssibleArrows.push(arrow);
      }
    }
  }
  return posssibleArrows;
}

// Generate the possible moves from a given starting position, and a dice roll
function createPositions (position, i, j) {
  var moves = [];
  var posssibleArrows = possibleArrows(position);
  for (var k = 0; k < posssibleArrows.length; k++) {
    for (var l = 0; l < posssibleArrows.length; l++) {
      if (k == l) {
        if (!((posssibleArrows[k].checkers.length >= 2) && (position.checkers[posssibleArrows[k].checkers[posssibleArrows[k].checkers.length-2]].player == position.me))) {
          continue; 
        }
      } 
      
      var to1, to2, transition;
      if (position.me == computer) {
        to1 = position.arrows[posssibleArrows[k].id - i];
        to2 = position.arrows[posssibleArrows[l].id - j];
      } else {
        to1 = position.arrows[posssibleArrows[k].id + i];
        to2 = position.arrows[posssibleArrows[l].id + j];
      }

      if (to1 && to2) {

        transition = [{
          from: posssibleArrows[k].id,
          to: to1.id
        }, {
          from: posssibleArrows[l].id,
          to: to2.id
        }];

        moves.push(new Move(position, transition, [i, j]));
      }

    }
  }

  for (var k = 0; k < posssibleArrows.length; k++) {
    var to, transition;
    if (position.me == computer) {
      to = position.arrows[posssibleArrows[k].id - i - j];
    } else {
      to = position.arrows[posssibleArrows[k].id + i + j];
    }

    if (to) {

      transition = [{
        from: posssibleArrows[k].id,
        to: to.id
      }];

      moves.push(new Move(position, transition, [i, j]));
    }

  }


  return moves;
}

function generatePossibleMoves (position) {
  var moves = [];
  // Simulate dice rolling
  for (var i = 1; i <= 6; i++) {
    for (var j = 1; j <= 6; j++) {
      moves = moves.concat(createPositions(position, i, j));
    }
  }
  return moves;
}

function Move (position, transitions, dice, me) {
  this.position = position;
  this.transitions = transitions;
  this.rolled = dice;
  this.isValid = function () {
    return true;
  };
  this.getNewPosition = function () {
    var newPosition = JSON.parse(JSON.stringify(this.position));
    for (var i in this.transitions) {
      var transition = this.transitions[i];
     // console.log("transition", transition)
      newPosition.arrows[transition.to].checkers.push(
        newPosition.arrows[transition.from].checkers.pop()
      );
    }
    newPosition.dice = this.rolled;
    newPosition.previousTransitions = this.transitions;
    newPosition.me = (newPosition.me == opponent) ? computer : opponent;
    return newPosition;
  };
}

function Position () {
  this.dice = [];
  this.checkers = {};
  this.arrows = [];
  this.me = 0;
  this.previousTransitions = [];
  this._ranking = undefined;
  this.children = [];
  this.moves = [];
};


function Arrow (_id) {
  this.id = _id;
  this.checkers = [];
}

function Checker (_id, _player) {
  // this.id = _id;
  this.player = _player;
}

var initPos = function () {
  var initialPosition = new Position();

  // Set Up Arrows
  for (var i = 0; i <= 23; i++) {
    initialPosition.arrows.push(new Arrow(i));
  }

  // Set Up Checkers
  for (var i = 0; i < 15; i++) {
    initialPosition.checkers[i] = new Checker(i, opponent);
    initialPosition.arrows[0].checkers.push(i);
  }

  // for (var i = 14; i >= 0; i--) {
  //   initialPosition.checkers[15+i] = new Checker(15+i, computer);
  //   initialPosition.arrows[23].checkers.push(15+i);
  // }

  for (var i = 15; i < 30; i++) {
    initialPosition.checkers[i] = new Checker(i, computer);
    initialPosition.arrows[23].checkers.push(i);
  }

  return initialPosition;
}

var Mechanics = {
  Position: Position,
  Arrow: Arrow,
  Checker: Checker,
  useEvaluator: function (_evaluationFunction) {
    evaluationFunction = _evaluationFunction;
  },
  initPos: initPos,
  setPlayers: function (params) {
    computer = params.computer;
    opponent = params.opponent;
  },
  createPositions: createPositions,
  createChildren: createChildren,
  getValue: getValue
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mechanics;
}