/// <reference types="react" />
import React, { useState, useMemo } from 'react';
import bandiData from '../bandi.json';
import { Bando } from '../types';
import BandoCard from './BandoCard';

const BandiRegionali: React.FC = () => {
  const [selectedRegione, setSelectedRegione] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra solo i bandi regionali (ID che inizia con REG-)
  const bandiRegionali = useMemo(() => {
    return (bandiData as Bando[]).filter(bando => bando.id.startsWith('REG-'));
  }, []);

  // Estrai le regioni uniche
  const regioni = useMemo(() => {
    const regioniSet = new Set(bandiRegionali.map(b => b.areaGeografica));
    return Array.from(regioniSet).sort();
  }, [bandiRegionali]);

  // Filtra i bandi in base alla regione selezionata e alla ricerca
  const bandiFiltrati = useMemo(() => {
    return bandiRegionali.filter(bando => {
      const matchRegione = selectedRegione ? bando.areaGeografica === selectedRegione : true;
      const matchSearch = searchQuery 
        ? bando.titolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bando.sintesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bando.enteErogatore.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchRegione && matchSearch;
    });
  }, [bandiRegionali, selectedRegione, searchQuery]);

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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Bandi Regionali</h1>
          <p className="text-blue-100 text-lg">
            Esplora i {bandiRegionali.length} bandi delle regioni italiane
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8">
        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totaleBandi}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Bandi Disponibili
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="text-3xl font-bold text-green-600 mb-1">
              €{(stats.importoTotale / 1000000).toFixed(1)}M
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Importo Totale Disponibile
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats.intensitaMedia.toFixed(0)}%
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Intensità Media di Aiuto
            </div>
          </div>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Filtra i Bandi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ricerca testuale */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cerca per parola chiave
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca nel titolo, descrizione o ente..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro per regione */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Regione
              </label>
              <select
                value={selectedRegione}
                onChange={(e) => setSelectedRegione(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutte le regioni</option>
                {regioni.map(regione => (
                  <option key={regione} value={regione}>
                    {regione}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset filtri */}
          {(selectedRegione || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRegione('');
                setSearchQuery('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
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

export default BandiRegionali;
