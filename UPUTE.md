# Dnevnik – verzija 9 (više datoteka)

## Što je u mapi
- index.html, sw.js, manifest.json, icon-192.png, icon-512.png
- mapa css/ (4 datoteke)
- mapa js/ (14 datoteka)

## Prijenos na GitHub (prvi put s ovom verzijom)
1. Otvorite svoj repozitorij na github.com.
2. Add file → Upload files.
3. Povucite unutra SVE iz ove mape: index.html, sw.js, manifest.json, obje ikone i mape css i js (povucite cijele mape, GitHub ih prenosi s podmapama).
4. Pritisnite Commit changes.
5. Pričekajte 1–2 minute da GitHub Pages objavi stranicu.

## Na mobitelu
Otvorite aplikaciju s internetom. Pojavit će se traka „Osvježi sada”, pritisnite je. Podaci ostaju, jer su spremljeni na mobitelu.

## Kod svake sljedeće izmjene
Uvijek se mijenjaju ova dva broja zajedno:
- index.html: <meta name="app-version" content="9"> → 10
- sw.js: const C="dnevnik-v9" → "dnevnik-v10"
Ako dodate novu datoteku, dopišite je i na popis FILES u sw.js.
