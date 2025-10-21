"use client";
import React, { useRef, useState } from "react";

const VoiceRecognition: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      setTranscript(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      alert("Error: " + event.error);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <button onClick={startListening} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">Start Voice</button>
      <button onClick={stopListening} className="px-4 py-2 bg-gray-400 text-white rounded">Stop</button>
      <div className="mt-4 text-lg">Transcript: <span className="font-mono">{transcript}</span></div>
    </div>
  );
};

export default VoiceRecognition;
