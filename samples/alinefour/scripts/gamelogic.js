var util = require('util');

run();

function run() {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	var g = newGame();
	var activePlayer = 1;
	prompt(g, activePlayer);

	process.stdin.on('data', function(chunk) {    
		var col = +chunk;
		if(col < 0 || col >= g.length) {
			console.error("Invalid move");
			return;
		}

		makeMove(g, col, activePlayer);
		var winner = checkForWinner(g);
		if(winner) {
			printGame(g);
			console.log("GAME OVER - Player " + activePlayer + " wins!!!");
			process.exit();
		} else {
			activePlayer = activePlayer % 2;
			activePlayer++;
			prompt(g, activePlayer);
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


function makeMove(game, col, player) {
	var column = game[col];
	var landing = getLandingPosition(game, col);

	if(landing < 0)
		throw Error('Illegal move');
	column[landing] = player;
}

function getLandingPosition(game, col) {
	var column = game[col];
	var p1 = column.indexOf(1) === -1 ? column.length : column.indexOf(1);
	var p2 = column.indexOf(2) === -1 ? column.length : column.indexOf(2);
	var result = Math.min(p1, p2) - 1;
	return result;
}

function newGame() {
	var game = [];
	var rows = 6;
	var columns = 7;
	var c;

	for(c = 0; c < columns; c++) {
		var col = [];
		for(r = 0; r < rows; r++) {
			col.push(0);
		}
		game.push(col);
	}

	return game;
}

function exampleGame() {
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

function checkForWinner(game) {
	var positions = getPiecePositions(game);
	var results = positions.map(function(p) {
		var match = checkPositionForWin(game, p);		
		if(match) {
			
			var win = [];
			win.push({ x: match.x, y: match.y });
			win = win.concat(match.connecting);
			win.push(p);

			return win;
		}
	}).filter(function(p) { 
		return p; 
	});

	return results[0];
}

function checkPositionForWin(game, position) {
	var offsets = getOffsetPositions(position).filter(function(o) {
		return o.x >= 0 && o.y >= 0 &&
			o.x < game.length && o.y < game[0].length;
	});

	var player = game[position.x][position.y];

	var matching = offsets.filter(function(o) {
		return game[o.x][o.y] === player;
	}).filter(function(o) {
		return o.connecting.every(function(c) {
			return game[c.x][c.y] === player;
		});
	});
	
	return matching[0];	
}

function getOffsetPositions(position) {
	var offset = 3;
	var offsets = [
		{ x: position.x, y: position.y - offset},
		{ x: position.x, y: position.y + offset},
		{ x: position.x - offset, y: position.y},
		{ x: position.x + offset, y: position.y},

		{ x: position.x - offset, y: position.y - offset},
		{ x: position.x + offset, y: position.y + offset},
		{ x: position.x - offset, y: position.y + offset},
		{ x: position.x + offset, y: position.y - offset}

	];

	offsets.forEach(function(o) {		
		var dx = (o.x - position.x) / offset;
		var dy = (o.y - position.y) / offset;

		var connecting1 = { x: o.x - dx, y: o.y - dy };
		var connecting2 = { x: connecting1.x - dx, y: connecting1.y - dy };
		o.connecting = [connecting1, connecting2];
	});

	return offsets;
}

function getPiecePositions(game) {
	return game.map(function(column, x) {
		return column.map(function(_, y) {
			if(game[x][y] !== 0)
				return {x: x, y: y};
		});
	}).reduce(function(a, b) { 
		return a.concat(b); 
	}).filter(function(p) {
		return p;
	});
}

function getRows(game) {
	return game[0].map(function(_, r) {
		return getRow(r);
	});

	function getRow(r) {
		return game.map(function(column) { return column[r]; });
	}
}

function printGame(game) {
	getRows(game).forEach(function(row) { console.log(row); });
}
