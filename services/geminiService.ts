import { GoogleGenAI, Type, Modality, LiveServerMessage } from '@google/genai';
import type { Bando, GroundingChunk } from '../types';

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const CACHE_KEY = 'portale_bandi_cache';
const CACHE_TIMESTAMP_KEY = 'portale_bandi_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ore in millisecondi

/**
 * Fetches real grants data using Google Search and Gemini AI, with localStorage caching.
 */
export async function fetchAndParseBandiData(): Promise<Bando[]> {
  // Check cache first
  const cachedData = getCachedBandi();
  if (cachedData) {
    console.log('Using cached bandi data');
    return cachedData;
  }

  console.log('Fetching fresh bandi data from web...');

  const model = 'gemini-2.5-flash';

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "Un ID univoco per il bando, genera un uuid." },
        titolo: { type: Type.STRING },
        enteErogatore: { type: Type.STRING },
        areaGeografica: { type: Type.STRING },
        categoriaTematica: { type: Type.STRING, description: "La categoria principale del bando (es. 'Tecnologia e Innovazione', 'Cultura', etc.)" },
        tipologiaIntervento: { type: Type.STRING, description: "Il tipo di aiuto (es. 'Contributo a fondo perduto', 'Credito d'imposta')" },
        targetBeneficiari: { type: Type.ARRAY, items: { type: Type.STRING } },
        sintesi: { type: Type.STRING, description: "Breve riassunto del bando di 1-2 frasi." },
        dettagli: {
          type: Type.OBJECT,
          properties: {
            aChiERivolto: { type: Type.STRING },
            cosaFinanzia: { type: Type.STRING },
            quantoFinanzia: { type: Type.STRING },
            comePartecipare: { type: Type.STRING, description: "Fornisci una breve descrizione su come partecipare e menziona il link se presente." },
          },
          required: ["aChiERivolto", "cosaFinanzia", "quantoFinanzia", "comePartecipare"]
        },
        intensitaAiuto: { type: Type.NUMBER, description: "Intensità dell'aiuto in percentuale (es. 50 per 50%). Se non specificato, stima un valore ragionevole." },
        importoMassimo: { type: Type.NUMBER, description: "Importo massimo del finanziamento in euro. Se non specificato, stima un valore ragionevole." },
        dataApertura: { type: Type.STRING, description: "Data di apertura in formato ISO YYYY-MM-DD. Se non specificata, usa la data odierna." },
        dataScadenza: { type: Type.STRING, description: "Data di scadenza in formato ISO YYYY-MM-DD." },
        linkUfficiale: { type: Type.STRING },
        complessita: { type: Type.STRING, description: "Livello di complessità burocratica, può essere 'Bassa', 'Media' o 'Alta'." }
      },
      required: ["id", "titolo", "enteErogatore", "areaGeografica", "categoriaTematica", "tipologiaIntervento", "targetBeneficiari", "sintesi", "dettagli", "intensitaAiuto", "importoMassimo", "dataApertura", "dataScadenza", "linkUfficiale", "complessita"]
    }
  };

  try {
    // Step 1: Search for real bandi using Google Search
    const searchQuery = `Cerca bandi e finanziamenti pubblici italiani attivi nel 2024-2025.
    Trova almeno 15-20 bandi diversi per regioni italiane, PMI, startup, ricerca e sviluppo, innovazione, cultura, sociale.
    Includi bandi nazionali e regionali (Lombardia, Lazio, Veneto, Emilia-Romagna, Piemonte, Campania, Sicilia).
    Per ogni bando trovato, fornisci: titolo, ente erogatore, descrizione dettagliata, beneficiari, importi, scadenze, link ufficiale.
    Formatta le informazioni in modo chiaro e strutturato.`;

    const searchResponse = await ai.models.generateContent({
      model: model,
      contents: searchQuery,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const searchResults = searchResponse.text;
    console.log('Search results obtained, now parsing...');

    // Step 2: Parse the search results into structured JSON
    const parsePrompt = `Analizza il seguente testo contenente informazioni su bandi italiani e estrai i dati in formato JSON strutturato.
    Assicurati di compilare tutti i campi in modo accurato.
    Per 'dataApertura', se non specificata, usa la data odierna (2025-11-07).
    Per 'id', genera un ID univoco sequenziale.
    Se non trovi abbastanza informazioni per compilare tutti i campi, fai del tuo meglio per stimare valori ragionevoli.

    Testo dei bandi:
    ${searchResults}

    Restituisci SOLO un array JSON valido, senza altre spiegazioni.`;

    const parseResponse = await ai.models.generateContent({
      model: model,
      contents: parsePrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonText = parseResponse.text.trim();
    const parsedBandi = JSON.parse(jsonText);

    if (Array.isArray(parsedBandi) && parsedBandi.length > 0) {
      // Save to localStorage cache
      saveBandiToCache(parsedBandi);
      console.log(`Successfully fetched ${parsedBandi.length} bandi from web`);
      return parsedBandi as Bando[];
    }

    console.error("Parsed data is not a valid array:", parsedBandi);
    throw new Error("Nessun bando trovato");
  } catch (e) {
    console.error("Failed to fetch or parse bandi data from Gemini:", e);
    throw new Error("Impossibile recuperare i bandi. Verifica la connessione e la chiave API.");
  }
}

/**
 * Get cached bandi from localStorage if not expired
 */
function getCachedBandi(): Bando[] | null {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!cachedData || !timestamp) {
      return null;
    }

    const cacheAge = Date.now() - parseInt(timestamp);
    if (cacheAge > CACHE_DURATION) {
      console.log('Cache expired, will fetch fresh data');
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }

    return JSON.parse(cachedData) as Bando[];
  } catch (e) {
    console.error('Error reading cache:', e);
    return null;
  }
}

/**
 * Save bandi to localStorage cache
 */
function saveBandiToCache(bandi: Bando[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(bandi));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('Bandi saved to cache');
  } catch (e) {
    console.error('Error saving to cache:', e);
  }
}

/**
 * Clear the bandi cache (useful for forcing a refresh)
 */
export function clearBandiCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('Cache cleared');
}

/**
 * Uses Gemini with Google Search grounding to answer a user's query.
 */
export async function generateWithGoogleSearch(query: string): Promise<{ text: string; sources: GroundingChunk[] }> {
    const model = 'gemini-2.5-flash';

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Rispondi in italiano alla seguente domanda: "${query}"`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { text, sources: sources as GroundingChunk[] };
    } catch(e) {
        console.error("Error with Google Search grounding:", e);
        throw new Error("Errore durante la ricerca con AI. Riprova.");
    }
}


// --- Live Assistant Service ---

export interface LiveSession {
  close: () => void;
}

interface LiveSessionCallbacks {
  onOpen: () => void;
  onClose: () => void;
  onError: (error: ErrorEvent) => void;
  onTranscription: (turn: { speaker: 'user' | 'model', text: string }) => void;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createPcmBlob(data: Float32Array): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

class AudioQueue {
  private audioContext: AudioContext;
  private sampleRate: number;
  private nextStartTime: number = 0;

  constructor(audioContext: AudioContext, sampleRate: number = 24000) {
    this.audioContext = audioContext;
    this.sampleRate = sampleRate;
  }

  async enqueue(base64Data: string) {
    try {
      const pcmData = decode(base64Data);
      const int16Array = new Int16Array(pcmData.buffer);
      const float32Array = new Float32Array(int16Array.length);

      // Convert Int16 to Float32
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Array);

      // Calculate when to start this chunk
      const currentTime = this.audioContext.currentTime;
      const startTime = Math.max(currentTime, this.nextStartTime);

      // Play the audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(startTime);

      // Update next start time
      const duration = audioBuffer.duration;
      this.nextStartTime = startTime + duration;

      console.log(`Queued audio chunk: start=${startTime.toFixed(3)}s, duration=${duration.toFixed(3)}s`);
    } catch (e) {
      console.error('Error queuing audio:', e);
    }
  }

  reset() {
    this.nextStartTime = this.audioContext.currentTime;
  }
}

export async function startLiveSession(callbacks: LiveSessionCallbacks, bandi?: Bando[]): Promise<LiveSession> {
    let currentInputTranscription = '';
    let currentOutputTranscription = '';
    let audioStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let outputAudioContext: AudioContext | null = null;
    let audioQueue: AudioQueue | null = null;

    // Prepare system instruction with bandi data
    let systemInstruction = 'Sei un assistente AI specializzato in bandi e finanziamenti. Rispondi in italiano. Sii conciso e amichevole.';

    if (bandi && bandi.length > 0) {
        // Create detailed summary with all bandi data
        const bandiSummary = bandi.map((b, idx) => `
${idx + 1}. ${b.titolo}
   - Ente: ${b.enteErogatore}
   - Area: ${b.areaGeografica}
   - Categoria: ${b.categoriaTematica}
   - Tipo: ${b.tipologiaIntervento}
   - Target: ${b.targetBeneficiari.join(', ')}
   - Importo max: €${b.importoMassimo.toLocaleString()}
   - Intensità aiuto: ${b.intensitaAiuto}%
   - Scadenza: ${b.dataScadenza}
   - Complessità: ${b.complessita}
   - Sintesi: ${b.sintesi}`).join('\n');

        systemInstruction = `Sei un assistente vocale specializzato in bandi e finanziamenti pubblici italiani.
Sei amichevole, competente e aiuti gli utenti a trovare i bandi più adatti alle loro esigenze.

HAI ACCESSO A ${bandi.length} BANDI:
${bandiSummary}

COME COMPORTARTI:
✓ Quando chiesto UN bando specifico: fornisci dettagli completi (titolo, ente, area, importo, scadenza, sintesi)
✓ Quando chiesto un RIEPILOGO: elenca brevemente i bandi rilevanti (max 3-4 alla volta, poi chiedi se vuole sentirne altri)
✓ Quando chiesto FILTRO per categoria/area/tipo: filtra e presenta solo i bandi pertinenti
✓ Dialogo NATURALE: rispondi alle domande di approfondimento, fai domande chiarificatrici se necessario
✓ Risposte CONCISE ma COMPLETE: 2-4 frasi per domanda semplice, più dettagli se richiesto
✓ Se l'utente chiede "tutti i bandi": chiedi prima per quale categoria/area è interessato

ESEMPI DI INTERAZIONE:
User: "Parlami del bando per l'innovazione digitale"
Tu: "Il bando [nome] dell'ente [X] è per [target] in [area]. Finanzia fino a [importo] euro con scadenza il [data]. [Breve sintesi]. Vuoi sapere come partecipare?"

User: "Dammi un riepilogo dei bandi per PMI"
Tu: "Ho trovato X bandi per PMI. Te ne elenco alcuni: 1) [titolo breve], scadenza [data]... Vuoi che continui o preferisci approfondire uno di questi?"

User: "Filtra i bandi per la Lombardia"
Tu: "In Lombardia ci sono X bandi disponibili: [elenco breve con titoli e scadenze]. Su quale vuoi più informazioni?"

REGOLE:
- Rispondi SOLO in italiano
- NON inventare informazioni non presenti nei dati
- Se non sai qualcosa, dillo chiaramente`;

        console.log('System instruction length:', systemInstruction.length, 'chars');
    }

    console.log('Connecting to Gemini Live API...');

    const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
            onopen: async () => {
                callbacks.onOpen();
                try {
                    console.log('Requesting microphone access...');
                    audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            sampleRate: 16000
                        }
                    });
                    console.log('Microphone access granted, tracks:', audioStream.getAudioTracks());

                    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    console.log('Input audio context created, state:', audioContext.state);

                    // Create output audio context for playing responses
                    outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    console.log('Output audio context created, state:', outputAudioContext.state);

                    // Create audio queue for sequential playback
                    audioQueue = new AudioQueue(outputAudioContext, 24000);
                    console.log('Audio queue created');

                    // Resume audio contexts if suspended (required on some browsers)
                    if (audioContext.state === 'suspended') {
                        await audioContext.resume();
                        console.log('Input audio context resumed');
                    }
                    if (outputAudioContext.state === 'suspended') {
                        await outputAudioContext.resume();
                        console.log('Output audio context resumed');
                    }

                    source = audioContext.createMediaStreamSource(audioStream);
                    scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

                    let packetCount = 0;
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);

                        // Log first few packets to verify audio is being captured
                        if (packetCount < 3) {
                            const volume = Math.max(...Array.from(inputData).map(Math.abs));
                            console.log(`Audio packet ${packetCount}, volume level:`, volume);
                            packetCount++;
                        }

                        const pcmBlob = createPcmBlob(inputData);
                        sessionPromise.then((session) => {
                            // Check if session is still open before sending
                            try {
                                session.sendRealtimeInput({ media: pcmBlob });
                            } catch (e) {
                                // Silently ignore errors when session is closed
                            }
                        }).catch((e) => {
                            // Ignore errors when session is closing
                        });
                    };
                    source.connect(scriptProcessor);
                    // Connect to destination to keep the processor active
                    scriptProcessor.connect(audioContext.destination);

                    console.log('Microphone setup complete, ready to capture audio');

                } catch (err) {
                   console.error("Error setting up microphone:", err);
                   callbacks.onError(new ErrorEvent('mic_error', { message: "Microphone access denied or error." }));
                }
            },
            onclose: (e) => {
                console.log('WebSocket closed, event:', e);
                // Clean up audio resources
                if (scriptProcessor) {
                    scriptProcessor.disconnect();
                    scriptProcessor = null;
                }
                if (source) {
                    source.disconnect();
                    source = null;
                }
                if (audioContext) {
                    audioContext.close();
                    audioContext = null;
                }
                if (outputAudioContext) {
                    outputAudioContext.close();
                    outputAudioContext = null;
                }
                if (audioStream) {
                    audioStream.getTracks().forEach(track => track.stop());
                    audioStream = null;
                }
                callbacks.onClose();
            },
            onerror: (e) => {
                console.error('WebSocket error:', e);
                callbacks.onError(e);
            },
            onmessage: async (message: LiveServerMessage) => {
                console.log('Received message from server:', message);

                // Handle audio output
                if (message.serverContent?.modelTurn?.parts) {
                    for (const part of message.serverContent.modelTurn.parts) {
                        if (part.inlineData && part.inlineData.mimeType?.includes('audio') && part.inlineData.data) {
                            if (audioQueue) {
                                await audioQueue.enqueue(part.inlineData.data);
                            }
                        }
                    }
                }

                if (message.serverContent?.inputTranscription) {
                    currentInputTranscription += message.serverContent.inputTranscription.text;
                    console.log('User transcription:', message.serverContent.inputTranscription.text);
                } else if (message.serverContent?.outputTranscription) {
                    currentOutputTranscription += message.serverContent.outputTranscription.text;
                    console.log('Model transcription:', message.serverContent.outputTranscription.text);
                }

                if (message.serverContent?.turnComplete) {
                    console.log('Turn complete');
                    if (currentInputTranscription.trim()) {
                        callbacks.onTranscription({ speaker: 'user', text: currentInputTranscription.trim() });
                    }
                    if (currentOutputTranscription.trim()) {
                        callbacks.onTranscription({ speaker: 'model', text: currentOutputTranscription.trim() });
                    }
                    currentInputTranscription = '';
                    currentOutputTranscription = '';

                    // Reset audio queue for next turn
                    if (audioQueue) {
                        audioQueue.reset();
                    }
                }

                // Log setup complete messages
                if (message.setupComplete) {
                    console.log('Setup complete received');
                }
            },
        },
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: systemInstruction,
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: 'Puck' // Italian female voice
                    }
                }
            }
        },
    });

    const session = await sessionPromise;

    return {
        close: () => {
            // Clean up audio resources first
            if (scriptProcessor) {
                scriptProcessor.disconnect();
                scriptProcessor.onaudioprocess = null;
                scriptProcessor = null;
            }
            if (source) {
                source.disconnect();
                source = null;
            }
            if (audioContext) {
                audioContext.close();
                audioContext = null;
            }
            if (outputAudioContext) {
                outputAudioContext.close();
                outputAudioContext = null;
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
                audioStream = null;
            }
            // Then close the session
            session.close();
        },
    };
}
