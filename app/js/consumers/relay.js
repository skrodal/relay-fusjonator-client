/* global saveTextAsFile */
/* global FEIDE_CONNECT */
/* global $ */
/* global jso */
/* global UTILS */


/**
 * Speaks with Adobe Connect proxy API behind Feide Connect gatekeeper.
 */

var RELAY = (function () {
	'use strict';
	var CSV_DATA = false;           // [ [] ]
	var MIGRATION_DATA = false;     // [ {} ]

	// Mainly for testing/dev
	function _getAPIRoutesXHR() {
		return jso.ajax({
			url: jso.config.get("endpoints").relay,
			dataType: 'json'
		}).then(function (response) {
			return response.data;
		}).fail(function (jqXHR) {
			var message = jqXHR.responseJSON.message || jqXHR.status + ': ' + jqXHR.statusText;
			UTILS.alertError("Feil!", "<p>En feil oppstod i samtale med API:</p> <p><code>" + message + "</code></p>");
		});
	}

	// Get the version
	function _getRelayVersionXHR() {
		return jso.ajax({
			url: jso.config.get("endpoints").relay + 'version/',
			dataType: 'json'
		}).then(function (response) {
			return response.data;
		}).fail(function (jqXHR) {
			var message = jqXHR.responseJSON.message || jqXHR.status + ': ' + jqXHR.statusText;
			UTILS.alertError("Feil!", "<p>En feil oppstod i samtale med API:</p> <p><code>" + message + "</code></p>");
		});
	}

	function _verifyUsersXHR() {
		var new_csv_arr = [];
		//CSV_DATA = {test : true};

		if (CSV_DATA) {
			// Stupid csv.toArrays actually extracts to an object type... Fix this before submitting
			$.each(CSV_DATA, function (index, csv) {
				new_csv_arr.push(csv);
			});
			// Make the call
			return jso.ajax({
				url: jso.config.get("endpoints").relay + 'users/verify/',
				method: 'POST',
				data: {
					user_list: new_csv_arr
				},
				dataType: 'json'
			}).then (function(response){
				return response.data;
			}).fail (function(jqXHR){
				var message = jqXHR.responseJSON.message || jqXHR.status + ': ' + jqXHR.statusText;
				UTILS.alertError('Feil!', message);
			});
		} else {
			return {status: false, message: 'RelayFusjonator: Mangler CSV data!'};
		}
	}

	function _migrateUsersXHR() {
		if (MIGRATION_DATA) {
			// Make the call
			return jso.ajax({
				url: jso.config.get("endpoints").relay + 'users/migrate/',
				method: 'POST',
				data: {
					user_list: MIGRATION_DATA
				},
				dataType: 'json'
			}).then (function(response){
				return response.data;
			}).fail (function(jqXHR){
				var message = jqXHR.responseJSON.message || jqXHR.status + ': ' + jqXHR.statusText;
				UTILS.alertError('Feil!', message);
			});
		} else {
			return {status: false, message: 'RelayFusjonator: Mangler migreringsdata!'};
		}
	}



	// ----------- SETTERS ----------- //

	function _setCSVData(csvData) {
		CSV_DATA = csvData;
		// New CSV, reset any old migration data
		_setMigrationData(false);
	}

	function _setMigrationData(migrationData) {
		MIGRATION_DATA = migrationData;
	}

	// ----------- ./SETTERS ----------- //

	return {

		setCSVData: function (csvData) {
			_setCSVData(csvData);
		},
		setMigrationData: function (migrationData) {
			_setMigrationData(migrationData);
		},
		getCSVData: function () {
			return CSV_DATA;
		},
		getMigrationData: function () {
			return MIGRATION_DATA;
		},
		getAPIRoutesXHR: function () {
			return _getAPIRoutesXHR();
		},
		getVersionXHR: function () {
			return _getRelayVersionXHR();
		},
		verifyUsersXHR: function () {
			return _verifyUsersXHR();
		},
		migrateUsersXHR: function(){
			return _migrateUsersXHR();
		}

	};
})(); // Self-invoking






