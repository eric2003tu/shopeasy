"use client";
import React, { useRef, useState } from "react";
import { IoMdSearch } from 'react-icons/io';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface VoiceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const VoiceSearchBar: React.FC<VoiceSearchBarProps> = ({ value, onChange, placeholder }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    setListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      onChange(spoken);
      setListening(false);
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      alert("Error: " + event.error);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="flex flex-row items-center w-64">
      <input
        type="text"
        placeholder={placeholder || "Search users..."}
        value={value}
        onChange={handleInputChange}
        className="w-full px-3 py-2 rounded-l text-gray-700 focus:outline-none border border-gray-500"
        aria-label="Search users"
      />
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className={`px-3 py-2 bg-gray-200 text-[#634bc1] ${listening ? 'bg-blue-100' : ''} rounded-l focus:outline-none`}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
      >
        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <span className="px-2 py-2 text-gray-400"><IoMdSearch size={20} /></span>
    </div>
  );
};

export default VoiceSearchBar;
