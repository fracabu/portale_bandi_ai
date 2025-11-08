/// <reference types="react" />
import React, { useState, useMemo } from 'react';
import bandiData from '../bandi.json';
import { Bando } from '../types';
import BandoCard from './BandoCard';
import BandiNavbar from './BandiNavbar';

const FondiStrutturali: React.FC = () => {
  const [selectedRegione, setSelectedRegione] = useState<string>('');
  const [selectedFondo, setSelectedFondo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra solo i fondi strutturali (ID che inizia con FS-)
  const fondiStrutturali = useMemo(() => {
    return (bandiData as Bando[]).filter(bando => bando.id.startsWith('FS-'));
  }, []);

  // Estrai regioni uniche
  const regioni = useMemo(() => {
    const regioniSet = new Set(fondiStrutturali.map(b => b.areaGeografica));
    return Array.from(regioniSet).sort();
  }, [fondiStrutturali]);

  // Identifica il tipo di fondo dal titolo
  const getTipoFondo = (bando: Bando): string => {
    if (bando.titolo.includes('FSE') || bando.id.includes('FSE')) return 'FSE+';
    if (bando.titolo.includes('FESR')) return 'FESR';
    if (bando.titolo.includes('PON')) return 'PON';
    return 'Altro';
  };

  const tipiFondo = useMemo(() => {
    const tipiSet = new Set(fondiStrutturali.map(getTipoFondo));
    return Array.from(tipiSet).sort();
  }, [fondiStrutturali]);

  // Filtra i bandi
  const bandiFiltrati = useMemo(() => {
    return fondiStrutturali.filter(bando => {
      const matchRegione = selectedRegione ? bando.areaGeografica === selectedRegione : true;
      const matchFondo = selectedFondo ? getTipoFondo(bando) === selectedFondo : true;
      const matchSearch = searchQuery 
        ? bando.titolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bando.sintesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bando.enteErogatore.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchRegione && matchFondo && matchSearch;
    });
  }, [fondiStrutturali, selectedRegione, selectedFondo, searchQuery]);

  // Statistiche
  const stats = useMemo(() => {
    const totaleBandi = bandiFiltrati.length;
    const importoTotale = bandiFiltrati.reduce((sum, b) => sum + b.importoMassimo, 0);
    const intensitaMedia = bandiFiltrati.length > 0 
      ? bandiFiltrati.reduce((sum, b) => sum + b.intensitaAiuto, 0) / bandiFiltrati.length 
      : 0;

    return { totaleBandi, importoTotale, intensitaMedia };
  }, [bandiFiltrati]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <BandiNavbar />
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Fondi Strutturali</h1>
          <p className="text-teal-100 text-lg">
            {fondiStrutturali.length} bandi FSE+, FESR e PON per lo sviluppo territoriale
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8">
        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
            <div className="text-3xl font-bold text-teal-600 mb-1">
              {stats.totaleBandi}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Bandi Disponibili
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.importoTotale > 0 
                ? `€${(stats.importoTotale / 1000000).toFixed(0)}M` 
                : 'Variabile'}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Dotazione Finanziaria
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-600">
            <div className="text-3xl font-bold text-cyan-600 mb-1">
              {stats.intensitaMedia > 0 ? `${stats.intensitaMedia.toFixed(0)}%` : '100%'}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Copertura Media
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-teal-50 border-l-4 border-teal-600 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">ℹ️ Fondi Strutturali 2021-2027</h3>
          <ul className="text-teal-800 text-sm space-y-1">
            <li><strong>FSE+</strong> - Fondo Sociale Europeo Plus: formazione, occupazione, inclusione sociale</li>
            <li><strong>FESR</strong> - Fondo Europeo di Sviluppo Regionale: innovazione, ricerca, transizione digitale/verde</li>
            <li><strong>PON</strong> - Programmi Operativi Nazionali: progetti nazionali su istruzione, ricerca, infrastrutture</li>
          </ul>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Filtra i Bandi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ricerca testuale */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cerca per parola chiave
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca nel titolo o descrizione..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            {/* Filtro per tipo fondo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo di Fondo
              </label>
              <select
                value={selectedFondo}
                onChange={(e) => setSelectedFondo(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">Tutti i fondi</option>
                {tipiFondo.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro per regione */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Area Geografica
              </label>
              <select
                value={selectedRegione}
                onChange={(e) => setSelectedRegione(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">Tutte le aree</option>
                {regioni.map(regione => (
                  <option key={regione} value={regione}>
                    {regione}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset filtri */}
          {(selectedRegione || selectedFondo || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRegione('');
                setSelectedFondo('');
                setSearchQuery('');
              }}
              className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              ✕ Cancella filtri
            </button>
          )}
        </div>

        {/* Lista bandi */}
        <div>
          {bandiFiltrati.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-slate-800">Nessun bando trovato</h3>
              <p className="mt-1 text-sm text-slate-500">
                Prova a modificare i filtri di ricerca.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-slate-600 mb-4">
                Mostrando {bandiFiltrati.length} {bandiFiltrati.length === 1 ? 'bando' : 'bandi'}
              </div>
              {bandiFiltrati.map(bando => (
                <BandoCard key={bando.id} bando={bando} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FondiStrutturali;
