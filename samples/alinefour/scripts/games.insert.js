function insert(game, user, request) {
    game.player1 = user.userId;
    game.state = newBoard();
    game.activePlayer = Math.floor((Math.random()*2)+1);
    request.execute();

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