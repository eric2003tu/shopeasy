"use client";
import React, { useRef, useState } from "react";
import { IoMdSearch } from 'react-icons/io';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface VoiceSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const VoiceSearchBar: React.FC<VoiceSearchBarProps> = ({ onSearch, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim() || transcript.trim());
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    setListening(true);
    setTranscript("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setTranscript(spoken);
      setSearchQuery(spoken);
      setListening(false);
      onSearch(spoken);
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <form onSubmit={handleSubmit} className="flex flex-row w-full items-center">
      <input
        type="text"
        placeholder={placeholder || "Search products by name, category, ..."}
        value={searchQuery}
        onChange={handleInputChange}
        className="w-full px-3 py-2 rounded-l text-gray-700 focus:outline-none border border-gray-500"
        aria-label="Search products"
      />
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className={`px-3 py-2 bg-gray-200 text-[#634bc1] ${listening ? 'bg-blue-100' : ''} rounded-l focus:outline-none`}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
      >
        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <button
        type="submit"
        className="bg-[#ffdc89] text-[#634bc1] px-4 py-2 rounded-r cursor-pointer hover:bg-[#e6c97d] transition"
        aria-label="Search"
      >
        <IoMdSearch size={20} />
      </button>
    </form>
  );
};

export default VoiceSearchBar;
