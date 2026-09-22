# Liao Studio — sito dell'agenzia

React + Vite + TypeScript + Tailwind. Pagina singola con hero animata e
portfolio filtrabile.

## Avvio

```bash
npm install
npm run dev      # http://127.0.0.1:4186
npm run build    # genera dist/
npm run preview  # anteprima della build
```

## Com'è fatto

```
src/
  theme.ts                    Palette presa dal logo (navy + blu elettrico)
  data/projects.ts            ← I 28 PROGETTI: nome, settore, descrizione, link
  components/
    Hero.tsx                  Hero: shader, titolo, toolbar, CTA
    ShaderBackground.tsx      Decide se usare la shader o il fondale di scorta
    ShaderStack.tsx           Lo stack di shader vero (caricato in differita)
    HeadlineToolbar.tsx       La barra B / I / U / colore che ristila il titolo
    Navbar.tsx                Barra a pillola, orologio di Bologna, menu mobile
    TextRoll.tsx              Bottoni con testo che "rulla" al passaggio
    SectionHead.tsx           Pastiglia numerata + titolo di sezione
    LogoWatermark.tsx         Il marchio in filigrana che si accende col mouse
    Pricing.tsx               I tre pacchetti + la nota sul dominio
    Intro.tsx  Work.tsx  Services.tsx  Process.tsx  Faq.tsx  Contact.tsx  Footer.tsx
public/
  work/<slug>.jpg             Gli screenshot dei siti realizzati
  brand/                      Logo e favicon
```

## L'hero

Tre cose lavorano insieme:

**1. Il fondale reagisce al mouse.** È uno stack di shader WebGPU
(pacchetto `shaders`). Il livello che risponde al puntatore è `ChromaFlow`:
dipinge scie di luce che seguono il mouse con inerzia. I quattro colori
direzionali usano i due blu del logo, così il verso del movimento cambia la
tinta della scia. Sopra, `FlutedGlass` le spezza in lamelle di vetro rigato.

**2. Il titolo si può ristilare.** La seconda riga è presentata come testo
selezionato e la barra sotto la modifica davvero: livello del titolo,
grassetto, corsivo, sottolineato e colore. Le etichette che compaiono sotto
la selezione mostrano gli stili attivi.

**3. Il marchio in filigrana si accende.** Dietro al titolo c'è il logo a
opacità 0,04. Una seconda copia, a colori pieni, è coperta da una maschera
radiale centrata sul puntatore: dove passi il mouse il logo si illumina. La
posizione viaggia su due variabili CSS aggiornate dentro un
`requestAnimationFrame`, quindi React non ridisegna nulla. Su touch e con
"riduci animazioni" la filigrana resta ferma.

**4. I bottoni "rullano".** La scritta è duplicata in colonna dentro un box
con overflow nascosto; al passaggio la colonna scorre di metà altezza.

### Peso e compatibilità

Il pacchetto delle shader pesa ~720 KB gzip, più di tutto il resto del sito.
Per questo:

- il resto della pagina è **59 KB gzip** e si carica subito;
- la shader viene richiesta **solo** se `navigator.gpu` risponde e solo dopo
  che il thread principale è libero (`requestIdleCallback`);
- dove WebGPU non c'è (Firefox, Safari datati) o se l'utente ha chiesto meno
  animazioni, resta un fondale CSS con le stesse tinte e **il file pesante non
  viene mai scaricato**.

Se cambi la configurazione di build, controlla che `dist/assets/index-*.js`
non importi staticamente il chunk delle shader:

```bash
grep -o 'from"\./ShaderStack[^"]*"' dist/assets/index-*.js   # non deve trovare nulla
```

## Il portfolio

Ne vengono mostrati **6 alla volta**, con il bottone "Mostra altri". I filtri
azzerano il conteggio quando cambi settore.

L'ordine dei settori è quello di `CATS` in `src/data/projects.ts`: infissi →
palestre → estetica → parrucchieri → gelaterie → ristoranti → asiatico.
I progetti seguono quell'ordine.

**Doppioni tolti.** Tre siti erano costruiti sulla stessa base di altri, quindi
in vetrina resta solo il migliore dei tre gruppi:

| Tolto | Tenuto | Perché |
|---|---|---|
| Pizzeria Da Mami | Regina Antonietta | stesso identico template; Regina Antonietta è l'unico online |
| Pizzeria 2 Forni | Regina Antonietta | stesso identico template |
| Steve Hair Diffusion | Vivi Salon | due splash scuri quasi uguali; Vivi Salon è online e più incisivo |

Sono ancora in `PROJECTS`: per rimetterne uno in vetrina basta togliere la sua
voce dall'elenco dei rimossi (o aggiungerla di nuovo al file).

Ogni progetto ha un campo `hidden?: boolean`: mettilo a `true` e sparisce dal
sito senza cancellare i dati — utile se un cliente ti chiede di toglierlo.

## Aggiungere un progetto al portfolio

1. Screenshot del sito a 1440×900, salvato in `public/work/<slug>.jpg`
   (le card lo ritagliano in 329:246).
2. Aggiungi la voce in `src/data/projects.ts`:

