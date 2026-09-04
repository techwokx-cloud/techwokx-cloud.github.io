"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { openChatWidget } from "@/lib/chat-events";

const Mascot3D = dynamic(() => import("@/components/Mascot3D"), { ssr: false });

const SIZE = 220;
const MOVE_INTERVAL_MS = 6000;
const WAVE_INTERVAL_MS = 8000;

function randomPoint() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = SIZE + 20;
  // Keep clear of the top nav and the bottom-right chat button.
  const minY = 110;
  const maxY = Math.max(minY + 100, h - SIZE - 180);
  const maxX = Math.max(margin, w - margin - 140);
  return {
    x: margin + Math.random() * (maxX - margin),
    y: minY + Math.random() * (maxY - minY),
  };
}

export default function FloatingMascot() {
  const [pos, setPos] = useState({ x: 40, y: 140 });
  const [waving, setWaving] = useState(false);
  const [bumping, setBumping] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (!initialized.current) {
      initialized.current = true;
      setPos(randomPoint());
    }

    const moveTimer = setInterval(() => {
      setPos(randomPoint());
      setBumping(true);
      setTimeout(() => setBumping(false), 500);
    }, MOVE_INTERVAL_MS);

    const waveTimer = setInterval(() => {
      setWaving(true);
      setTimeout(() => setWaving(false), 1800);
    }, WAVE_INTERVAL_MS);

    return () => {
      clearInterval(moveTimer);
      clearInterval(waveTimer);
    };
  }, [reducedMotion]);

  const handleTouch = () => {
    setWaving(true);
    setGreeting(true);
    setTimeout(() => setWaving(false), 1800);
    setTimeout(() => setGreeting(false), 2800);
  };

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed z-40 hidden transition-all duration-[3200ms] ease-in-out lg:block"
      style={{ left: pos.x, top: pos.y }}
    >
      {greeting && (
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy-800 px-4 py-2 text-sm font-medium text-white shadow-glow">
          Need help with your website? 👋
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          handleTouch();
          openChatWidget();
        }}
        onMouseEnter={handleTouch}
        aria-label="Chat with the TechWokx AI assistant"
        className={`pointer-events-auto block cursor-pointer transition-transform duration-500 ${
          bumping ? "scale-90" : "scale-100"
        }`}
        style={{ width: SIZE, height: SIZE }}
      >
        <Mascot3D waving={waving} />
      </button>
    </div>
  );
}
