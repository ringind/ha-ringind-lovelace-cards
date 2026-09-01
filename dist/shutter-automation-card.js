/* Shutter (Rolladen) sun-automation card (custom:shutter-automation-card)
 *   - Reusable for any side of the house (east/south/…) — every entity is picked
 *     explicitly in the editor, nothing is hardcoded or defaulted.
 *   - `mode`: "popup" (default) opens the config/info workflow in a modal
 *     <dialog>; "dropdown" expands it inline under the header; "inline" shows
 *     it permanently (no toggle button).
 *   - Collapsed (and always-visible) row: the automation on/off switch, the
 *     auto-opening on/off switch, and the close/open shutter buttons. Tapping
 *     the header/expander reveals the rest: the "Schliessen, wenn" / "Öffnen,
 *     wenn" threshold workflow (live +/- steppers, no hardcoded min/max/step —
 *     read from each input_number, with the current live value shown alongside
 *     each threshold) plus an info column embedding the same custom:horizon-card
 *     the original subview used, and optional outdoor sensor/weather readouts.
 *   - `language`: "auto" (follows HA), "de" or "en".
 * Code comments English; user-facing strings German/English via localization/.
 *
 * config:
 *   type: custom:shutter-automation-card
 *   title: "Automatik Ostseite"                 # optional; falls back to a translated default
 *   mode: popup                                 # "popup" (default) | "dropdown" | "inline"
 *   language: auto                              # "auto" | "de" | "en"
 *   automation_active:  input_boolean....
 *   opening_active:     input_boolean....
 *   close_azimuth:      input_number....
 *   close_temp:         input_number....
 *   close_brightness:   input_number....
 *   open_azimuth:       input_number....
 *   open_elevation:     input_number....
 *   open_brightness:    input_number....
 *   close_script:       script....
 *   open_script:        script....
 *   sun_entity:          sun.sun                # optional — shows the horizon-card + live az/el values
 *   brightness_sensor:  sensor....               # optional info readouts
 *   temperature_sensor: sensor....
 *   wind_sensor:        sensor....
 *   weather_entity:     weather....
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
const DE = { "shutter-automation-card": {
  title: "Rolladen-Automatik",
  close: "Schließen",
  disc: "Konfiguration & Info",
  less: "Weniger",
  automation_active: "Automatisierung aktiv",
  opening_active: "Rolladen öffnen aktiv",
  close_action: "Schliesse Rolläden",
  open_action: "Öffne Rolläden",
  h_close: "Schliessen, wenn",
  h_open: "Öffnen, wenn",
  h_info: "Sonnenstandsinfo",
  lbl_azimuth_close: "Azimut >",
  lbl_temp_close: "und Außentemperatur >",
  lbl_brightness_close: "und Außenhelligkeit >",
  lbl_azimuth_open: "Azimut >",
  lbl_elevation_open: "und Höhenwinkel <",
  lbl_brightness_open: "oder Außenhelligkeit <",
  lbl_brightness_sensor: "Außenhelligkeit",
  lbl_temperature_sensor: "Außentemperatur",
  lbl_wind_sensor: "Windgeschwindigkeit",
  lbl_weather: "Wetter",
  actual: "Aktuell",
  horizon_missing: "Sonnenstands-Karte (horizon-card) nicht verfügbar.",
  cond_close_met: "Schließen-Bedingung aktuell erfüllt",
  cond_open_met: "Öffnen-Bedingung aktuell erfüllt",
  cond_none: "Keine Bedingung aktuell erfüllt",
  not_found: "Keine Entitäten konfiguriert – bitte im Karten-Editor auswählen.",
  e_title: "Titel",
  e_mode: "Anzeige",
  e_language: "Sprache",
  e_popup: "Popup",
  e_dropdown: "Ausklappen (Dropdown)",
  e_inline: "Inline (immer sichtbar)",
  e_auto: "Automatisch (HA)",
  e_de: "Deutsch",
  e_en: "Englisch",
  e_grp_status: "Status",
  e_grp_close: "Schliessen, wenn",
  e_grp_open: "Öffnen, wenn",
  e_grp_actions: "Rolläden-Aktionen",
  e_grp_info: "Info-Anzeige (optional)",
  e_automation_active: "Automatisierung aktiv (input_boolean)",
  e_opening_active: "Rolladen öffnen aktiv (input_boolean)",
  e_close_azimuth: "Azimut-Schwelle Schliessen (input_number)",
  e_close_temp: "Temperatur-Schwelle Schliessen (input_number)",
  e_close_brightness: "Helligkeits-Schwelle Schliessen (input_number)",
  e_open_azimuth: "Azimut-Schwelle Öffnen (input_number)",
  e_open_elevation: "Höhenwinkel-Schwelle Öffnen (input_number)",
  e_open_brightness: "Helligkeits-Schwelle Öffnen (input_number)",
  e_close_script: "Skript: Rolläden schliessen",
  e_open_script: "Skript: Rolläden öffnen",
  e_sun_entity: "Sonnenstand-Entität (sun)",
  e_brightness_sensor: "Sensor: Außenhelligkeit",
  e_temperature_sensor: "Sensor: Außentemperatur",
  e_wind_sensor: "Sensor: Windgeschwindigkeit",
  e_weather_entity: "Wetter-Entität"
} };
const EN = { "shutter-automation-card": {
  title: "Shutter Automation",
  close: "Close",
  disc: "Configuration & Info",
  less: "Less",
  automation_active: "Automation active",
  opening_active: "Auto-opening active",
  close_action: "Close shutters",
  open_action: "Open shutters",
  h_close: "Close when",
  h_open: "Open when",
  h_info: "Sun position",
  lbl_azimuth_close: "Azimuth >",
  lbl_temp_close: "and outdoor temperature >",
  lbl_brightness_close: "and outdoor brightness >",
  lbl_azimuth_open: "Azimuth >",
  lbl_elevation_open: "and elevation <",
  lbl_brightness_open: "or outdoor brightness <",
  lbl_brightness_sensor: "Outdoor brightness",
  lbl_temperature_sensor: "Outdoor temperature",
  lbl_wind_sensor: "Wind speed",
  lbl_weather: "Weather",
  actual: "Currently",
  horizon_missing: "Sun-position card (horizon-card) not available.",
  cond_close_met: "Close condition currently met",
  cond_open_met: "Open condition currently met",
  cond_none: "No condition currently met",
  not_found: "No entities configured — set them up in the card editor.",
  e_title: "Title",
  e_mode: "Display",
  e_language: "Language",
  e_popup: "Popup",
  e_dropdown: "Dropdown",
  e_inline: "Inline (always shown)",
  e_auto: "Automatic (HA)",
  e_de: "German",
  e_en: "English",
  e_grp_status: "Status",
  e_grp_close: "Close when",
  e_grp_open: "Open when",
  e_grp_actions: "Shutter actions",
  e_grp_info: "Info display (optional)",
  e_automation_active: "Automation active (input_boolean)",
  e_opening_active: "Auto-opening active (input_boolean)",
  e_close_azimuth: "Azimuth threshold, close (input_number)",
  e_close_temp: "Temperature threshold, close (input_number)",
  e_close_brightness: "Brightness threshold, close (input_number)",
  e_open_azimuth: "Azimuth threshold, open (input_number)",
  e_open_elevation: "Elevation threshold, open (input_number)",
  e_open_brightness: "Brightness threshold, open (input_number)",
  e_close_script: "Script: close shutters",
  e_open_script: "Script: open shutters",
  e_sun_entity: "Sun position entity (sun)",
  e_brightness_sensor: "Sensor: outdoor brightness",
  e_temperature_sensor: "Sensor: outdoor temperature",
  e_wind_sensor: "Sensor: wind speed",
  e_weather_entity: "Weather entity"
} };
const I18N = { de: DE["shutter-automation-card"], en: EN["shutter-automation-card"] };

const STYLE = `
:host{--acc:var(--primary-color);display:block}
ha-card{padding:14px 14px 12px;overflow:hidden}
.hd{display:flex;align-items:center;gap:10px;cursor:pointer;min-height:30px}
.hd>ha-icon{--mdc-icon-size:22px;color:var(--acc);flex:0 0 auto}
.ttl{font-weight:800;font-size:16px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
:host(.inline) .hd{cursor:default}
.toggle-btn{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.toggle-btn ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.toggle-btn.open ha-icon{transform:rotate(180deg)}

.mainrow{margin-top:8px}
.swrow{display:flex;align-items:center;gap:10px;padding:8px 2px}
.swrow .ic{--mdc-icon-size:20px;color:var(--secondary-text-color);flex:0 0 auto}
.swrow .lbl{flex:1;min-width:0;font-size:.9375rem;color:var(--primary-text-color)}
.sw{position:relative;width:44px;height:26px;border-radius:13px;background:var(--divider-color);border:none;cursor:pointer;flex:0 0 auto;transition:background .2s;padding:0}
.sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
.sw.on{background:var(--acc)}
.sw.on::after{transform:translateX(18px)}

.cmds{display:flex;gap:8px;margin-top:6px}
.cmd{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:13px;padding:12px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;background:var(--divider-color);color:var(--primary-text-color)}
.cmd ha-icon{--mdc-icon-size:19px}
.cmd:active{transform:scale(.97)}

.warn{padding:20px;color:var(--secondary-text-color);font-size:13px;text-align:center}

.more[hidden]{display:none}
.more{margin-top:4px}
.cols{display:flex;flex-wrap:wrap;gap:22px;margin-top:2px}
.col{flex:1 1 260px;min-width:230px}
.sec{font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--secondary-text-color);margin:16px 0 6px;display:flex;align-items:center;gap:6px}
.sec:first-child{margin-top:0}
.sec ha-icon{--mdc-icon-size:15px}

.st-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:7px 2px}
.st-row .lbl{flex:1;min-width:0;font-size:.875rem;color:var(--primary-text-color)}
.stbtn{border:none;background:var(--divider-color);color:var(--primary-text-color);width:28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.stbtn ha-icon{--mdc-icon-size:16px}
.stbtn:active{background:var(--acc);color:#fff}
.stval{min-width:66px;text-align:center;font-weight:700;font-variant-numeric:tabular-nums;font-size:.8125rem;color:var(--secondary-text-color)}
.st-live{flex:1 1 100%;text-align:right;font-size:.75rem;color:var(--secondary-text-color)}
.st-live b{color:var(--primary-text-color);font-weight:700}

.stat{display:flex;align-items:center;gap:8px;padding:8px 2px;font-size:12.5px;color:var(--primary-text-color);border-bottom:1px solid var(--divider-color);cursor:pointer}
.stat ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.stat b{margin-left:auto;font-weight:700;color:var(--secondary-text-color)}
.stat:last-child{border-bottom:none}

.compass{position:relative;width:100%;margin:2px 0 8px}
.cond{display:flex;align-items:center;gap:7px;justify-content:center;font-size:11.5px;font-weight:700;color:var(--secondary-text-color);margin:0 auto 12px;text-align:center}
.cond .dot{width:8px;height:8px;border-radius:50%;background:var(--disabled-text-color);flex:0 0 auto}
.cond.close .dot{background:#f59e0b}
.cond.open .dot{background:#22c55e}

dialog.pop{border:none;margin:auto;padding:0;width:min(620px, calc(100vw - 32px));max-width:min(620px, calc(100vw - 32px));max-height:calc(100% - 72px);border-radius:var(--ha-dialog-border-radius, 28px);color:var(--primary-text-color);background:var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));box-shadow:0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);font-family:var(--mdc-typography-body1-font-family, var(--ha-font-family-body, inherit));font-size:1rem;overflow:hidden;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
dialog.pop[open]{display:flex;flex-direction:column}
dialog.pop::backdrop{background:transparent}
.pop-hd{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:24px 24px 8px;font-size:1.574rem;font-weight:400;line-height:1.2;color:var(--primary-text-color)}
.pop-hd>ha-icon{--mdc-icon-size:24px;color:var(--acc);flex:0 0 auto}
.pop-ttl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x{flex:0 0 auto;border:none;background:none;cursor:pointer;color:var(--secondary-text-color);width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
.x:hover{background:var(--secondary-background-color, rgba(127,127,127,.15))}
.x ha-icon{--mdc-icon-size:24px}
.pop-bd{flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 24px 24px}

@media(max-width:600px){.cols{flex-direction:column;gap:0}}
@media all and (max-width:450px), all and (max-height:500px){
  dialog.pop{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0}
  .pop-hd{padding-top:max(24px, env(safe-area-inset-top))}
  .pop-bd{padding-bottom:max(24px, env(safe-area-inset-bottom))}
}
`;

const STEP_CLOSE = [
  ["close_azimuth", "lbl_azimuth_close", "mdi:sun-angle", "azimuth"],
  ["close_temp", "lbl_temp_close", "mdi:thermometer-plus", "temperature_sensor"],
  ["close_brightness", "lbl_brightness_close", "mdi:brightness-6", "brightness_sensor"],
];
const STEP_OPEN = [
  ["open_azimuth", "lbl_azimuth_open", "mdi:sun-angle", "azimuth"],
  ["open_elevation", "lbl_elevation_open", "mdi:angle-acute", "elevation"],
  ["open_brightness", "lbl_brightness_open", "mdi:brightness-6", "brightness_sensor"],
];

class ShutterAutomationCard extends HTMLElement {
  static getStubConfig() { return { mode: "popup", language: "auto" }; }
  static getConfigElement() { return document.createElement("shutter-automation-card-editor"); }
  setConfig(c) {
    const prevSig = this._psig;
    this._cfg = Object.assign({ mode: "popup", language: "auto" }, c || {});
    this._popup = this._cfg.mode === "popup";
    this._inline = this._cfg.mode === "inline";
    this._open = false;
    this._psig = this._cfg.mode + "|" + this._cfg.language;
    if (this.shadowRoot && prevSig !== undefined && prevSig !== this._psig) {
      this.shadowRoot.innerHTML = ""; this._sig = null; this._delegated = false;
      this._build(); if (this._hass) this._render();
    }
  }
  getCardSize() { return 8; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  disconnectedCallback() {
    // A view switch tears the card down; never carry an open modal dialog across it.
    const d = this.shadowRoot && this.shadowRoot.getElementById("pop");
    if (d && d.open) { try { d.close(); } catch (_e) { /* ignore */ } }
  }

  _lang() {
    const c = (this._cfg && this._cfg.language) || "auto";
    if (c === "de" || c === "en") return c;
    const hl = (this._hass && this._hass.language || "").toLowerCase();
    return hl.startsWith("de") ? "de" : "en";
  }
  _t(k) { return (I18N[this._lang()] || I18N.de)[k] || k; }

  _e(id) { return id && this._hass && this._hass.states[id]; }
  _num(id) { const e = this._e(id); const v = parseFloat(e && e.state); return isNaN(v) ? null : v; }
  _sunAttr(name) {
    const e = this._e(this._cfg.sun_entity);
    const v = e && e.attributes && e.attributes[name];
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }

  _toggle() {
    if (this._inline) return;
    if (this._popup) { this._openPop(); return; }
    this._open = !this._open;
    this.$("more").hidden = !this._open;
    this.$("toggleBtn").classList.toggle("open", this._open);
  }
  _openPop() {
    const d = this.$("pop");
    if (!d) return;
    if (d.open) { try { d.close(); } catch (_e) { /* ignore */ } }
    try { d.showModal(); } catch (_e) { d.removeAttribute("open"); try { d.showModal(); } catch (_e2) { /* ignore */ } }
  }

  _adjust(id, dir) {
    const e = this._e(id); if (!e) return;
    const a = e.attributes || {};
    const min = a.min != null ? Number(a.min) : -Infinity;
    const max = a.max != null ? Number(a.max) : Infinity;
    const step = a.step != null ? Number(a.step) : 1;
    let v = (parseFloat(e.state) || 0) + dir * step;
    v = Math.max(min, Math.min(max, v));
    v = Math.round(v / step) * step;
    this._svc("input_number", "set_value", { entity_id: id, value: v });
  }

  _swRow(id, labelKey, icon) {
    if (!id) return "";
    const on = this._e(id) && this._e(id).state === "on";
    return `<div class="swrow"><ha-icon class="ic" icon="${icon}"></ha-icon><span class="lbl">${this._t(labelKey)}</span><button class="sw${on ? " on" : ""}" data-toggle="${id}" aria-label="${this._t(labelKey)}"></button></div>`;
  }
  // `liveSrc` names where the actual/current counterpart of this threshold comes
  // from: "azimuth"/"elevation" read off the configured sun entity, or another
  // config key (e.g. "temperature_sensor") whose entity's state is the live value.
  _liveValue(liveSrc) {
    if (liveSrc === "azimuth" || liveSrc === "elevation") {
      const v = this._sunAttr(liveSrc);
      return v == null ? null : { v, unit: "°" };
    }
    const id = this._cfg[liveSrc];
    const e = this._e(id);
    if (!e) return null;
    const v = parseFloat(e.state);
    if (isNaN(v)) return null;
    return { v, unit: (e.attributes && e.attributes.unit_of_measurement) || "" };
  }
  _fmtNum(v, unit) { return (Number.isInteger(v) ? v : v.toFixed(1)) + (unit ? " " + unit : ""); }
  _stepRow(key, labelKey, icon, liveSrc) {
    const id = this._cfg[key];
    const e = this._e(id);
    if (!e) return "";
    const unit = (e.attributes && e.attributes.unit_of_measurement) || "";
    const v = parseFloat(e.state);
    const disp = isNaN(v) ? "–" : this._fmtNum(v, unit);
    const live = liveSrc ? this._liveValue(liveSrc) : null;
    return `<div class="st-row"><ha-icon icon="${icon}"></ha-icon><span class="lbl">${this._t(labelKey)}</span>` +
      `<button class="stbtn" data-adj="${id}|-1"><ha-icon icon="mdi:minus"></ha-icon></button>` +
      `<span class="stval">${disp}</span>` +
      `<button class="stbtn" data-adj="${id}|1"><ha-icon icon="mdi:plus"></ha-icon></button>` +
      (live ? `<span class="st-live">${this._t("actual")}: <b>${this._fmtNum(live.v, live.unit)}</b></span>` : "") +
      `</div>`;
  }
  _statRow(id, labelKey, icon, formatter) {
    const e = this._e(id);
    if (!e) return "";
    const val = formatter ? formatter(e) : e.state + ((e.attributes && e.attributes.unit_of_measurement) ? " " + e.attributes.unit_of_measurement : "");
    return `<div class="stat" data-mi="${id}"><ha-icon icon="${icon}"></ha-icon>${this._t(labelKey)}<b>${val}</b></div>`;
  }

  // The info column reuses the same custom:horizon-card the original subview used
  // (rather than a self-drawn compass) so azimuth/elevation and the cardinal
  // labels render exactly as HA's own N/E/S/W-aware card lays them out. It's a
  // live DOM element, not an HTML string — mounted separately in _render() so a
  // cols.innerHTML replacement doesn't tear it down on every unrelated update.
  _mountHorizonCard() {
    const wrap = this.$("sunViz");
    if (!wrap) return;
    if (!customElements.get("horizon-card")) {
      wrap.innerHTML = `<div class="warn">${this._t("horizon_missing")}</div>`;
      return;
    }
    wrap.innerHTML = "";
    const hc = document.createElement("horizon-card");
    try { hc.setConfig({ title: null, fields: { azimuth: true, elevation: true } }); } catch (_e) { /* ignore */ }
    hc.hass = this._hass;
    wrap.appendChild(hc);
  }

  _condition() {
    const c = this._cfg;
    const az = this._sunAttr("azimuth");
    const el = this._sunAttr("elevation");
    if (az == null || el == null) return null;
    const bri = c.brightness_sensor ? this._num(c.brightness_sensor) : null;
    const temp = c.temperature_sensor ? this._num(c.temperature_sensor) : null;
    const closeAz = c.close_azimuth ? this._num(c.close_azimuth) : null;
    const closeTemp = c.close_temp ? this._num(c.close_temp) : null;
    const closeBri = c.close_brightness ? this._num(c.close_brightness) : null;
    const openAz = c.open_azimuth ? this._num(c.open_azimuth) : null;
    const openEl = c.open_elevation ? this._num(c.open_elevation) : null;
    const openBri = c.open_brightness ? this._num(c.open_brightness) : null;
    const canClose = closeAz != null && closeTemp != null && closeBri != null && temp != null && bri != null;
    const canOpen = openAz != null && openEl != null && openBri != null && bri != null;
    if (canClose && az > closeAz && temp > closeTemp && bri > closeBri) return "close";
    if (canOpen && ((az > openAz && el < openEl) || bri < openBri)) return "open";
    if (canClose || canOpen) return "none";
    return null;
  }
  _condHTML() {
    const cond = this._condition();
    if (cond == null) return "";
    const cls = "cond" + (cond === "close" ? " close" : cond === "open" ? " open" : "");
    const txt = cond === "close" ? this._t("cond_close_met") : cond === "open" ? this._t("cond_open_met") : this._t("cond_none");
    return `<div class="${cls}"><span class="dot"></span>${txt}</div>`;
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const popup = this._popup, inline = this._inline;
    const ttl = this._cfg.title || this._t("title");
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd" id="hd">
  <ha-icon icon="mdi:window-shutter-auto"></ha-icon>
  <span class="ttl" id="ttl">${ttl}</span>
  ${inline ? "" : `<button class="toggle-btn" id="toggleBtn" title="${this._t("disc")}"><ha-icon icon="${popup ? "mdi:tune-variant" : "mdi:chevron-down"}"></ha-icon></button>`}
 </div>
 <div class="mainrow" id="mainrow"></div>
 ${popup ? "" : `<div class="more" id="more"${inline ? "" : " hidden"}><div id="cols"></div></div>`}
</ha-card>
${popup ? `<dialog class="pop" id="pop">
 <div class="pop-hd">
  <ha-icon icon="mdi:window-shutter-auto"></ha-icon>
  <span class="pop-ttl" id="popTtl">${ttl}</span>
  <button class="x" id="closeBtn" title="${this._t("close")}"><ha-icon icon="mdi:close"></ha-icon></button>
 </div>
 <div class="pop-bd"><div id="cols"></div></div>
</dialog>` : ""}`;
    this.$ = (id) => r.getElementById(id);
    this.classList.toggle("inline", inline);
    if (!inline) {
      this.$("hd").addEventListener("click", () => this._toggle());
    }
    if (popup) {
      this.$("closeBtn").onclick = () => this.$("pop").close();
      this.$("pop").addEventListener("click", (e) => { if (e.target === this.$("pop")) this.$("pop").close(); });
    }
    // Delegated once on the shadow root — survives every re-render (innerHTML
    // swaps only replace children, not listeners bound to `r` itself), so this
    // must only ever be attached a single time per element instance.
    if (!this._delegated) {
      this._delegated = true;
      r.addEventListener("click", (e) => {
        const sw = e.target.closest("[data-toggle]");
        if (sw) { this._svc("input_boolean", "toggle", { entity_id: sw.dataset.toggle }); return; }
        const sc = e.target.closest("[data-script]");
        if (sc) { this._svc("script", "turn_on", { entity_id: sc.dataset.script }); return; }
        const adj = e.target.closest("[data-adj]");
        if (adj) { const [id, dir] = adj.dataset.adj.split("|"); this._adjust(id, Number(dir)); return; }
        const mi = e.target.closest("[data-mi]");
        if (mi) { this._mi(mi.dataset.mi); }
      });
    }
  }

  _renderMainRow() {
    const c = this._cfg;
    let html = this._swRow(c.automation_active, "automation_active", "mdi:window-shutter-auto") +
      this._swRow(c.opening_active, "opening_active", "mdi:window-shutter-auto");
    const btns = [];
    if (c.close_script) btns.push(`<button class="cmd" data-script="${c.close_script}"><ha-icon icon="mdi:window-shutter"></ha-icon>${this._t("close_action")}</button>`);
    if (c.open_script) btns.push(`<button class="cmd" data-script="${c.open_script}"><ha-icon icon="mdi:window-shutter-open"></ha-icon>${this._t("open_action")}</button>`);
    if (btns.length) html += `<div class="cmds">${btns.join("")}</div>`;
    this.$("mainrow").innerHTML = html || `<div class="warn">${this._t("not_found")}</div>`;
  }

  _colsHTML() {
    const c = this._cfg;
    let left = "";
    const closeRows = STEP_CLOSE.map(([k, l, i, s]) => this._stepRow(k, l, i, s)).filter(Boolean).join("");
    if (closeRows) left += `<div class="sec"><ha-icon icon="mdi:close"></ha-icon>${this._t("h_close")}</div>${closeRows}`;
    const openRows = STEP_OPEN.map(([k, l, i, s]) => this._stepRow(k, l, i, s)).filter(Boolean).join("");
    if (openRows) left += `<div class="sec"><ha-icon icon="mdi:blinds-open"></ha-icon>${this._t("h_open")}</div>${openRows}`;

    let right = "";
    const hasSun = !!(c.sun_entity && this._e(c.sun_entity));
    const statRows = [
      this._statRow(c.brightness_sensor, "lbl_brightness_sensor", "mdi:brightness-6"),
      this._statRow(c.temperature_sensor, "lbl_temperature_sensor", "mdi:thermometer"),
      this._statRow(c.wind_sensor, "lbl_wind_sensor", "mdi:weather-windy"),
      c.weather_entity ? this._statRow(c.weather_entity, "lbl_weather", "mdi:weather-partly-cloudy",
        (e) => (e.attributes.temperature != null ? Math.round(e.attributes.temperature) + "°" : "") + " · " + e.state) : "",
    ].filter(Boolean).join("");
    if (hasSun || statRows) {
      right += `<div class="sec"><ha-icon icon="mdi:weather-sunny"></ha-icon>${this._t("h_info")}</div>`;
      if (hasSun) { right += `<div class="compass" id="sunViz"></div>`; right += this._condHTML(); }
      right += statRows;
    }

    if (!left && !right) return `<div class="warn">${this._t("not_found")}</div>`;
    return `<div class="cols">${left ? `<div class="col">${left}</div>` : ""}${right ? `<div class="col">${right}</div>` : ""}</div>`;
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    const ttl = c.title || this._t("title");
    if (this.$("ttl")) this.$("ttl").textContent = ttl;
    if (this.$("popTtl")) this.$("popTtl").textContent = ttl;

    const KEYS = ["automation_active", "opening_active", "close_azimuth", "close_temp", "close_brightness",
      "open_azimuth", "open_elevation", "open_brightness", "close_script", "open_script", "sun_entity",
      "brightness_sensor", "temperature_sensor", "wind_sensor", "weather_entity"];
    const sig = KEYS.map((k) => { const e = this._e(c[k]); return e ? e.last_updated : ""; }).join("#");
    if (sig === this._sig) return;
    this._sig = sig;

    const auto = c.automation_active && this._e(c.automation_active);
    this.style.setProperty("--acc", auto && auto.state !== "on" ? "var(--disabled-text-color)" : "var(--primary-color)");

    this._renderMainRow();
    if (this.$("cols")) { this.$("cols").innerHTML = this._colsHTML(); this._mountHorizonCard(); }
  }
}

/* ---- visual editor ---- */
class ShutterAutomationCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _L() {
    const c = (this._config && this._config.language) || "auto";
    if (c === "de" || c === "en") return I18N[c];
    const hl = (this._hass && this._hass.language || "").toLowerCase();
    return hl.startsWith("de") ? I18N.de : I18N.en;
  }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => {
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: ev.detail.value }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const L = this._L();
    this._form.computeLabel = (s) => ({
      title: L.e_title, mode: L.e_mode, language: L.e_language,
      automation_active: L.e_automation_active, opening_active: L.e_opening_active,
      close_azimuth: L.e_close_azimuth, close_temp: L.e_close_temp, close_brightness: L.e_close_brightness,
      open_azimuth: L.e_open_azimuth, open_elevation: L.e_open_elevation, open_brightness: L.e_open_brightness,
      close_script: L.e_close_script, open_script: L.e_open_script,
      sun_entity: L.e_sun_entity, brightness_sensor: L.e_brightness_sensor, temperature_sensor: L.e_temperature_sensor,
      wind_sensor: L.e_wind_sensor, weather_entity: L.e_weather_entity,
    }[s.name] || s.name);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "title", selector: { text: {} } },
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "popup", label: L.e_popup }, { value: "dropdown", label: L.e_dropdown }, { value: "inline", label: L.e_inline },
      ] } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en },
      ] } } },
      { name: "", type: "expandable", flatten: true, title: L.e_grp_status, icon: "mdi:toggle-switch", schema: [
        { name: "automation_active", selector: { entity: { domain: "input_boolean" } } },
        { name: "opening_active", selector: { entity: { domain: "input_boolean" } } },
      ] },
      { name: "", type: "expandable", flatten: true, title: L.e_grp_close, icon: "mdi:window-shutter", schema: [
        { name: "close_azimuth", selector: { entity: { domain: "input_number" } } },
        { name: "close_temp", selector: { entity: { domain: "input_number" } } },
        { name: "close_brightness", selector: { entity: { domain: "input_number" } } },
      ] },
      { name: "", type: "expandable", flatten: true, title: L.e_grp_open, icon: "mdi:window-shutter-open", schema: [
        { name: "open_azimuth", selector: { entity: { domain: "input_number" } } },
        { name: "open_elevation", selector: { entity: { domain: "input_number" } } },
        { name: "open_brightness", selector: { entity: { domain: "input_number" } } },
      ] },
      { name: "", type: "expandable", flatten: true, title: L.e_grp_actions, icon: "mdi:script-text", schema: [
        { name: "close_script", selector: { entity: { domain: "script" } } },
        { name: "open_script", selector: { entity: { domain: "script" } } },
      ] },
      { name: "", type: "expandable", flatten: true, title: L.e_grp_info, icon: "mdi:weather-sunny", schema: [
        { name: "sun_entity", selector: { entity: { domain: "sun" } } },
        { name: "brightness_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "temperature_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "wind_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "weather_entity", selector: { entity: { domain: "weather" } } },
      ] },
    ];
    this._form.data = this._config;
  }
}
customElements.define("shutter-automation-card-editor", ShutterAutomationCardEditor);

customElements.define("shutter-automation-card", ShutterAutomationCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "shutter-automation-card",
  name: "Rolladen-Automatik",
  description: "Sonnenstands-gesteuerte Rolladen-Automatik (Ost/Süd/…) — Popup/Dropdown/Inline, jede Entität frei wählbar, DE/EN.",
  preview: false,
});
