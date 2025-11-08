// FIX: A triple-slash directive is added to explicitly include React types, resolving errors related to missing JSX definitions.
/// <reference types="react" />
import React, { useState, useRef, useCallback } from 'react';
import { startVapiSession, VapiSession } from '../services/vapiService';
import type { Bando } from '../types';

type ConversationTurn = {
  speaker: 'user' | 'model';
  text: string;
};

interface LiveAssistantProps {
  bandi: Bando[];
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ bandi }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vapiSessionRef = useRef<VapiSession | null>(null);

  const handleSessionStart = async () => {
    setIsConnecting(true);
    setError(null);
    setConversation([]);

    try {
      const session = await startVapiSession({
        onCallStart: () => {
          console.log('VAPI call started');
          setIsConnecting(false);
          setIsSessionActive(true);
        },
        onCallEnd: () => {
          console.log('VAPI call ended');
          setIsSessionActive(false);
          setIsConnecting(false);
          setIsSpeaking(false);
        },
        onError: (err) => {
          console.error('VAPI error:', err);
          setError('Si è verificato un errore durante la sessione.');
          setIsSessionActive(false);
          setIsConnecting(false);
        },
        onMessage: (message) => {
          // Handle transcripts
          if (message.type === 'transcript' && message.transcript) {
            const text = message.transcript.text || message.transcriptType;
            if (message.role === 'user') {
              setConversation(prev => [...prev.slice(-9), { speaker: 'user', text }]);
            } else if (message.role === 'assistant') {
              setConversation(prev => [...prev.slice(-9), { speaker: 'model', text }]);
            }
          }
        },
        onSpeechStart: () => {
          setIsSpeaking(true);
        },
        onSpeechEnd: () => {
          setIsSpeaking(false);
        },
      }, bandi);

      vapiSessionRef.current = session;
    } catch (err) {
      console.error('Failed to start VAPI session:', err);
      setError('Impossibile avviare l\'assistente. Verifica la chiave API VAPI.');
      setIsConnecting(false);
    }
  };

  const handleSessionStop = () => {
    vapiSessionRef.current?.stop();
    vapiSessionRef.current = null;
    setIsSessionActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  const toggleAssistant = () => {
    if (isAssistantOpen && isSessionActive) {
      handleSessionStop();
    }
    setIsAssistantOpen(!isAssistantOpen);
  };

  const AssistantIcon: React.FC<{ active: boolean }> = ({ active }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-white transition-transform duration-300 ${active ? 'scale-110' : ''}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.9 2 10 2.9 10 4V7.08C7.61 7.57 6 9.57 6 12C6 14.43 7.61 16.43 10 16.92V20C10 21.1 10.9 22 12 22S14 21.1 14 20V16.92C16.39 16.43 18 14.43 18 12C18 9.57 16.39 7.57 14 7.08V4C14 2.9 13.1 2 12 2Z" />
    </svg>
  );

  return (
    <>
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 transition-transform"
        aria-label="Apri assistente vocale"
      >
        {isAssistantOpen ? (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <AssistantIcon active={isSessionActive} />
        )}
      </button>

      {isAssistantOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-lg shadow-2xl z-40 overflow-hidden border border-slate-200 flex flex-col h-[500px]">
          <header className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Assistente Vocale AI</h3>
                <p className="text-sm text-slate-500">
                  {isSpeaking ? 'Sto parlando...' : 'Parla per trovare il bando giusto'}
                  {bandi.length > 0 && <span className="ml-1 text-blue-600 font-medium">({bandi.length} bandi)</span>}
                </p>
              </div>
              {isSpeaking && (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              )}
            </div>
          </header>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {conversation.length === 0 && !isConnecting && !error && (
              <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                Premi il pulsante per iniziare.
              </div>
            )}
            {conversation.map((turn, index) => (
              <div key={index} className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 px-3 rounded-lg max-w-[80%] ${turn.speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {turn.text}
                </div>
              </div>
            ))}
          </div>

          <footer className="p-4 border-t border-slate-200 bg-slate-50">
            {error && <div className="text-sm text-red-600 text-center mb-2">{error}</div>}
            
            {!isSessionActive ? (
              <button
                onClick={handleSessionStart}
                disabled={isConnecting}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connessione...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    <span>Inizia a parlare</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSessionStop}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow flex items-center justify-center gap-2"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>Termina sessione</span>
              </button>
            )}
          </footer>
        </div>
      )}
    </>
  );
};

export default LiveAssistant;