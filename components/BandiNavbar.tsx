/// <reference types="react" />
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BandiNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/bandi-regionali',
      label: 'Regionali',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'green'
    },
    {
      path: '/bandi-nazionali',
      label: 'Nazionali',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      color: 'purple'
    },
    {
      path: '/bandi-ue',
      label: 'UE',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      path: '/fondi-strutturali',
      label: 'Fondi Strutturali',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'orange'
    },
    {
      path: '/altri-enti',
      label: 'Altri Enti',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      green: isActive 
        ? 'bg-green-600 text-white border-green-700' 
        : 'text-green-700 border-green-200 hover:bg-green-50',
      purple: isActive 
        ? 'bg-purple-600 text-white border-purple-700' 
        : 'text-purple-700 border-purple-200 hover:bg-purple-50',
      blue: isActive 
        ? 'bg-blue-600 text-white border-blue-700' 
        : 'text-blue-700 border-blue-200 hover:bg-blue-50',
      orange: isActive 
        ? 'bg-orange-600 text-white border-orange-700' 
        : 'text-orange-700 border-orange-200 hover:bg-orange-50',
      teal: isActive 
        ? 'bg-teal-600 text-white border-teal-700' 
        : 'text-teal-700 border-teal-200 hover:bg-teal-50'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto py-3 gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-slate-700 border-slate-200 hover:bg-slate-50 transition whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Home</span>
          </Link>
          
          <div className="h-8 w-px bg-slate-300 mx-2"></div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition font-medium whitespace-nowrap ${getColorClasses(item.color, isActive)}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BandiNavbar;
