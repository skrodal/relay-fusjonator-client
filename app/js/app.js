/* global MENU */

var APP = (function () {
	'use strict';
	var success = '<i class="icon ion-checkmark-circled"></i>';
	var error = '<i class="icon ion-minus-circled"></i>';

	// Bootstrapping after all necessary AJAX calls have been completed
	$(document).ready(function () {
		$.when(FEIDE_CONNECT.readyUser()).then(function (user) {
			updateUserUI();
			MENU.init();
		});

		$.when(RELAY.getRelayVersionXHR(), RELAY.getRelayFusjonatorVersionXHR()).then(function (relayVersion, relayFusjonatorVersion){
			console.log(relayVersion);
			console.log(relayFusjonatorVersion);
		});

	});

	function updateUserUI() {
		// User-specific
		$('.userFirstName').html(' ' + FEIDE_CONNECT.user().name.first);
		$('.userFullName').html(' ' + FEIDE_CONNECT.user().name.full);
		$('.feideOrg').html(' ' + FEIDE_CONNECT.user().org.id);
		$('.feideOrgShortname').html(' ' + FEIDE_CONNECT.user().org.shortname);

		$('.feideAffiliation').html(' admin');
		$('.userImage').attr('src', FEIDE_CONNECT.user().photo);
		// Dev
		$('#connectSessionInfo').text(JSON.stringify(FEIDE_CONNECT.user(), undefined, 2));
		// Show top logout dropdown
		$('#userMenu').fadeIn().removeClass('hidden');
		//
	}

})();