import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DatabaseView from './components/DatabaseView';
import BandiRegionali from './components/BandiRegionali';
import BandiNazionali from './components/BandiNazionali';
import BandiUE from './components/BandiUE';
import FondiStrutturali from './components/FondiStrutturali';
import AltriEnti from './components/AltriEnti';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/database" element={<DatabaseView />} />
        <Route path="/bandi-regionali" element={<BandiRegionali />} />
        <Route path="/bandi-nazionali" element={<BandiNazionali />} />
        <Route path="/bandi-ue" element={<BandiUE />} />
        <Route path="/fondi-strutturali" element={<FondiStrutturali />} />
        <Route path="/altri-enti" element={<AltriEnti />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
