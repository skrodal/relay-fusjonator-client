(function () {
	'use strict';


//
	var ajaxSpinner = '<p><span class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i>&nbsp;&nbsp;Nå snakker jeg med TechSmith Relay.</span></p><p>Dette kan ta litt tid, bare vent til jeg er ferdig du.</p>';
// Used for both error info and CSV table preview
	var $infoModalTitle = $('#infoModal').find('h4.modal-title');
	var $infoModalBody = $('#infoModal').find('div.modal-body');

	/**
	 * 1.
	 *
	 * Check user supplied CSV. If all good, generateTableFromCSV() will process the data
	 * further.
	 *
	 * (PS! The button triggers the infoModal via data-target attr)
	 */
	$('#btnCheckCSV').on('click', function () {
		// We have started a new cycle - reset any old status info in all boxes
		resetStepThree();
		if ($('#txtCSV').val().length < 1) {
			UTILS.alertError('Tomt?', 'Lim inn CSV i tekstfeltet f&oslash;rst.');
			return false;
		}
		$infoModalTitle.html('CSV Sjekk');
		$infoModalBody.html('');

		try {
			// Using jquery-csv library; populate CSVData obj on success
			$.csv.toArrays($('#txtCSV').val().trim(), {}, function (err, CSVData) {
				// Make sure there is enough data
				if (CSVData.length < 2) {
					$infoModalBody.html(
						'<div class="alert alert-warning">' +
						'<h4><i class="icon fa fa-warning"></i> Lite innhold...</h4>' +
						'<p>For at dette skal v&aelig;re verdt innsatsen kunne du lagt til minst to rader da!</p>' +
						'</div>');
					return false;
				}
				// CSV found, generate preview table (and check for further errors)
				generateTableFromCSV(CSVData);
			});
		} catch (err) {
			// jquery-csv found issues with the CSV that does not adhere to the standard
			UTILS.alertError('Feil med CSV', 'Feilmeldingen er: <code>' + err.message + "</code>");
			resetStepOne();
			return false;
		}
	});

	/**
	 * 2.
	 *
	 * Check the passed CSV array for any issues. If OK;
	 *
	 *  - store the array with RELAY (setCSVData(CSVData))
	 *  - create a preview table with all usernames (old->new) sorted for final inspection
	 *
	 * If any issues with the CSV (e.g. not exactly two columns), display a warning instead and reset
	 * CSV Data and UI.
	 *
	 * @param CSVData
	 */
	function generateTableFromCSV(CSVData) {
		// Preview table
		var $tableClone = $('#csvTableTemplate').clone();
		//
		var usernameOld, emailOld, usernameNew, emailNew;
		//
		var errorInCSV = false;
		//
		$infoModalTitle.html('CSV Sjekk');
		$infoModalBody.html('');
		// Expected CSV is an array with [0] usernameOld, [1] usernameNew
		$.each(CSVData, function (index, csv) {
			// We want two columns only, break otherwise.
			if (csv.length !== 4) {
				$tableClone.empty();
				$infoModalBody.html(
					'<div class="alert alert-warning">' +
					'<h4><i class="icon fa fa-warning"></i> Feil format i CSV!</h4>' +
					'<p>Jeg forventer fire (4) kolonner per rad, hverken mer eller mindre!</p>' +
					'</div>');
				errorInCSV = true;
				return false;
			}
			//
			usernameOld = CSVData[index][0] = csv[0].trim();
			emailOld = CSVData[index][1] = csv[1].trim();
			usernameNew = CSVData[index][2] = csv[2].trim();
			emailNew = CSVData[index][3] = csv[3].trim();

			if (usernameOld.length === 0 || emailOld.length === 0 || usernameNew.length === 0 || emailNew.length === 0) {
				$tableClone.empty();
				$infoModalBody.html(
					'<div class="alert alert-warning">' +
					'<h4><i class="icon fa fa-warning"></i> Tomme felter</h4>' +
					'<p>En eller flere felter i CSVen din mangler verdi.</p>' +
					'</div>');
				errorInCSV = true;
				return false;
			}
			$tableClone.find('tbody').append('<tr><td>' + usernameOld + '</td><td>' + emailOld + '</td><td>' + usernameNew + '</td><td>' + emailNew + '</td></tr>');
		});

		// As long as no errors were caught in the $.each loop...
		if (!errorInCSV) {
			$infoModalBody.html('<p>Bra jobba! CSV ser grei ut! Ta en titt selv i tabellen under: </p>');
			$infoModalBody.append($tableClone.html());
			$infoModalBody.append(
				'<p><span class="badge bg-aqua">' + CSVData.length + '</span> brukere i tabellen</p>'
			);
			RELAY.setCSVData(CSVData);
			console.info('CSV er vurdert OK og lagret som: ');
			console.info(CSVData);
			$("div#csvStatusMsg").removeClass("hidden");
		}
	}


	/**
	 * 3.
	 *
	 * POST the CSV array to the API for inspection (checks if logins exist etc.)
	 */
	$('#submitCSVForInspection').on('click', function () {
		var bodyHtml = '';
		var migrationData = [];
		// Reset
		RELAY.setMigrationData(false);
		resetStepTwo();

		$infoModalTitle.html('Status brukerkontoer');
		$infoModalBody.html(ajaxSpinner);
		//
		console.info('Sender følgende CSV til RelayFusjonator API for INSPEKSJON:');
		console.info(RELAY.getCSVData());

		if (RELAY.getCSVData() !== false) {
			$.when(RELAY.verifyUsersXHR()).then(function (response) {
				// Called function will handle error msgs, only react to good news here...
				if (response !== false) {
					bodyHtml += '<p>Alle brukernavn har nå blitt sjekket i TechSmith Relay. Oversikt ser du nedenfor.</p>';
					//
					console.info('RelayFusjonator API har sjekket CSV og svarte følgende:');
					console.info(response);
					// List all users that can be migrated
					if (!jQuery.isEmptyObject(response.ok)) {
						var $tblUserOK = $('#csvTableTemplate').clone();
						// Users to be migrated
						$.each(response.ok, function (userName, userInfo) {
							$tblUserOK.find('tbody').append('<tr>' +
								'<td class="text-blue">' + userInfo.account_info_current.username + '</td>' +
								'<td class="text-blue">' + userInfo.account_info_current.email + '</td>' +
								'<td class="text-green">' + userInfo.account_info_new.username + '</td>' +
								'<td class="text-green">' + userInfo.account_info_new.email + '</td>' +
								'</tr>');
							// Array with user objects currentUserId, newUsername
							migrationData.push({
								current_username: userInfo.account_info_current.username,
								current_email: userInfo.account_info_current.email,
								new_username: userInfo.account_info_new.username,
								new_email: userInfo.account_info_new.email
							});
						});
						bodyHtml += '<h4><span class="text-green icon ion-checkmark-circled"></span> Følgende <span class="badge bg-aqua">' + migrationData.length + '</span> brukerkontoer kan fusjoneres: </h4>';
						bodyHtml += $tblUserOK.html();
						// THIS is the array that will be sent to TechSmith Relay for actual renaming of usernames!
						RELAY.setMigrationData(migrationData);
						// Display users that can be migrated and show button:
						$('#preMigrationStatusMsg').html(
							'<p>Følgende <span class="badge bg-aqua">' + migrationData.length + '</span> brukerkontoer vil få nytt brukernavn og ny e-post: </p>' +
							$tblUserOK.html() + '<br>' +
							'<p>Klikk på knappen under for å kjøre fusjonering. Gamle brukernavn i tabellen over vil da få endret sine kontodetaljer i TechSmith Relay.</p>' +
							'<p class="clearfix"><button id="btnMigrateUsers" data-toggle="modal" data-target="#infoModal" class="btn btn-success pull-right icon ion-checkmark"> Fusjonér!</button></p>'
						);
					}

					// List users that CANNOT be migrated
					if (!jQuery.isEmptyObject(response.problem)) {
						bodyHtml += '<h4><span class="text-red icon ion-minus-circled"></span> Følgende brukerkontoer kan IKKE fusjoneres</h4> <p>Nytt brukernavn er allerede registrert i TechSmith Relay: </p>';
						var $tblUserPROBLEM = $('#csvTableTemplate').clone();
						// Users with problem
						$.each(response.problem, function (userName, userInfo) {
							$tblUserPROBLEM.find('tbody').append('<tr>' +
								'<td class="text-muted">' + userInfo.account_info_current.username + '</td>' +
								'<td class="text-muted">' + userInfo.account_info_current.email + '</td>' +
								'<td class="text-red">' + userInfo.account_info_new.username + '</td>' +
								'<td class="text-red">' + userInfo.account_info_new.email + '</td>' +
								'</tr>');
						});
						bodyHtml += $tblUserPROBLEM.html();
					}

					// List users that don't have an account
					if (!jQuery.isEmptyObject(response.ignore)) {
						bodyHtml += '<h4><span class="text-gray icon ion-information-circled"></span> Følgende brukernavn har ingen konto</h4><p>Disse vil ignoreres:</p>';
						var $tblUserIGNORE = $('#csvTableTemplate').clone();
						// Users to be ignored
						$.each(response.ignore, function (userName, userInfo) {
							$tblUserIGNORE.find('tbody').append('<tr>' +
								'<td class="text-muted">' + userInfo.account_info_current.username + '</td>' +
								'<td class="text-muted">' + userInfo.account_info_current.email + '</td>' +
								'<td class="text-muted">' + userInfo.account_info_new.username + '</td>' +
								'<td class="text-muted">' + userInfo.account_info_new.email + '</td>' +
								'</tr>');
						});
						bodyHtml += $tblUserIGNORE.html();
					}
					$infoModalBody.html(bodyHtml);
					// $infoModalBody.html('<pre>' + JSON.stringify(response, null, 4) + '</pre>');
				}
			}, function (error) {
				showInfoModalAjaxError(error.responseJSON);
			});
		} else {
			$infoModalTitle.html("Mangler CSV data");
			$infoModalBody.html("Husk å klikk knappen 'inspiser format' først... ");
		}
	});


	/**
	 * 4.
	 *
	 * POST the list of users to migrate to the API for actual migration.
	 */
	$('div#preMigrationStatusMsg').on('click', 'button#btnMigrateUsers', function () {
		var bodyHtml = '';
		console.info('Sender følgende brukerliste til RelayFusjonator API for MIGRERING:');
		console.info(RELAY.getMigrationData());
		// 3rd box
		resetStepThree();
		//
		$infoModalTitle.html('Status fusjonering');
		$infoModalBody.html(ajaxSpinner);

		if (RELAY.getMigrationData() !== false) {
			// Run the migration call
			$.when(RELAY.migrateUsersXHR()).then(function (response) {
				if (response !== false) {
					//
					console.info('RelayFusjonator API har nå gjennomført MIGRERING og svarte følgende:');
					console.info(response);
					//
					bodyHtml += '<h4>Fusjonering fiks ferdig, status nedenfor</h4>';
					bodyHtml += '<p>Alle inputdata er nå tilbakestilt. Gå tilbake til steg #1 for en ny runde om du ønsker det :)</p>';
					// Reset data and info boxes
					resetAll();

					// Expect to see migrated users here
					if (!jQuery.isEmptyObject(response.ok)) {
						var $tblUserOK = $('#csvTableTemplate').clone();
						// Users to be migrated
						$.each(response.ok, function (userNameOld, userInfo) {
							$tblUserOK.find('tbody').append('<tr>' +
								'<td class="text-muted"><s>' + userInfo.account_info_old.username + '</s></td>' +
								'<td class="text-muted"><s>' + userInfo.account_info_old.email + '</s></td>' +
								'<td class="text-green">' + userInfo.account_info_new.username + '</td>' +
								'<td class="text-green">' + userInfo.account_info_new.email + '</td>' +
								'</tr>');
						});
						bodyHtml += '<h4><span class="text-green icon ion-checkmark-circled"></span> Følgende <span class="badge bg-aqua">' + UTILS.getObjectSize(response.ok) + '</span> brukerkontoer er nå blitt fusjonert: </h4>';
						bodyHtml += $tblUserOK.html();
					}

					// Errors with migrating users here (this really should not happen)
					if (!jQuery.isEmptyObject(response.problem)) {
						bodyHtml += '<h4><span class="text-red icon ion-minus-circled"></span>OBS! Fusjonering av følgende brukerkontoer genererte en feilmelding!!!</h4>';
						var $tblUserPROBLEM = $('#csvTableTemplate').clone();
						// Users with problem
						$.each(response.problem, function (userNameOld, userInfo) {
							$tblUserPROBLEM.find('tbody').append('<tr>' +
								'<td class="text-red">' + userInfo.account_info_old.username + '</td>' +
								'<td class="text-red">' + userInfo.account_info_old.email + '</td>' +
								'<td class="text-red">' + userInfo.account_info_new.username + '</td>' +
								'<td class="text-red">' + userInfo.account_info_new.email + '</td>' +
								'</tr>');
						});
						bodyHtml += $tblUserPROBLEM.html();
					}
					$infoModalBody.html(bodyHtml);
					$('#postMigrationStatusMsg').html(bodyHtml);

				}
			}, function (error) {
				showInfoModalAjaxError(error.responseJSON);
			});
		} else {
			$infoModalTitle.html("<h4>Mangler migreringsdata!</h4>");
			$infoModalBody.html("<p>...mulig du ikke har sjekket migreringsstatus i forrige steg?</p>");
		}
	});


// Start step one from scratch
	function resetStepOne() {
		$("div#csvStatusMsg").addClass("hidden");
	}

// Start step two from scratch
	function resetStepTwo() {
		resetStepOne();
		$("#preMigrationStatusMsg").html('<p>Gjør unna steg #1 først...</p>');

	}

// Done, reset everything!
	function resetStepThree() {
		resetStepTwo();
		$("#postMigrationStatusMsg").html('<p>Gjør unna steg #1 og #2 først...</p>');
	}

	function resetAll() {
		$('#txtCSV').val("");
		RELAY.setMigrationData(false);
		RELAY.setCSVData(false);
		resetStepOne();
		resetStepTwo();
	}

	/** Update info modal with error **/
	function showInfoModalAjaxError(error) {
		console.error(error);
		$infoModalBody.html('<div class="alert alert-danger">' +
			'<h4><i class="icon fa fa-ban"></i> En feil oppstod!</h4>' +
			'<p>TechSmith Relay ville liksom ikke gjøre som den ble bedt om av Fusjonator API. Feilmeldingen var:/</p><br>' +
			'<p><code>' + error.message + '</code></p><br>' +
			'<p>Dobbeltsjekk dataene du forøker å fóre inn. Evt. ta en refresh av denne siden, og prøv på nytt.</p>' +
			'<p>Dersom problemet vedvarer, send en feilmelding til simon.skrodal@uninett.no, evt. support@ecampus.no.</p>' +
			'</div>');
	}

	$('#btnInsertTestDataCSV').on('click', function () {
		insertTestDataCSV();
	});


	function insertTestDataCSV() {
		$('#txtCSV').val(
			'borborson@uninett.no, bor.borson@uninett.no, borborson@feide.no, bor.borson@feide.no\n' +
			'borborson@feide.no, bor.borson@feide.no, borborson@uninett.no, bor.borson@uninett.no\n' +
			'simon1@uninett.no, simon.skrodal@uninett.no, simon1@feide.no, simon.skrodal@feide.no\n' +
			'simon1@feide.no, simon.skrodal@feide.no, simon1@uninett.no, simon.skrodal@uninett.no\n' +
			'renlin@uninett.no, renate.langeland@uninett.no, simon@uninett.no, simon.skrodal@uninett.no\n' +
			'karius@hin.no, karius.tannberg@hin.no, karius@uit.no, karius.tannberg@uit.no\n' +
			'baktus@hin.no, baktus.tannberg@hin.no, baktus@uit.no, baktus.tannberg@uit.no\n' +
			'kasper@hin.no, kasper.tyv@hin.no, kasper@uit.no, kasper.tyv@uit.no\n');
	}


})();



