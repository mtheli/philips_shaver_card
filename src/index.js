import { PhilipsShaverCard } from "./philips_shaver_card.js";

customElements.define("philips-shaver-card", PhilipsShaverCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "philips-shaver-card",
  name: "Philips Shaver Card",
  description: "Custom card for the Philips Shaver integration with pressure gauge, battery, and diagnostics.",
  preview: true,
});

console.info(
  "%c PHILIPS-SHAVER-CARD %c v0.1.0 ",
  "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700",
  "color:#1c1c1c;background:#ffab40;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700",
);
