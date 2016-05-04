/**
 * Dataporten JSO kickoff for this client.
 *
 * Auth and collection of user/group info, all combined in a USER object.
 *
 */

// Global vars
var DEV = !true;

// Settings pertaining to this client.
var jso = new JSO({
	providerID: "DP-relay_fusjonator-fusjonator",
	client_id: "CHANGEME TO: CLIENT_ID IN DASHBOARD",
	redirect_uri: "CHANGEME TO: REDIRECT URI IN DASHBOARD",
	authorization: "https://auth.dataporten.no/oauth/authorization",
	scopes: {
		request: ["userinfo", "userinfo-mail", "userinfo-photo", "userinfo-feide", "gk_tr-fusjonator", "gk_tr-fusjonator_admin", "gk_techsmith-relay"],
		require: ["userinfo", "userinfo-mail", "userinfo-photo", "userinfo-feide", "gk_tr-fusjonator", "gk_tr-fusjonator_admin", "gk_techsmith-relay"]
	},
	endpoints: {
		userinfo: "https://auth.dataporten.no/userinfo",
		photo: "https://auth.dataporten.no/user/media/",
		relay_fusjonator: "https://tr-fusjonator.dataporten-api.no/api/relay-fusjonator/",
		// Official Relay API - used solely to get prod version number
		relay: 'https://techsmith-relay.dataporten-api.no/api/techsmith-relay/'
	}
});

jso.callback();
// Catch response
jso.getToken(function (token) {
	// console.log('Authorization: Bearer ' + token.access_token);
	// console.log(JSON.stringify(token, undefined, 2));
});


