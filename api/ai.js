//var minimax = require('./minimax.js');
var random = require('./random.js');
random.setUp({
  computer: 0,
  opponent: 5
});
var move = random.nextMove();
console.log(JSON.stringify(move, null, 2));