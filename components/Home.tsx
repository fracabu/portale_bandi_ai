/// <reference types="react" />
import React from 'react';
import { Link } from 'react-router-dom';
import bandiData from '../bandi.json';
import { Bando } from '../types';

const Home: React.FC = () => {
  const bandi = bandiData as Bando[];
  
  // Conta i bandi per categoria
  const bandiRegionali = bandi.filter(b => b.id.startsWith('REG-')).length;
  const bandiNazionali = bandi.filter(b => b.id.startsWith('NAZ-')).length;
  const bandiUE = bandi.filter(b => b.id.startsWith('UE-')).length;
  const bandiFondiStrutturali = bandi.filter(b => b.id.startsWith('FS-')).length;
  const bandiAltri = bandi.filter(b => b.id.startsWith('ALT-')).length;

  const categories = [
    {
      title: 'Bandi Regionali',
      count: bandiRegionali,
      description: 'Opportunità specifiche per le regioni italiane',
      icon: '🗺️',
      color: 'from-green-500 to-emerald-600',
      link: '/bandi-regionali'
    },
    {
      title: 'Bandi Nazionali',
      count: bandiNazionali,
      description: 'Finanziamenti validi su tutto il territorio nazionale',
      icon: '🏴',
      color: 'from-purple-500 to-indigo-600',
      link: '/bandi-nazionali'
    },
    {
      title: 'Bandi UE',
      count: bandiUE,
      description: 'Programmi europei per innovazione e ricerca',
      icon: '🇪🇺',
      color: 'from-blue-500 to-cyan-600',
      link: '/bandi-ue'
    },
    {
      title: 'Fondi Strutturali',
      count: bandiFondiStrutturali,
      description: 'FSE+ e FESR per sviluppo territoriale',
      icon: '💼',
      color: 'from-orange-500 to-amber-600',
      link: '/fondi-strutturali'
    },
    {
      title: 'Altri Enti',
      count: bandiAltri,
      description: 'CCIAA, Fondazioni e altri soggetti',
      icon: '🏛️',
      color: 'from-pink-500 to-rose-600',
      link: '/altri-enti'
    }
  ];

  const totalImporto = bandi.reduce((sum, b) => sum + b.importoMassimo, 0);
  const totalBandi = bandi.length;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Portale Bandi <span className="text-yellow-300">AI</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Trova i finanziamenti giusti per il tuo progetto.<br />
              Semplice, veloce, completo.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">{totalBandi}</div>
                <div className="text-sm text-blue-200 mt-1">Bandi Disponibili</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">
                  €{(totalImporto / 1000000000).toFixed(1)}B
                </div>
                <div className="text-sm text-blue-200 mt-1">Risorse Totali</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">5</div>
                <div className="text-sm text-blue-200 mt-1">Categorie</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Esplora per Categoria
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Seleziona la categoria di bandi che ti interessa per visualizzare tutte le opportunità disponibili
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => (
              <Link
                key={category.link}
                to={category.link}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative p-6">
                  {/* Icon */}
                  <div className="text-5xl mb-4">{category.icon}</div>
                  
                  {/* Title and Count */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    {category.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold`}>
                    {category.count} bandi disponibili
                  </div>
                  
                  {/* Arrow */}
                  <div className="absolute top-6 right-6 text-slate-400 group-hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Database Link */}
          <div className="text-center">
            <Link
              to="/database"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl font-semibold text-lg hover:from-slate-800 hover:to-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Visualizza Database Completo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Portale Bandi AI - Tutti i dati sono forniti a scopo informativo
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
