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
// ---------- Gauge constants ----------
const $8b62e546fdd14731$var$GAUGE = {
    CX: 140,
    CY: 142,
    R: 108,
    STROKE: 22,
    PRESSURE_MAX: 6000,
    ZONE_BASE: 500 / 6000,
    ZONE_LOW: 0.25,
    ZONE_HIGH: 4000 / 6000
};
const $8b62e546fdd14731$var$GAUGE_W = 280;
// ---------- SVG arc helpers (semicircle, CW in SVG) ----------
function $8b62e546fdd14731$var$fracToXY(frac, r = $8b62e546fdd14731$var$GAUGE.R) {
    // frac: 0 = left (180°), 1 = right (360°=0°)
    const deg = 180 + 180 * frac;
    const rad = deg * Math.PI / 180;
    return {
        x: $8b62e546fdd14731$var$GAUGE.CX + r * Math.cos(rad),
        y: $8b62e546fdd14731$var$GAUGE.CY + r * Math.sin(rad)
    };
}
function $8b62e546fdd14731$var$describeArc(f1, f2, r = $8b62e546fdd14731$var$GAUGE.R) {
    const range = 180;
    const spanDeg = (f2 - f1) * range;
    let ef1 = f1, ef2 = f2;
    if (f2 - f1 >= 0.999) {
        ef1 = 0.001;
        ef2 = 0.999;
    }
    const p1 = $8b62e546fdd14731$var$fracToXY(ef1, r), p2 = $8b62e546fdd14731$var$fracToXY(ef2, r);
    const large = spanDeg > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}
// ---------- Mini ring arc helper (270° arc, gap at bottom, CW in SVG) ----------
const $8b62e546fdd14731$var$RING = {
    CX: 18,
    CY: 18,
    R: 14,
    SW: 3,
    START: 135,
    END: 405
};
function $8b62e546fdd14731$var$ringArc(frac) {
    const f = Math.max(0, Math.min(1, frac));
    const range = $8b62e546fdd14731$var$RING.END - $8b62e546fdd14731$var$RING.START;
    const startRad = $8b62e546fdd14731$var$RING.START * Math.PI / 180;
    const endRad = ($8b62e546fdd14731$var$RING.START + range * f) * Math.PI / 180;
    const x1 = $8b62e546fdd14731$var$RING.CX + $8b62e546fdd14731$var$RING.R * Math.cos(startRad);
    const y1 = $8b62e546fdd14731$var$RING.CY + $8b62e546fdd14731$var$RING.R * Math.sin(startRad);
    const x2 = $8b62e546fdd14731$var$RING.CX + $8b62e546fdd14731$var$RING.R * Math.cos(endRad);
    const y2 = $8b62e546fdd14731$var$RING.CY + $8b62e546fdd14731$var$RING.R * Math.sin(endRad);
    const large = range * f > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${$8b62e546fdd14731$var$RING.R} ${$8b62e546fdd14731$var$RING.R} 0 ${large} 1 ${x2} ${y2}`;
}
function $8b62e546fdd14731$var$ringBgArc() {
    return $8b62e546fdd14731$var$ringArc(1);
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
    if (pct > 30) return "#3f51b5";
    if (pct > 15) return "#ff9800";
    return "#f44336";
}
function $8b62e546fdd14731$var$cleaningColor(remaining) {
    if (remaining > 15) return "#00bcd4";
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
    droplet: '<path d="M12 2c0 0-6 7.34-6 11a6 6 0 0 0 12 0c0-3.66-6-11-6-11zm0 15a3 3 0 0 1-3-3c0-.55.45-1 1-1s1 .45 1 1a1 1 0 0 0 1 1c.55 0 1 .45 1 1s-.45 1-1 1z"/>',
    motor: '<path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53A6.95 6.95 0 0 1 12 19z"/>',
    charges: '<path d="M15.67 4H14V2h-4v2H8.33A1.33 1.33 0 0 0 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.74 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>'
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
      --ps-elevated: color-mix(in srgb, var(--primary-text-color, #fff) 6%, var(--ps-card-bg));
    }
    ha-card {
      overflow: hidden;
      font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
      color: var(--primary-text-color, #fff);
      container-type: inline-size;
    }

    /* HEADER */
    .header {
      padding: 16px 16px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      overflow: hidden;
    }
    .device-name {
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .model-mode {
      font-size: 11px;
      color: var(--ps-text-dimmest);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 6px;
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

    /* MINI TILES ROW */
    .tiles-row {
      display: flex;
      gap: 6px;
      padding: 0 16px 14px;
      justify-content: center;
    }
    .mini-tile {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--ps-elevated);
      border-radius: 12px;
      padding: 6px 8px 6px 4px;
      flex: 1;
      min-width: 0;
      max-width: 140px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .mini-tile:hover {
      background: color-mix(in srgb, var(--primary-text-color, #fff) 10%, var(--ps-card-bg));
    }
    .mini-ring-wrap {
      position: relative;
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }
    .mini-ring-svg { width: 36px; height: 36px; }
    .mini-ring-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
    }
    .mini-tile-info {
      display: flex;
      flex-direction: column;
    }
    .mini-tile-label {
      font-size: 9px;
      color: var(--ps-text-dimmest);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1;
      margin-bottom: 3px;
    }
    .mini-tile-value {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }

    /* GAUGE */
    .gauge-section {
      padding: 4px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gauge-svg { display: block; max-width: 100%; height: auto; }
    .gauge-status {
      font-size: 13px;
      color: var(--ps-text-dimmest);
      margin-top: -2px;
      margin-bottom: 8px;
      text-align: center;
      transition: color 0.3s;
    }

    /* Pressure label below gauge */
    .pressure-label {
      font-size: 17px;
      font-weight: 700;
      text-align: center;
      margin-top: -6px;
      margin-bottom: 2px;
      transition: color 0.3s;
    }
    .pressure-value {
      font-size: 11px;
      color: var(--ps-text-dimmest);
      text-align: center;
      margin-bottom: 8px;
      font-variant-numeric: tabular-nums;
    }

    /* Gauge arcs */
    .gauge-arc-fill {
      transition: stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1), stroke 0.4s;
    }
    .zone-arc { stroke-linecap: butt; }
    .zone-separator { stroke: var(--ps-card-bg); stroke-width: 3; }

    /* Needle */
    .needle-line {
      stroke-linecap: round;
      transition: x2 0.5s cubic-bezier(.4,0,.2,1), y2 0.5s cubic-bezier(.4,0,.2,1), stroke 0.3s;
    }
    .needle-glow {
      filter: blur(4px); opacity: 0.5;
      transition: x2 0.5s cubic-bezier(.4,0,.2,1), y2 0.5s cubic-bezier(.4,0,.2,1), stroke 0.3s;
    }

    /* Edge labels */
    .gauge-edge-label { font-size: 10px; fill: var(--ps-text-dimmest); }

    /* Shaving mini stats tiles */
    .shave-stats {
      display: flex;
      gap: 6px;
      padding: 8px 16px;
      justify-content: center;
    }
    .shave-stat-tile {
      flex: 1;
      min-width: 0;
      max-width: 120px;
      background: var(--ps-elevated);
      border-radius: 10px;
      padding: 10px 4px;
      text-align: center;
    }
    .shave-stat-val {
      font-size: 15px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .shave-stat-label {
      font-size: 10px;
      color: var(--ps-text-dimmest);
      margin-top: 6px;
    }

    /* DIVIDER + SPACER */
    .divider {
      height: 1px;
      background: var(--ps-border);
      margin: 0 16px;
    }

    /* STAT ROWS */
    .stats { padding: 6px 16px 10px; }
    .stat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 0;
      border-bottom: 1px solid var(--ps-border);
    }
    .stat-row:last-child { border-bottom: none; }
    .stat-label {
      font-size: 13px;
      color: var(--ps-text-dim);
      display: flex;
      align-items: center;
      gap: 10px;
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

    /* UNAVAILABLE */
    .unavailable {
      padding: 20px;
      text-align: center;
      color: var(--ps-text-dim);
      font-size: 14px;
    }

    /* NARROW CARD */
    @container (max-width: 350px) {
      .mini-tile-info { display: none; }
      .mini-tile { padding: 4px; justify-content: center; }
    }

    /* ANIMATIONS */
    @keyframes chargeGlow {
      0%, 100% { stroke-opacity: 0.3; }
      50% { stroke-opacity: 1; }
    }
    .charging-arc { animation: chargeGlow 2s ease-in-out infinite; }
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
    static getStubConfig(hass) {
        const entry = Object.values(hass.entities).find((e)=>e.platform === "philips_shaver" && e.translation_key === "battery");
        return {
            device_id: entry ? entry.device_id : ""
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
        this._entities = null;
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
        ${this._renderMiniTiles()}
        ${this._renderGauge()}
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
        // Click on mini tiles → more-info
        const batTile = card.querySelector('[data-mini="battery"]');
        if (batTile) batTile.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.battery));
        const headTile = card.querySelector('[data-mini="head"]');
        if (headTile) headTile.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.head_remaining));
        const cleanTile = card.querySelector('[data-mini="cleaning"]');
        if (cleanTile) cleanTile.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.cleaning_cycles_remaining));
        // Click on connection icons → more-info (order: BT first, LAN second)
        const connIcons = card.querySelectorAll(".conn-icon");
        if (connIcons.length >= 2) {
            const btEl = connIcons[0];
            btEl.style.cursor = "pointer";
            btEl.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.shaver_ble_connected));
            const lanEl = connIcons[1];
            lanEl.style.cursor = "pointer";
            lanEl.addEventListener("click", ()=>this._fireMoreInfo(this._entities?.esp_bridge_alive));
        }
    }
    // ---------- Partial update ----------
    _updateDynamic() {
        const root = this.shadowRoot;
        if (!root) return;
        // Update mini tiles
        const bat = this._numState("battery", 0);
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        this._updateMiniTile(root, "battery", bat / 100, bc, `${bat}%`);
        const head = this._numState("head_remaining", 0);
        const hc = $8b62e546fdd14731$var$headColor(head);
        this._updateMiniTile(root, "head", head / 100, hc, `${Math.round(head)}%`);
        const clean = this._numState("cleaning_cycles_remaining", 0);
        const cc = $8b62e546fdd14731$var$cleaningColor(clean);
        this._updateMiniTile(root, "cleaning", clean / 30, cc, clean.toFixed(0));
        // Update connection icons
        const espEntity = this._entity("esp_bridge_alive");
        const espConnected = espEntity ? espEntity.state === "on" : false;
        const bleEntity = this._entity("shaver_ble_connected");
        const bleConnected = bleEntity ? bleEntity.state === "on" : false;
        const connIcons = root.querySelectorAll(".conn-icon");
        if (connIcons.length >= 2) {
            const btEl = connIcons[0];
            btEl.setAttribute("fill", bleConnected ? "#42a5f5" : "var(--ps-text-dimmest)");
            btEl.setAttribute("class", bleConnected ? "conn-icon" : "conn-icon disconnected");
            const lanEl = connIcons[1];
            lanEl.innerHTML = $8b62e546fdd14731$var$ICONS[espConnected ? "lan_connect" : "lan_disconnect"];
            lanEl.setAttribute("fill", espConnected ? "#42a5f5" : "var(--ps-text-dimmest)");
            lanEl.setAttribute("class", espConnected ? "conn-icon" : "conn-icon disconnected");
        }
        // Update gauge
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
            const tip = $8b62e546fdd14731$var$fracToXY(needleFrac, $8b62e546fdd14731$var$GAUGE.R - 16);
            const needleLine = root.querySelector(".needle-line");
            if (needleLine) {
                needleLine.setAttribute("x2", tip.x);
                needleLine.setAttribute("y2", tip.y);
                needleLine.setAttribute("stroke", nc);
            }
            const needleGlow = root.querySelector(".needle-glow");
            if (needleGlow) {
                needleGlow.setAttribute("x2", tip.x);
                needleGlow.setAttribute("y2", tip.y);
                needleGlow.setAttribute("stroke", nc);
            }
            const hubDot = root.querySelector(".gauge-hub-dot");
            if (hubDot) hubDot.setAttribute("fill", nc);
            const pLabel = root.querySelector(".pressure-label");
            if (pLabel) {
                pLabel.textContent = stateLabels[pState] || "\u2014";
                pLabel.style.color = nc;
            }
            const pVal = root.querySelector(".pressure-value");
            if (pVal) pVal.textContent = pressure > 0 ? pressure : "\u2014";
            // Update shave stat tiles
            this._updateStatTile(root, "shave-rpm", this._numState("motor_rpm", 0));
            this._updateStatTile(root, "shave-ma", this._numState("motor_current", 0));
            const motion = this._state("motion_type", "no_motion");
            const motionLabels = {
                no_motion: "\u2014",
                small_circle: "Circles",
                large_stroke: "Strokes"
            };
            this._updateStatTile(root, "shave-motion", motionLabels[motion] || "\u2014");
        } else if (activity === "cleaning") {
            const progress = this._numState("cleaning_progress", 0);
            const cleanArc = root.querySelector(".gauge-clean-arc");
            if (cleanArc) cleanArc.setAttribute("d", $8b62e546fdd14731$var$describeArc(0, progress / 100));
            const cleanText = root.querySelector(".gauge-clean-text");
            if (cleanText) cleanText.textContent = `${Math.round(progress)}%`;
        } else {
            const batArc = root.querySelector(".gauge-bat-arc");
            if (batArc) {
                batArc.setAttribute("d", $8b62e546fdd14731$var$describeArc(0, bat / 100));
                batArc.setAttribute("stroke", bc);
            }
            const batText = root.querySelector(".gauge-bat-text");
            if (batText) batText.textContent = `${bat}%`;
        }
    }
    _updateMiniTile(root, key, frac, color, text) {
        const tile = root.querySelector(`[data-mini="${key}"]`);
        if (!tile) return;
        const val = tile.querySelector(".mini-tile-value");
        if (val) {
            val.textContent = text;
            val.style.color = color;
        }
        const arc = tile.querySelector(".mini-ring-fill");
        if (arc) {
            arc.setAttribute("d", $8b62e546fdd14731$var$ringArc(frac));
            arc.setAttribute("stroke", color);
        }
        const icon = tile.querySelector(".mini-ring-icon");
        if (icon) icon.setAttribute("fill", color);
    }
    _updateStatTile(root, key, value) {
        const el = root.querySelector(`[data-shave="${key}"]`);
        if (el) el.textContent = value;
    }
    // ---------- Header ----------
    _renderHeader() {
        const model = this._state("model_number", "");
        const name = this._config.title || "Philips Shaver";
        // Connection status
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
          <span class="model-mode">${model}</span>
        </div>
        <div class="header-right">
          <div class="conn-icons">
            <svg class="${btClass}" viewBox="0 0 24 24" fill="${btColor}">${$8b62e546fdd14731$var$ICONS.bluetooth}</svg>
            <svg class="${lanClass}" viewBox="0 0 24 24" fill="${lanColor}">${$8b62e546fdd14731$var$ICONS[lanIcon]}</svg>
          </div>
        </div>
      </div>
    `;
    }
    // ---------- Mini tiles row ----------
    _renderMiniTiles() {
        const bat = this._numState("battery", 0);
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        const head = this._numState("head_remaining", 0);
        const hc = $8b62e546fdd14731$var$headColor(head);
        const clean = this._numState("cleaning_cycles_remaining", 0);
        const cc = $8b62e546fdd14731$var$cleaningColor(clean);
        const tiles = [
            {
                key: "battery",
                label: "Battery",
                value: `${bat}%`,
                frac: bat / 100,
                color: bc,
                icon: this._state("activity", "off") === "charging" ? $8b62e546fdd14731$var$ICONS.charge : $8b62e546fdd14731$var$ICONS.charges
            },
            {
                key: "head",
                label: "Head",
                value: `${Math.round(head)}%`,
                frac: head / 100,
                color: hc,
                icon: $8b62e546fdd14731$var$ICONS.razor
            },
            {
                key: "cleaning",
                label: "Clean",
                value: clean.toFixed(0),
                frac: clean / 30,
                color: cc,
                icon: $8b62e546fdd14731$var$ICONS.droplet
            }
        ];
        const bg = $8b62e546fdd14731$var$ringBgArc();
        return `
      <div class="tiles-row">
        ${tiles.map((t)=>`
          <div class="mini-tile" data-mini="${t.key}">
            <div class="mini-ring-wrap">
              <svg class="mini-ring-svg" viewBox="0 0 36 36">
                <path d="${bg}" fill="none" stroke="var(--ps-track)" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
                <path class="mini-ring-fill" d="${$8b62e546fdd14731$var$ringArc(t.frac)}" fill="none" stroke="${t.color}" stroke-width="${$8b62e546fdd14731$var$RING.SW}" stroke-linecap="round"/>
              </svg>
              <svg class="mini-ring-icon" viewBox="0 0 24 24" fill="${t.color}">${t.icon}</svg>
            </div>
            <div class="mini-tile-info">
              <span class="mini-tile-label">${t.label}</span>
              <span class="mini-tile-value" style="color:${t.color}">${t.value}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    }
    // ---------- Gauge ----------
    _renderGauge() {
        const activity = this._state("activity", "off");
        if (activity === "shaving") return this._renderPressureGauge();
        if (activity === "cleaning") return this._renderCleaningGauge();
        return this._renderBatteryGauge(activity === "charging");
    }
    _renderPressureGauge() {
        const { CX: cx, CY: cy, R: r, STROKE: st, PRESSURE_MAX: max } = $8b62e546fdd14731$var$GAUGE;
        const pressure = this._numState("pressure", 0);
        const pState = this._state("pressure_state", "no_contact");
        const elapsed = this._elapsed || this._numState("shaving_time", 0);
        const tm = Math.floor(elapsed / 60);
        const ts = elapsed % 60;
        const timerStr = String(tm).padStart(2, "0") + ":" + String(ts).padStart(2, "0");
        const needleFrac = Math.min(pressure / max, 0.99);
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
        // Zone separator lines
        const sepLines = [
            base,
            low,
            high
        ].map((f)=>{
            const inner = $8b62e546fdd14731$var$fracToXY(f, r - 12);
            const outer = $8b62e546fdd14731$var$fracToXY(f, r + 12);
            return `<line x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}" class="zone-separator"/>`;
        }).join("");
        const tip = $8b62e546fdd14731$var$fracToXY(needleFrac, r - 16);
        return `
      <div class="gauge-section">
        <svg class="gauge-svg" width="${$8b62e546fdd14731$var$GAUGE_W}" height="186" viewBox="0 0 ${$8b62e546fdd14731$var$GAUGE_W} 186">
          <!-- Track -->
          <path d="${$8b62e546fdd14731$var$describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="butt"/>
          <!-- Zones -->
          <path d="${$8b62e546fdd14731$var$describeArc(0, base)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="round" class="zone-arc"/>
          <path d="${$8b62e546fdd14731$var$describeArc(base, low)}" fill="none" stroke="#42a5f5" stroke-width="${st}" class="zone-arc" opacity="0.5"/>
          <path d="${$8b62e546fdd14731$var$describeArc(low, high)}" fill="none" stroke="#4caf50" stroke-width="${st}" class="zone-arc" opacity="0.65"/>
          <path d="${$8b62e546fdd14731$var$describeArc(high, 1)}" fill="none" stroke="#ff9800" stroke-width="${st}" stroke-linecap="round" class="zone-arc" opacity="0.5"/>
          <!-- Zone separators -->
          ${sepLines}
          <!-- Session timer -->
          <text x="${cx}" y="${cy - 48}" text-anchor="middle" font-size="10" fill="var(--ps-text-dimmest)" font-family="inherit" letter-spacing="1.5" text-transform="uppercase">SESSION</text>
          <text class="gauge-timer" x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="38" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="'SF Mono','Menlo','Consolas',monospace" letter-spacing="1">${timerStr}</text>
          <!-- Needle -->
          <line x1="${cx}" y1="${cy + 10}" x2="${tip.x}" y2="${tip.y}" stroke="${nc}" stroke-width="6" class="needle-glow"/>
          <line x1="${cx}" y1="${cy + 10}" x2="${tip.x}" y2="${tip.y}" stroke="${nc}" stroke-width="3" class="needle-line"/>
          <!-- Hub -->
          <circle cx="${cx}" cy="${cy + 10}" r="8" fill="var(--ps-card-bg)" stroke="var(--ps-border)" stroke-width="2"/>
          <circle class="gauge-hub-dot" cx="${cx}" cy="${cy + 10}" r="4" fill="${nc}"/>
          <!-- Edge labels -->
          <text x="26" y="${cy + 28}" class="gauge-edge-label" text-anchor="start">Low</text>
          <text x="${$8b62e546fdd14731$var$GAUGE_W - 26}" y="${cy + 28}" class="gauge-edge-label" text-anchor="end">High</text>
        </svg>
        <div class="pressure-label" style="color:${nc}">${stateLabels[pState] || "\u2014"}</div>
        <div class="pressure-value">${pressure > 0 ? pressure : "\u2014"}</div>
      </div>
    `;
    }
    _renderBatteryGauge(isCharging) {
        const { CX: cx, CY: cy, R: r, STROKE: st } = $8b62e546fdd14731$var$GAUGE;
        const bat = this._numState("battery", 0);
        const bc = $8b62e546fdd14731$var$batteryColor(bat);
        const arcClass = isCharging ? "gauge-bat-arc charging-arc" : "gauge-bat-arc";
        return `
      <div class="gauge-section">
        <svg class="gauge-svg" width="${$8b62e546fdd14731$var$GAUGE_W}" height="180" viewBox="0 0 ${$8b62e546fdd14731$var$GAUGE_W} 180">
          <path d="${$8b62e546fdd14731$var$describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="round"/>
          <path class="${arcClass}" d="${$8b62e546fdd14731$var$describeArc(0, bat / 100)}" fill="none" stroke="${bc}" stroke-width="${st}" stroke-linecap="round"/>
          <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="52" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="inherit" letter-spacing="-2">
            <tspan class="gauge-bat-text">${bat}%</tspan>
          </text>
          <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="13" fill="${isCharging ? "#4caf50" : "var(--ps-text-dim)"}" font-family="inherit">
            ${isCharging ? "\u26A1 Charging" : "Battery"}
          </text>
        </svg>
        <div class="gauge-status" style="color:${isCharging ? "#4caf50" : "var(--ps-text-dimmest)"}">
          ${isCharging ? "Plugged In" : "Standby"}
        </div>
      </div>
    `;
    }
    _renderCleaningGauge() {
        const { CX: cx, CY: cy, STROKE: st } = $8b62e546fdd14731$var$GAUGE;
        const progress = this._numState("cleaning_progress", 0);
        const frac = Math.max(0, Math.min(1, progress / 100));
        const color = "#42a5f5";
        return `
      <div class="gauge-section">
        <svg class="gauge-svg" width="${$8b62e546fdd14731$var$GAUGE_W}" height="180" viewBox="0 0 ${$8b62e546fdd14731$var$GAUGE_W} 180">
          <path d="${$8b62e546fdd14731$var$describeArc(0, 1)}" fill="none" stroke="var(--ps-track)" stroke-width="${st}" stroke-linecap="round"/>
          <path class="gauge-clean-arc charging-arc" d="${$8b62e546fdd14731$var$describeArc(0, frac)}" fill="none" stroke="${color}" stroke-width="${st}" stroke-linecap="round"/>
          <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="52" font-weight="700" fill="var(--primary-text-color, #fff)" font-family="inherit" letter-spacing="-2">
            <tspan class="gauge-clean-text">${Math.round(progress)}%</tspan>
          </text>
          <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="13" fill="var(--ps-text-dim)" font-family="inherit">
            ${$8b62e546fdd14731$var$ICONS.droplet ? `<tspan>Cleaning</tspan>` : "Cleaning"}
          </text>
        </svg>
        <div class="gauge-status" style="color:${color}">
          In Progress
        </div>
      </div>
    `;
    }
    // ---------- Stats ----------
    _renderStats() {
        const activity = this._state("activity", "off");
        const isShaving = activity === "shaving";
        const isCharging = activity === "charging";
        if (isShaving) return this._renderShaveStats();
        let rows = "";
        if (isCharging) rows = this._statRow("charges", "Charge Cycles", this._numState("amount_of_charges", 0)) + this._statRow("clock", "Last Session", $8b62e546fdd14731$var$formatSession(this._numState("shaving_time", 0))) + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0)) + this._statRow("clock", "Total Time", $8b62e546fdd14731$var$formatAge(this._numState("total_age", 0)));
        else if (activity === "cleaning") {
            const remaining = this._numState("cleaning_cycles_remaining", 0);
            rows = this._statRow("droplet", "Cycles Remaining", remaining.toFixed(1)) + this._statRow("clock", "Last Session", $8b62e546fdd14731$var$formatSession(this._numState("shaving_time", 0))) + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0));
        } else {
            const daysUsed = this._numState("days_last_used", null);
            const daysText = daysUsed === null ? "\u2014" : daysUsed === 0 ? "Today" : daysUsed === 1 ? "Yesterday" : `${daysUsed}d ago`;
            rows = this._statRow("clock", "Last Session", $8b62e546fdd14731$var$formatSession(this._numState("shaving_time", 0))) + this._statRow("calendar", "Last Used", daysText) + this._statRow("clock", "Total Time", $8b62e546fdd14731$var$formatAge(this._numState("total_age", 0))) + this._statRow("counter", "Total Uses", this._numState("amount_of_operational_turns", 0));
        }
        return `<div class="stats">${rows}</div>`;
    }
    _renderShaveStats() {
        const rpm = this._numState("motor_rpm", 0);
        const ma = this._numState("motor_current", 0);
        const motion = this._state("motion_type", "no_motion");
        const motionLabels = {
            no_motion: "\u2014",
            small_circle: "Circles",
            large_stroke: "Strokes"
        };
        return `
      <div class="shave-stats">
        <div class="shave-stat-tile">
          <div class="shave-stat-val" data-shave="shave-rpm">${rpm}</div>
          <div class="shave-stat-label">RPM</div>
        </div>
        <div class="shave-stat-tile">
          <div class="shave-stat-val" data-shave="shave-ma">${ma}</div>
          <div class="shave-stat-label">mA</div>
        </div>
        <div class="shave-stat-tile">
          <div class="shave-stat-val" data-shave="shave-motion">${motionLabels[motion] || "\u2014"}</div>
          <div class="shave-stat-label">Motion</div>
        </div>
      </div>
    `;
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
console.info("%c PHILIPS-SHAVER-CARD %c v0.1.0 ", "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700", "color:#1c1c1c;background:#ffab40;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700");


