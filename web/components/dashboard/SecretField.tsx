"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SecretField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Not set"}
          className="w-full min-w-0 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide value" : "Show value"}
          className="focus-ring shrink-0 text-slate-400 hover:text-slate-600"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
