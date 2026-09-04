export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    // Strip emoji/markdown-ish characters so they aren't read aloud awkwardly.
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
    if (!clean) return;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Fails silently — voice is an enhancement, not a requirement.
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechRecognitionSupported() {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
}

export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onEnd: () => void
) {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Recognition) return null;

  const recognition = new Recognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0]?.[0]?.transcript;
    if (transcript) onResult(transcript);
  };
  recognition.onerror = () => onEnd();
  recognition.onend = () => onEnd();

  return recognition;
}
