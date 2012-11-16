var util = require('util');
var Game = require('./game.js');
run();

function run() {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	var game = new Game(newBoard());
	var activePlayer = 1;
	prompt(game.board, activePlayer);

	process.stdin.on('data', function(chunk) {    
		var col = +chunk;
		if(!game.isLegalMove(col)) {
			console.error("Invalid move");
			return;
		}

		game.makeMove(col, activePlayer);
		var winner = game.checkForWinner();
		if(winner) {
			printGame(game.board);
			console.log("GAME OVER - Player " + activePlayer + " wins!!!");
			process.exit();
		} else {
			activePlayer = activePlayer % 2;
			activePlayer++;
			prompt(game.board, activePlayer);
		}
	});
	
}

function prompt(game, activePlayer) {
	console.log("Columns:");
	console.log([0,1,2,3,4,5,6]);
	console.log("-----------------------");
	printGame(game);
	console.log("Player" + activePlayer + ":");
}

function newBoard() {
	return [
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0]
	];
}

function exampleBoard() {
	return [
		[0,0,1,2,2,1],
		[0,0,0,2,1,1],
		[0,0,0,0,2,2],
		[0,0,0,0,0,1],
		[0,0,0,0,1,2],
		[0,0,0,1,1,2],
		[0,0,1,2,2,1]
	];
}

function printGame(game) {
	getRows(game).forEach(function(row) { console.log(row); });
}

function getRows(game) {
	return game[0].map(function(_, r) {
		return getRow(r);
	});

	function getRow(r) {
		return game.map(function(column) { return column[r]; });
	}
}