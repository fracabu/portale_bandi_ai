/// <reference types="react" />
import React, { useState, useMemo } from 'react';
import bandiData from '../bandi.json';
import { Bando } from '../types';
import BandoCard from './BandoCard';
import BandiNavbar from './BandiNavbar';

const AltriEnti: React.FC = () => {
  const [selectedEnte, setSelectedEnte] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra solo i bandi di altri enti (ID che inizia con ALT-)
  const bandiAltriEnti = useMemo(() => {
    return (bandiData as Bando[]).filter(bando => bando.id.startsWith('ALT-'));
  }, []);

  // Estrai gli enti erogatori unici
  const enti = useMemo(() => {
    const entiSet = new Set(bandiAltriEnti.map(b => b.enteErogatore));
    return Array.from(entiSet).sort();
  }, [bandiAltriEnti]);

  // Identifica il tipo di ente
  const getTipoEnte = (enteErogatore: string): string => {
    if (enteErogatore.includes('CCIAA') || enteErogatore.includes('Camera di Commercio')) return 'Camera di Commercio';
    if (enteErogatore.includes('Fondazione') || enteErogatore.includes('Fondimpresa')) return 'Fondazione';
    if (enteErogatore.includes('INAIL')) return 'INAIL';
    return 'Altro';
  };

  // Filtra i bandi
  const bandiFiltrati = useMemo(() => {
    return bandiAltriEnti.filter(bando => {
      const matchEnte = selectedEnte ? bando.enteErogatore === selectedEnte : true;
      const matchSearch = searchQuery 
        ? bando.titolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bando.sintesi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bando.enteErogatore.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchEnte && matchSearch;
    });
  }, [bandiAltriEnti, selectedEnte, searchQuery]);

  // Statistiche
  const stats = useMemo(() => {
    const totaleBandi = bandiFiltrati.length;
    const importoTotale = bandiFiltrati.reduce((sum, b) => sum + b.importoMassimo, 0);
    const intensitaMedia = bandiFiltrati.length > 0 
      ? bandiFiltrati.reduce((sum, b) => sum + b.intensitaAiuto, 0) / bandiFiltrati.length 
      : 0;

    // Conta per tipo di ente
    const conteggioPerTipo = bandiFiltrati.reduce((acc, bando) => {
      const tipo = getTipoEnte(bando.enteErogatore);
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totaleBandi, importoTotale, intensitaMedia, conteggioPerTipo };
  }, [bandiFiltrati]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <BandiNavbar />
      <div className="pt-16">
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Altri Enti</h1>
          <p className="text-orange-100 text-lg">
            {bandiAltriEnti.length} bandi da Camere di Commercio, Fondazioni e altri enti
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8">
        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {stats.totaleBandi}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Bandi Disponibili
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.importoTotale > 0 
                ? `€${(stats.importoTotale / 1000).toFixed(0)}K` 
                : 'Variabile'}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Importo Totale
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {stats.intensitaMedia > 0 ? `${stats.intensitaMedia.toFixed(0)}%` : 'Variabile'}
            </div>
            <div className="text-slate-600 text-sm uppercase tracking-wide">
              Copertura Media
            </div>
          </div>
        </div>

        {/* Conteggio per tipo di ente */}
        {Object.keys(stats.conteggioPerTipo).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Bandi per tipo di ente</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.conteggioPerTipo).map(([tipo, count]) => (
                <div key={tipo} className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                  <span className="text-orange-900 font-medium">{tipo}</span>
                  <span className="ml-2 text-orange-600 font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">ℹ️ Bandi di Enti Locali e Fondazioni</h3>
          <ul className="text-orange-800 text-sm space-y-1">
            <li><strong>Camere di Commercio</strong> - Voucher e incentivi per digitalizzazione, internazionalizzazione, formazione</li>
            <li><strong>Fondazioni</strong> - Sostegno a formazione continua, ricerca, progetti culturali e sociali</li>
            <li><strong>INAIL</strong> - Incentivi per salute e sicurezza sul lavoro</li>
            <li><strong>Altri</strong> - Bandi di enti settoriali e organizzazioni specializzate</li>
          </ul>
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
                placeholder="Cerca nel titolo o descrizione..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
            </div>

            {/* Filtro per ente */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ente Erogatore
              </label>
              <select
                value={selectedEnte}
                onChange={(e) => setSelectedEnte(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              >
                <option value="">Tutti gli enti</option>
                {enti.map(ente => (
                  <option key={ente} value={ente}>
                    {ente}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset filtri */}
          {(selectedEnte || searchQuery) && (
            <button
              onClick={() => {
                setSelectedEnte('');
                setSearchQuery('');
              }}
              className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium"
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
    </div>
  );
};

export default AltriEnti;
