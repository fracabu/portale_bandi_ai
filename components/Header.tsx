// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React from 'react';
import { Link } from 'react-router-dom';
import GeminiSearch from './GeminiSearch';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Portale Bandi <span className="text-blue-600">AI</span>
          </h1>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="ml-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Aggiorna bandi"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <div className="flex gap-2">
            <Link
              to="/bandi-regionali"
              className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-2 text-sm font-medium"
              title="Bandi Regionali"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Regionali
            </Link>
            <Link
              to="/bandi-nazionali"
              className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition flex items-center gap-2 text-sm font-medium"
              title="Bandi Nazionali"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Nazionali
            </Link>
            <Link
              to="/database"
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-2 text-sm font-medium"
              title="Visualizza database completo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Database
            </Link>
          </div>
        </div>
        <div className="w-full sm:w-auto sm:max-w-lg flex-grow">
          <GeminiSearch />
        </div>
      </div>
    </header>
  );
};

export default Header;