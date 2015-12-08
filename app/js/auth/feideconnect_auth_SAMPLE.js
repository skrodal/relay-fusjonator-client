/**
 * Feide Connect JSO kickoff for this client.
 *
 * Auth and collection of user/group info, all combined in a USER object.
 *
 */

// Global vars
var DEV = !true;

// Settings pertaining to this client.
var jso = new JSO({
	providerID: "FC-relay_fusjonator-fusjonator",
	client_id: "CHANGEME TO: CLIENT_ID IN DASHBOARD",
	redirect_uri: "CHANGEME TO: REDIRECT URI IN DASHBOARD",
	authorization: "https://auth.feideconnect.no/oauth/authorization",
	scopes: {
		request: ["userinfo", "userinfo-mail", "userinfo-photo", "userinfo-feide", "gk_tr-fusjonator", "gk_tr-fusjonator_admin", "gk_techsmith-relay"],
		require: ["userinfo", "userinfo-mail", "userinfo-photo", "userinfo-feide", "gk_tr-fusjonator", "gk_tr-fusjonator_admin", "gk_techsmith-relay"]
	},
	endpoints: {
		userinfo: "https://auth.feideconnect.no/userinfo",
		photo: "https://auth.feideconnect.no/user/media/",
		relay_fusjonator: "https://tr-fusjonator.gk.feideconnect.no/api/relay-fusjonator/",
		// Official Relay API - used solely to get prod version number
		relay: 'https://techsmith-relay.gk.feideconnect.no/api/techsmith-relay/'
	}
});

jso.callback();
// Catch response
jso.getToken(function (token) {
	// console.log('Authorization: Bearer ' + token.access_token);
	// console.log(JSON.stringify(token, undefined, 2));
});


