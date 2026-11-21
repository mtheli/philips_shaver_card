import en from './locales/en.json';
import de from './locales/de.json';

const LOCALES = { en, de };

// Static contexts (setConfig before hass is set, the config form callbacks)
// have no hass of their own; fall back to the one of the HA frontend.
function resolveLanguage(hass) {
  const h = hass || document.querySelector('home-assistant')?.hass;
  return h?.locale?.language || h?.language || 'en';
}

export function t(hass, key) {
  const locale = LOCALES[resolveLanguage(hass)] || LOCALES.en;
  return locale[key] || LOCALES.en[key] || key;
}
