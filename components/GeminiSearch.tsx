// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React, { useState } from 'react';
import { generateWithGoogleSearch } from '../services/geminiService';
import { GroundingChunk } from '../types';

const GeminiSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: GroundingChunk[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsModalOpen(true);

    try {
      const response = await generateWithGoogleSearch(query);
      setResult({
        text: response.text,
        sources: response.sources || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuery('');
    setResult(null);
    setError(null);
  }

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chiedi a Gemini (es. 'ultimi bandi export tech in Lombardia')"
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <header className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Risposta da Gemini AI</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <div className="p-6 overflow-y-auto">
              {isLoading && (
                 <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-600">Ricerca in corso...</p>
                 </div>
              )}
              {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
              {result && (
                <div className="prose max-w-none text-slate-700">
                  <p className="text-sm text-slate-500 italic mb-4">La risposta seguente è generata da AI con informazioni da Google Search e potrebbe non essere sempre accurata. Verifica sempre le fonti ufficiali.</p>
                  <div dangerouslySetInnerHTML={{ __html: result.text.replace(/\n/g, '<br />') }} />
                  {result.sources.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-800">Fonti:</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {result.sources.map((source, index) => (
                          source.web && source.web.uri && <li key={index}>
                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {source.web.title || source.web.uri}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiSearch;