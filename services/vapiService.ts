import Vapi from '@vapi-ai/web';
import type { Bando } from '../types';

export interface VapiCallbacks {
  onCallStart: () => void;
  onCallEnd: () => void;
  onError: (error: any) => void;
  onMessage: (message: any) => void;
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
}

export interface VapiSession {
  stop: () => void;
}

/**
 * Start a VAPI voice session with access to bandi data
 */
export async function startVapiSession(
  callbacks: VapiCallbacks,
  bandi: Bando[]
): Promise<VapiSession> {
  const vapiApiKey = process.env.VAPI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!vapiApiKey) {
    throw new Error('VAPI_API_KEY non configurata. Aggiungi VAPI_API_KEY in .env.local');
  }

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY non configurata. Aggiungi GEMINI_API_KEY in .env.local');
  }

  const vapi = new Vapi(vapiApiKey);

  // Prepare bandi summary for context
  const bandiContext = bandi.map((b, idx) => ({
    id: b.id,
    numero: idx + 1,
    titolo: b.titolo,
    ente: b.enteErogatore,
    area: b.areaGeografica,
    categoria: b.categoriaTematica,
    tipo: b.tipologiaIntervento,
    target: b.targetBeneficiari.join(', '),
    importoMassimo: b.importoMassimo,
    intensitaAiuto: b.intensitaAiuto,
    scadenza: b.dataScadenza,
    complessita: b.complessita,
    sintesi: b.sintesi,
    link: b.linkUfficiale
  }));

  // Prepare system instruction with all bandi data
  const systemInstruction = `Sei Ginevra, un'assistente vocale specializzata in bandi e finanziamenti pubblici italiani.
Sei amichevole, competente e aiuti gli utenti a trovare i bandi più adatti alle loro esigenze.

HAI ACCESSO A ${bandi.length} BANDI AGGIORNATI:
${JSON.stringify(bandiContext, null, 2)}

COME COMPORTARTI:
✓ Risposte BREVI e NATURALI (2-4 frasi max per risposta)
✓ Quando chiesto UN bando specifico: fornisci titolo, ente, importo massimo, scadenza e breve sintesi
✓ Quando chiesto ELENCO/RIEPILOGO: elenca 3-4 bandi rilevanti con titolo e scadenza, poi chiedi se vuole sentirne altri o approfondire
✓ Quando chiesto FILTRO (per regione/categoria/tipo): filtra i bandi e presenta solo quelli pertinenti
✓ DIALOGO NATURALE: rispondi a domande di approfondimento, fai domande chiarificatrici se l'utente non è specifico
✓ Se l'utente chiede "tutti i bandi" o "quanti bandi ci sono": rispondi con il numero totale e chiedi per quale categoria/area è interessato

ESEMPI:
User: "Quali bandi ci sono per startup?"
Tu: "Ho trovato [X] bandi per startup. I principali sono: [elenco 3 bandi con titolo e scadenza]. Vuoi che ti dia più dettagli su uno di questi?"

User: "Parlami del bando Smart & Start"
Tu: "Smart & Start è un bando di [ente] per [target]. Finanzia fino a [importo] euro. La scadenza è [data]. [Breve sintesi]. Vuoi sapere come partecipare?"

REGOLE IMPORTANTI:
- Rispondi SEMPRE in italiano
- NON inventare dati non presenti nelle informazioni che hai
- Se non trovi un bando specifico, dillo chiaramente e proponi alternative simili
- Sii concisa: massimo 3-4 frasi per risposta, poi chiedi se vuole approfondire
- Usa un tono amichevole ma professionale`;

  // Configure assistant with inline config (not using Assistant ID)
  const assistantConfig = {
    name: 'Ginevra - Assistente Bandi',
    model: {
      provider: 'openai',
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemInstruction
        }
      ]
    },
    voice: {
      provider: '11labs',
      voiceId: 'Letizia' // Italian voice "Letizia" from ElevenLabs
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'it'
    },
    firstMessage: 'Ciao! Sono Ginevra, la tua assistente per i bandi. Come posso aiutarti oggi?',
    endCallMessage: 'Grazie per avermi consultato. Buona giornata!',
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600
  };

  // Event listeners
  vapi.on('call-start', () => {
    console.log('VAPI call started');
    callbacks.onCallStart();
  });

  vapi.on('call-end', () => {
    console.log('VAPI call ended');
    callbacks.onCallEnd();
  });

  vapi.on('error', (error) => {
    console.error('VAPI error:', error);
    callbacks.onError(error);
  });

  vapi.on('message', (message) => {
    console.log('VAPI message:', message);
    callbacks.onMessage(message);
  });

  vapi.on('speech-start', () => {
    console.log('User speech started');
    callbacks.onSpeechStart();
  });

  vapi.on('speech-end', () => {
    console.log('User speech ended');
    callbacks.onSpeechEnd();
  });

  // Start the call using assistant ID from VAPI dashboard
  // To update the system prompt with bandi data, copy the prompt from console logs to VAPI dashboard
  try {
    await vapi.start('55a8f4aa-8eb4-47ec-bdd7-747bf519bdca');
    console.log('VAPI session started successfully with assistant ID');

    // Log the system prompt that should be configured in VAPI dashboard
    console.log('\n=== COPY THIS SYSTEM PROMPT TO VAPI DASHBOARD ===\n');
    console.log(systemInstruction);
    console.log('\n=== END OF SYSTEM PROMPT ===\n');
  } catch (error) {
    console.error('Failed to start VAPI session:', error);
    throw error;
  }

  return {
    stop: () => {
      vapi.stop();
      console.log('VAPI session stopped');
    }
  };
}
