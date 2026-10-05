/** I siti realizzati. Aggiungi qui una voce e compare in tutto il sito; `hidden` la toglie senza cancellarla. */

export type CatKey =
  | 'ristoranti'
  | 'asiatico'
  | 'gelaterie'
  | 'parrucchieri'
  | 'estetica'
  | 'fitness'
  | 'casa'
  | 'animali';

export interface Project {
  slug: string;
  name: string;
  cat: CatKey;
  loc: string;
  blurb: string;
  tags: string[];
  featured?: boolean;
  /** indirizzo pubblico del sito: si apre e si naviga nella finestra dell'hero */
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
  { key: 'animali', label: 'Cura animali' },
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
    url: 'https://liaostudios.github.io/cd-design/',
  },
  {
    slug: 'amati-fitness',
    name: 'Amati Fitness Lab',
    cat: 'fitness',
    loc: 'Castel Maggiore',
    blurb: 'Palestra e centro fitness: corsi, abbonamenti e staff presentati in modo diretto.',
    tags: ['Palestra', 'Corsi', 'Abbonamenti'],
    url: 'https://liaostudios.github.io/amati-fitness-web/',
  },
  {
    slug: 'kings-club',
    name: 'King\'s Club Fitness',
    cat: 'fitness',
    loc: 'Funo di Argelato',
    blurb: 'Palestra storica attiva dal 1994: trent\'anni di attività raccontati con sale, corsi e staff.',
    tags: ['Dal 1994', 'Corsi', 'Staff'],
    url: 'https://liaostudios.github.io/kings-club-web/',
  },
  {
    slug: 'ellenails',
    name: 'ElleNails Studio',
    cat: 'estetica',
    loc: 'Bologna · Croce Coperta',
    blurb: 'Atelier di nail art: ricostruzione, semipermanente e gallery dei lavori sempre aggiornata.',
    tags: ['Nail art', 'Ricostruzione', 'Gallery'],
    url: 'https://liaostudios.github.io/ellenails-web/',
  },
  {
    slug: 'ladynails',
    name: 'Lady Nail',
    cat: 'estetica',
    loc: 'Bologna & Castel Maggiore',
    blurb: 'Nail art, ricostruzione e manicure in due sedi: listino chiaro e prenotazione diretta.',
    tags: ['Nail art', 'Due sedi', 'Prenotazioni'],
    url: 'https://liaostudios.github.io/ladynails-web/',
  },
  {
    slug: 'vivi-salon',
    name: 'Vivi Salon',
    cat: 'parrucchieri',
    loc: 'Bologna',
    blurb: 'Parrucchieri e centro estetico dal 2016: capelli, unghie, viso e corpo in un listino chiaro.',
    tags: ['Parrucchieri', 'Estetica', 'Listino'],
    featured: true,
    url: 'https://liaostudios.github.io/vivi-salon-web/',
  },
  {
    slug: 'che-stile',
    name: 'CHE STILE!',
    cat: 'parrucchieri',
    loc: 'Castel Maggiore',
    blurb: 'Salone di acconciature con identità grafica decisa e prenotazione telefonica in evidenza.',
    tags: ['Acconciature', 'Gallery', 'Prenotazioni'],
    featured: true,
    url: 'https://liaostudios.github.io/che-stile/',
  },
  {
    slug: 'parrucchiere-milan',
    name: 'Parrucchiere e Centro Estetico Milan',
    cat: 'parrucchieri',
    loc: 'Funo di Argelato',
    blurb: 'Salone uomo e donna con centro estetico: servizi, foto reali e contatti a portata di mano.',
    tags: ['Uomo & Donna', 'Estetica', 'Contatti'],
    url: 'https://liaostudios.github.io/parrucchiere-milan-web/',
  },
  {
    slug: 'crema-e-gusto',
    name: 'Crema & Gusto',
    cat: 'gelaterie',
    loc: 'Funo & Bologna',
    blurb: 'Pasticceria e caffetteria con due sedi: torte su misura, lievitati e colazioni in un unico sito.',
    tags: ['Pasticceria', 'Due sedi', 'Torte su misura'],
    url: 'https://liaostudios.github.io/crema-e-gusto-web/',
  },
  {
    slug: 'vincio-cremeria',
    name: 'Vincio Cremeria',
    cat: 'gelaterie',
    loc: 'Castel Maggiore',
    blurb: 'Gelateria artigianale: gusti di stagione e laboratorio raccontati con foto grandi e calde.',
    tags: ['Gelateria', 'Artigianale', 'Gallery'],
    url: 'https://liaostudios.github.io/vincio-cremeria/',
  },
  {
    slug: 'belli-comodi',
    name: 'Belli Comodi',
    cat: 'gelaterie',
    loc: 'Bologna',
    blurb: 'Gelato, piadine e aperitivo in giardino dal 1996: tre anime in un sito unico e coerente.',
    tags: ['Gelateria', 'Piadineria', 'Aperitivo'],
    url: 'https://liaostudios.github.io/belli-comodi/',
  },
  {
    slug: 'le-volpi',
    name: 'Le Volpi',
    cat: 'ristoranti',
    loc: 'Bologna',
    blurb: 'Pizzeria e ristorante con forno a legna: identità calda, menù navigabile e contatti sempre a portata.',
    tags: ['Ristorante', 'Pizzeria', 'Menu'],
    url: 'https://liaostudios.github.io/le-volpi/',
  },
  {
    slug: 'le-rose-2',
    name: 'Le Rose 2',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Ristorante e pizzeria di quartiere: pesce, griglia e napoletana in un sito ordinato e veloce.',
    tags: ['Ristorante', 'Menu', 'Prenotazioni'],
    url: 'https://liaostudios.github.io/le-rose-2/',
  },
  {
    slug: 'regina-antonietta',
    name: 'Regina Antonietta',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Vera pizza napoletana d\'asporto: sito essenziale costruito attorno all\'ordine telefonico.',
    tags: ['Napoletana', 'Asporto', 'Menu'],
    url: 'https://liaostudios.github.io/regina-antonietta/',
  },
  {
    slug: 'little-kitchen',
    name: 'Little Kitchen',
    cat: 'ristoranti',
    loc: 'Bologna',
    blurb: 'French tacos, burger, poutine e grigliata: street food con menù chiaro e ordine rapido.',
    tags: ['Street food', 'Menu', 'Ordini'],
    url: 'https://liaostudios.github.io/little-kitchen/',
  },
  {
    slug: 'toki-sushi',
    name: 'Toki Sushi–Asian',
    cat: 'asiatico',
    loc: 'Bologna',
    blurb: 'Sushi all you can eat con cucina espressa: atmosfera contemporanea e prenotazione rapida.',
    tags: ['Sushi', 'All you can eat', 'Prenotazioni'],
    url: 'https://liaostudios.github.io/toki-sushi/',
  },
  {
    slug: 'yappo-ramen',
    name: 'Yappo Ramen & Izakaya',
    cat: 'asiatico',
    loc: 'San Lazzaro di Savena',
    blurb: 'Ramen e izakaya giapponese contemporaneo: brodi, yakitori e piatti da condividere.',
    tags: ['Ramen', 'Izakaya', 'Menu'],
    featured: true,
    url: 'https://liaostudios.github.io/yappo-ramen/',
  },
  {
    slug: 'gangnam-wings',
    name: 'Gangnam Wings',
    cat: 'asiatico',
    loc: 'Milano',
    blurb: 'Fast food coreano K-style: pollo fritto, menù illustrato e ordinazione in un clic.',
    tags: ['Coreano', 'Fast food', 'Menu'],
    url: 'https://liaostudios.github.io/gangnam-wings-milano/',
  },
  {
    slug: 'la-cuccia',
    name: 'La Cuccia di Lilli e Il Vagabondo',
    cat: 'animali',
    loc: 'Castel Maggiore',
    blurb: 'Toelettatura e cura degli animali: servizi, prezzi e prenotazione pensati per chi ha fretta.',
    tags: ['Toelettatura', 'Servizi', 'Prenotazioni'],
    url: 'https://liaostudios.github.io/la-cuccia-web/',
  },
  {
    slug: 'i-wash-my-dog',
    name: 'I wash my dog',
    cat: 'animali',
    loc: 'Castel Maggiore',
    blurb: 'Lavaggio self-service per cani: come funziona, orari e gettoni spiegati in una pagina.',
    tags: ['Self-service', 'Orari', 'Come funziona'],
    url: 'https://liaostudios.github.io/i-wash-my-dog-web/',
  },
  {
    slug: 'naild-it',
    name: 'Nail\'d IT',
    cat: 'estetica',
    loc: 'Bologna · Corticella',
    blurb: 'Atelier di unghie con listino trasparente e prenotazione immediata dal telefono.',
    tags: ['Atelier unghie', 'Listino', 'Prenotazioni'],
    featured: true,
    hidden: true,
  },
  {
    slug: 'trendy-salon',
    name: 'Trendy Salon',
    cat: 'parrucchieri',
    loc: 'Bologna · Corticella',
    blurb: 'Taglio, colore e balayage presentati con foto reali e recensioni Google in vetrina.',
    tags: ['Parrucchiere', 'Balayage', 'Recensioni'],
    hidden: true,
  },
  {
    slug: 'animus-hair',
    name: 'Animus Hair Studio',
    cat: 'parrucchieri',
    loc: 'Granarolo dell\'Emilia',
    blurb: 'Parrucchiere e barber in un unico spazio: due mondi distinti dentro lo stesso sito.',
    tags: ['Parrucchiere', 'Barber', 'Prenotazioni'],
    hidden: true,
  },
  {
    slug: 'mo-gelato',
    name: 'M\'o il gelato',
    cat: 'gelaterie',
    loc: 'Castel Maggiore',
    blurb: 'Gelateria artigianale raccontata per immagini, con gusti e stagionalità in primo piano.',
    tags: ['Gelateria', 'Artigianale', 'Gallery'],
    hidden: true,
  },
  {
    slug: 'cremery',
    name: 'Cremery',
    cat: 'gelaterie',
    loc: 'Castel Maggiore',
    blurb: 'Gelato mantecato ogni giorno, cannoli e semifreddi, con consegna a domicilio integrata.',
    tags: ['Gelateria', 'Delivery', 'Prodotti'],
    hidden: true,
  },
  {
    slug: 'gelatomania',
    name: 'Gelatomania',
    cat: 'gelaterie',
    loc: 'Funo di Argelato',
    blurb: 'Gelateria artigianale a cinque minuti da Bologna: torte gelato, semifreddi e panettoni.',
    tags: ['Gelateria', 'Torte gelato', 'Gallery'],
    hidden: true,
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
    hidden: true,
  },
  {
    slug: 'saporito',
    name: 'Saporito',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Il primo all you can eat 100% italiano della zona: sito multipagina con menù a nastro e prenotazioni.',
    tags: ['Multipagina', 'Menu', 'Prenotazioni'],
    featured: true,
    hidden: true,
  },
  {
    slug: 'la-braceria',
    name: 'La Braceria',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Carne alla brace e musica dal vivo: sito che racconta la cucina e spinge le serate evento.',
    tags: ['Food & Music', 'Eventi', 'Menu'],
    featured: true,
    hidden: true,
  },
  {
    slug: 'trattoria-mulino',
    name: 'Trattoria Mulino Bruciato',
    cat: 'ristoranti',
    loc: 'Bologna',
    blurb: 'Cucina bolognese servita fino a notte fonda, con orari e menù immediatamente leggibili.',
    tags: ['Cucina bolognese', 'Orari estesi', 'Menu'],
    hidden: true,
  },
  {
    slug: 'mediterraneo',
    name: 'Pizzeria Mediterraneo',
    cat: 'ristoranti',
    loc: 'Castel Maggiore',
    blurb: 'Pizza d\'autore presentata con cura: sezioni pulite, foto grandi e contatti diretti.',
    tags: ['Pizza d\'autore', 'Menu', 'Contatti'],
    hidden: true,
  },
  {
    slug: 'macao',
    name: 'Ristorante Macao',
    cat: 'asiatico',
    loc: 'Funo di Argelato',
    blurb: 'Sushi e cucina asiatica con formula all you can eat e à la carte, in una veste elegante.',
    tags: ['All you can eat', 'Prenotazioni', 'Menu'],
    featured: true,
    hidden: true,
  },
];

/** I progetti mostrati sul sito, già nell'ordine giusto. */
export const VISIBLE = PROJECTS.filter((p) => !p.hidden);

export const catLabel = (k: CatKey) => CATS.find((c) => c.key === k)?.label ?? k;
