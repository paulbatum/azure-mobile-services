var gameTable = tables.getTable('games');

function update(item, user, request) {
    gameTable.where({
        id: item.id
    }).read({
        success: function(results) {
            if (results.length !== 1) {
                request.respond(404);
            } else {
                var game = results[0];

                if (game.player2 === null) {                    
                    joinGame(game);
                } else {
                    makeMove(game);                    
                }
            }
        }
    });

    function joinGame(game) {
        game.player2 = user.userId;
        gameTable.update(game, {
            success: function() {
                request.respond(200, game);
                if (game.activePlayer === 1) notifyTurn(game.player1);
            }
        });
    }
    
    function makeMove(gameRow) {
        var activePlayerId = getActivePlayerId(gameRow);
        if(activePlayerId != user.userId) {
            request.respond(400, "Its not you turn");
            return;
        }
        
        if(typeof item.move !== 'number') {
            request.respond(400, "Move must be a number");
            return;
        }
        
        var game = new Game(gameRow.state);
        if(!game.isLegalMove(item.move)) {
            request.respond(400, "Illegal move");
            return;
        }

        var inactiveId = gameRow.activePlayer == 1 ? game.Player2 : game.Player1;
        
        game.makeMove(item.move, gameRow.activePlayer);
        gameRow.state = game.toJson();

        var winResult = game.checkForWinner();
        if(winResult) {
            gameRow.result = gameRow.activePlayer == 1 ? "Player 1 wins" : "Player 2 wins";
            
            gameRow.activePlayer = 0;
            gameTable.update(gameRow, {
                success: function() {
                    request.respond(200, gameRow);
                    notifyLoser(inactiveId);
                } 
            });
        } else if (game.checkForDraw) {
            gameRow.result = "Draw";
            gameRow.activePlayer = 0;
            gameTable.update(gameRow, {
                success: function() {
                    request.respond(200, gameRow);
                    notifyDraw(inactiveId);
                } 
            });            
        } else {
            gameRow.activePlayer = (game.activePlayer % 2) + 1;
            gameTable.update(gameRow, {
                success: function() {
                    request.respond(200, gameRow);
                    notifyTurn(getActivePlayerId(gameRow));
                } 
            });
        }
        
    }

    function getActivePlayerId(gameRow) {
       return gameRow.activePlayer == 1 ? gameRow.player1 : gameRow.player2; 
    }

    function notifyDraw(userId) {
        toastUser(userId, "The game ended in a draw");
    }
    
    function notifyTurn(userId) {
        toastUser(userId, "Its your turn!");
    }

    function notifyLoser(userId) {
        toastUser(userId, "You lost! Try harder next time!");
    }

    function toastUser(userId, message) {
        var playerTable = tables.getTable('players');
        playerTable.where({
            userId: userId
        }).read({
            success: function(results) {
                var channel = results[0].wnsChannel;
                push.wns.sendToastText02(channel, {
                    text1: "alinefour",
                    text2: message
                });
            }
        });
    }

}

function Game(boardOrJson) {

    var game = typeof boardOrJson === 'string' ? JSON.parse(boardOrJson) : boardOrJson;

    return {
        makeMove: makeMove,
        isLegalMove: isLegalMove,
        checkForWinner: checkForWinner,
        board: game,
        toJson: function() { return JSON.stringify(game); },
        checkForDraw: checkForDraw
    };

    function checkForDraw() {
        for(var i = 0; i < game.length; i++) {
            if(isLegalMove(i))
                return false;
        }
        return true;
    }

    function makeMove(col, player) {
        if(!isLegalMove(col))
            throw new Error('Illegal move');

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
