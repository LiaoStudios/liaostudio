/** Forma delle righe così come stanno nel database. */

export interface ProgettoRow {
  slug: string;
  nome: string;
  categoria: string;
  luogo: string;
  descrizione: string;
  tags: string[];
  url: string | null;
  in_evidenza: boolean;
  nascosto: boolean;
  ordine: number;
}

export interface PianoRow {
  id: string;
  nome: string;
  sottotitolo: string;
  prezzo: string;
  unita: string;
  nota: string | null;
  voci: string[];
  in_evidenza: boolean;
  ordine: number;
}

export interface CategoriaRow {
  chiave: string;
  etichetta: string;
  ordine: number;
}

export interface RichiestaRow {
  id: string;
  creata_il: string;
  nome: string;
  attivita: string | null;
  email: string;
  telefono: string | null;
  progetto: string | null;
  budget: string | null;
  messaggio: string | null;
  stato: 'nuova' | 'letta' | 'in_corso' | 'chiusa';
  note: string | null;
}
