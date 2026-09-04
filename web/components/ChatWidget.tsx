"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, MessageCircle, ExternalLink, User, Mic, Volume2, VolumeX } from "lucide-react";
import { findAnswer } from "@/lib/chat-knowledge";
import { siteConfig } from "@/lib/site-config";
import { OPEN_CHAT_EVENT } from "@/lib/chat-events";
import {
  speak,
  stopSpeaking,
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
} from "@/lib/voice";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  offerWhatsApp?: boolean;
};

function whatsappLink(question?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  const text = question
    ? `${siteConfig.whatsappFallbackMessage} "${question}"`
    : "Hi TechWokx! I'd like to talk to someone about AI for my website.";
  return `${base}?text=${encodeURIComponent(text)}`;
}

const GREETING: Message = {
  id: "greeting",
  from: "bot",
  text: "👋 Hi! I'm the TechWokx AI Assistant. Ask me about pricing, industries, how the scan works, or anything else — and if I don't know, I'll get you straight to our team on WhatsApp. Or you can scan your website right now to see your existing readiness score.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreetedRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowTeaser(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const openHandler = () => {
      setOpen(true);
      setShowTeaser(false);
    };
    window.addEventListener(OPEN_CHAT_EVENT, openHandler);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openHandler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Voice welcome — speaks the greeting once, the first time the panel opens.
  useEffect(() => {
    if (open && voiceEnabled && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      speak(GREETING.text);
    }
    if (!open) stopSpeaking();
  }, [open, voiceEnabled]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const sendMessage = (question: string) => {
    if (!question.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), from: "user", text: question.trim() };
    const answer = findAnswer(question);

    const botMsg: Message = answer
      ? { id: crypto.randomUUID(), from: "bot", text: answer }
      : {
          id: crypto.randomUUID(),
          from: "bot",
          text: "I don't have a confident answer for that yet. Let's get you to a real person on WhatsApp — they can help right away.",
          offerWhatsApp: true,
        };

    setMessages((m) => [...m, userMsg, botMsg]);
    if (voiceEnabled) speak(botMsg.text);
    setInput("");
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleVoice = () => {
    setVoiceEnabled((v) => {
      if (v) stopSpeaking();
      return !v;
    });
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setListening(false);
        sendMessage(transcript);
      },
      () => setListening(false)
    );
    if (!recognizer) return;
    recognitionRef.current = recognizer;
    setListening(true);
    stopSpeaking();
    recognizer.start();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {!open && showTeaser && (
        <div className="card-dark relative max-w-[220px] rounded-2xl border-violet/30 bg-navy-800 p-3.5 text-sm text-white/90 shadow-glow">
          <button
            aria-label="Dismiss"
            onClick={() => setShowTeaser(false)}
            className="focus-ring absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-600 text-mist hover:text-white"
          >
            <X size={12} />
          </button>
          👋 Questions about AI for your website? Ask me anything.
        </div>
      )}

      {open && (
        <div className="card-dark flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border-violet/30 bg-navy-800 shadow-glow">
          <div className="flex items-center justify-between border-b border-white/10 bg-navy-700 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient">
                <Bot size={18} className="text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">TechWokx AI Assistant</p>
                <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                </p>
              </div>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-md p-1.5 text-mist hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 bg-navy-800 px-4 py-1.5">
            <span className="text-[11px] text-mist">
              {listening ? "Listening…" : "Voice replies"}
            </span>
            <button
              onClick={toggleVoice}
              aria-label={voiceEnabled ? "Turn off voice replies" : "Turn on voice replies"}
              className="focus-ring flex items-center gap-1 rounded-md px-1.5 py-1 text-mist hover:text-white"
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[85%] gap-2 ${m.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      m.from === "user" ? "bg-navy-600" : "bg-brand-gradient"
                    }`}
                  >
                    {m.from === "user" ? (
                      <User size={12} className="text-white/80" />
                    ) : (
                      <Bot size={12} className="text-white" />
                    )}
                  </span>
                  <div>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.from === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-navy-700 text-white/90"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.offerWhatsApp && (
                      <a
                        href={whatsappLink(
                          messages[messages.findIndex((msg) => msg.id === m.id) - 1]?.text
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25"
                      >
                        <MessageCircle size={13} />
                        Continue on WhatsApp
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? "Listening…" : "Ask me anything..."}
              className="focus-ring w-full min-w-0 rounded-lg border border-white/10 bg-navy-700 px-3 py-2.5 text-sm text-white placeholder:text-mist"
            />
            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? "Stop voice input" : "Ask by voice"}
                className={`focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${
                  listening
                    ? "border-rose-400/50 bg-rose-500/15 text-rose-300"
                    : "border-white/10 text-mist hover:text-white"
                }`}
              >
                <Mic size={16} className={listening ? "animate-pulse" : ""} />
              </button>
            )}
            <button
              type="submit"
              aria-label="Send"
              className="btn-gradient focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            >
              <Send size={16} />
            </button>
          </form>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring flex items-center justify-center gap-1.5 border-t border-white/10 py-2.5 text-xs font-medium text-mist hover:text-emerald-300"
          >
            <MessageCircle size={13} />
            Prefer to talk to a human? Chat on WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={() => {
          setOpen((v) => !v);
          setShowTeaser(false);
        }}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="btn-gradient focus-ring relative flex h-14 w-14 items-center justify-center rounded-full shadow-glow"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-violet opacity-30" />
        )}
        {open ? <X size={22} /> : <Bot size={24} />}
      </button>
    </div>
  );
}
