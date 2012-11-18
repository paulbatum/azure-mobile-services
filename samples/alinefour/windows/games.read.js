function read(query, user, request) {
    request.execute({
        success: function (results) {
            lookupNicknames(function (idToNickname) {
                results.forEach(function (r) {
                    r.player1Nickname = idToNickname[r.player1] || "Unnamed";
                    if (r.player2) {
                        r.player2Nickname = idToNickname[r.player2] || "Unnamed";
                    }
                });
                request.respond();
            })
        }
    });
}

function lookupNicknames(callback) {
    var playerTable = tables.getTable('players');
    playerTable.read({
        success: function (results) {
            var idToNickname = {};
            results.forEach(function (r) {
                idToNickname[r.userId] = r.nickname;
            })
            callback(idToNickname);
        }
    });
}