"use client";
import React, { useEffect, useRef, useState } from 'react';

type VoiceInputProps = {
  language?: string;
  onResult: (text: string) => void;
  onError?: (err: string) => void;
  continuous?: boolean;
  interim?: boolean;
};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function VoiceInput({ language = 'en-US', onResult, onError, continuous = false, interim = false }: VoiceInputProps) {
  const recogRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.('SpeechRecognition API not supported in this browser');
      return;
    }
    const r = new SpeechRecognition();
    r.lang = language;
    r.continuous = continuous;
    r.interimResults = interim;

    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);

    r.onerror = (ev: any) => {
      const msg = ev?.error || 'unknown';
      onError?.(String(msg));
    };

    let finalTranscript = '';
    r.onresult = (ev: any) => {
      let interimTranscript = '';
      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const res = ev.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interimTranscript += res[0].transcript;
        }
      }
      setInterimText(interimTranscript);
      // If there are final results, deliver them
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
        finalTranscript = '';
      }
    };

    recogRef.current = r;
    return () => {
      try { r.stop(); } catch {}
      recogRef.current = null;
    };
  }, [language, continuous, interim, onError, onResult]);

  const start = () => {
    try {
      recogRef.current.lang = language;
      recogRef.current.start();
    } catch (e: any) {
      onError?.(String(e?.message || e));
    }
  };

  const stop = () => {
    try { recogRef.current?.stop(); } catch {}
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-pressed={listening}
        onClick={() => (listening ? stop() : start())}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${listening ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        <span className={`w-3 h-3 rounded-full ${listening ? 'bg-white animate-pulse' : 'bg-red-600'}`} />
        {listening ? 'Listening…' : 'Speak'}
      </button>
      <div className="text-sm text-muted-foreground">{interimText}</div>
    </div>
  );
}
