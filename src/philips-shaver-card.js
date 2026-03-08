/**
 * Philips Shaver Card for Home Assistant
 * https://github.com/mtheli/philips-shaver-card
 */

// ---------- Entity discovery map: translation_key → local alias ----------
const TRANSLATION_KEY_MAP = {
  // Sensors
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
  // Binary sensors
  charging: "is_charging",
  travel_lock: "travel_lock",
  // Selects
  shaving_mode: "shaving_mode",
  lightring_brightness: "lightring_brightness",
};

// ---------- Mode config ----------
const MODE_CONFIG = {
  sensitive: { label: "Sensitive", color: "#90caf9" },
  regular: { label: "Regular", color: "#a5d6a7" },
  normal: { label: "Normal", color: "#a5d6a7" },
  intense: { label: "Intense", color: "#ffab40" },
  custom: { label: "Custom", color: "#ce93d8" },
  foam: { label: "Foam", color: "#80deea" },
  battery_saving: { label: "Eco", color: "#a5d6a7" },
};

// ---------- Pressure gauge constants ----------
const GAUGE = {
  SIZE: 240,
  STROKE: 20,
  PRESSURE_MAX: 6000,
  ZONE_BASE: 500 / 6000,
  ZONE_LOW: 1500 / 6000,
  ZONE_HIGH: 4000 / 6000,
};
GAUGE.CX = GAUGE.SIZE / 2;
GAUGE.CY = GAUGE.SIZE / 2 + 10;
GAUGE.R = GAUGE.SIZE / 2 - GAUGE.STROKE / 2 - 8;

// ---------- SVG arc helpers ----------
function fracToAngle(f) {
  return Math.PI - f * Math.PI;
}

function arcX(f) {
  return GAUGE.CX + GAUGE.R * Math.cos(fracToAngle(f));
}

function arcY(f) {
  return GAUGE.CY - GAUGE.R * Math.sin(fracToAngle(f));
}

