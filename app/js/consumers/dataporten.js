/* global JSO */
//
JSO.enablejQuery($);

var DATAPORTEN = (function () {
	"use strict";
	var USER = {};
	USER.org = {};
	var XHR_USER;

	// Self-invoking
	(function () {
		XHR_USER = _getUserInfo();
	})();


	function _getUserInfo() {
		return jso.ajax({
			url: jso.config.get("endpoints").userinfo,
			dataType: 'json'
		}).then(function (response) {
				var user = response.user;

				if (user.userid_sec[0].indexOf("feide:") === -1) {
					UTILS.showAuthError("Brukerinfo", "Tilgang til tjenesten krever p&aring;logging med Feide. Kan ikke finne ditt Feide brukernavn.");
					return false;
				}

				var username = user.userid_sec[0].split('feide:')[1];
				var org = username.split('@')[1];

				USER.id = user.userid;
				USER.username = username;
				USER.name = {
					full: user.name,
					first: user.name.split(' ')[0]
				};
				USER.email = user.email;
				USER.photo = jso.config.get("endpoints").photo + user.profilephoto;
				USER.org.id = org;
				USER.org.shortname = org.split('.')[0];
				UTILS.updateAuthProgress("Brukerinfo");
			})
			.fail(function (jqXHR) {
				UTILS.showAuthError("(Feide)Connect", jqXHR.status + ': ' + jqXHR.statusText);
			});

	}


	/*** Expose public functions ***/
	return {
		readyUser: function () {
			return XHR_USER;
		},
		user: function () {
			return USER;
		}
	};
})();
