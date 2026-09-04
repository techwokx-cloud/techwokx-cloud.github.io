/**
 * TEMPORARY SITE CONFIG
 * ----------------------------------------------------------------
 * There's no real admin panel yet, so settings that should eventually
 * be editable from one live on the VPS backend instead. This file is
 * the single place to update them until then.
 */

export const siteConfig = {
  /** WhatsApp number the AI assistant hands off to when it can't answer
   *  a question. Include the country code, digits only (no +, spaces,
   *  or dashes) — this is the format wa.me links require.
   *  Example Ghana number shown in the footer: +233 20 123 4567 -> "233201234567"
   */
  whatsappNumber: "233201234567",

  /** Default message pre-filled when a visitor is handed off to WhatsApp. */
  whatsappFallbackMessage:
    "Hi TechWokx! I was chatting with your AI assistant and it couldn't answer my question:",

  /** Meta (Facebook/Instagram) Pixel ID for ad conversion tracking.
   *  Get this from Meta Events Manager (business.facebook.com/events_manager).
   *  Set to null to disable tracking entirely (no script loads).
   */
  metaPixelId: "440897446242409" as string | null,
};
