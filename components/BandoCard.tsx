// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React, { useState } from 'react';
import { Bando } from '../types';

interface BandoCardProps {
  bando: Bando;
}

const InfoPill: React.FC<{ icon: JSX.Element; text: string; className?: string }> = ({ icon, text, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${className}`}>
    {icon}
    {text}
  </span>
);

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-slate-700 mb-1">{title}</h4>
    <p className="text-slate-600 leading-relaxed">{children}</p>
  </div>
);

const BandoCard: React.FC<BandoCardProps> = ({ bando }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const complexityColors = {
    Bassa: 'bg-green-100 text-green-800',
    Media: 'bg-yellow-100 text-yellow-800',
    Alta: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-blue-700 mb-1">{bando.titolo}</h2>
            <p className="text-sm font-medium text-slate-500">{bando.enteErogatore}</p>
          </div>
          <InfoPill 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            text={`Complessità: ${bando.complessita}`}
            className={complexityColors[bando.complessita]}
          />
        </div>

        <p className="text-slate-600 mt-4">{bando.sintesi}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6c0 1.887.646 3.65 1.745 4.999l.11.147a.5.5 0 01-.707.707l-.11-.147A7 7 0 1117 8a7 7 0 01-7 7z" /><path d="M8 8a2 2 0 114 0 2 2 0 01-4 0z" /></svg>} text={bando.areaGeografica} className="bg-slate-100 text-slate-700" />
          <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 4a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1V7zm2 2a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} text={bando.tipologiaIntervento} className="bg-blue-100 text-blue-800" />
          <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} text={bando.targetBeneficiari.join(', ')} className="bg-indigo-100 text-indigo-800" />
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
            <DetailSection title="A chi è rivolto">{bando.dettagli.aChiERivolto}</DetailSection>
            <DetailSection title="Cosa finanzia">{bando.dettagli.cosaFinanzia}</DetailSection>
            <DetailSection title="Quanto finanzia">{bando.dettagli.quantoFinanzia}</DetailSection>
            <DetailSection title="Come partecipare">{bando.dettagli.comePartecipare}</DetailSection>
          </div>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-sm text-slate-600">
           <div><strong>Scadenza:</strong> {new Date(bando.dataScadenza).toLocaleDateString('it-IT')}</div>
        </div>
        <div className="flex items-center gap-2">
            <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
            {isExpanded ? 'Mostra meno' : 'Mostra dettagli'}
            </button>
            <a href={bando.linkUfficiale} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition shadow">
            Fonte Ufficiale
            </a>
        </div>
      </div>
    </div>
  );
};

export default BandoCard;