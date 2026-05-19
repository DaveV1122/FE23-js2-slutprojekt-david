# FE23-js2-slutprojekt-david-vakhayev

Slutprojekt - Social Media. En enkel forumapp byggd med TypeScript, Node.js, Express, JSON-fil som databas och Parcel pa frontend.

## Projektstruktur

```text
backend/
  src/
    controllers/
    routes/
    services/
    utils/
    types/
    db.json
    server.ts
frontend/
  src/
    api/
    components/
    pages/
    state/
    main.ts
    router.ts
    styles.css
docs/
```

## Installation

Installera beroenden i bada mapparna:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Starta appen

Starta backend i en terminal:

```bash
cd backend
npm run dev
```

Starta frontend i en annan terminal:

```bash
cd frontend
npm run dev
```

Oppna sedan:

```text
http://localhost:1234
```

Backend kor pa:

```text
http://localhost:3000
```

## Testkonton

Det finns tva exempelkonton i `backend/src/db.json`:

- `anna` / `password`
- `erik` / `password`

## Kommandon for kontroll

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run typecheck
npm run build
```

## Assignment Checklist

- [x] Minst 3 forum finns i databasen.
- [x] Forum-sidor skyddas i frontend och skickar utloggade anvandare till login.
- [x] Varje forum visar kommentarer i kronologisk ordning.
- [x] Anvandare kan registrera konto.
- [x] Anvandarnamn maste vara unikt.
- [x] Anvandare har losenord.
- [x] Anvandare valjer mellan minst 3 standardavatarer.
- [x] Login kontrollerar anvandarnamn och losenord mot JSON-databasen.
- [x] Inloggad anvandare visas i navbaren.
- [x] Inloggad anvandare kan besoka forum och skriva kommentar.
- [x] Inloggad anvandare kan besoka andra anvandares profiler.
- [x] Inloggad anvandare kan besoka sin egen profil.
- [x] Profil visar anvandarnamn, avatar och senaste 3 kommentarer.
- [x] Det finns en lista med alla anvandare.
- [x] Varje anvandare i listan ar klickbar.
- [x] Anvandare kan ta bort sina egna kommentarer.
- [x] Anvandare kan inte ta bort andras kommentarer.
- [x] Anvandare kan ta bort sitt eget konto.
- [x] Felhantering visar relevanta meddelanden.
- [x] Backend hanterar daliga requests utan att krascha.
- [x] VG-extra: anvandare kan redigera egna kommentarer.
- [x] VG-extra: anvandare kan gilla/av-gilla kommentarer.