function describeArc(f1, f2) {
  const x1 = arcX(f1), y1 = arcY(f1);
  const x2 = arcX(f2), y2 = arcY(f2);
  const large = (f2 - f1) > 0.5 ? 1 : 0;
  return `M ${x1} ${y1} A ${GAUGE.R} ${GAUGE.R} 0 ${large} 0 ${x2} ${y2}`;
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

function batteryColor(pct) {
  if (pct > 50) return "#4caf50";
  if (pct > 20) return "#ff9800";
  return "#f44336";
}

function headColor(pct) {
  if (pct > 30) return "#4caf50";
  if (pct > 15) return "#ff9800";
  return "#f44336";
}

// ---------- SVG Icon paths ----------
const ICONS = {
  speed: '<path d="M12 16a3 3 0 0 1-2.12-.88L4.93 10.2a8 8 0 1 1 14.14 0l-4.95 4.95A3 3 0 0 1 12 16zm0-12a6 6 0 0 0-4.24 10.24L12 18.49l4.24-4.25A6 6 0 0 0 12 4z"/>',
  current: '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>',
  clock: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  calendar: '<path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14z"/>',
  clean: '<path d="M16 11h-1V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v8H8a5 5 0 0 0-5 5v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5a5 5 0 0 0-5-5z"/>',
  counter: '<path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h2v2H9V9zm0 4h6v2H9v-2zm4-4h2v2h-2V9z"/>',
  signal: '<path d="M12 6c3.33 0 6 2.67 6 6h2c0-4.42-3.58-8-8-8S4 7.58 4 12h2c0-3.33 2.67-6 6-6zm0 4c1.1 0 2 .9 2 2h2a4 4 0 0 0-8 0h2c0-1.1.9-2 2-2zm-1 4h2v2h-2z"/>',
  firmware: '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6z"/>',
  lock: '<path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM9 8V6a3 3 0 0 1 6 0v2H9z"/>',
  charge: '<path d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.74 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/>',
};

function svgIcon(name) {
  return `<svg class="stat-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">${ICONS[name] || ""}</svg>`;
}

// ---------- CSS ----------
function cardStyles() {
  return `
    :host {
      --ps-text-dim: rgba(255,255,255,0.5);
      --ps-text-dimmer: rgba(255,255,255,0.35);
      --ps-text-dimmest: rgba(255,255,255,0.25);
      --ps-border: rgba(255,255,255,0.04);
      --ps-track: rgba(255,255,255,0.06);
    }
    ha-card {
      overflow: hidden;
      font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
      color: var(--primary-text-color, #fff);
    }
    .header {
      padding: 14px 20px 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .status-dot.active {
      animation: pulse 2s infinite;
    }
    .device-name {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
    }
    .model-mode {
      font-size: 11px;
      color: var(--ps-text-dimmest);
      white-space: nowrap;
    }
    .battery-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .gauge-wrap {
      padding: 8px 0 4px;
      display: flex;
      justify-content: center;
    }
    .gauge-container {
      position: relative;
      width: ${GAUGE.SIZE}px;
    }
    .gauge-label {
      text-align: center;
      margin-top: -8px;
    }
    .gauge-state {
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
      transition: color 0.3s;
    }
    .gauge-sub {
      font-size: 11px;
      color: var(--ps-text-dimmest);
      margin-top: 3px;
    }
    .head-bar-wrap { padding: 0 20px; }
    .head-bar-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .head-bar-label { font-size: 11px; color: var(--ps-text-dim); }
    .head-bar-value { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); }
    .head-bar-track {
      height: 4px;
      background: var(--ps-track);
      border-radius: 2px;
      overflow: hidden;
    }
    .head-bar-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.5s;
    }
    .divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
      margin: 0 20px;
    }
    .spacer { height: 10px; }
    .stats { padding: 4px 20px 8px; }
    .stat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 0;
      border-bottom: 1px solid var(--ps-border);
    }
    .stat-row:last-child { border-bottom: none; }
    .stat-label {
      font-size: 13px;
      color: var(--ps-text-dim);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-icon { width: 16px; height: 16px; opacity: 0.55; }
    .stat-value {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      font-variant-numeric: tabular-nums;
    }
    .stat-unit {
      font-size: 11px;
      color: var(--ps-text-dimmer);
      margin-left: 2px;
      font-weight: 400;
    }
    .diag-header {
      padding: 10px 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
    .diag-label { font-size: 12px; color: var(--ps-text-dimmest); }
    .diag-chevron { transition: transform 0.25s; }
    .diag-chevron.open { transform: rotate(180deg); }
    .diag-content {
      padding: 0 20px 14px;
      animation: slideIn 0.2s ease;
    }
    .unavailable {
      padding: 20px;
      text-align: center;
      color: var(--ps-text-dim);
      font-size: 14px;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes chargeGlow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
}

// ==========================================================
// CARD CLASS
// ==========================================================
export class PhilipsShaverCard extends HTMLElement {

  // ---- Config form (HA visual editor) ----
  static getConfigForm() {
    return {
      schema: [
        {
          name: "device_id",
          required: true,
          selector: {
            device: {
              filter: { integration: "philips_shaver" },
              multiple: false,
            },
          },
        },
        {
          name: "title",
          label: "Title (optional — defaults to 'Philips Shaver')",
          selector: { text: {} },
        },
      ],
    };
  }

  static getStubConfig() {
    return { device_id: "" };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._entities = null;
    this._diagOpen = false;
    this._timer = null;
    this._elapsed = 0;
    this._lastActivity = null;
  }

  setConfig(config) {
    if (!config.device_id) {
      throw new Error("Please select a Philips Shaver device in the card configuration.");
    }
    this._config = config;
    this._entities = null; // Re-discover on next render
    if (this._hass) this._findEntities();
  }

  getCardSize() {
    return 6;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._entities) this._findEntities();
    this._render();
  }

  // ---------- Entity discovery via translation_key ----------
  _findEntities() {
    if (!this._hass || !this._config?.device_id) return;

    const allEntities = this._hass.entities || {};
    const deviceId = this._config.device_id;
    const found = {};

    for (const entityId in allEntities) {
      const entity = allEntities[entityId];
      if (entity.device_id !== deviceId) continue;

      const tKey = entity.translation_key;
      if (tKey && TRANSLATION_KEY_MAP[tKey]) {
        found[TRANSLATION_KEY_MAP[tKey]] = entity.entity_id;
      }

      // Fallback: battery via device_class
      const state = this._hass.states[entity.entity_id];
      if (!found.battery && state?.attributes?.device_class === "battery") {
        found.battery = entity.entity_id;
      }
    }

    this._entities = found;
  }

  // ---------- State helpers ----------
  _entity(key) {
    const id = this._entities?.[key];
    return id ? this._hass.states[id] : null;
  }

  _state(key, fallback) {
    const e = this._entity(key);
    if (!e || e.state === "unavailable" || e.state === "unknown") return fallback !== undefined ? fallback : null;
    return e.state;
  }

  _numState(key, fallback = 0) {
    const v = this._state(key);
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
      const timerEl = this.shadowRoot?.querySelector(".gauge-timer");
      if (timerEl) {
        const m = Math.floor(this._elapsed / 60);
        const s = this._elapsed % 60;
        timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      }
    }, 1000);
  }

  _stopTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  disconnectedCallback() {
    this._stopTimer();
  }

  // ---------- More-info event ----------
  _fireMoreInfo(entityId) {
    if (!entityId) return;
    const e = new Event("hass-more-info", { bubbles: true, composed: true });
    e.detail = { entityId };
    this.dispatchEvent(e);
  }

  // ---------- Main render ----------
  _render() {
    if (!this._hass || !this._config || !this._entities) return;

    const activity = this._state("activity", "off");
    const isShaving = activity === "shaving";

    // Timer management
    if (isShaving && !this._timer) this._startTimer();
    else if (!isShaving && this._timer) this._stopTimer();

    // Full re-render when activity mode changes or first render
    const needsFull = this._lastActivity !== activity || !this.shadowRoot.querySelector(".card-content");
    this._lastActivity = activity;

    if (needsFull) {
      const root = this.shadowRoot;
      root.innerHTML = "";

      const style = document.createElement("style");
      style.textContent = cardStyles();
      root.appendChild(style);

      const card = document.createElement("ha-card");
      card.innerHTML = `<div class="card-content">
        ${this._renderHeader()}
        ${this._renderGauge()}
        ${this._renderHeadBar()}
        <div class="spacer"></div>
        <div class="divider"></div>
        ${this._renderStats()}
        <div class="divider"></div>
        ${this._renderDiagnostics()}
      </div>`;
      root.appendChild(card);
      this._bind(card);
    } else {
      this._updateDynamic();
    }
  }

  // ---------- Event binding ----------
  _bind(card) {
    const diagHeader = card.querySelector(".diag-header");
    if (diagHeader) {
      diagHeader.addEventListener("click", () => {
        this._diagOpen = !this._diagOpen;
        this._lastActivity = null; // Force full re-render
        this._render();
      });
    }

    // Click on header → more-info for activity
    const header = card.querySelector(".header-left");
    if (header) {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => this._fireMoreInfo(this._entities?.activity));
    }

    // Click on battery → more-info for battery
    const batBadge = card.querySelector(".battery-badge");
    if (batBadge) {
      batBadge.style.cursor = "pointer";
      batBadge.addEventListener("click", () => this._fireMoreInfo(this._entities?.battery));
    }

    // Click on head bar → more-info for head_remaining
    const headBar = card.querySelector(".head-bar-wrap");
    if (headBar) {
      headBar.style.cursor = "pointer";
      headBar.addEventListener("click", () => this._fireMoreInfo(this._entities?.head_remaining));
    }
  }

  // ---------- Partial update ----------
  _updateDynamic() {
    const root = this.shadowRoot;
    if (!root) return;

    const bat = this._numState("battery", 0);
    const bc = batteryColor(bat);
    const batVal = root.querySelector(".battery-value");
    if (batVal) batVal.textContent = `${bat}%`;

    const head = this._numState("head_remaining", 0);
    const headFill = root.querySelector(".head-bar-fill");
    if (headFill) { headFill.style.width = `${head}%`; headFill.style.background = headColor(head); }
    const headVal = root.querySelector(".head-bar-value");
    if (headVal) headVal.textContent = `${head}%`;

    const activity = this._state("activity", "off");
    if (activity === "shaving") {
      const pressure = this._numState("pressure", 0);
      const pState = this._state("pressure_state", "no_contact");
      const stateColors = { no_contact: "rgba(255,255,255,0.25)", too_low: "#42a5f5", optimal: "#4caf50", too_high: "#f44336" };
      const stateLabels = { no_contact: "No Contact", too_low: "Too Low", optimal: "Optimal", too_high: "Too High" };
      const nc = stateColors[pState] || stateColors.no_contact;

      const needleFrac = Math.min(pressure / GAUGE.PRESSURE_MAX, 1);
      const angle = fracToAngle(needleFrac);
      const nx = GAUGE.CX + (GAUGE.R - 12) * Math.cos(angle);
      const ny = GAUGE.CY - (GAUGE.R - 12) * Math.sin(angle);

      const needle = root.querySelector(".gauge-needle");
      if (needle) { needle.setAttribute("x2", nx); needle.setAttribute("y2", ny); needle.setAttribute("stroke", nc); needle.style.filter = `drop-shadow(0 0 6px ${nc})`; }
      const hubDot = root.querySelector(".gauge-hub-dot");
      if (hubDot) hubDot.setAttribute("fill", nc);

      const stateEl = root.querySelector(".gauge-state");
      if (stateEl) { stateEl.textContent = stateLabels[pState] || "\u2014"; stateEl.style.color = nc; }
      const subEl = root.querySelector(".gauge-sub");
      if (subEl) subEl.textContent = pressure > 0 ? pressure : "\u2014";

      this._updateStat("motor_rpm", this._numState("motor_rpm", 0));
      this._updateStat("motor_current", this._numState("motor_current", 0));
    } else {
      const bat2 = this._numState("battery", 0);
      const batArc = root.querySelector(".gauge-bat-arc");
      if (batArc) { batArc.setAttribute("d", describeArc(0, bat2 / 100)); batArc.setAttribute("stroke", batteryColor(bat2)); }
      const batText = root.querySelector(".gauge-bat-text");
      if (batText) batText.textContent = `${bat2}%`;
    }
  }

  _updateStat(key, value) {
    const el = this.shadowRoot?.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = value;
  }

  // ---------- Header ----------
  _renderHeader() {
    const bat = this._numState("battery", 0);
    const bc = batteryColor(bat);
    const activity = this._state("activity", "off");
    const isShaving = activity === "shaving";
    const isCharging = activity === "charging";
    const statusColor = isShaving ? "#ffab40" : isCharging ? "#4caf50" : "rgba(255,255,255,0.25)";
    const dotClass = (isShaving || isCharging) ? "status-dot active" : "status-dot";
    const model = this._state("model_number", "");
    const mode = this._state("shaving_mode", "");
    const modeLabel = MODE_CONFIG[mode]?.label || (mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "");
    const modelMode = [model, modeLabel].filter(Boolean).join(" \u00b7 ");
    const name = this._config.title || "Philips Shaver";

    const batFill = Math.max(0, bat / 100 * 17);
    const batSvg = `<svg viewBox="0 0 24 14" width="20" height="12" fill="${bc}">
      <rect x="0.5" y="0.5" width="20" height="13" rx="2" ry="2" fill="none" stroke="${bc}" stroke-width="1.5"/>
      <rect x="21" y="4" width="2.5" height="6" rx="1" fill="${bc}" opacity="0.6"/>
      <rect x="2" y="2" width="${batFill}" height="10" rx="1" fill="${bc}"/>
    </svg>`;

    return `
      <div class="header">
        <div class="header-left">
          <div class="${dotClass}" style="background:${statusColor};${(isShaving || isCharging) ? `box-shadow:0 0 8px ${statusColor}` : ""}"></div>
          <span class="device-name">${name}</span>
          <span class="model-mode">${modelMode}</span>
        </div>
        <div class="battery-badge" style="color:${bc}">
          ${batSvg}
          <span class="battery-value">${bat}%</span>
        </div>
      </div>
    `;
  }

  // ---------- Gauge ----------
  _renderGauge() {
    const activity = this._state("activity", "off");
    if (activity === "shaving") return this._renderPressureGauge();
    return this._renderBatteryGauge(activity === "charging");
  }

  _renderPressureGauge() {
    const { SIZE: S, CX: cx, CY: cy, STROKE: ST, R: r } = GAUGE;
    const height = S / 2 + 50;
    const pressure = this._numState("pressure", 0);
    const pState = this._state("pressure_state", "no_contact");
    const elapsed = this._elapsed || this._numState("shaving_time", 0);
    const tm = Math.floor(elapsed / 60);
    const ts = elapsed % 60;

    const needleFrac = Math.min(pressure / GAUGE.PRESSURE_MAX, 1);
    const angle = fracToAngle(needleFrac);
    const needleLen = r - 12;
    const nx = cx + needleLen * Math.cos(angle);
    const ny = cy - needleLen * Math.sin(angle);

    const stateColors = { no_contact: "rgba(255,255,255,0.25)", too_low: "#42a5f5", optimal: "#4caf50", too_high: "#f44336" };
    const stateLabels = { no_contact: "No Contact", too_low: "Too Low", optimal: "Optimal", too_high: "Too High" };
    const nc = stateColors[pState] || stateColors.no_contact;

    const { ZONE_BASE: base, ZONE_LOW: low, ZONE_HIGH: high } = GAUGE;

    const dots = [base, low, high].map(f =>
      `<circle cx="${arcX(f)}" cy="${arcY(f)}" r="4" fill="rgba(28,28,28,0.95)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`
    ).join("");

    return `
      <div class="gauge-wrap">
        <div class="gauge-container" style="height:${height}px">
          <svg width="${S}" height="${height}" viewBox="0 0 ${S} ${height}">
            <path d="${describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${ST}" stroke-linecap="round"/>
            <path d="${describeArc(0, base)}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${ST}" stroke-linecap="round"/>
            <path d="${describeArc(base, low)}" fill="none" stroke="#42a5f5" stroke-width="${ST}" stroke-linecap="butt" opacity="0.6"/>
            <path d="${describeArc(low, high)}" fill="none" stroke="#4caf50" stroke-width="${ST}" stroke-linecap="butt" opacity="0.75"/>
            <path d="${describeArc(high, 1)}" fill="none" stroke="#ff9800" stroke-width="${ST}" stroke-linecap="round" opacity="0.6"/>
            ${dots}
            <line class="gauge-needle" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"
              stroke="${nc}" stroke-width="3.5" stroke-linecap="round"
              style="transition:x2 0.5s cubic-bezier(.4,0,.2,1),y2 0.5s cubic-bezier(.4,0,.2,1),stroke 0.3s;filter:drop-shadow(0 0 6px ${nc})"/>
            <circle cx="${cx}" cy="${cy}" r="8" fill="#252525" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
            <circle class="gauge-hub-dot" cx="${cx}" cy="${cy}" r="4" fill="${nc}" style="transition:fill 0.3s"/>
            <text x="24" y="${cy + 26}" text-anchor="start" font-size="10" fill="var(--ps-text-dimmest)" font-family="inherit">Low</text>
            <text x="${S - 24}" y="${cy + 26}" text-anchor="end" font-size="10" fill="var(--ps-text-dimmest)" font-family="inherit">High</text>
            <text x="${cx}" y="${cy - 38}" text-anchor="middle" font-size="11" fill="var(--ps-text-dimmer)" font-family="inherit" letter-spacing="1">SESSION</text>
            <text class="gauge-timer" x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="34" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="'SF Mono','Menlo','Consolas',monospace" letter-spacing="1">${String(tm).padStart(2, "0")}:${String(ts).padStart(2, "0")}</text>
          </svg>
          <div class="gauge-label">
            <div class="gauge-state" style="color:${nc}">${stateLabels[pState] || "\u2014"}</div>
            <div class="gauge-sub">${pressure > 0 ? pressure : "\u2014"}</div>
          </div>
        </div>
      </div>
    `;
  }

  _renderBatteryGauge(isCharging) {
    const { SIZE: S, CX: cx, CY: cy, STROKE: ST } = GAUGE;
    const height = S / 2 + 50;
    const bat = this._numState("battery", 0);
    const bc = batteryColor(bat);
    const chargeAttr = isCharging ? ' style="animation:chargeGlow 2s ease-in-out infinite"' : ' opacity="0.85"';

    return `
      <div class="gauge-wrap">
        <div class="gauge-container" style="height:${height}px">
          <svg width="${S}" height="${height}" viewBox="0 0 ${S} ${height}">
            <path d="${describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${ST}" stroke-linecap="round"/>
            <path class="gauge-bat-arc" d="${describeArc(0, bat / 100)}" fill="none" stroke="${bc}" stroke-width="${ST}" stroke-linecap="round"${chargeAttr}/>
            <text class="gauge-bat-text" x="${cx}" y="${cy - 24}" text-anchor="middle" font-size="48" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="inherit">${bat}%</text>
            <text x="${cx}" y="${cy + 2}" text-anchor="middle" font-size="13" fill="var(--ps-text-dim)" font-family="inherit">${isCharging ? "\u26A1 Charging" : "Battery"}</text>
          </svg>
          <div class="gauge-label" style="margin-top:-4px">
            <div style="font-size:13px;color:${isCharging ? "#4caf50" : "var(--ps-text-dimmest)"}">
              ${isCharging ? "Plugged In" : "Standby"}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- Head bar ----------
  _renderHeadBar() {
    const head = this._numState("head_remaining", 0);
    const hc = headColor(head);
    return `
      <div class="head-bar-wrap">
        <div class="head-bar-header">
          <span class="head-bar-label">Shaver Head</span>
          <span class="head-bar-value">${head}%</span>
        </div>
        <div class="head-bar-track">
          <div class="head-bar-fill" style="width:${head}%;background:${hc}"></div>
        </div>
      </div>
    `;
  }

  // ---------- Stats ----------
  _renderStats() {
    const activity = this._state("activity", "off");
    const isShaving = activity === "shaving";
    const isCharging = activity === "charging";

    let rows = "";
    if (isShaving) {
      rows = this._statRow("speed", "Motor Speed", `<span data-stat="motor_rpm">${this._numState("motor_rpm", 0)}</span>`, "RPM")
           + this._statRow("current", "Motor Current", `<span data-stat="motor_current">${this._numState("motor_current", 0)}</span>`, "mA");
    } else if (isCharging) {
      rows = this._statRow("charge", "Charge Cycles", this._numState("amount_of_charges", 0))
           + this._statRow("clock", "Last Session", formatSession(this._numState("shaving_time", 0)))
           + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0))
           + this._statRow("clock", "Total Time", formatAge(this._numState("total_age", 0)));
    } else {
      const daysUsed = this._numState("days_last_used", null);
      const daysText = daysUsed === null ? "\u2014" : daysUsed === 0 ? "Today" : daysUsed === 1 ? "Yesterday" : `${daysUsed}d ago`;
      rows = this._statRow("clock", "Last Session", formatSession(this._numState("shaving_time", 0)))
           + this._statRow("calendar", "Last Used", daysText)
           + this._statRow("clean", "Cleaning Cycles", this._numState("cleaning_cycles", 0))
           + this._statRow("clock", "Total Time", formatAge(this._numState("total_age", 0)))
           + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0));
    }

    return `<div class="stats">${rows}</div>`;
  }

  _statRow(icon, label, value, unit) {
    return `
      <div class="stat-row">
        <span class="stat-label">${svgIcon(icon)}${label}</span>
        <span class="stat-value">${value}${unit ? `<span class="stat-unit">${unit}</span>` : ""}</span>
      </div>
    `;
  }

  // ---------- Diagnostics ----------
  _renderDiagnostics() {
    const chevronClass = this._diagOpen ? "diag-chevron open" : "diag-chevron";
    let content = "";
    if (this._diagOpen) {
      const rssi = this._state("rssi");
      const fw = this._state("firmware", "\u2014");
      const motorMax = this._numState("motor_current_max", null);
      const travelLock = this._state("travel_lock");
      const lockText = travelLock === "on" ? "Locked" : "Unlocked";
      const charges = this._numState("amount_of_charges", 0);

      let rows = "";
      if (rssi !== null) rows += this._statRow("signal", "RSSI", rssi, "dBm");
      rows += this._statRow("firmware", "Firmware", fw);
      if (motorMax !== null) rows += this._statRow("current", "Motor Limit", motorMax, "mA");
      rows += this._statRow("lock", "Travel Lock", lockText);
      rows += this._statRow("charge", "Charge Cycles", charges);

      content = `<div class="diag-content">${rows}</div>`;
    }

    return `
      <div class="diag-header">
        <span class="diag-label">Diagnostics</span>
        <svg class="${chevronClass}" width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--ps-text-dimmest)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </div>
      ${content}
    `;
  }
}
