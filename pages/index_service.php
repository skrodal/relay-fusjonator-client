<!-- Main content -->
    <section id="pageService" class="content app_page hidden">

	    <div id="versionMismatchWarning" class="callout callout-danger hidden">
		    <h4>
			    <i class="icon ion-android-warning"></i>
				RelayFusjonator API Database Mismatch!
		    </h4>
		    <p>
			    RelayFusjonator API snakker med en annen Relay database enn den som er i prod! Fusjonatoren er altså fortsatt i testmodus og
			    skriver til en gammel database.
		    </p>
		    
		    <p>
			    <strong>Sjekk med <code>simon.skrodal@uninett.no</code> for å få fikset dette.</strong>
		    </p>
	    </div>

	    <div class="row">
			<div class="col-lg-12 col-md-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-code-working"> 1. Lim inn brukerliste (CSV)</h3>
					</div>
					<div class="box-body">
						<textarea name="" id="txtCSV" class="form-control" rows="6" style="width: 100%;" placeholder="gammelt@brukernavn.no, nytt@brukernavn.no"></textarea>
						<br/>
						<p class="clearfix">
							<button id="btnInsertTestDataCSV" class="btn btn-link btn-sm pull-left icon ion-code-working"> Sett inn testdata</button>
							<button id="btnCheckCSV" data-toggle="modal" data-target="#infoModal" class="btn btn-info btn-sm pull-right icon ion-checkmark"> Inspiser format</button>
						</p>

						<div id="csvStatusMsg" class="hidden">
							<h4>
								<span class="text-green icon ion-happy"></span> CSV er ok!
							</h4>
							<p>
								For å sjekke kontostatus i TechSmith Relay for alle brukere i lista, klikk på knappen nedenfor.
							</p>
							<p>
								<span id="submitCSVForInspection" data-toggle="modal" data-target="#infoModal" class="btn btn-success">Sjekk kontostatus</span>
							</p>
						</div>
					</div>

					<div class="box-footer clearfix hidden">

					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>
		</div>

	    <div class="row">
			<div class="col-lg-12 col-md-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-people"> 2. Kontostatus fra TechSmith Relay</h3>
					</div>
					<div id="preMigrationStatusMsg" class="box-body">
						<p>Gjør unna steg #1 først...</p>
					</div><!-- /.box-body -->
					<div class="box-footer clearfix hidden">

					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>
		</div>

	    <div class="row">
			<div class="col-lg-12 col-md-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-sunny"> 3. Status fusjonering</h3>
					</div>
					<div class="box-body">

					<div id="postMigrationStatusMsg" class="box-body">
						<p>Gjør unna steg #1 og #2 først...</p>
					</div><!-- /.box-body -->

					</div><!-- /.box-body -->
					<div class="box-footer hidden">

					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>
		</div>

	    <div class="row">
		    <div class="col-lg-12">
			    <div class="box box-solid">
				    <!--
				    <div class="box-header">
					    <h3 class="box-title">Klar - ferdig - g&aring;...</h3>
				    </div>
				    -->
				    <div class="box-body text-muted">
					    <p>
						    Fusjonatoren fungerer som følger:
					    </p>

					    <ol>
						    <li>
							    Først, lim inn din CSV-liste med brukernavn og klikk knappen under. Dette gjør et oppslag hos Adobe Connect
							    for å finne ut hvilke brukernavn i lista som faktisk har konto. Den vil også sjekke om evt. noen av de nye
							    brukernavnene eksisterer.
						    </li>

						    <li>
							    Når oppslaget er ferdig vil en ny liste komme i retur. Denne inneholder alle brukere som tilfredsstiller krav
							    til migrering. Om alt ser ok ut, klikk knappen for å migrere og vent på svar.
						    </li>

						    <li>
							    Når migrering er gjennomført vil du motta en oppsummering på jobben som er gjort (og evt. problemer).
						    </li>
					    </ol>
				    </div>
			    </div>
		    </div>
	    </div>
	</section>

	<!-- CSV Table Modal -->
	<div id="infoModal" class="modal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header bg-dark-gray">
					<button type="button" class="close" data-dismiss="modal" aria-label="Lukk"><span aria-hidden="true">×</span></button>
					<h4 class="modal-title">CSV Sjekk</h4>
				</div>
				<div class="modal-body" style="max-height: calc(100vh - 212px); overflow-y: auto;">
					<div class="alert alert-warning">
                        <h4><i class="icon fa fa-warning"></i> Tomt!</h4>
                        Fant ikke CSV. Har du husket å lime inn i tekstfeltet?
                    </div>
					<!-- RELAY -->
				</div>
				<div class="modal-footer bg-dark-gray">
				<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
				</div>
			</div>
		</div>
	</div>

	<!-- CSV table template (for cloning) -->
	<div id="csvTableTemplate" class="hidden">
		<table class="table table-bordered table-condensed table-hover">
			<tbody>
				<tr class="info">
					<th>Gammelt brukernavn</th>
					<th>Gammel e-post</th>

					<th>Nytt brukernavn</th>
					<th>Ny e-post</th>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- RESULT Modal -->
	<div id="resultModal" class="modal" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header bg-light-blue">
					<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Lukk"><span aria-hidden="true">×</span></button> -->
					<h4 class="modal-title">Oppsummering</h4>
				</div>
				<div class="modal-body" style="max-height: calc(100vh - 212px); overflow-y: auto;">
					<!-- RELAY -->
				</div>
				<div class="modal-footer bg-light-blue">
					<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
				</div>
			</div>
		</div>
	</div>


<script src="app/js/consumers/relay.js"></script>
<script src="app/js/index_service.js"></script>
<script src="app/js/etc/saveTextAsFile.js"></script>

