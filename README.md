# Regal Guesthouse — website

Site static (HTML/CSS/JS, fără build) pentru Regal Guesthouse, Strada Muzeului 40 A, Sighetu Marmației.

- `index.html` — landing page în 10 secțiuni (hero parallax + rezervare rapidă, motto, camere, facilități, 4,7★/330 recenzii, relaxare, poveste, galerie masonry cu lightbox, împrejurimi, contact + hartă)
- `rezervare.html` — calendar interactiv, alegere cameră, estimare preț, plată la proprietate / transfer
- `contact.html` — hartă extinsă, indicații rutiere, NAP, formular solicitări speciale
- `js/config.js` — endpoint CRM, GA4, Google Ads (remarketing + conversii), Meta Pixel. Se încarcă doar cu ID-uri completate și consimțământ cookie.

## De completat înainte de lansare

1. **Fotografii** — 25 de imagini reale în `img/*.webp` (fațadă, salon, lounge, cameră dublă, biliard, bar, mic dejun, tradiții, sărbători). Unele provin din colaje/capturi și au rezoluție mică: pentru calitate maximă înlocuiți-le cu originalele, păstrând numele fișierului (hero: `img/fatada.webp`, ~1920px). Lipsesc încă fotografii pentru camera twin, camera triplă și baie (casetele albastre `.ph`). Fotografia din salon provine de pe elsetrip — verificați dreptul de folosire.
2. **Email** — `contact@regalguesthouse.ro` este provizoriu.
3. **Facebook** — linkul duce acum la o căutare; puneți URL-ul exact al paginii.
4. **Domeniu** — `https://www.regalguesthouse.ro/` din canonical, Open Graph, `sitemap.xml` și `robots.txt`.
5. **Prețuri / camere** — tipurile de cameră (dublă, twin, triplă) și „de la 30€” se confirmă cu proprietarii.
6. **CRM** — setați `crmEndpoint` în `js/config.js`; fără el, formularele deschid WhatsApp cu mesajul precompletat.

## Evenimente de măsurare

`view_rooms` (secțiunea camere văzută → audiență retargetare), `search_availability`, `begin_checkout` (pagina de rezervare), `generate_lead` (formular trimis → conversie Google Ads / Lead Meta).
