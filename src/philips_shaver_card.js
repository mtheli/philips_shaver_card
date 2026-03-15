/**
 * Philips Shaver Card for Home Assistant
 * https://github.com/mtheli/philips_shaver_card
 */

import { LitElement, html, css, unsafeCSS, svg } from 'lit';
import styles from 'bundle-text:./philips_shaver_card.css';
import { t } from './translations.js';

export const CARD_VERSION = "0.4.1";

// ---------- Entity discovery map: translation_key → local alias ----------
const TRANSLATION_KEY_MAP = {
  battery: "battery",
  activity: "activity",
  device_state: "device_state",
  shaving_time: "shaving_time",
  head_remaining: "head_remaining",
  motor_rpm: "motor_rpm",
  motor_current: "motor_current",
  motor_current_max: "motor_current_max",
  pressure: "pressure",
  pressure_state: "pressure_state",
  days_last_used: "days_last_used",
  cleaning_cycles: "cleaning_cycles",
  total_age: "total_age",
  amount_of_charges: "amount_of_charges",
  amount_of_operational_turns: "amount_of_operational_turns",
  model_number: "model_number",
  firmware: "firmware",
  rssi: "rssi",
  last_seen: "last_seen",
  handle_load_type: "handle_load_type",
  motion_type: "motion_type",
  cleaning_progress: "cleaning_progress",
  cleaning_cycles_remaining: "cleaning_cycles_remaining",
  charging: "is_charging",
  travel_lock: "travel_lock",
  esp_bridge_alive: "esp_bridge_alive",
  shaver_ble_connected: "shaver_ble_connected",
  shaving_mode: "shaving_mode",
  lightring_brightness: "lightring_brightness",
  speed: "speed",
  speed_verdict: "speed_verdict",
};

// ---------- Gauge constants ----------
const GAUGE = {
  CX: 140, CY: 142, R: 108, STROKE: 22,
  PRESSURE_MAX: 6000,
  ZONE_BASE: 500 / 6000,
  ZONE_LOW: 1500 / 6000,
  ZONE_HIGH: 4000 / 6000,
  SPEED_MAX: 300,
  SPEED_ZONE_OPTIMAL: 150 / 300,
};
const GAUGE_W = 280;

// ---------- SVG arc helpers (semicircle, CW in SVG) ----------
function fracToXY(frac, r = GAUGE.R) {
  const deg = 180 + 180 * frac;
  const rad = (deg * Math.PI) / 180;
  return { x: GAUGE.CX + r * Math.cos(rad), y: GAUGE.CY + r * Math.sin(rad) };
}

function describeArc(f1, f2, r = GAUGE.R) {
  const range = 180;
  const spanDeg = (f2 - f1) * range;
  let ef1 = f1, ef2 = f2;
  if (f2 - f1 >= 0.999) { ef1 = 0.001; ef2 = 0.999; }
  const p1 = fracToXY(ef1, r), p2 = fracToXY(ef2, r);
  const large = spanDeg > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

// ---------- Mini ring arc helper (270° arc, gap at bottom, CW in SVG) ----------
const RING = { CX: 18, CY: 18, R: 14, SW: 3, START: 135, END: 405 };

function ringArc(frac) {
  const f = Math.max(0, Math.min(1, frac));
  const range = RING.END - RING.START;
  const startRad = (RING.START * Math.PI) / 180;
  const endRad = ((RING.START + range * f) * Math.PI) / 180;
  const x1 = RING.CX + RING.R * Math.cos(startRad);
  const y1 = RING.CY + RING.R * Math.sin(startRad);
  const x2 = RING.CX + RING.R * Math.cos(endRad);
  const y2 = RING.CY + RING.R * Math.sin(endRad);
  const large = (range * f > 180) ? 1 : 0;
  return `M ${x1} ${y1} A ${RING.R} ${RING.R} 0 ${large} 1 ${x2} ${y2}`;
}

function ringBgArc() {
  return ringArc(1);
}

// ---------- Formatting helpers ----------
function formatAge(s) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  return `${d}d ${h}h`;
}