```ts
{
  slug: 'nome-file',
  name: 'Nome Attività',
  cat: 'ristoranti',
  loc: 'Città',
  blurb: 'Una riga che spiega cosa risolve il sito.',
  tags: ['Tag 1', 'Tag 2'],
  featured: true,
  url: 'https://sito-online.it',   // facoltativo: se c'è, la card è cliccabile
}
```

Settori (`cat`): `ristoranti`, `asiatico`, `gelaterie`, `parrucchieri`,
`estetica`, `fitness`, `casa`. Si aggiungono in `CATS`, nello stesso file:
i filtri e i conteggi si aggiornano da soli.

Gli screenshot dei siti si rigenerano con gli script della versione
precedente, in `_v1-static/build/` (vedi `capture.js`); i PNG originali a
piena risoluzione sono in `../_liaostudio-screens/`.

## Pubblicazione

`netlify.toml` è già configurato (build `npm run build`, publish `dist`).

```bash
npx netlify deploy --prod
```

## Da completare prima di andare online

- [x] Email → `liaostudio07@gmail.com` (in `src/components/Contact.tsx`)
- [ ] **Telefono** → non compare da nessuna parte: non me l'hai dato e non ho
      voluto mettere un numero finto. Va aggiunto in `Navbar.tsx`,
      `Contact.tsx` e `Footer.tsx`.
- [ ] **Instagram** e altri social → `Footer.tsx`
- [ ] **Partita IVA** → `Footer.tsx`
- [ ] **Dominio** → `index.html` (canonical e og:url), `public/robots.txt`,
      `public/sitemap.xml`
- [ ] Il modulo contatti apre il client di posta. Per riceverli via web, su
      Netlify serve un form con attributo `netlify` (oppure una funzione).

## Cose che non ho inventato

- **Recensioni**: nessuna testimonianza nel sito, perché non avrei potuto
  scriverne di vere. Quando hai due o tre frasi reali dei clienti si aggiunge
  una sezione dedicata.
- **Prezzi**: le cifre nella sezione Prezzi sono quelle che mi hai dato tu.
  Si cambiano in `src/components/Pricing.tsx`, array `PLANS`.
- **Recensioni**: vedi sopra.

## Versione precedente

La prima versione, in HTML statico e con palette terracotta, è archiviata in
`_v1-static/`. Non viene pubblicata.

## Dashboard (`/admin`)

Area riservata per gestire le richieste dal modulo contatti, i progetti del
portfolio, i prezzi e alcuni testi — senza toccare il codice.

**Come accedere la prima volta:**
1. Vai su `/admin`
2. "Prima volta? Crea il tuo account" → email e password
3. Solo `liaostudio07@gmail.com` può registrarsi: un trigger sul database
   rifiuta ogni altro indirizzo, prima ancora che l'account esista.
4. Conferma l'indirizzo dal link che arriva via email
5. Torna su `/admin` e accedi

**Cosa si può fare da lì:**
- **Richieste** — tutte le richieste inviate dal modulo contatti, con stato
  (nuova/letta/in corso/chiusa), filtri, ed eliminazione.
- **Progetti** — nascondere un progetto dal sito, metterlo tra i lavori in
  evidenza, modificare luogo, descrizione e link.
- **Prezzi** — cambiare nome, prezzo, unità, nota e voci elenco dei tre
  pacchetti. Il layout della sezione (il confronto rate/tantum della landing
  page) resta quello disegnato in `Pricing.tsx`.
- **Testi** — email, telefono, zona, P.IVA. *Non ancora collegati al sito
  pubblico* (che per queste voci usa ancora `build/build.js`): serve un
  prossimo passo per farli leggere da lì.

Il sito pubblico (Lavori, Prezzi) legge dal database: appena salvi nella
dashboard, chi ricarica la pagina vede il cambiamento — senza rebuild, senza
deploy.

### Una cosa tecnica da sapere se tocchi le query di scrittura

Postgres valuta le policy di **lettura** (RLS SELECT) anche su un `INSERT`
o `UPDATE` che chiede indietro la riga modificata (`RETURNING`, o
`.select()` dopo `.insert()`/`.update()` nel client Supabase) — non solo le
policy di scrittura. Il modulo contatti pubblico scrive nella tabella
`richieste`, ma non può rileggerla: se qualcuno aggiunge `.select()` dopo
quell'`insert()`, la scrittura torna a fallire con un errore di RLS che
sembra dire "la policy di inserimento non va bene", quando in realtà è
mancare la policy di lettura (che qui manca *di proposito*, per non far
leggere a chiunque le richieste altrui). Il commento in `Contact.tsx` lo
spiega nel punto esatto.

### Struttura del database (Supabase, progetto `liaostudio`)

```
richieste     Le richieste dal modulo contatti
categorie     I 7 settori del portfolio
progetti      I 25 progetti (nome, categoria, descrizione, tag, url, visibilità)
piani         I 3 pacchetti di prezzo
testi         Testi liberi (email, telefono, zona, P.IVA — vedi sopra)
admin_ammessi L'unico indirizzo che può registrarsi sulla dashboard
```

Tutte le tabelle hanno la sicurezza a livello di riga attiva (RLS): il
pubblico può leggere i contenuti e scrivere una richiesta, ma non leggere le
richieste altrui né toccare nient'altro; solo chi ha fatto login può
gestire tutto.
