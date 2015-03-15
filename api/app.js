var random = require('./random.js');

var db = require('./database')
var express = require('express')
var bodyParser = require("body-parser");

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var Game = db.models.game;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// http://stackoverflow.com/a/26821795/4396258
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function(request, response) {
  response.send('Hello World!');
})



app.post('/sup', function(request, response) {
  response.send("sup - " + request.body.sup);
})

app.post('/getmove', function(req, res) {
  console.log(req.body);
  console.dir(req.body);
  var position = req.body.position;
  console.dir(position);
  random.setInitPosition(position);
  random.setUp({
    computer: 0,
    opponent: 5
  });
  var move = random.nextMove();
  res.json({
    moves: move.previousTransitions,
    dice: move.dice
  });
})

app.post('/move', function(req, res) {
  var gameId = req.body.game;

  var move = {
    player: 2,
    rolled: [ 2, 5 ],
    actions: {
      type: 'move',
      checker: 4,
      from: 0,
      to: 5
    }
  };

  Game.findById(gameId, function (err, game) {
    if (err) {
      res.json({success: false, error: err.message});
      return ;
    }

    game.moves.push(move);
    game.save(function (err) {
      res.json({success: true});
    });
    console.dir(game);

  });

})

app.post('/newGame', function (req, res) {

  var game = new Game({
    player1: 1,
    player2: 3735928559,
    turn: 1,
  });
  
  game.save(function (err, data) {
    res.json({'id' : game._id});
  });

})

app.post('/rollDice', function(req, res) {
  var die1 = getRandomInt(1, 7);
  var die2 = getRandomInt(1, 7);
  res.json({'results' : [ die1, die2 ]});
})

db.connected(function () {
  console.log('database is connected')

  app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
  })
});
