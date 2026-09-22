/** I 28 siti realizzati. Aggiungi qui una voce e compare in tutto il sito. */

export type CatKey =
  | 'ristoranti'
  | 'asiatico'
  | 'gelaterie'
  | 'parrucchieri'
  | 'estetica'
  | 'fitness'
  | 'casa';

export interface Project {
  slug: string;
  name: string;
  cat: CatKey;
  loc: string;
  blurb: string;
  tags: string[];
  featured?: boolean;
  /** se il sito è online e pubblico, la card diventa cliccabile */
  url?: string;
  /** mettilo a true per togliere un progetto dal sito senza cancellarlo */
  hidden?: boolean;
}

export const CATS: { key: CatKey; label: string }[] = [
  { key: 'casa', label: 'Casa & Impresa' },
  { key: 'fitness', label: 'Palestre & Fitness' },
  { key: 'estetica', label: 'Estetica & Unghie' },
  { key: 'parrucchieri', label: 'Parrucchieri' },
  { key: 'gelaterie', label: 'Gelaterie & Pasticcerie' },
  { key: 'ristoranti', label: 'Ristoranti & Pizzerie' },
  { key: 'asiatico', label: 'Sushi & Asiatico' },
];

export const PROJECTS: Project[] = [
  {
    slug: 'cd-design',
    name: 'CD Design Porte & Finestre',
    cat: 'casa',
    loc: 'Castel Maggiore',
    blurb: 'Infissi, porte blindate e serramenti: sito multipagina con una scheda per ogni categoria.',
    tags: ['Multipagina', 'Catalogo', 'Preventivi'],
    featured: true,
    url: 'https://cd-design.eu',
  },
  {
    slug: 'amati-fitness',
    name: 'Amati Fitness Lab',
    cat: 'fitness',
    loc: 'Castel Maggiore',
    blurb: 'Palestra e centro fitness: corsi, abbonamenti e staff presentati in modo diretto.',
    tags: ['Palestra', 'Corsi', 'Abbonamenti'],
  },
  {
    slug: 'kings-club',
    name: 'King\'s Club Fitness',
    cat: 'fitness',
    loc: 'Funo di Argelato',
    blurb: 'Palestra storica attiva dal 1994: trent\'anni di attività raccontati con sale, corsi e staff.',
    tags: ['Dal 1994', 'Corsi', 'Staff'],
  },
  {
    slug: 'ellenails',
    name: 'ElleNails Studio',
    cat: 'estetica',
    loc: 'Bologna · Croce Coperta',
    blurb: 'Atelier di nail art: ricostruzione, semipermanente e gallery dei lavori sempre aggiornata.',
    tags: ['Nail art', 'Ricostruzione', 'Gallery'],
  },
  {
    slug: 'naild-it',
    name: 'Nail\'d IT',
    cat: 'estetica',
    loc: 'Bologna · Corticella',
    blurb: 'Atelier di unghie con listino trasparente e prenotazione immediata dal telefono.',
    tags: ['Atelier unghie', 'Listino', 'Prenotazioni'],
    featured: true,
  },
  {
    slug: 'vivi-salon',
    name: 'Vivi Salon',
    cat: 'parrucchieri',
    loc: 'Bologna',
    blurb: 'Parrucchieri e centro estetico dal 2016: capelli, unghie, viso e corpo in un listino chiaro.',
    tags: ['Parrucchieri', 'Estetica', 'Listino'],
    featured: true,
    url: 'https://vivi-salon.netlify.app',
  },
  {
    slug: 'che-stile',
    name: 'CHE STILE!',
    cat: 'parrucchieri',
    loc: 'Castel Maggiore',
    blurb: 'Salone di acconciature con identità grafica decisa e prenotazione telefonica in evidenza.',
    tags: ['Acconciature', 'Gallery', 'Prenotazioni'],
    featured: true,
  },
  {
    slug: 'trendy-salon',
    name: 'Trendy Salon',
    cat: 'parrucchieri',
    loc: 'Bologna · Corticella',
    blurb: 'Taglio, colore e balayage presentati con foto reali e recensioni Google in vetrina.',
    tags: ['Parrucchiere', 'Balayage', 'Recensioni'],
  },
  {
    slug: 'animus-hair',
    name: 'Animus Hair Studio',
    cat: 'parrucchieri',
    loc: 'Granarolo dell\'Emilia',
    blurb: 'Parrucchiere e barber in un unico spazio: due mondi distinti dentro lo stesso sito.',
    tags: ['Parrucchiere', 'Barber', 'Prenotazioni'],
  },
  {
    slug: 'crema-e-gusto',
    name: 'Crema & Gusto',
    cat: 'gelaterie',
    loc: 'Funo & Bologna',
    blurb: 'Pasticceria e caffetteria con due sedi: torte su misura, lievitati e colazioni in un unico sito.',
    tags: ['Pasticceria', 'Due sedi', 'Torte su misura'],
    url: 'https://cremandgusto.netlify.app',
  },
  {
    slug: 'mo-gelato',
    name: 'M\'o il gelato',
    cat: 'gelaterie',
    loc: 'Castel Maggiore',
    blurb: 'Gelateria artigianale raccontata per immagini, con gusti e stagionalità in primo piano.',
    tags: ['Gelateria', 'Artigianale', 'Gallery'],
  },
  {
    slug: 'belli-comodi',
    name: 'Belli Comodi',
    cat: 'gelaterie',
    loc: 'Bologna',
    blurb: 'Gelato, piadine e aperitivo in giardino dal 1996: tre anime in un sito unico e coerente.',
    tags: ['Gelateria', 'Piadineria', 'Aperitivo'],
  },
  {
    slug: 'cremery',
    name: 'Cremery',
    cat: 'gelaterie',
    loc: 'Castel Maggiore',
    blurb: 'Gelato mantecato ogni giorno, cannoli e semifreddi, con consegna a domicilio integrata.',
    tags: ['Gelateria', 'Delivery', 'Prodotti'],
  },
  {
    slug: 'gelatomania',
    name: 'Gelatomania',
    cat: 'gelaterie',
    loc: 'Funo di Argelato',
    blurb: 'Gelateria artigianale a cinque minuti da Bologna: torte gelato, semifreddi e panettoni.',
    tags: ['Gelateria', 'Torte gelato', 'Gallery'],
  },
  {
    slug: 'king-pizza',
    name: 'King Pizza',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Pizzeria con menù completo, ordinazione d\'asporto online e area gestionale per lo staff.',
    tags: ['Menu digitale', 'Ordini online', 'Dashboard'],
    featured: true,
    url: 'https://king-pizzas.netlify.app',
  },
  {
    slug: 'saporito',
    name: 'Saporito',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Il primo all you can eat 100% italiano della zona: sito multipagina con menù a nastro e prenotazioni.',
    tags: ['Multipagina', 'Menu', 'Prenotazioni'],
    featured: true,
  },
  {
    slug: 'le-volpi',
    name: 'Le Volpi',
    cat: 'ristoranti',
    loc: 'Bologna',
    blurb: 'Pizzeria e ristorante con forno a legna: identità calda, menù navigabile e contatti sempre a portata.',
    tags: ['Ristorante', 'Pizzeria', 'Menu'],
  },
  {
    slug: 'la-braceria',
    name: 'La Braceria',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Carne alla brace e musica dal vivo: sito che racconta la cucina e spinge le serate evento.',
    tags: ['Food & Music', 'Eventi', 'Menu'],
    featured: true,
  },
  {
    slug: 'le-rose-2',
    name: 'Le Rose 2',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Ristorante e pizzeria di quartiere: pesce, griglia e napoletana in un sito ordinato e veloce.',
    tags: ['Ristorante', 'Menu', 'Prenotazioni'],
  },
  {
    slug: 'trattoria-mulino',
    name: 'Trattoria Mulino Bruciato',
    cat: 'ristoranti',
    loc: 'Bologna',
    blurb: 'Cucina bolognese servita fino a notte fonda, con orari e menù immediatamente leggibili.',
    tags: ['Cucina bolognese', 'Orari estesi', 'Menu'],
  },
  {
    slug: 'mediterraneo',
    name: 'Pizzeria Mediterraneo',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Pizza d\'autore presentata con cura: sezioni pulite, foto grandi e contatti diretti.',
    tags: ['Pizza d\'autore', 'Menu', 'Contatti'],
  },
  {
    slug: 'regina-antonietta',
    name: 'Regina Antonietta',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Vera pizza napoletana d\'asporto: sito essenziale costruito attorno all\'ordine telefonico.',
    tags: ['Napoletana', 'Asporto', 'Menu'],
    url: 'https://regina-antonietta-pizzeria.netlify.app',
  },
  {
    slug: 'macao',
    name: 'Ristorante Macao',
    cat: 'asiatico',
    loc: 'Funo di Argelato',
    blurb: 'Sushi e cucina asiatica con formula all you can eat e à la carte, in una veste elegante.',
    tags: ['All you can eat', 'Prenotazioni', 'Menu'],
    featured: true,
  },
  {
    slug: 'toki-sushi',
    name: 'Toki Sushi–Asian',
    cat: 'asiatico',
    loc: 'Bologna',
    blurb: 'Sushi all you can eat con cucina espressa: atmosfera contemporanea e prenotazione rapida.',
    tags: ['Sushi', 'All you can eat', 'Prenotazioni'],
  },
  {
    slug: 'yappo-ramen',
    name: 'Yappo Ramen & Izakaya',
    cat: 'asiatico',
    loc: 'San Lazzaro di Savena',
    blurb: 'Ramen e izakaya giapponese contemporaneo: brodi, yakitori e piatti da condividere.',
    tags: ['Ramen', 'Izakaya', 'Menu'],
    featured: true,
  },
];

/** I progetti mostrati sul sito, già nell'ordine giusto. */
export const VISIBLE = PROJECTS.filter((p) => !p.hidden);

export const catLabel = (k: CatKey) => CATS.find((c) => c.key === k)?.label ?? k;
