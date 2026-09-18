# Sportovci na kandidátkách 2026

Přehled bývalých i aktivních profesionálních sportovců, reprezentantů a olympioniků, kteří
kandidují do zastupitelstev v komunálních volbách **9.–10. října 2026**. Filtrovatelné
po krajích, sportech a významu, s portréty pro rychlé ověření totožnosti.

**Živá verze:** https://vildafranek.github.io/volby2026-sportovci/

---

## Odkud data jsou

Zdrojem je otevřený registr kandidátů Českého statistického úřadu ve stavu po registraci listin:

| Soubor | Co obsahuje | Řádků |
|---|---|---|
| [`kvrk.csv`](https://volby.gov.cz/opendata/kv2026/kv2026_opendata_seznam.htm) | kandidáti do zastupitelstev obcí | 190 151 |
| [`serk.csv`](https://volby.gov.cz/opendata/se2026/se2026_opendata_seznam.htm) | kandidáti do Senátu (27 obvodů) | 154 |
| `kvrzcoco.csv`, `kvros.csv` | číselníky zastupitelstev a volebních stran | — |

Pole `POVOLANI` (kandidát si ho vyplňuje sám) bylo profiltrováno přes ~70 sportovních
klíčových slov. Navíc proběhl křížový sken jmen známých hokejistů a fotbalistů proti věku,
aby se odchytili ti, kdo u sebe sport neuvedli. Výsledek doplnilo regionální zpravodajství
(Deník, Blesk, Hospodářské noviny).

### Co tenhle postup nenajde

- Kdo se na listině označí jen jako „podnikatel“ nebo „OSVČ“, propadne filtrem — pokud zároveň
  nesedí na jmenný sken. U malých obcí to platí dvojnásob.
- Popisky jsou **vlastní tvrzení kandidátů**. „Reprezentant“ nebo „mistr světa“ na kandidátce
  není ověřený fakt.
- Záznamy s `overitTotoznost: true` sedí věkem i regionem na známého sportovce, ale povolání
  na listině to nepotvrzuje. Před publikací je potřeba doptat se.

### Senát: nula

Mezi 154 kandidáty ve 27 obvodech není jediný bývalý profesionální sportovec — jen čtyři
trenéři a funkcionáři. (Pozor na starší články: Haškova senátní kandidatura byla v roce 2024.)

---

## Struktura

```
index.html              stránka
assets/styles.css       vzhled (světlé i tmavé téma přes CSS proměnné)
assets/data.js          ZDROJ DAT — window.KANDIDATI
assets/photos.js        portréty jako data: URI (window.PHOTOS)
assets/app.js           filtrování a vykreslování, bez závislostí
data/kandidati.json     export dat s čitelnými názvy polí, pro další použití
scripts/export-json.mjs generuje data/kandidati.json z assets/data.js
```

Žádný build, žádné závislosti. `index.html` funguje i po dvojkliku z disku.

### Formát dat

`assets/data.js` je zkrácený zápis, `data/kandidati.json` ten čitelný:

| krátce | v JSONu | význam |
|---|---|---|
| `n` | `jmeno` | jméno a příjmení podle registru ČSÚ |
| `v` | `vek` | věk uvedený na kandidátce |
| `s` | `sport` | `hokej` \| `fotbal` \| `jine` |
| `st` | `byvalyProfik` | bývalý profesionál nebo reprezentant |
| `f` | `overitTotoznost` | totožnost se sportovcem není potvrzená |
| `d` | `popis` | povolání z kandidátky, doplněné o kariéru |
| `o` | `obec` | obec nebo městská část |
| `p` | `subjekt` | kandidující strana, hnutí nebo sdružení |
| `c` | `poradiNaKandidatce` | pořadí; `1` = lídr |
| `k` | `kraj` | jeden ze 14 krajů |

Po úpravě `assets/data.js` spusť `node scripts/export-json.mjs`, ať JSON nezůstane pozadu.

---

## Portréty

Fotky jsou z Wikimedia Commons přes cs.wikipedia.org, oříznuté na 64×64 a uložené jako
data: URI, aby stránka fungovala offline i bez cizích serverů. **Je to fotka toho sportovce,
ne fotka z kandidátky** — slouží k porovnání obličeje, ne jako doklad totožnosti. Portrét má
32 jmen ze 179; u zbytku volně licencovaná fotka neexistuje a zobrazí se monogram.

Jednotliví autoři a licence jsou uvedené u příslušných souborů na
[Wikimedia Commons](https://commons.wikimedia.org/).

---

## Publikování na GitHub Pages

Settings → Pages → Source: *Deploy from a branch*, branch `main`, složka `/ (root)`.
Soubor `.nojekyll` je v repu proto, aby Pages servírovaly obsah beze změn.

## Licence

Data ČSÚ jsou veřejná. Kód v tomto repu je MIT. Portréty mají vlastní licence svých autorů
na Wikimedia Commons — při dalším použití je uveďte.
