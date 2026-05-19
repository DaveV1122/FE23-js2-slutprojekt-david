# Reflection - David Vakhayev

## Vad heter din grupp?

Gruppen heter David Vakhayev.

## Vad var ditt ansvarsomrade?

Mitt ansvarsomrade var att bygga en enkel social media/forum-app enligt uppgiften. Jag ansvarade for backend med Node.js, Express, TypeScript och JSON-fil som databas, samt frontend med Parcel och TypeScript.

## Vilken kod har du skrivit?

Jag har skrivit backendens API-routes, controllers, services, typer och JSON-databaslogik. Jag har ocksa skrivit frontendens router, API-lager, auth-state med localStorage, sidor for login/register/forum/anvandare/profil, komponenter for navbar och kommentarer samt CSS for grannssnittet.

## Vad var mest utmanande?

Det mest utmanande var att fa alla regler kring anvandarens rattigheter att fungera tydligt utan att bygga ett for komplext autentiseringssystem. Exempelvis ska en anvandare kunna redigera och ta bort sina egna kommentarer, men inte andra anvandares kommentarer.

## Hur loste du det?

Jag loste det genom att halla inloggningen enkel och spara den inloggade anvandaren i localStorage pa frontend. Vid requests skickas anvandarens id till backend. Backend kontrollerar sedan att id:t matchar agaren innan kommentarer redigeras eller tas bort, och innan ett konto tas bort.

## Hur kan projektet vidareutvecklas och forbattras?

Projektet kan forbattras med riktig autentisering, hashade losenord, server-side sessions eller JWT, battre formulardesign, sokfunktion, kategorier, pagination for kommentarer och mer omfattande tester. Databasen kan ocksa bytas fran JSON-fil till en riktig databas om projektet ska anvandas pa riktigt.