function formatSession(s) {
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

const DISABLED_COLOR = "var(--disabled-text-color, #9e9e9e)";

function batteryColor(pct) {
  if (pct <= 0) return DISABLED_COLOR;
  if (pct > 50) return "#4caf50";
  if (pct > 20) return "#ff9800";
  return "#f44336";
}

function headColor(pct) {
  if (pct <= 0) return DISABLED_COLOR;
  if (pct > 30) return "#3f51b5";
  if (pct > 15) return "#ff9800";
  return "#f44336";
}

function cleaningColor(remaining) {
  if (remaining <= 0) return DISABLED_COLOR;
  if (remaining > 15) return "#00bcd4";
  if (remaining > 5) return "#ff9800";
  return "#f44336";
}

// ---------- SVG Icon paths ----------
const ICONS = {
  speed: 'M12 16a3 3 0 0 1-2.12-.88L4.93 10.2a8 8 0 1 1 14.14 0l-4.95 4.95A3 3 0 0 1 12 16zm0-12a6 6 0 0 0-4.24 10.24L12 18.49l4.24-4.25A6 6 0 0 0 12 4z',
  current: 'M7 2v11h3v9l7-12h-4l4-8z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  calendar: 'M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14z',
  clean: 'M16 11h-1V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v8H8a5 5 0 0 0-5 5v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5a5 5 0 0 0-5-5z',
  counter: 'M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h2v2H9V9zm0 4h6v2H9v-2zm4-4h2v2h-2V9z',
  signal: 'M12 6c3.33 0 6 2.67 6 6h2c0-4.42-3.58-8-8-8S4 7.58 4 12h2c0-3.33 2.67-6 6-6zm0 4c1.1 0 2 .9 2 2h2a4 4 0 0 0-8 0h2c0-1.1.9-2 2-2zm-1 4h2v2h-2z',
  firmware: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6z',
  lock: 'M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM9 8V6a3 3 0 0 1 6 0v2H9z',
  charge: 'M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.74 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z',
  bluetooth: 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z',
  lan_connect: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  lan_disconnect: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  razor: 'M20 8C19.45 8 19 7.55 19 7C19 6.45 19.45 6 20 6V5H4V6C4.55 6 5 6.45 5 7C5 7.55 4.55 8 4 8H2V15H4C4.55 15 5 15.45 5 16C5 16.55 4.55 17 4 17V18H20V17C19.45 17 19 16.55 19 16C19 15.45 19.45 15 20 15H22V8H20M20 12H19V13H17V12H13.41C13.2 12.58 12.65 13 12 13S10.8 12.58 10.59 12H7V13H5V12H4V11H5V10H7V11H10.59C10.8 10.42 11.35 10 12 10S13.2 10.42 13.41 11H17V10H19V11H20V12Z',
  droplet: 'M12 2c0 0-6 7.34-6 11a6 6 0 0 0 12 0c0-3.66-6-11-6-11zm0 15a3 3 0 0 1-3-3c0-.55.45-1 1-1s1 .45 1 1a1 1 0 0 0 1 1c.55 0 1 .45 1 1s-.45 1-1 1z',
  motor: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53A6.95 6.95 0 0 1 12 19z',
  charges: 'M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.74 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z',
};

const PRESSURE_COLORS = {
  no_contact: "var(--disabled-text-color, #9e9e9e)",
  too_low: "#42a5f5",
  optimal: "#4caf50",
  too_high: "#f44336",
};
const SPEED_COLORS = {
  none: "var(--disabled-text-color, #9e9e9e)",
  optimal: "#4caf50",
  too_fast: "#ff9800",
};

// ==========================================================
// CARD CLASS
// ==========================================================
export class PhilipsShaverCard extends LitElement {

  // ---------- Translation helper ----------
  _t(key) { return t(this._hass, key); }

  set hass(hass) {
    this._hass = hass;

    if ((!this._entities || !this._entities.battery) && this.config?.device_id) {
      this._entities = this._findEntities(hass, this.config.device_id);
    }

    // Timer management
    const activity = this._stateVal("activity", "off");
    if (activity === "shaving" && !this._timer) this._startTimer();
    else if (activity !== "shaving" && this._timer) this._stopTimer();

    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopTimer();
  }

  setConfig(config) {
    if (!config.device_id) {
      throw new Error(t(null, "config_select_device"));
    }
    this.config = config;
    this._entities = null;
    if (this._hass) {
      this._entities = this._findEntities(this._hass, config.device_id);
    }
  }

  getCardSize() {
    return 6;
  }

  // ---------- Entity discovery ----------
  _findEntities(hass, deviceId) {
    const allEntities = hass.entities || {};
    const devices = hass.devices || {};
    const found = {};

    const deviceIds = new Set([deviceId]);
    const mainDevice = devices[deviceId];
    if (mainDevice) {
      const configEntries = mainDevice.config_entries || [];
      for (const [id, dev] of Object.entries(devices)) {
        if (id === deviceId) continue;
        const devEntries = dev.config_entries || [];
        if (configEntries.some((ce) => devEntries.includes(ce))) {
          deviceIds.add(id);
        }
      }
    }

    for (const entityId in allEntities) {
      const entity = allEntities[entityId];
      if (!deviceIds.has(entity.device_id)) continue;

      const tKey = entity.translation_key;
      if (tKey && TRANSLATION_KEY_MAP[tKey]) {
        found[TRANSLATION_KEY_MAP[tKey]] = entity.entity_id;
      }

      const state = hass.states[entity.entity_id];
      if (!found.battery && state?.attributes?.device_class === "battery") {
        found.battery = entity.entity_id;
      }
    }

    return found;
  }

  // ---------- State helpers ----------
  _entity(key) {
    const id = this._entities?.[key];
    return id ? this._hass.states[id] : null;
  }

  _stateVal(key, fallback) {
    const e = this._entity(key);
    if (!e || e.state === "unavailable" || e.state === "unknown") return fallback !== undefined ? fallback : null;
    return e.state;
  }

  _numState(key, fallback = 0) {
    const v = this._stateVal(key);
    if (v === null) return fallback;
    const n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  // ---------- Timer ----------
  _startTimer() {
    if (this._timer) return;
    this._elapsed = this._numState("shaving_time", 0);
    this._timer = setInterval(() => {
      this._elapsed++;
      this.requestUpdate();
    }, 1000);
  }

  _stopTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  // ---------- More-info event ----------
  _fireMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }

  _navigateToDevice() {
    const deviceId = this.config?.device_id;
    if (!deviceId) return;
    const path = `/config/devices/device/${deviceId}`;
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  // ---------- SVG icon helper ----------
  _svgIcon(name) {
    return svg`<path d="${ICONS[name] || ''}"/>`;
  }

  // ---------- Main render ----------
  render() {
    const hass = this._hass;
    const config = this.config;

    if (!hass || !config || !this._entities) {
      if (hass && config?.device_id) {
        this._entities = this._findEntities(hass, config.device_id);
      }
      if (!this._entities) {
        return html`<ha-card><div class="unavailable">${this._t("config_no_device")}</div></ha-card>`;
      }
    }

    const activity = this._stateVal("activity", "off");

    return html`
      <ha-card>
        ${this._renderHeader()}
        ${this._renderChips()}
        <div class="visual-area">
          ${this._renderGauge(activity)}
        </div>
        <div class="divider"></div>
        ${this._renderStats(activity)}
      </ha-card>
    `;
  }

  // ---------- Header ----------
  _renderHeader() {
    const device = this._hass.devices?.[this.config.device_id];
    const model = device?.model || "";
    const name = this.config.title || this._t("default_title");
    const showModel = this.config.show_model !== false;

    const espEntity = this._entity("esp_bridge_alive");
    const espConnected = espEntity ? espEntity.state === "on" : false;
    const bleEntity = this._entity("shaver_ble_connected");
    const bleConnected = bleEntity ? bleEntity.state === "on" : false;

    return html`
      <div class="card-header">
        <div class="header-title" @click="${() => this._fireMoreInfo(this._entities?.activity)}">
          <h2>${name}</h2>
          ${showModel && model ? html`<span class="header-sub">${model}</span>` : ''}
        </div>
        <div class="header-icons">
          <svg class="conn-icon ${bleConnected ? '' : 'disconnected'}"
               viewBox="0 0 24 24"
               @click="${() => this._fireMoreInfo(this._entities?.shaver_ble_connected)}">
            <path d="${ICONS.bluetooth}"/>
          </svg>
          ${espEntity ? html`
          <svg class="conn-icon ${espConnected ? '' : 'disconnected'}"
               viewBox="0 0 24 24"
               @click="${() => this._fireMoreInfo(this._entities?.esp_bridge_alive)}">
            <path d="${espConnected ? ICONS.lan_connect : ICONS.lan_disconnect}"/>
          </svg>` : ''}
          <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
               @click="${() => this._navigateToDevice()}">
            <circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/>
          </svg>
        </div>
      </div>
    `;
  }

  // ---------- Chips row ----------
  _renderChips() {
    const bat = this._numState("battery", 0);
    const bc = batteryColor(bat);
    const head = this._numState("head_remaining", 0);
    const hc = headColor(head);
    const clean = this._numState("cleaning_cycles_remaining", 0);
    const cc = cleaningColor(clean);
    const activity = this._stateVal("activity", "off");

    const bg = ringBgArc();

    const tiles = [
      { key: "battery", label: this._t("chip_battery"), value: `${bat}%`, frac: bat / 100, color: bc, icon: activity === "charging" ? ICONS.charge : ICONS.charges, entity: this._entities?.battery },
      { key: "head", label: this._t("chip_head"), value: `${Math.round(head)}%`, frac: head / 100, color: hc, icon: ICONS.razor, entity: this._entities?.head_remaining },
    ];
    if (this._entities?.cleaning_cycles_remaining) {
      tiles.push({ key: "cleaning", label: this._t("chip_clean"), value: clean.toFixed(0), frac: clean / 30, color: cc, icon: ICONS.droplet, entity: this._entities.cleaning_cycles_remaining });
    }

    return html`
      <div class="chips-row">
        ${tiles.map(t => html`
          <div class="chip" @click="${() => this._fireMoreInfo(t.entity)}">
            <div class="chip-icon">
              <svg class="chip-ring-svg" viewBox="0 0 36 36">
                <path d="${bg}" fill="none" stroke="var(--ps-track)" stroke-width="${RING.SW}" stroke-linecap="round"/>
                <path d="${ringArc(t.frac)}" fill="none" stroke="${t.color}" stroke-width="${RING.SW}" stroke-linecap="round"/>
              </svg>
              <svg class="chip-ring-icon" viewBox="0 0 24 24" fill="${t.color}">
                <path d="${t.icon}"/>
              </svg>
            </div>
            <span class="chip-label">${t.label}</span>
            <span class="chip-value" style="color:${t.color}">${t.value}</span>
          </div>
        `)}
      </div>
    `;
  }

  // ---------- Device type ----------
  get _isOneBlade() {
    return !!this._entities?.speed;
  }

  // ---------- Gauge ----------
  _renderGauge(activity) {
    if (activity === "shaving") {
      return this._isOneBlade ? this._renderSpeedGauge() : this._renderPressureGauge();
    }
    if (activity === "cleaning") return this._renderCleaningGauge();
    if (activity === "charging") return this._renderChargingBattery();
    return this._renderBatteryGauge();
  }

  _renderPressureGauge() {
    const { CX: cx, CY: cy, R: r, STROKE: st, PRESSURE_MAX: max } = GAUGE;
    const pressure = this._numState("pressure", 0);
    const pState = this._stateVal("pressure_state", "no_contact");
    const elapsed = this._elapsed || this._numState("shaving_time", 0);
    const tm = Math.floor(elapsed / 60);
    const ts = elapsed % 60;
    const timerStr = String(tm).padStart(2, "0") + ":" + String(ts).padStart(2, "0");

    const needleFrac = Math.min(pressure / max, 0.99);
    const nc = PRESSURE_COLORS[pState] || PRESSURE_COLORS.no_contact;

    const { ZONE_BASE: base, ZONE_LOW: low, ZONE_HIGH: high } = GAUGE;

    const separators = [base, low, high].map(f => {
      const inner = fracToXY(f, r - 12);
      const outer = fracToXY(f, r + 12);
      return svg`<line x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}" class="zone-separator"/>`;
    });

    const tip = fracToXY(needleFrac, r - 16);

    return html`
      <div class="gauge-section">
        <svg class="gauge-svg" width="${GAUGE_W}" height="186" viewBox="0 0 ${GAUGE_W} 186">
          <!-- Track -->
          <path d="${describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="butt"/>
          <!-- Zones -->
          <path d="${describeArc(0, base)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="round" class="zone-arc"/>
          <path d="${describeArc(base, low)}" fill="none" stroke="#42a5f5" stroke-width="${st}" class="zone-arc" opacity="0.5"/>
          <path d="${describeArc(low, high)}" fill="none" stroke="#4caf50" stroke-width="${st}" class="zone-arc" opacity="0.65"/>
          <path d="${describeArc(high, 1)}" fill="none" stroke="#ff9800" stroke-width="${st}" stroke-linecap="round" class="zone-arc" opacity="0.5"/>
          <!-- Zone separators -->
          ${separators}
          <!-- Session timer -->
          <text x="${cx}" y="${cy - 48}" text-anchor="middle" font-size="10" fill="var(--ps-text-dimmest)" font-family="inherit" letter-spacing="1.5">${this._t("gauge_session")}</text>
          <text x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="38" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="'SF Mono','Menlo','Consolas',monospace" letter-spacing="1">${timerStr}</text>
          <!-- Needle -->
          <line x1="${cx}" y1="${cy + 10}" x2="${tip.x}" y2="${tip.y}" stroke="${nc}" stroke-width="6" class="needle-glow"/>
          <line x1="${cx}" y1="${cy + 10}" x2="${tip.x}" y2="${tip.y}" stroke="${nc}" stroke-width="3" class="needle-line"/>
          <!-- Hub -->
          <circle cx="${cx}" cy="${cy + 10}" r="8" fill="var(--ps-card-bg)" stroke="var(--ps-border)" stroke-width="2"/>
          <circle cx="${cx}" cy="${cy + 10}" r="4" fill="${nc}"/>
          <!-- Edge labels -->
          <text x="26" y="${cy + 28}" class="gauge-edge-label" text-anchor="start">${this._t("gauge_low")}</text>
          <text x="${GAUGE_W - 26}" y="${cy + 28}" class="gauge-edge-label" text-anchor="end">${this._t("gauge_high")}</text>
        </svg>
        <div class="pressure-label" style="color:${nc}">${this._t("pressure_" + pState) || "\u2014"}</div>
        <div class="pressure-value">${pressure > 0 ? pressure : "\u2014"}</div>
      </div>
    `;
  }

  _renderSpeedGauge() {
    const { CX: cx, CY: cy, R: r, STROKE: st, SPEED_MAX: max, SPEED_ZONE_OPTIMAL: zoneOpt } = GAUGE;
    const speed = this._numState("speed", 0);
    const sState = this._stateVal("speed_verdict", "none");
    const elapsed = this._elapsed || this._numState("shaving_time", 0);
    const tm = Math.floor(elapsed / 60);
    const ts = elapsed % 60;
    const timerStr = String(tm).padStart(2, "0") + ":" + String(ts).padStart(2, "0");

    const needleFrac = Math.min(speed / max, 0.99);
    const nc = SPEED_COLORS[sState] || SPEED_COLORS.none;

    const separator = (() => {
      const inner = fracToXY(zoneOpt, r - 12);
      const outer = fracToXY(zoneOpt, r + 12);
      return svg`<line x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}" class="zone-separator"/>`;
    })();

    const tip = fracToXY(needleFrac, r - 16);

    return html`
      <div class="gauge-section">
        <svg class="gauge-svg" width="${GAUGE_W}" height="186" viewBox="0 0 ${GAUGE_W} 186">
          <!-- Track -->
          <path d="${describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="butt"/>
          <!-- Zones -->
          <path d="${describeArc(0, zoneOpt)}" fill="none" stroke="#4caf50" stroke-width="${st}" stroke-linecap="round" class="zone-arc" opacity="0.65"/>
          <path d="${describeArc(zoneOpt, 1)}" fill="none" stroke="#ff9800" stroke-width="${st}" stroke-linecap="round" class="zone-arc" opacity="0.5"/>
          <!-- Zone separator -->
          ${separator}
          <!-- Session timer -->
          <text x="${cx}" y="${cy - 48}" text-anchor="middle" font-size="10" fill="var(--ps-text-dimmest)" font-family="inherit" letter-spacing="1.5">${this._t("gauge_session")}</text>
          <text x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="38" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="'SF Mono','Menlo','Consolas',monospace" letter-spacing="1">${timerStr}</text>
          <!-- Needle -->
          <line x1="${cx}" y1="${cy + 10}" x2="${tip.x}" y2="${tip.y}" stroke="${nc}" stroke-width="6" class="needle-glow"/>
          <line x1="${cx}" y1="${cy + 10}" x2="${tip.x}" y2="${tip.y}" stroke="${nc}" stroke-width="3" class="needle-line"/>
          <!-- Hub -->
          <circle cx="${cx}" cy="${cy + 10}" r="8" fill="var(--ps-card-bg)" stroke="var(--ps-border)" stroke-width="2"/>
          <circle cx="${cx}" cy="${cy + 10}" r="4" fill="${nc}"/>
          <!-- Edge labels -->
          <text x="26" y="${cy + 28}" class="gauge-edge-label" text-anchor="start">${this._t("gauge_slow")}</text>
          <text x="${GAUGE_W - 26}" y="${cy + 28}" class="gauge-edge-label" text-anchor="end">${this._t("gauge_fast")}</text>
        </svg>
        <div class="pressure-label" style="color:${nc}">${this._t("speed_" + sState) || "\u2014"}</div>
        <div class="pressure-value">${speed > 0 ? speed : "\u2014"}</div>
      </div>
    `;
  }

  _renderBatteryGauge() {
    const { CX: cx, CY: cy, STROKE: st } = GAUGE;
    const bat = this._numState("battery", 0);
    const bc = batteryColor(bat);

    return html`
      <div class="gauge-section">
        <svg class="gauge-svg" width="${GAUGE_W}" height="180" viewBox="0 0 ${GAUGE_W} 180">
          <path d="${describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="round"/>
          <path d="${describeArc(0, bat / 100)}" fill="none" stroke="${bc}" stroke-width="${st}" stroke-linecap="round"/>
          <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="52" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="inherit" letter-spacing="-2">${bat}%</text>
          <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="13" fill="var(--ps-text-dim)" font-family="inherit">${this._t("gauge_battery")}</text>
        </svg>
        <div class="gauge-status" style="color:var(--ps-text-dimmest)">${this._t("gauge_standby")}</div>
      </div>
    `;
  }

  _renderChargingBattery() {
    const bat = this._numState("battery", 0);
    const fillW = Math.round((bat / 100) * 174);

    const bubbles = [
      { size: 3, top: 20, left: 15, dur: 2.5, delay: 0 },
      { size: 5, top: 45, left: 30, dur: 3, delay: 0.8 },
      { size: 2, top: 65, left: 50, dur: 2.2, delay: 1.5 },
      { size: 4, top: 35, left: 10, dur: 3.5, delay: 2 },
      { size: 3, top: 55, left: 40, dur: 2.8, delay: 0.4 },
    ];

    return html`
      <div class="battery-wrap">
        <div class="battery-container">
          <div class="battery-cap"></div>
          <div class="battery-body">
            <div class="battery-liquid" style="width:${fillW}px">
              <div class="battery-wave-surface">
                <div class="battery-wave-inner">
                  <svg viewBox="0 0 14 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:14px;height:100%">
                    <path d="M7,0 Q0,12.5 7,25 Q14,37.5 7,50 Q0,62.5 7,75 Q14,87.5 7,100 Q0,112.5 7,125 Q14,137.5 7,150 Q0,162.5 7,175 Q14,187.5 7,200 L14,200 L14,0 Z" fill="#4caf50" opacity="0.75"/>
                  </svg>
                </div>
              </div>
              <div class="battery-bubbles">
                ${bubbles.map(b => html`
                  <div class="bubble" style="width:${b.size}px;height:${b.size}px;top:${b.top}%;left:${b.left}%;animation-duration:${b.dur}s;animation-delay:${b.delay}s"></div>
                `)}
              </div>
            </div>
            <div class="battery-bolt">
              <svg viewBox="0 0 24 24" fill="#4caf50">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" opacity="0.8"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="battery-pct">${bat}%</div>
        <div class="battery-sub">
          <span class="charge-dot"></span>
          <span class="charge-dot"></span>
          <span class="charge-dot"></span>
          <span style="margin-left:2px">${this._t("gauge_charging")}</span>
        </div>
      </div>
    `;
  }

  _renderCleaningGauge() {
    const progress = this._numState("cleaning_progress", 0);
    const frac = Math.max(0, Math.min(1, progress / 100));

    const cx = 80, cy = 80, r = 66, sw = 10;
    const START = 135, range = 270;

    const cleanRingArc = (f) => {
      const startRad = (START * Math.PI) / 180;
      const endRad = ((START + range * f) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad);
      const large = (range * f > 180) ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    };

    const droplets = [
      { size: 6, angle: 160, dur: 2, delay: 0 },
      { size: 8, angle: 220, dur: 2.5, delay: 0.5 },
      { size: 5, angle: 300, dur: 1.8, delay: 1.2 },
      { size: 7, angle: 370, dur: 2.2, delay: 1.8 },
      { size: 6, angle: 250, dur: 2.8, delay: 0.8 },
    ];

    return html`
      <div class="cleaning-wrap">
        <div class="cleaning-gauge-ring">
          <svg class="cleaning-ring-svg" viewBox="0 0 160 160">
            <path d="${cleanRingArc(1)}" fill="none" stroke="var(--ps-track)" stroke-width="${sw}" stroke-linecap="round"/>
            <path d="${cleanRingArc(frac)}" fill="none" stroke="#42a5f5" stroke-width="${sw}" stroke-linecap="round" class="cleaning-arc-fill"/>
          </svg>
          <div class="cleaning-center">
            <div class="cleaning-pct">${Math.round(progress)}%</div>
            <div class="cleaning-label">${this._t("gauge_cleaning")}</div>
          </div>
          <div class="cleaning-droplets">
            ${droplets.map(d => {
              const rad = (d.angle * Math.PI) / 180;
              const dx = cx + (r + 16) * Math.cos(rad);
              const dy = cy + (r + 16) * Math.sin(rad);
              return html`<div class="droplet" style="width:${d.size}px;height:${d.size}px;left:${dx - d.size/2}px;top:${dy - d.size/2}px;animation-duration:${d.dur}s;animation-delay:${d.delay}s"></div>`;
            })}
          </div>
        </div>
        <div class="cleaning-status">
          <div class="clean-spinner"></div>
          ${this._t("gauge_in_progress")}
        </div>
      </div>
    `;
  }

  // ---------- Stats ----------
  _renderStats(activity) {
    if (activity === "shaving") return this._renderShaveStats();

    let rows;
    if (activity === "charging") {
      rows = html`
        ${this._statRow("charges", this._t("stat_charge_cycles"), this._numState("amount_of_charges", 0))}
        ${this._statRow("clock", this._t("stat_last_session"), formatSession(this._numState("shaving_time", 0)))}
        ${this._statRow("counter", this._t("stat_total_uses"), this._numState("amount_of_operational_turns", 0))}
        ${this._statRow("clock", this._t("stat_total_time"), formatAge(this._numState("total_age", 0)))}
      `;
    } else if (activity === "cleaning") {
      const remaining = this._numState("cleaning_cycles_remaining", 0);
      rows = html`
        ${this._statRow("droplet", this._t("stat_cycles_remaining"), remaining.toFixed(1))}
        ${this._statRow("clock", this._t("stat_last_session"), formatSession(this._numState("shaving_time", 0)))}
        ${this._statRow("counter", this._t("stat_total_uses"), this._numState("amount_of_operational_turns", 0))}
      `;
    } else {
      const daysUsed = this._numState("days_last_used", null);
      let daysText;
      if (daysUsed === null) daysText = "\u2014";
      else if (daysUsed === 0) daysText = this._t("time_today");
      else if (daysUsed === 1) daysText = this._t("time_yesterday");
      else daysText = this._t("time_days_ago").replace("{n}", daysUsed);

      rows = html`
        ${this._statRow("clock", this._t("stat_last_session"), formatSession(this._numState("shaving_time", 0)))}
        ${this._statRow("calendar", this._t("stat_last_used"), daysText)}
        ${this._statRow("clock", this._t("stat_total_time"), formatAge(this._numState("total_age", 0)))}
        ${this._statRow("counter", this._t("stat_total_uses"), this._numState("amount_of_operational_turns", 0))}
      `;
    }

    return html`<div class="stats">${rows}</div>`;
  }

  _renderShaveStats() {
    const rpm = this._numState("motor_rpm", 0);
    const ma = this._numState("motor_current", 0);

    if (this._isOneBlade) {
      return html`
        <div class="shave-stats">
          <div class="shave-stat-tile">
            <div class="shave-stat-val">${ma}</div>
            <div class="shave-stat-label">${this._t("shave_ma")}</div>
          </div>
          <div class="shave-stat-tile">
            <div class="shave-stat-val">${this._numState("speed", 0)}</div>
            <div class="shave-stat-label">${this._t("shave_speed")}</div>
          </div>
        </div>
      `;
    }

    const motion = this._stateVal("motion_type", "no_motion");
    const motionText = motion === "no_motion" ? "\u2014" : this._t("motion_" + motion);
    return html`
      <div class="shave-stats">
        <div class="shave-stat-tile">
          <div class="shave-stat-val">${rpm}</div>
          <div class="shave-stat-label">${this._t("shave_rpm")}</div>
        </div>
        <div class="shave-stat-tile">
          <div class="shave-stat-val">${ma}</div>
          <div class="shave-stat-label">${this._t("shave_ma")}</div>
        </div>
        <div class="shave-stat-tile">
          <div class="shave-stat-val">${motionText}</div>
          <div class="shave-stat-label">${this._t("shave_motion")}</div>
        </div>
      </div>
    `;
  }

  _statRow(icon, label, value, unit) {
    return html`
      <div class="stat-row">
        <span class="stat-label">
          <svg class="stat-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="${ICONS[icon] || ''}"/>
          </svg>
          ${label}
        </span>
        <span class="stat-value">${value}${unit ? html`<span class="stat-unit">${unit}</span>` : ''}</span>
      </div>
    `;
  }

  // ---------- Styles ----------
  static get styles() {
    return unsafeCSS(styles);
  }

  // ---------- Config form ----------
  static getConfigForm() {
    return {
      schema: [
        {
          name: "title",
          label: t(null, "config_title"),
          selector: { text: {} },
        },
        {
          name: "show_model",
          label: t(null, "config_show_model"),
          selector: { boolean: {} },
          default: true,
        },
        {
          name: "device_id",
          required: true,
          selector: {
            device: {
              filter: [{ integration: "philips_shaver" }],
              entity: [{ domain: "sensor", device_class: "battery" }],
              multiple: false,
            },
          },
        },
      ],
    };
  }

  static getStubConfig(hass) {
    const entry = Object.values(hass.entities).find(
      (e) => e.platform === "philips_shaver" && e.translation_key === "battery"
    );
    return { device_id: entry ? entry.device_id : "" };
  }
}
