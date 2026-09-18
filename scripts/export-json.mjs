/**
 * Vygeneruje data/kandidati.json z assets/data.js, aby se obě verze nerozešly.
 * Spuštění:  node scripts/export-json.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const src = readFileSync(join(root, "assets/data.js"), "utf8");
const window = {};
// data.js je čistý literál bez vedlejších efektů, takže ho stačí vyhodnotit
new Function("window", src)(window);

const KEYS = {
  n: "jmeno", v: "vek", s: "sport", st: "byvalyProfik", f: "overitTotoznost",
  np: "jmenovecSportovce",
  d: "popis", o: "obec", p: "subjekt", c: "poradiNaKandidatce", k: "kraj",
};
const BOOL = new Set(["st", "f", "np"]);

const out = window.KANDIDATI.map((r) =>
  Object.fromEntries(
    Object.entries(KEYS)
      .filter(([short]) => r[short] !== undefined)
      .map(([short, long]) => [long, BOOL.has(short) ? Boolean(r[short]) : r[short]])
  )
);

writeFileSync(join(root, "data/kandidati.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`Zapsáno data/kandidati.json — ${out.length} záznamů`);
