// Update on a game means that a player is joining it.
// We don't care about what values the client sent for update.
// The game state itself will be updated via the move virtual table.

var gameTable = tables.getTable('games');

function update(item, user, request) {
    gameTable.where({id: item.id}).read({
        success: function(results) {
            if(results.length !== 1) {
                request.respond(404);
                return;
            }
            var game = results[0];
            if(game.player2 !== null) {
                request.respond(400, "No slot free");
                return;
            }
            
            game.player2 = user.userId;
            gameTable.update(game, {
                success: function() {
                    request.respond(200, game);
                }
            });
        }
    })
}