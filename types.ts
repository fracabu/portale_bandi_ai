export interface Bando {
  id: string;
  titolo: string;
  enteErogatore: string;
  areaGeografica: string;
  categoriaTematica: string;
  tipologiaIntervento: string;
  targetBeneficiari: string[];
  sintesi: string;
  dettagli: {
    aChiERivolto: string;
    cosaFinanzia: string;
    quantoFinanzia: string;
    comePartecipare: string;
  };
  intensitaAiuto: number;
  importoMassimo: number;
  dataApertura: string;
  dataScadenza: string;
  linkUfficiale: string;
  complessita: 'Bassa' | 'Media' | 'Alta';
}

export interface Filters {
  query: string;
  categoria: string;
  tipologia: string;
  target: string;
  area: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}