// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React from 'react';
import { Filters } from '../types';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterName: keyof Filters, value: string) => void;
  categorie: string[];
  tipologie: string[];
  target: string[];
  aree: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, categorie, tipologie, target, aree }) => {

  const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">{title}</h3>
      {children}
    </div>
  );

  const Select: React.FC<{ name: keyof Filters; options: string[]; value: string; label: string }> = ({ name, options, value, label }) => (
    <select
      name={name}
      id={name}
      value={value}
      onChange={(e) => onFilterChange(name, e.target.value)}
      className="w-full p-2 border border-slate-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    >
      <option value="">{label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
       <FilterGroup title="Ricerca Libera">
         <input
          type="text"
          placeholder="Cerca per parola chiave..."
          value={filters.query}
          onChange={(e) => onFilterChange('query', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </FilterGroup>

      <FilterGroup title="Categoria Tematica">
        <Select name="categoria" options={categorie} value={filters.categoria} label="Tutte le categorie" />
      </FilterGroup>

      <FilterGroup title="Tipologia Intervento">
        <Select name="tipologia" options={tipologie} value={filters.tipologia} label="Tutte le tipologie" />
      </FilterGroup>

      <FilterGroup title="Target Beneficiari">
        <Select name="target" options={target} value={filters.target} label="Tutti i target" />
      </FilterGroup>
      
      <FilterGroup title="Area Geografica">
        <Select name="area" options={aree} value={filters.area} label="Tutte le aree" />
      </FilterGroup>

    </div>
  );
};

export default FilterSidebar;