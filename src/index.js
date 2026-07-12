import { PhilipsShaverCard, CARD_VERSION } from "./philips_shaver_card.js";
import { CARD_ORIGIN } from "./version.js";
import { t } from "./translations.js";

const TAG = "philips-shaver-card";
const BANNER_ID = "philips-shaver-card-outdated-banner";

// Custom elements can only be defined once, so when two copies of the card are
// loaded (bundled with the integration + leftover standalone install) the first
// one wins. If an outdated copy won, this bundled copy patches the winner so
// every rendered card shows a visible hint on top of the console warning and
// the integration's repair issue.
function markOutdatedCards(WinnerClass) {
  const inject = (card) => {
    const root = card.renderRoot ?? card.shadowRoot;
    if (!root || root.querySelector(`#${BANNER_ID}`)) return;
    const haCard = root.querySelector("ha-card");
    if (!haCard) return; // not rendered yet — retry on the next update
    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.style.cssText =
      "background:var(--warning-color,#ffa600);color:var(--text-primary-color,#fff);" +
      "padding:6px 12px;font-size:12px;line-height:1.3;font-weight:500;" +
      "border-radius:var(--ha-card-border-radius,12px) var(--ha-card-border-radius,12px) 0 0;";
    banner.textContent = `⚠️ ${t(card.hass ?? card._hass, "outdated_standalone_active")}`;
    haCard.prepend(banner);
  };

  const origUpdated = WinnerClass.prototype.updated;
  WinnerClass.prototype.updated = function (...args) {
    origUpdated?.apply(this, args);
    try {
      inject(this);
    } catch (e) {
      // Never break the (old) card over a hint.
    }
  };
}

const winner = customElements.get(TAG);
if (winner) {
  console.warn(
    `philips-shaver-card v${CARD_VERSION} [${CARD_ORIGIN}] was not loaded: ` +
      "another copy of the card is already registered. The card ships with the " +
      "Philips Shaver integration — if the standalone card is still installed " +
      "(HACS or manual resource), remove it to avoid running an outdated version.",
  );
  if (CARD_ORIGIN === "bundled" && winner.CARD_ORIGIN !== "bundled") {
    markOutdatedCards(winner);
  }
} else {
  // Marker for other copies to recognize which variant won the race.
  PhilipsShaverCard.CARD_VERSION = CARD_VERSION;
  PhilipsShaverCard.CARD_ORIGIN = CARD_ORIGIN;
  customElements.define(TAG, PhilipsShaverCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG,
    name: "Philips Shaver Card",
    description: "Custom card for the Philips Shaver integration with pressure gauge, battery, and diagnostics.",
    preview: true,
    // Card picker suggestion (HA 2026.6+): suggest this card for any
    // philips_shaver entity. The picked entity may sit on a sub-device
    // (e.g. Connection), so normalize to the device owning the battery
    // entity within the same config entry — same shape as getStubConfig.
    getEntitySuggestion: (hass, entityId) => {
      const entity = hass.entities?.[entityId];
      if (!entity || entity.platform !== "philips_shaver") return null;
      const devices = hass.devices || {};
      const entryIds = devices[entity.device_id]?.config_entries || [];
      const main = Object.values(hass.entities).find(
        (e) =>
          e.platform === "philips_shaver" &&
          e.translation_key === "battery" &&
          (e.device_id === entity.device_id ||
            (devices[e.device_id]?.config_entries || []).some((ce) =>
              entryIds.includes(ce),
            )),
      );
      const deviceId = (main ?? entity).device_id;
      // setConfig rejects a falsy device_id — better no suggestion than
      // one whose preview renders an error card.
      return deviceId ? { config: { type: `custom:${TAG}`, device_id: deviceId } } : null;
    },
  });

  console.info(
    `%c PHILIPS-SHAVER-CARD %c v${CARD_VERSION} [${CARD_ORIGIN}] `,
    "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700",
    "color:#1c1c1c;background:#ffab40;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700",
  );
}
