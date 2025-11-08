// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Bando, Filters } from './types';
import { CATEGORIE_TEMATICHE, TIPOLOGIE_INTERVENTO, TARGET_BENEFICIARI, AREE_GEOGRAFICHE } from './constants';
import bandiData from './bandi.json';
import FilterSidebar from './components/FilterSidebar';
import BandoList from './components/BandoList';
import Header from './components/Header';
import LiveAssistant from './components/LiveAssistant';

const App: React.FC = () => {
  const [bandi, setBandi] = useState<Bando[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    categoria: '',
    tipologia: '',
    target: '',
    area: '',
    query: ''
  });

  useEffect(() => {
    // Load bandi from static JSON file
    const loadBandi = () => {
      try {
        setIsLoading(true);
        setError(null);
        // Cast imported JSON to Bando[] type
        setBandi(bandiData as Bando[]);
        console.log(`Loaded ${bandiData.length} bandi from static data`);
      } catch (err) {
        console.error("Failed to load bandi data:", err);
        setError("Impossibile caricare i dati dei bandi. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };
    loadBandi();
  }, []);

  const handleFilterChange = useCallback((filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  }, []);

  const handleRefresh = useCallback(() => {
    // Refresh from static data (no external fetch needed)
    setIsLoading(true);
    setError(null);
    try {
      setBandi(bandiData as Bando[]);
      console.log(`Refreshed ${bandiData.length} bandi from static data`);
    } catch (err) {
      console.error("Failed to reload bandi data:", err);
      setError("Impossibile ricaricare i dati dei bandi. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredBandi = useMemo(() => {
    return bandi.filter(bando => {
      const queryMatch = bando.titolo.toLowerCase().includes(filters.query.toLowerCase()) || bando.sintesi.toLowerCase().includes(filters.query.toLowerCase());
      const categoriaMatch = filters.categoria ? bando.categoriaTematica === filters.categoria : true;
      const tipologiaMatch = filters.tipologia ? bando.tipologiaIntervento === filters.tipologia : true;
      const targetMatch = filters.target ? bando.targetBeneficiari.includes(filters.target) : true;
      const areaMatch = filters.area ? bando.areaGeografica === filters.area : true;

      return queryMatch && categoriaMatch && tipologiaMatch && targetMatch && areaMatch;
    });
  }, [filters, bandi]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <h3 className="mt-2 text-lg font-medium text-slate-800">Analisi AI in corso...</h3>
            <p className="mt-1 text-sm text-slate-500">
              L'intelligenza artificiale sta estraendo e strutturando i bandi più recenti.
            </p>
          </div>
        </div>
      );
    }

    if (error) {
       return (
         <div className="text-center py-16 px-6 bg-red-50 text-red-700 rounded-lg shadow-md">
            <h3 className="mt-2 text-lg font-medium">Si è verificato un errore</h3>
            <p className="mt-1 text-sm">{error}</p>
         </div>
       );
    }
    
    return <BandoList bandi={filteredBandi} />;
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header onRefresh={handleRefresh} isRefreshing={isLoading} />
      <main className="container mx-auto p-4 lg:p-8">
        <div>
          {renderContent()}
        </div>
      </main>
      {/* <LiveAssistant bandi={bandi} /> */}
    </div>
  );
};

export default App;