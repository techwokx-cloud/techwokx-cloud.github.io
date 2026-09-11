const path = require("path");
const pino = require("pino");
const qrcodeTerminal = require("qrcode-terminal");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

const SESSION_DIR =
  process.env.WHATSAPP_SESSION_DIR ||
  path.join(__dirname, "..", "..", "data", "whatsapp-session");

const logger = pino({ level: "silent" }); // Baileys is very chatty at default levels

let sock = null;
let connectionStatus = "disconnected"; // disconnected | connecting | qr_pending | connected

async function connect() {
  connectionStatus = "connecting";
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    logger,
    browser: ["TechWokx", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionStatus = "qr_pending";
      console.log("\n[whatsapp] Scan this QR code with WhatsApp (Linked Devices):\n");
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === "close") {
      connectionStatus = "disconnected";
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      console.log(
        `[whatsapp] connection closed (code ${statusCode}). ${
          loggedOut ? "Logged out — will not auto-reconnect. Delete session and restart to re-pair." : "Reconnecting..."
        }`
      );
      if (!loggedOut) {
        setTimeout(connect, 3000);
      }
    } else if (connection === "open") {
      connectionStatus = "connected";
      console.log("[whatsapp] connected successfully.");
    }
  });
}

function isConfigured() {
  return Boolean(process.env.WHATSAPP_ENABLED === "true");
}

function getStatus() {
  return connectionStatus;
}

// Accepts a number as digits only (country code + number, no + or spaces),
// e.g. "233201234567" — matches the format already used elsewhere in this
// codebase for whatsapp_country_code + whatsapp_number.
async function sendWhatsAppMessage(toNumber, text) {
  if (!sock || connectionStatus !== "connected") {
    throw new Error("WhatsApp is not connected.");
  }
  const digits = toNumber.replace(/[^\d]/g, "");
  const jid = `${digits}@s.whatsapp.net`;
  await sock.sendMessage(jid, { text });
}

function startWhatsApp() {
  if (!isConfigured()) {
    console.log("[whatsapp] WHATSAPP_ENABLED is not 'true' — skipping WhatsApp connection.");
    return;
  }
  connect().catch((err) => {
    console.error("[whatsapp] failed to start:", err.message);
  });
}

module.exports = { startWhatsApp, sendWhatsAppMessage, getStatus, isConfigured };
