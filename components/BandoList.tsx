// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React from 'react';
import { Bando } from '../types';
import BandoCard from './BandoCard';

interface BandoListProps {
  bandi: Bando[];
}

const BandoList: React.FC<BandoListProps> = ({ bandi }) => {
  if (bandi.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-800">Nessun bando trovato</h3>
        <p className="mt-1 text-sm text-slate-500">
          Prova a modificare i filtri di ricerca o a utilizzare una parola chiave diversa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bandi.map(bando => (
        <BandoCard key={bando.id} bando={bando} />
      ))}
    </div>
  );
};

export default BandoList;