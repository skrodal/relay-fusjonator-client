# RelayFusjonator (relay-fusjonator-client)

Web-klient som tar seg av migrering av eksisterende brukere i tjeneste TechSmith Relay (levert av UNINETT AS). 

Klienten brukes ifm. fusjonering av læresteder som abonnerer på tjenesten. 

### Spesifikt

- Klienten bistår med å endre brukernavn og e-postadresse for gitte brukerkontoer.
- Brukerkontoer defineres i en komma-separert liste (CSV) med brukere som skal migreres. 
- CSV må ha følgende format `gammelt_brukernavn, gammel_epost, nytt_brukernavn, ny_epost`, eks. under på brukere som skal flyttes fra org `hin.no` og `hih.no` til org `uit.no`:

```
    boer@hin.no, boer.boerson@hin.no, boerboer@uit.no, boer.boerson@uit.no
    josefine@hin.no, josefine.torsoien@hin.no, josefinetors@uit.no, josefine.torsoien@uit.no
    nils@hin.no, nils.tollvold@hin.no, nilstoll@uit.no, nils.tollvold@uit.no
    ole@hih.no, ole.pedersen.elveplassen@hih.no, oleelve@uit.no, ole.pedersen.elveplassen@uit.no
    laura@hih.no, laura.isaksen@hih.no, lauraisak@uit.no, laura.isaksen@uit.no
```

- Klient sjekker CSV brukerliste for evt. feil før den sender lista over til API (relay-fusjonator-api) for verifisering av brukere. 
- APIet sjekker status for alle brukernavn med Relay database og svarer klienten med liste over:
   - Brukerkontoer som ikke er i bruk (legges i liste for kontoer som kan ignoreres)
   - Brukerkontoer som er aktive og kan migreres (legges i liste over kandidater)
   - Brukerkontoer der gammel OG ny brukerkonto allerede er i bruk (legges i liste over kontoer som ikke kan migreres) 
- Klient presenterer svar fra API og hvilke kontoer som kan migreres. Bruker kan så sende disse tilbake til API for faktisk migrasjon (skriving til Relay database).

### Avhengigheter

Klienten er registrert i UNINETT Dataporten og benytter seg av følgende 3.parts APIer (også registrert i Dataporten):

- https://github.com/skrodal/relay-fusjonator-api

### UI 

![Preview](/app/img/RelayFusjonator.png)

## Annet ##

Utviklet av Simon Skrødal for UNINETT