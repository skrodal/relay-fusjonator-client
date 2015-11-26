<!-- Main content -->
    <section id="pageDashboard" class="content app_page hidden">
	    <div class="row">
			<div class="col-md-6">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-information-outline"> Om tjenesten</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<p>
							Hei <span class="userFirstName"></span>!
						</p>
						<p>
							<strong>Relay</strong>Fusjonator brukes i forbindelse med fusjonering av læresteder.
							Den lar deg <code>migrere/fusjonere</code> eksisterende brukernavn og e-postadresser i TechSmith Relay til nye.
						</p>

						<p>
							Tjenesten krever at du har ei liste over alle brukernavn og e-postadresser, gamle til nye, i CSV-format.
						</p>

						<p>
							For &aring; kunne bruke tjenesten MÅ du være ansatt i UNINETT!
						</p>
					</div><!-- /.box-body -->
				</div><!-- /.box -->
			</div>

			<div class="col-md-6">
				<!-- Session info (DEV) -->
				<div class="box box-warning collapsed-box">
					<div class="box-header with-border">
						<h3 class="box-title ion-code-working"> Sesjonsinformasjon (fra Feide Connect)</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<pre id="connectSessionInfo"></pre>
					</div><!-- /.box-body -->
				</div><!-- /.box -->
			</div>
		</div>

	    <div class="row">
			<div class="col-lg-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-code-working"> Forutsetninger</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<p>
							Endring av brukernavn/e-post krever f&oslash;lgende <a href="https://no.wikipedia.org/wiki/CSV" target="_blank">CSV</a> <small><sup><i class="fa fa-external-link"></i></sup></small> struktur: :
						</p>
						<well>
<pre>
GAMMELT_BRUKERNAVN@HIN.NO, GAMMEL.EPOST@HIN.NO, NYTT_BRUKERNAVN@UIT.NO, NY_EPOST@UIT.NO
karius@hin.no, karius.tannberg@hin.no, karius@uit.no, karius.tannberg@uit.no
baktus@hin.no, baktus.tannberg@hin.no, baktus@uit.no, baktus.tannberg@hin.no
kasper@hin.no, kasper.kardemomme@hin.no. kasper@uit.no, kasper.kardemomme@uit.no
jesper@hin.no, jesper.kardemomme@hin.no. jesper@uit.no, jesper.kardemomme@uit.no
..., ...
..., ...
</pre>
						</well>
						<p>
							...altså, ganske enkelt; gammelt brukernavn KOMMA gammel e-post KOMMA nytt brukernavn KOMMA ny e-post NY LINJE osv. osv.
						</p>

						<p>
							Dersom lista inneholder brukere som ikke eksisterer i TechSmith Relay sin brukerdatabase vil disse glatt hoppes over.
						</p>
					</div><!-- /.box-body -->
					<div class="box-footer">
						<span class="text-muted icon ion-android-alert">&nbsp;
							<small>
								Inkluder <strong>kun</strong> datarader i CSV, <strong>ikke</strong> tittelrad!
							</small>
						</span>
					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>
		</div>
	</section>

<script src="app/js/app.js"></script>