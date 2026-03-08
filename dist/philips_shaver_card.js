/**
 * Philips Shaver Card for Home Assistant
 * https://github.com/mtheli/philips_shaver_card
 */ // ---------- Entity discovery map: translation_key → local alias ----------
const $8b62e546fdd14731$var$TRANSLATION_KEY_MAP = {
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
    cleaning_cycles_remaining: "cleaning_cycles_remaining",
    // Binary sensors
    charging: "is_charging",
    travel_lock: "travel_lock",
    esp_bridge_alive: "esp_bridge_alive",
    shaver_ble_connected: "shaver_ble_connected",
    // Selects
    shaving_mode: "shaving_mode",
    lightring_brightness: "lightring_brightness"
};
// ---------- Mode config ----------
const $8b62e546fdd14731$var$MODE_CONFIG = {
    sensitive: {
        label: "Sensitive",
        color: "#90caf9"
    },
    regular: {
        label: "Regular",
        color: "#a5d6a7"
    },
    normal: {
        label: "Normal",
        color: "#a5d6a7"
    },
    intense: {
        label: "Intense",
        color: "#ffab40"
    },
    custom: {
        label: "Custom",
        color: "#ce93d8"
    },
    foam: {
        label: "Foam",
        color: "#80deea"
    },
    battery_saving: {
        label: "Eco",
        color: "#a5d6a7"
    }
};
// ---------- Pressure gauge constants ----------
const $8b62e546fdd14731$var$GAUGE = {
    SIZE: 240,
    STROKE: 20,
    PRESSURE_MAX: 6000,
    ZONE_BASE: 500 / 6000,
    ZONE_LOW: 0.25,
    ZONE_HIGH: 4000 / 6000
};
$8b62e546fdd14731$var$GAUGE.CX = $8b62e546fdd14731$var$GAUGE.SIZE / 2;
$8b62e546fdd14731$var$GAUGE.CY = $8b62e546fdd14731$var$GAUGE.SIZE / 2 + 10;
$8b62e546fdd14731$var$GAUGE.R = $8b62e546fdd14731$var$GAUGE.SIZE / 2 - $8b62e546fdd14731$var$GAUGE.STROKE / 2 - 8;
// ---------- SVG arc helpers ----------
function $8b62e546fdd14731$var$fracToAngle(f) {
    return Math.PI - f * Math.PI;
}
function $8b62e546fdd14731$var$arcX(f) {
    return $8b62e546fdd14731$var$GAUGE.CX + $8b62e546fdd14731$var$GAUGE.R * Math.cos($8b62e546fdd14731$var$fracToAngle(f));
}
function $8b62e546fdd14731$var$arcY(f) {
    return $8b62e546fdd14731$var$GAUGE.CY - $8b62e546fdd14731$var$GAUGE.R * Math.sin($8b62e546fdd14731$var$fracToAngle(f));
}
function $8b62e546fdd14731$var$describeArc(f1, f2) {
    const x1 = $8b62e546fdd14731$var$arcX(f1), y1 = $8b62e546fdd14731$var$arcY(f1);
    const x2 = $8b62e546fdd14731$var$arcX(f2), y2 = $8b62e546fdd14731$var$arcY(f2);
    return `M ${x1} ${y1} A ${$8b62e546fdd14731$var$GAUGE.R} ${$8b62e546fdd14731$var$GAUGE.R} 0 0 1 ${x2} ${y2}`;
}
// ---------- Mini ring arc helper ----------
const $8b62e546fdd14731$var$RING = {
    CX: 50,
    CY: 50,
    R: 42,
    SW: 7,
    START: 135,
    END: 405
};
function $8b62e546fdd14731$var$ringArc(frac) {
    const clamp = Math.max(0, Math.min(1, frac));
    const startRad = $8b62e546fdd14731$var$RING.START * Math.PI / 180;
    const range = $8b62e546fdd14731$var$RING.END - $8b62e546fdd14731$var$RING.START;
    const endRad = ($8b62e546fdd14731$var$RING.START + range * clamp) * Math.PI / 180;
    const x1 = $8b62e546fdd14731$var$RING.CX + $8b62e546fdd14731$var$RING.R * Math.cos(startRad);
    const y1 = $8b62e546fdd14731$var$RING.CY + $8b62e546fdd14731$var$RING.R * Math.sin(startRad);
    const x2 = $8b62e546fdd14731$var$RING.CX + $8b62e546fdd14731$var$RING.R * Math.cos(endRad);
    const y2 = $8b62e546fdd14731$var$RING.CY + $8b62e546fdd14731$var$RING.R * Math.sin(endRad);
    const large = range * clamp > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${$8b62e546fdd14731$var$RING.R} ${$8b62e546fdd14731$var$RING.R} 0 ${large} 1 ${x2} ${y2}`;
}
function $8b62e546fdd14731$var$ringBgArc() {
    const startRad = $8b62e546fdd14731$var$RING.START * Math.PI / 180;
    const endRad = $8b62e546fdd14731$var$RING.END * Math.PI / 180;
    const x1 = $8b62e546fdd14731$var$RING.CX + $8b62e546fdd14731$var$RING.R * Math.cos(startRad);
    const y1 = $8b62e546fdd14731$var$RING.CY + $8b62e546fdd14731$var$RING.R * Math.sin(startRad);
    const x2 = $8b62e546fdd14731$var$RING.CX + $8b62e546fdd14731$var$RING.R * Math.cos(endRad);
    const y2 = $8b62e546fdd14731$var$RING.CY + $8b62e546fdd14731$var$RING.R * Math.sin(endRad);
    return `M ${x1} ${y1} A ${$8b62e546fdd14731$var$RING.R} ${$8b62e546fdd14731$var$RING.R} 0 1 1 ${x2} ${y2}`;
}
// ---------- Formatting helpers ----------
function $8b62e546fdd14731$var$formatAge(s) {
    const d = Math.floor(s / 86400);
    const h = Math.floor(s % 86400 / 3600);
    return `${d}d ${h}h`;
}
function $8b62e546fdd14731$var$formatSession(s) {
    return `${Math.floor(s / 60)}m ${s % 60}s`;
}
function $8b62e546fdd14731$var$batteryColor(pct) {
    if (pct > 50) return "#4caf50";
    if (pct > 20) return "#ff9800";
    return "#f44336";
}
function $8b62e546fdd14731$var$headColor(pct) {
    if (pct > 30) return "#4caf50";
    if (pct > 15) return "#ff9800";
    return "#f44336";
}
function $8b62e546fdd14731$var$cleaningColor(remaining) {
    if (remaining > 15) return "#4caf50";
    if (remaining > 5) return "#ff9800";
    return "#f44336";
}
// ---------- SVG Icon paths ----------
const $8b62e546fdd14731$var$ICONS = {
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
    bluetooth: '<path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>',
    lan_connect: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
    lan_disconnect: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
    razor: '<path d="M20 8C19.45 8 19 7.55 19 7C19 6.45 19.45 6 20 6V5H4V6C4.55 6 5 6.45 5 7C5 7.55 4.55 8 4 8H2V15H4C4.55 15 5 15.45 5 16C5 16.55 4.55 17 4 17V18H20V17C19.45 17 19 16.55 19 16C19 15.45 19.45 15 20 15H22V8H20M20 12H19V13H17V12H13.41C13.2 12.58 12.65 13 12 13S10.8 12.58 10.59 12H7V13H5V12H4V11H5V10H7V11H10.59C10.8 10.42 11.35 10 12 10S13.2 10.42 13.41 11H17V10H19V11H20V12Z"/>',
    droplet: '<path d="M12 2c0 0-6 7.34-6 11a6 6 0 0 0 12 0c0-3.66-6-11-6-11zm0 15a3 3 0 0 1-3-3c0-.55.45-1 1-1s1 .45 1 1a1 1 0 0 0 1 1c.55 0 1 .45 1 1s-.45 1-1 1z"/>'
};
function $8b62e546fdd14731$var$svgIcon(name) {
    return `<svg class="stat-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">${$8b62e546fdd14731$var$ICONS[name] || ""}</svg>`;
}
// ---------- CSS ----------
function $8b62e546fdd14731$var$cardStyles() {
    return `
    :host {
      --ps-text-dim: var(--secondary-text-color, rgba(255,255,255,0.5));
      --ps-text-dimmer: var(--disabled-text-color, rgba(255,255,255,0.35));
      --ps-text-dimmest: var(--disabled-text-color, rgba(255,255,255,0.25));
      --ps-border: var(--divider-color, rgba(255,255,255,0.04));
      --ps-track: var(--divider-color, rgba(255,255,255,0.06));
      --ps-card-bg: var(--ha-card-background, var(--card-background-color, #1c1c1c));
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
    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .conn-icons {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .conn-icon {
      width: 16px;
      height: 16px;
      opacity: 0.7;
      transition: opacity 0.3s;
    }
    .conn-icon.disconnected {
      opacity: 0.25;
    }
    .gauge-wrap {
      padding: 8px 0 4px;
      display: flex;
      justify-content: center;
    }
    .gauge-container {
      position: relative;
      width: ${$8b62e546fdd14731$var$GAUGE.SIZE}px;
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
    .info-tiles {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-tile {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .ring-wrap {
      width: 36px;
      height: 36px;
      position: relative;
    }
    .ring-wrap svg.ring-svg {
      width: 100%;
      height: 100%;
    }
    .ring-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
    }
    .tile-value {
      font-size: 13px;
      font-weight: 600;
      transition: color 0.3s;
    }
    .divider {
      height: 1px;
      background: var(--ps-border);
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
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .stat-unit {
      font-size: 11px;
      color: var(--ps-text-dimmer);
      margin-left: 2px;
      font-weight: 400;
    }
    .unavailable {
      padding: 20px;
      text-align: center;
      color: var(--ps-text-dim);
      font-size: 14px;
    }
    @keyframes chargeGlow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
  `;
}
class $8b62e546fdd14731$export$4778d74453ecc150 extends HTMLElement {
    // ---- Config form (HA visual editor) ----
    static getConfigForm() {
        return {
            schema: [
                {
                    name: "device_id",
                    required: true,
                    selector: {
                        device: {
                            filter: {
                                integration: "philips_shaver"
                            },
                            multiple: false
                        }
                    }
                },
                {
                    name: "title",
                    label: "Title (optional \u2014 defaults to 'Philips Shaver')",
                    selector: {
                        text: {}
                    }
                }
            ]
        };
    }
    static getStubConfig() {
        return {
            device_id: ""
        };
    }
    constructor(){
        super();
        this.attachShadow({
            mode: "open"
        });
        this._hass = null;
        this._config = null;
        this._entities = null;
        this._timer = null;
        this._elapsed = 0;
        this._lastActivity = null;
    }
    setConfig(config) {
        if (!config.device_id) throw new Error("Please select a Philips Shaver device in the card configuration.");
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
        for(const entityId in allEntities){
            const entity = allEntities[entityId];
            if (entity.device_id !== deviceId) continue;
            const tKey = entity.translation_key;
            if (tKey && $8b62e546fdd14731$var$TRANSLATION_KEY_MAP[tKey]) found[$8b62e546fdd14731$var$TRANSLATION_KEY_MAP[tKey]] = entity.entity_id;
            // Fallback: battery via device_class
            const state = this._hass.states[entity.entity_id];
            if (!found.battery && state?.attributes?.device_class === "battery") found.battery = entity.entity_id;
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
        this._timer = setInterval(()=>{
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
        const e = new Event("hass-more-info", {
            bubbles: true,
            composed: true
        });
        e.detail = {
            entityId: entityId
        };
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
            style.textContent = $8b62e546fdd14731$var$cardStyles();
            root.appendChild(style);
            const card = document.createElement("ha-card");
            card.innerHTML = `<div class="card-content">
        ${this._renderHeader()}
        ${this._renderGauge()}
        <div class="spacer"></div>
        <div class="divider"></div>
        ${this._renderStats()}
      </div>`;
            root.appendChild(card);
            this._bind(card);
        } else this._updateDynamic();
    }
    // ---------- Event binding ----------
    _bind(card) {
        // Click on header → more-info for activity
        const header = card.querySelector(".header-left");
        if (header) {
            header.style.cursor = "pointer";
            header.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.activity));
        }
        // Click on battery ring tile → more-info for battery
        const batTile = card.querySelector('[data-mini="battery"]');
        if (batTile) batTile.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.battery));
        // Click on mini gauges → more-info
        const headGauge = card.querySelector('[data-mini="head"]');
        if (headGauge) headGauge.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.head_remaining));
        const cleanGauge = card.querySelector('[data-mini="cleaning"]');
        if (cleanGauge) cleanGauge.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.cleaning_cycles_remaining));
        // Click on connection icons → more-info
        const connIcons = card.querySelectorAll(".conn-icon");
        if (connIcons.length >= 2) {
            const lanEl = connIcons[0];
            lanEl.style.cursor = "pointer";
            lanEl.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.esp_bridge_alive));
            const btEl = connIcons[1];
            btEl.style.cursor = "pointer";
            btEl.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.shaver_ble_connected));
        }
    }
    // ---------- Partial update ----------
    _updateDynamic() {
        const root = this.shadowRoot;
        if (!root) return;
        // Update battery ring tile
        const bat = this._numState("battery", 0);
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        const batVal = root.querySelector(".tile-bat-val");
        if (batVal) {
            batVal.textContent = `${bat}%`;
            batVal.style.color = bc;
        }
        const batArc = root.querySelector(".ring-bat-arc");
        if (batArc) {
            batArc.setAttribute("d", $8b62e546fdd14731$var$ringArc(bat / 100));
            batArc.setAttribute("stroke", bc);
        }
        const batIcon = root.querySelector('[data-mini="battery"] .ring-icon');
        if (batIcon) batIcon.setAttribute("fill", bc);
        // Update connection icons
        const espEntity = this._entity("esp_bridge_alive");
        const espConnected = espEntity ? espEntity.state === "on" : false;
        const bleEntity = this._entity("shaver_ble_connected");
        const bleConnected = bleEntity ? bleEntity.state === "on" : false;
        const connIcons = root.querySelectorAll(".conn-icon");
        if (connIcons.length >= 2) {
            const lanEl = connIcons[0];
            lanEl.innerHTML = $8b62e546fdd14731$var$ICONS[espConnected ? "lan_connect" : "lan_disconnect"];
            lanEl.setAttribute("fill", espConnected ? "#42a5f5" : "var(--ps-text-dimmest)");
            lanEl.setAttribute("class", espConnected ? "conn-icon" : "conn-icon disconnected");
            const btEl = connIcons[1];
            btEl.setAttribute("fill", bleConnected ? "#42a5f5" : "var(--ps-text-dimmest)");
            btEl.setAttribute("class", bleConnected ? "conn-icon" : "conn-icon disconnected");
        }
        // Update info tiles (ring arcs + values)
        const head = this._numState("head_remaining", 0);
        const hc = $8b62e546fdd14731$var$headColor(head);
        const headVal = root.querySelector(".tile-head-val");
        if (headVal) {
            headVal.textContent = `${Math.round(head)}%`;
            headVal.style.color = hc;
        }
        const headArc = root.querySelector(".ring-head-arc");
        if (headArc) {
            headArc.setAttribute("d", $8b62e546fdd14731$var$ringArc(head / 100));
            headArc.setAttribute("stroke", hc);
        }
        const headIcon = root.querySelector('[data-mini="head"] .ring-icon');
        if (headIcon) headIcon.setAttribute("fill", hc);
        const clean = this._numState("cleaning_cycles_remaining", 0);
        const cc = $8b62e546fdd14731$var$cleaningColor(clean);
        const cleanVal = root.querySelector(".tile-clean-val");
        if (cleanVal) {
            cleanVal.textContent = clean.toFixed(1);
            cleanVal.style.color = cc;
        }
        const cleanArc = root.querySelector(".ring-clean-arc");
        if (cleanArc) {
            cleanArc.setAttribute("d", $8b62e546fdd14731$var$ringArc(clean / 30));
            cleanArc.setAttribute("stroke", cc);
        }
        const cleanIcon = root.querySelector('[data-mini="cleaning"] .ring-icon');
        if (cleanIcon) cleanIcon.setAttribute("fill", cc);
        const activity = this._state("activity", "off");
        if (activity === "shaving") {
            const pressure = this._numState("pressure", 0);
            const pState = this._state("pressure_state", "no_contact");
            const stateColors = {
                no_contact: "var(--disabled-text-color, #9e9e9e)",
                too_low: "#42a5f5",
                optimal: "#4caf50",
                too_high: "#f44336"
            };
            const stateLabels = {
                no_contact: "No Contact",
                too_low: "Too Low",
                optimal: "Optimal",
                too_high: "Too High"
            };
            const nc = stateColors[pState] || stateColors.no_contact;
            const needleFrac = Math.min(pressure / $8b62e546fdd14731$var$GAUGE.PRESSURE_MAX, 1);
            const angle = $8b62e546fdd14731$var$fracToAngle(needleFrac);
            const nx = $8b62e546fdd14731$var$GAUGE.CX + ($8b62e546fdd14731$var$GAUGE.R - 12) * Math.cos(angle);
            const ny = $8b62e546fdd14731$var$GAUGE.CY - ($8b62e546fdd14731$var$GAUGE.R - 12) * Math.sin(angle);
            const needle = root.querySelector(".gauge-needle");
            if (needle) {
                needle.setAttribute("x2", nx);
                needle.setAttribute("y2", ny);
                needle.setAttribute("stroke", nc);
                needle.style.filter = `drop-shadow(0 0 6px ${nc})`;
            }
            const hubDot = root.querySelector(".gauge-hub-dot");
            if (hubDot) hubDot.setAttribute("fill", nc);
            const stateEl = root.querySelector(".gauge-state");
            if (stateEl) {
                stateEl.textContent = stateLabels[pState] || "\u2014";
                stateEl.style.color = nc;
            }
            const subEl = root.querySelector(".gauge-sub");
            if (subEl) subEl.textContent = pressure > 0 ? pressure : "\u2014";
            this._updateStat("motor_rpm", this._numState("motor_rpm", 0));
            this._updateStat("motor_current", this._numState("motor_current", 0));
        } else {
            const bat2 = this._numState("battery", 0);
            const batArc = root.querySelector(".gauge-bat-arc");
            if (batArc) {
                batArc.setAttribute("d", $8b62e546fdd14731$var$describeArc(0, bat2 / 100));
                batArc.setAttribute("stroke", $8b62e546fdd14731$var$batteryColor(bat2));
            }
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
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        const model = this._state("model_number", "");
        const mode = this._state("shaving_mode", "");
        const modeLabel = $8b62e546fdd14731$var$MODE_CONFIG[mode]?.label || (mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "");
        const modelMode = [
            model,
            modeLabel
        ].filter(Boolean).join(" \u00b7 ");
        const name = this._config.title || "Philips Shaver";
        // Connection status (binary_sensor: on = connected)
        const espEntity = this._entity("esp_bridge_alive");
        const espConnected = espEntity ? espEntity.state === "on" : false;
        const bleEntity = this._entity("shaver_ble_connected");
        const bleConnected = bleEntity ? bleEntity.state === "on" : false;
        const lanIcon = espConnected ? "lan_connect" : "lan_disconnect";
        const lanColor = espConnected ? "#42a5f5" : "var(--ps-text-dimmest)";
        const lanClass = espConnected ? "conn-icon" : "conn-icon disconnected";
        const btColor = bleConnected ? "#42a5f5" : "var(--ps-text-dimmest)";
        const btClass = bleConnected ? "conn-icon" : "conn-icon disconnected";
        return `
      <div class="header">
        <div class="header-left">
          <span class="device-name">${name}</span>
          <span class="model-mode">${modelMode}</span>
        </div>
        <div class="header-right">
          <div class="conn-icons">
            <svg class="${lanClass}" viewBox="0 0 24 24" fill="${lanColor}">${$8b62e546fdd14731$var$ICONS[lanIcon]}</svg>
            <svg class="${btClass}" viewBox="0 0 24 24" fill="${btColor}">${$8b62e546fdd14731$var$ICONS.bluetooth}</svg>
          </div>
          ${this._renderInfoTiles()}
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
        const { SIZE: S, CX: cx, CY: cy, STROKE: ST, R: r } = $8b62e546fdd14731$var$GAUGE;
        const height = S / 2 + 50;
        const pressure = this._numState("pressure", 0);
        const pState = this._state("pressure_state", "no_contact");
        const elapsed = this._elapsed || this._numState("shaving_time", 0);
        const tm = Math.floor(elapsed / 60);
        const ts = elapsed % 60;
        const needleFrac = Math.min(pressure / $8b62e546fdd14731$var$GAUGE.PRESSURE_MAX, 1);
        const angle = $8b62e546fdd14731$var$fracToAngle(needleFrac);
        const needleLen = r - 12;
        const nx = cx + needleLen * Math.cos(angle);
        const ny = cy - needleLen * Math.sin(angle);
        const stateColors = {
            no_contact: "var(--disabled-text-color, #9e9e9e)",
            too_low: "#42a5f5",
            optimal: "#4caf50",
            too_high: "#f44336"
        };
        const stateLabels = {
            no_contact: "No Contact",
            too_low: "Too Low",
            optimal: "Optimal",
            too_high: "Too High"
        };
        const nc = stateColors[pState] || stateColors.no_contact;
        const { ZONE_BASE: base, ZONE_LOW: low, ZONE_HIGH: high } = $8b62e546fdd14731$var$GAUGE;
        const dots = [
            base,
            low,
            high
        ].map((f)=>`<circle cx="${$8b62e546fdd14731$var$arcX(f)}" cy="${$8b62e546fdd14731$var$arcY(f)}" r="4" style="fill:var(--ps-card-bg);stroke:var(--ps-border)" stroke-width="1"/>`).join("");
        return `
      <div class="gauge-wrap">
        <div class="gauge-container" style="min-height:${height}px">
          <svg width="${S}" height="${height}" viewBox="0 0 ${S} ${height}">
            <path d="${$8b62e546fdd14731$var$describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${ST}" stroke-linecap="round"/>
            <path d="${$8b62e546fdd14731$var$describeArc(0, base)}" fill="none" stroke="var(--ps-track)" stroke-width="${ST}" stroke-linecap="round"/>
            <path d="${$8b62e546fdd14731$var$describeArc(base, low)}" fill="none" stroke="#42a5f5" stroke-width="${ST}" stroke-linecap="butt" opacity="0.6"/>
            <path d="${$8b62e546fdd14731$var$describeArc(low, high)}" fill="none" stroke="#4caf50" stroke-width="${ST}" stroke-linecap="butt" opacity="0.75"/>
            <path d="${$8b62e546fdd14731$var$describeArc(high, 1)}" fill="none" stroke="#ff9800" stroke-width="${ST}" stroke-linecap="round" opacity="0.6"/>
            ${dots}
            <line class="gauge-needle" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"
              stroke="${nc}" stroke-width="3.5" stroke-linecap="round"
              style="transition:x2 0.5s cubic-bezier(.4,0,.2,1),y2 0.5s cubic-bezier(.4,0,.2,1),stroke 0.3s;filter:drop-shadow(0 0 6px ${nc})"/>
            <circle cx="${cx}" cy="${cy}" r="8" style="fill:var(--ps-card-bg);stroke:var(--ps-border)" stroke-width="2"/>
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
        const { SIZE: S, CX: cx, CY: cy, STROKE: ST } = $8b62e546fdd14731$var$GAUGE;
        const height = S / 2 + 50;
        const bat = this._numState("battery", 0);
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        const chargeAttr = isCharging ? ' style="animation:chargeGlow 2s ease-in-out infinite"' : ' opacity="0.85"';
        return `
      <div class="gauge-wrap">
        <div class="gauge-container" style="min-height:${height}px">
          <svg width="${S}" height="${height}" viewBox="0 0 ${S} ${height}">
            <path d="${$8b62e546fdd14731$var$describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${ST}" stroke-linecap="round"/>
            <path class="gauge-bat-arc" d="${$8b62e546fdd14731$var$describeArc(0, bat / 100)}" fill="none" stroke="${bc}" stroke-width="${ST}" stroke-linecap="round"${chargeAttr}/>
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
    // ---------- Info tiles ----------
    _renderInfoTiles() {
        const bat = this._numState("battery", 0);
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        const head = this._numState("head_remaining", 0);
        const hc = $8b62e546fdd14731$var$headColor(head);
        const clean = this._numState("cleaning_cycles_remaining", 0);
        const cc = $8b62e546fdd14731$var$cleaningColor(clean);
        const bg = $8b62e546fdd14731$var$ringBgArc();
        return `
      <div class="info-tiles">
        <div class="info-tile" data-mini="battery">
          <div class="ring-wrap">
            <svg class="ring-svg" viewBox="0 0 100 100">
              <path d="${bg}" fill="none" stroke="var(--ps-track)" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
              <path class="ring-bat-arc" d="${$8b62e546fdd14731$var$ringArc(bat / 100)}" fill="none" stroke="${bc}" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
            </svg>
            <svg class="ring-icon" viewBox="0 0 24 24" fill="${bc}">${$8b62e546fdd14731$var$ICONS.charge}</svg>
          </div>
          <span class="tile-value tile-bat-val" style="color:${bc}">${bat}%</span>
        </div>
        <div class="info-tile" data-mini="head">
          <div class="ring-wrap">
            <svg class="ring-svg" viewBox="0 0 100 100">
              <path d="${bg}" fill="none" stroke="var(--ps-track)" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
              <path class="ring-head-arc" d="${$8b62e546fdd14731$var$ringArc(head / 100)}" fill="none" stroke="${hc}" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
            </svg>
            <svg class="ring-icon" viewBox="0 0 24 24" fill="${hc}">${$8b62e546fdd14731$var$ICONS.razor}</svg>
          </div>
          <span class="tile-value tile-head-val" style="color:${hc}">${Math.round(head)}%</span>
        </div>
        <div class="info-tile" data-mini="cleaning">
          <div class="ring-wrap">
            <svg class="ring-svg" viewBox="0 0 100 100">
              <path d="${bg}" fill="none" stroke="var(--ps-track)" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
              <path class="ring-clean-arc" d="${$8b62e546fdd14731$var$ringArc(clean / 30)}" fill="none" stroke="${cc}" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
            </svg>
            <svg class="ring-icon" viewBox="0 0 24 24" fill="${cc}">${$8b62e546fdd14731$var$ICONS.droplet}</svg>
          </div>
          <span class="tile-value tile-clean-val" style="color:${cc}">${clean.toFixed(1)}</span>
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
        if (isShaving) rows = this._statRow("speed", "Motor Speed", `<span data-stat="motor_rpm">${this._numState("motor_rpm", 0)}</span>`, "RPM") + this._statRow("current", "Motor Current", `<span data-stat="motor_current">${this._numState("motor_current", 0)}</span>`, "mA");
        else if (isCharging) rows = this._statRow("charge", "Charge Cycles", this._numState("amount_of_charges", 0)) + this._statRow("clock", "Last Session", $8b62e546fdd14731$var$formatSession(this._numState("shaving_time", 0))) + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0)) + this._statRow("clock", "Total Time", $8b62e546fdd14731$var$formatAge(this._numState("total_age", 0)));
        else {
            const daysUsed = this._numState("days_last_used", null);
            const daysText = daysUsed === null ? "\u2014" : daysUsed === 0 ? "Today" : daysUsed === 1 ? "Yesterday" : `${daysUsed}d ago`;
            rows = this._statRow("clock", "Last Session", $8b62e546fdd14731$var$formatSession(this._numState("shaving_time", 0))) + this._statRow("calendar", "Last Used", daysText) + this._statRow("clock", "Total Time", $8b62e546fdd14731$var$formatAge(this._numState("total_age", 0))) + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0));
        }
        return `<div class="stats">${rows}</div>`;
    }
    _statRow(icon, label, value, unit) {
        return `
      <div class="stat-row">
        <span class="stat-label">${$8b62e546fdd14731$var$svgIcon(icon)}${label}</span>
        <span class="stat-value">${value}${unit ? `<span class="stat-unit">${unit}</span>` : ""}</span>
      </div>
    `;
    }
}


customElements.define("philips-shaver-card", (0, $8b62e546fdd14731$export$4778d74453ecc150));
window.customCards = window.customCards || [];
window.customCards.push({
    type: "philips-shaver-card",
    name: "Philips Shaver Card",
    description: "Custom card for the Philips Shaver integration with pressure gauge, battery, and diagnostics.",
    preview: true
});
console.info("%c PHILIPS-SHAVER-CARD %c v1.0.0 ", "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700", "color:#1c1c1c;background:#ffab40;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700");


