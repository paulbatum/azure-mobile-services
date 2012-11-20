function insert(game, user, request) {

    game.player1 = user.userId;
    game.state = JSON.stringify(newBoard());
    game.activePlayer = Math.floor((Math.random() * 2) + 1);
    delete game.player1Nickname;
    delete game.player2Nickname;
    request.execute();

}

function newBoard() {
    return [
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0]
    ];
}