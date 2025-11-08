/// <reference types="react" />
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BandiNav: React.FC = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: '🏠 Home', color: 'hover:bg-slate-100 text-slate-700' },
    { path: '/bandi-regionali', label: 'Regionali', color: 'hover:bg-green-50 text-green-700' },
    { path: '/bandi-nazionali', label: 'Nazionali', color: 'hover:bg-purple-50 text-purple-700' },
    { path: '/bandi-ue', label: 'UE', color: 'hover:bg-blue-50 text-blue-700' },
    { path: '/fondi-strutturali', label: 'Fondi Strutturali', color: 'hover:bg-orange-50 text-orange-700' },
    { path: '/altri-enti', label: 'Altri Enti', color: 'hover:bg-pink-50 text-pink-700' },
    { path: '/database', label: '💾 Database', color: 'hover:bg-slate-100 text-slate-700' }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto gap-1 py-3">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                ${location.pathname === link.path 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : `${link.color} bg-slate-50`
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BandiNav;
