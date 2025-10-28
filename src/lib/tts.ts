export function speak(text: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    // cancel any existing speech and speak
    try { window.speechSynthesis.cancel(); } catch {}
    window.speechSynthesis.speak(u);
  } catch (e) {
    // safe fallback
    // console.debug('[tts] speak error', e);
  }
}

export function stopSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try { window.speechSynthesis.cancel(); } catch {}
}

export default speak;
