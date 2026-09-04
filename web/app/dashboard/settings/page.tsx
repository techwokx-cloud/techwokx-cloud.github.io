"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Plug,
  Mail,
  MessageCircle,
  Share2,
  Save,
  Check,
  AlertTriangle,
} from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import SecretField from "@/components/dashboard/SecretField";
import {
  getSettings,
  saveSettings,
  defaultSettings,
  type DashboardSettings,
} from "@/lib/dashboard-settings";

const modelOptions = [
  { value: "gemini-flash", label: "Gemini Flash" },
  { value: "claude", label: "Claude" },
  { value: "gpt", label: "GPT-5.6 Luna" },
  { value: "local", label: "Local / Self-hosted" },
];

const countryCodes = ["+233", "+234", "+254", "+27", "+44", "+1"];

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          <Icon size={18} className="text-violet-600" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-navy">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const set = <K extends keyof DashboardSettings>(key: K, value: DashboardSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <DashboardTopbar title="Settings" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <p>
            These settings currently save to this browser only (no backend
            yet) — they&apos;re a preview of the real settings UI. Real API
            keys and secrets will move to secure server-side storage on the
            VPS once that&apos;s live; don&apos;t rely on this for
            production credentials in the meantime.
          </p>
        </div>

        <Section
          icon={Sparkles}
          title="AI Models"
          description="Which models power the scanner, chat assistant, and content generation."
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Primary Model
            </label>
            <select
              value={settings.aiPrimaryModel}
              onChange={(e) => set("aiPrimaryModel", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              {modelOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Fallback Model
            </label>
            <select
              value={settings.aiFallbackModel}
              onChange={(e) => set("aiFallbackModel", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              {modelOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <SecretField
            label="Anthropic API Key"
            value={settings.anthropicApiKey}
            onChange={(v) => set("anthropicApiKey", v)}
            placeholder="sk-ant-..."
          />
          <SecretField
            label="OpenAI API Key"
            value={settings.openaiApiKey}
            onChange={(v) => set("openaiApiKey", v)}
            placeholder="sk-..."
          />
          <SecretField
            label="Google AI API Key"
            value={settings.googleApiKey}
            onChange={(v) => set("googleApiKey", v)}
            placeholder="AIza..."
          />
        </Section>

        <Section
          icon={Plug}
          title="Integrations & APIs"
          description="Third-party services the platform connects to."
        >
          <SecretField
            label="Buffer API Key"
            value={settings.bufferApiKey}
            onChange={(v) => set("bufferApiKey", v)}
            placeholder="Not connected"
          />
          <TextField
            label="Meta Pixel ID"
            value={settings.metaPixelId}
            onChange={(v) => set("metaPixelId", v)}
            placeholder="e.g. 440897446242409"
          />
        </Section>

        <Section
          icon={Mail}
          title="Email (SMTP)"
          description="Used to send scan reports and notifications."
        >
          <TextField
            label="SMTP Host"
            value={settings.smtpHost}
            onChange={(v) => set("smtpHost", v)}
            placeholder="smtp.yourprovider.com"
          />
          <TextField
            label="SMTP Port"
            value={settings.smtpPort}
            onChange={(v) => set("smtpPort", v)}
            placeholder="587"
          />
          <TextField
            label="SMTP Username"
            value={settings.smtpUsername}
            onChange={(v) => set("smtpUsername", v)}
            placeholder="hello@techwokx.com"
          />
          <SecretField
            label="SMTP Password"
            value={settings.smtpPassword}
            onChange={(v) => set("smtpPassword", v)}
          />
          <TextField
            label="From Name"
            value={settings.smtpFromName}
            onChange={(v) => set("smtpFromName", v)}
            placeholder="TechWokx"
          />
          <TextField
            label="From Email"
            value={settings.smtpFromEmail}
            onChange={(v) => set("smtpFromEmail", v)}
            placeholder="hello@techwokx.com"
            type="email"
          />
        </Section>

        <Section
          icon={MessageCircle}
          title="WhatsApp"
          description="Number the AI assistant hands off to when it can't answer a question."
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Country Code
            </label>
            <select
              value={settings.whatsappCountryCode}
              onChange={(e) => set("whatsappCountryCode", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              {countryCodes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <TextField
            label="WhatsApp Number"
            value={settings.whatsappNumber}
            onChange={(v) => set("whatsappNumber", v.replace(/[^\d]/g, ""))}
            placeholder="201234567"
          />
        </Section>

        <Section
          icon={Share2}
          title="Social URLs"
          description="Linked from the website footer."
        >
          <TextField
            label="Facebook"
            value={settings.socialFacebook}
            onChange={(v) => set("socialFacebook", v)}
            placeholder="https://facebook.com/techwokx"
          />
          <TextField
            label="Instagram"
            value={settings.socialInstagram}
            onChange={(v) => set("socialInstagram", v)}
            placeholder="https://instagram.com/techwokx"
          />
          <TextField
            label="X / Twitter"
            value={settings.socialTwitter}
            onChange={(v) => set("socialTwitter", v)}
            placeholder="https://x.com/techwokx"
          />
          <TextField
            label="LinkedIn"
            value={settings.socialLinkedIn}
            onChange={(v) => set("socialLinkedIn", v)}
            placeholder="https://linkedin.com/company/techwokx"
          />
          <TextField
            label="YouTube"
            value={settings.socialYouTube}
            onChange={(v) => set("socialYouTube", v)}
            placeholder="https://youtube.com/@techwokx"
          />
          <TextField
            label="TikTok"
            value={settings.socialTikTok}
            onChange={(v) => set("socialTikTok", v)}
            placeholder="https://tiktok.com/@techwokx"
          />
        </Section>

        <div className="flex items-center gap-3 pb-4">
          <button
            onClick={handleSave}
            className="btn-gradient focus-ring flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
          >
            <Save size={15} />
            Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check size={15} /> Saved to this browser
            </span>
          )}
        </div>
      </div>
    </>
  );
}
