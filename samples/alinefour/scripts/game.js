exports = module.exports = Game;

function Game(boardOrJson) {

	var game = typeof boardOrJson === 'string' ? JSON.parse(boardJson) : boardOrJson;

	return {
		makeMove: makeMove,
		isLegalMove: isLegalMove,
		checkForWinner: checkForWinner,
		board: game,
		toJson: function() { return JSON.stringify(game); }
	};

	function makeMove(col, player) {
		if(!isLegalMove(col))
			throw Error('Illegal move');

		game[col][getLandingPosition(col)] = player;
	}

	function isLegalMove(col) {
		return col >= 0 && col < game.length && getLandingPosition(col) >= 0;
	}

	function checkForWinner() {
		var positions = getPiecePositions();
		var results = positions.map(function(p) {
			var match = checkPositionForWin(p);		
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

	function getLandingPosition(col) {
		var column = game[col];
		var p1 = column.indexOf(1) === -1 ? column.length : column.indexOf(1);
		var p2 = column.indexOf(2) === -1 ? column.length : column.indexOf(2);
		var result = Math.min(p1, p2) - 1;
		return result;
	}

	function checkPositionForWin(position) {
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

	function getPiecePositions() {
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
}


