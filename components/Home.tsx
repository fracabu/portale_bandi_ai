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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 h-screen overflow-hidden flex flex-col">
      {/* Hero Section - Compatto */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
              Portale Bandi <span className="text-yellow-300">AI</span>
            </h1>
            <p className="text-lg text-blue-100 mb-4">
              Trova i finanziamenti giusti per il tuo progetto
            </p>
            
            {/* Stats Inline */}
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <span className="text-2xl font-bold text-yellow-300">{totalBandi}</span>
                <span className="text-blue-200 ml-1">Bandi</span>
              </div>
              <div className="border-l border-blue-400 pl-6">
                <span className="text-2xl font-bold text-yellow-300">
                  €{(totalImporto / 1000000000).toFixed(1)}B
                </span>
                <span className="text-blue-200 ml-1">Risorse</span>
              </div>
              <div className="border-l border-blue-400 pl-6">
                <span className="text-2xl font-bold text-yellow-300">5</span>
                <span className="text-blue-200 ml-1">Categorie</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Tutto visibile */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
          {/* Categories Grid - Compatto */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            {categories.map((category) => (
              <Link
                key={category.link}
                to={category.link}
                className="group relative bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-lg`}></div>
                
                <div className="relative text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    {category.title}
                  </h3>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-xs font-semibold`}>
                    {category.count} bandi
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Database Link */}
          <div className="text-center mt-auto pb-4">
            <Link
              to="/database"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg font-semibold hover:from-slate-800 hover:to-black transition-all shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Database Completo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Minimale */}
      <footer className="bg-slate-900 text-slate-400 py-3">
        <div className="container mx-auto px-4 text-center text-xs">
          © 2025 Portale Bandi AI
        </div>
      </footer>
    </div>
  );
};

export default Home;
