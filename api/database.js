var me = this;
me.scope = {};

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/backgammonator');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  me.scope.cb();
});


var gameSchema = mongoose.Schema({
  player1: Number,
  player2: Number,
  diceRoll: [ Number ],
  turn: Number,
  moves: [{
    player: Number,
    rolled: [ Number ],
    actions: {
      type: String,
      checker: Number,
      from: Number,
      to: Number
    }
  }]
});

var models = {};

models.game = mongoose.model('Game', gameSchema);

module.exports = {
  connected: function (callback) {
    me.scope.cb = callback;
  },
  models: models
};
