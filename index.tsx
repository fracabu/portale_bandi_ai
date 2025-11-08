import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import DatabaseView from './components/DatabaseView';
import BandiRegionali from './components/BandiRegionali';
import BandiNazionali from './components/BandiNazionali';
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
        <Route path="/" element={<App />} />
        <Route path="/database" element={<DatabaseView />} />
        <Route path="/bandi-regionali" element={<BandiRegionali />} />
        <Route path="/bandi-nazionali" element={<BandiNazionali />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
