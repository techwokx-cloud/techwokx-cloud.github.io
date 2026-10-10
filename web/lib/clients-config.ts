export interface Client {
  id: string;
  name: string;
  logo?: string; // Path to logo image in /public/clients/
  url: string;
  description?: string;
}

export const clients: Client[] = [
  {
    id: "ai-chat-vault",
    name: "AI Chat Vault",
    logo: "/clients/ai-chat-vault.png",
    url: "https://ai-chat-vault-6whh.onrender.com",
    description: "Conversation archive & management platform",
  },
  {
    id: "chiefflow-ai",
    name: "ChiefFlow AI",
    logo: "/clients/chiefflow-ai.png",
    url: "https://chiefflow-ai.onrender.com",
    description: "AI Chief of Staff application",
  },
  {
    id: "sovereignguard",
    name: "SovereignGuard AI",
    logo: "/clients/sovereignguard.png",
    url: "#",
    description: "Trade compliance system",
  },
  {
    id: "bookforge",
    name: "BookForge AI",
    logo: "/clients/bookforge.png",
    url: "#",
    description: "Low-content book creation",
  },
  {
    id: "vitalitybridge",
    name: "VitalityBridge",
    logo: "/clients/vitalitybridge.png",
    url: "#",
    description: "Personal life support app",
  },
  {
    id: "zarakitchen",
    name: "Zara Kitchen",
    logo: "/clients/zarakitchen.png",
    url: "https://zarakitchengh.com",
    description: "Restaurant website",
  },
];
