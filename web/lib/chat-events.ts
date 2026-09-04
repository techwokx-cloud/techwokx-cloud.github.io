export const OPEN_CHAT_EVENT = "techwokx:open-chat";

/** Call this from any client component to open the floating AI chat widget. */
export function openChatWidget() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
  }
}
