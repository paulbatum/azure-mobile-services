function insert(item, user, request) {
    item.userId = user.userId;

    var identities = user.getIdentities();
    if (identities.facebook) {
    	item.nickname = getNameFromFacebook(identities);    	
    } else {
    	request.execute();
    }


	function getNameFromFacebook(identities) {
	    var req = require('request');
	    var fbAccessToken = identities.facebook.accessToken;
	    var url = 'https://graph.facebook.com/me?access_token=' + fbAccessToken;
	    req(url, function (err, resp, body) {
	        if (err || resp.statusCode !== 200) {
	            console.error('Error sending data to FB Graph API: ', err);
	            request.respond(statusCodes.INTERNAL_SERVER_ERROR, body);
	        } else {
	            try {
	                var userData = JSON.parse(body);
	                item.name = userData.name;
	                request.execute();
	            } catch (ex) {
	                console.error('Error parsing response from FB Graph API: ', ex);
	                request.respond(statusCodes.INTERNAL_SERVER_ERROR, ex);
	            }
	        }
	    });
	   
	}
}

