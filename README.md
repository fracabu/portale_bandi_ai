# 🎯 Portale Bandi AI<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

> Portale intelligente per la ricerca e consultazione di bandi, finanziamenti e opportunità per imprese, startup e organizzazioni italiane.</div>



## 📋 Descrizione# Run and deploy your AI Studio app



**Portale Bandi AI** è un'applicazione web moderna che centralizza e organizza informazioni su bandi pubblici e privati disponibili in Italia. Il portale facilita la ricerca di opportunità di finanziamento per PMI, startup, università e altri enti attraverso un'interfaccia intuitiva e dati strutturati.This contains everything you need to run your app locally.



## ✨ Caratteristiche PrincipaliView your app in AI Studio: https://ai.studio/apps/drive/1jAIeCBTavTlc7rxXGRtyszYREl7jlnIc



- 📊 **Database Completo**: Oltre 60 bandi categorizzati per tipologia, area geografica e beneficiari## Run Locally

- 🔍 **Ricerca Avanzata**: Sistema di filtri per trovare rapidamente i bandi più rilevanti

- 🎨 **Interfaccia Moderna**: Design responsive e user-friendly con Tailwind CSS**Prerequisites:**  Node.js

- 🤖 **AI-Powered**: Integrazione con Google Gemini per analisi intelligente dei bandi

- 📱 **Mobile-First**: Ottimizzato per tutti i dispositivi

- ⚡ **Performance**: Build ottimizzato con Vite per caricamenti velocissimi1. Install dependencies:

   `npm install`

## 🗂️ Tipologie di Bandi2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:

Il portale include bandi per:   `npm run dev`


- **Tecnologia e Innovazione**: Digitalizzazione, Industria 4.0, R&S
- **Sviluppo d'Impresa**: Startup, PMI, investimenti strategici
- **Ambiente ed Energia**: Rinnovabili, efficienza energetica, economia circolare
- **Sociale e Inclusione**: Formazione, occupazione, inclusione
- **Ricerca**: Progetti universitari e centri di ricerca

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (configurazione custom)
- **AI Integration**: Google Gemini API
- **Voice Assistant**: Vapi.ai
- **Routing**: React Router DOM

## 🚀 Installazione e Avvio

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Setup

```bash
# Clona il repository
git clone https://github.com/fracabu/portale_bandi_ai.git

# Entra nella directory
cd portale_bandi_ai

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 📦 Build per Produzione

```bash
# Crea build ottimizzato
npm run build

# Preview del build
npm run preview
```

## 🌐 Deploy

Il progetto è configurato per il deploy automatico su **Vercel**. Ogni push sul branch `main` attiva automaticamente un nuovo deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fracabu/portale_bandi_ai)

## 📊 Struttura Dati

Ogni bando contiene:

```typescript
{
  id: string;
  titolo: string;
  enteErogatore: string;
  areaGeografica: string;
  categoriaTematica: string;
  tipologiaIntervento: string;
  targetBeneficiari: string[];
  sintesi: string;
  dettagli: {
    aChiERivolto: string;
    cosaFinanzia: string;
    quantoFinanzia: string;
    comePartecipare: string;
  };
  intensitaAiuto: number;
  importoMassimo: number;
  dataApertura: string;
  dataScadenza: string;
  linkUfficiale: string;
  complessita: "Bassa" | "Media" | "Alta";
}
```

## 🎯 Roadmap

- [ ] Aggiungere notifiche per scadenze bandi
- [ ] Sistema di preferiti e salvataggio ricerche
- [ ] Dashboard personalizzata per utenti registrati
- [ ] Export dei bandi in PDF
- [ ] Integrazione calendario per deadline
- [ ] Sistema di raccomandazione AI-powered

## 🤝 Contribuire

Le contribuzioni sono benvenute! Per favore:

1. Fai fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 👨‍💻 Autore

**Francesco Capurso**
- GitHub: [@fracabu](https://github.com/fracabu)

## 🙏 Ringraziamenti

- Dati sui bandi raccolti da fonti pubbliche ufficiali
- Design ispirato alle best practices di UX per piattaforme governative
- Community open source per gli strumenti utilizzati

---

⭐ Se questo progetto ti è utile, lascia una stella su GitHub!
