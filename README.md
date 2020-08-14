
# FIKSKart.no

FIKSKart.no er resultatet av et sommerprosjekt for Norkart, og er et produkt forespurt av Kartverket.

Applikasjonen tilbyr en løsning for å kunne melde fra om flere ulike feil i kart på en brukervennlig måte. Denne prototypen fokuserer på innmelding av feil som gjelder bygg, der man senere kan utvide med flere forhold, uavhengige av kartdatabasen. 


FIKSKart.no består både av en brukerside for privatpersoner og en brukerside for saksbehandlere - FIKSKart.no/intern. Saksbehandlersiden er implementert som et forslag til hvordan en integrert løsning mellom saksbehandler og kunde kan fungere og se ut. 

Innrapportering av avvik gjøres ved å redigere bygg i kartet ved hjelp av tegnefunksjoner, der bruker endrer direkte på klikkbar vektordata fra NGIS-OpenAPIet. Det er lagt opp til at saksbehandler kan redigere, kommentere og deretter sende inn innmeldte endringer direkte til APIet. 

*Du trenger [Node.js](https://nodejs.org) installert.*


## Sett opp applikasjonen
For å starte opp må du klone prosjektet eller laste det ned som en zip-fil.  

Installere dependencies med følgende kommando:

```bash
npm install
```
Legg til NGIS_OpenAPI nøkkelen som miljøvariabel:
```bash
API_KEY=value
```
og webatlas api-nøkkel slik:
```bash
MAP_KEY=value
```

...for å starte

```bash
npm run dev
```

Naviger til [localhost:5000](http://localhost:5000). Her kan du se appen kjøre.  


## Tech stack
* [Svelte](https://svelte.dev/) - Frontend
* [Realtime Firebase](https://firebase.google.com/docs/database) - Database
* [Leaflet](https://leafletjs.com/) - Kart
* [Geoman](https://geoman.io/) - Tegnefunksjonalitet
* [NGIS-OpenAPI](https://github.com/kartverket/SFKB-API) - Hente ut vektordata 


![UML](https://github.com/theatok/norkart-sommerprosjekt-2020/blob/master/public/images/fikskart-navigation.png)

## Tenker om fremtidige utvidelser
- Adressesøkefeltet i map bør kunne gjennomføre et faktisk adressesøk og hente ut korresponderende datasett fra NGIS-OpenAPI
- Vektordata for innrapporterte saker mellomlagres nå i databasen, men bør på sikt kunne sendes direkte inn til NGIS-OpenAPI. Vektordataen behøver i den forbindelse en mye mer detaljert beskrivelse av objektene (eks: vektor1 er en taklinje) enn det som lagres nå. 
- Dersom applikasjonen skal fungere som en integrert løsning, må brukerinformasjon lagres og overføres til FIKSkart.no
- Kommunikasjon mellom kunde og saksbehandler baserer seg på visuell tilbakemelding, men også en e-post basert løsning. Det å faktisk sende automatiske e-poster må implementeres i en senere iterasjon. 
- Fokuset i denne prototypen var "Bygg" (bygninger i kart), men da vi ønsker at det skal være en løsning som spenner over mange kategorier, må disse også implementeres. 
- Kodekvalitet: Definere fixed variabler (eks: image paths, navigeringslinker, roller m.m) èn gang og benytte dem over alt (mer dynamisk og letthåndterlig kode) 
- Småplukk: Navn på vedlegg/vedlegg vises ikke i summary (kun hardkodet tekst). Bildet som fremvises når man trykker for å utvide bildet når man ser mer detaljer om sak er også hardkodet, ikke faktisk tegning.

## Forfattere
* Designer
    * Julie Marzano
* Utviklere
    * Marie Skatvedt
    * Thea Tokstad










