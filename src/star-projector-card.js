/* Smart Star Projector card (custom:star-projector-card)
 *   - `mode` (graphical-editor choosable): "popup" (default) opens the controls in
 *     a modal <dialog> that scales & is styled like Home Assistant's more-info
 *     dialog; "dropdown" expands them inline under the header on tap; "inline"
 *     shows them in the card permanently (no toggle button).
 *   - The overlay behind the popup is always transparent (the dashboard stays
 *     fully visible). A light blur keeps the (opaque) popup crisp.
 *   - `language`: "auto" (follows HA), "de" or "en".
 *   - Every entity is configured explicitly and selectable in the editor.
 * Code comments English.
 *
 * config:
 *   type: custom:star-projector-card
 *   title: "Sternenprojektor"     # optional; falls back to a translated default
 *   mode: popup                   # "popup" (default) | "dropdown" | "inline"
 *   language: auto                # "auto" | "de" | "en"
 *   power:    switch.smart_star_projector_master
 *   nebula:   light.smart_star_projector_background
 *   stars:    light.smart_star_projector_laser
 *   rotation: number.smart_star_projector_star_rotation_speed
 *   timer:    time.smart_star_projector_timer
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
import DE from "../localization/de.js";
import EN from "../localization/en.js";
const I18N = { de: DE["star-projector-card"], en: EN["star-projector-card"] };

const STYLE = `
:host{--acc:#7c5cff;display:block}
ha-card{padding:12px 14px}
.hd{display:flex;align-items:center;gap:9px;cursor:pointer}
.hd>ha-icon{--mdc-icon-size:20px;color:var(--acc)}
.ttl{font-weight:800;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
:host(.inline) .hd{cursor:default}
.pwr{border:none;border-radius:12px;background:var(--divider-color);color:var(--primary-text-color);width:38px;height:32px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.pwr ha-icon{--mdc-icon-size:19px}
.pwr.on{background:var(--acc);color:#fff}
.toggle-btn{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.toggle-btn ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.toggle-btn.open ha-icon{transform:rotate(180deg)}
.drop{padding-top:4px}
.drop[hidden],#body[hidden]{display:none}

.row{display:flex;align-items:center;gap:12px;min-height:44px}
.row+.row{margin-top:4px}
.row .ic{--mdc-icon-size:22px;color:var(--secondary-text-color);width:36px;text-align:center;flex:0 0 auto}
.tg{border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--secondary-text-color);width:38px;height:36px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.tg ha-icon{--mdc-icon-size:20px}
.tg.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.lbl{font-size:0.9375rem;color:var(--primary-text-color);flex:0 0 84px}
.sl{-webkit-appearance:none;appearance:none;flex:1 1 auto;height:4px;border-radius:4px;background:var(--divider-color);outline:none;cursor:pointer;min-width:70px}
.sl::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--acc);cursor:pointer}
.sl::-moz-range-thumb{width:18px;height:18px;border:none;border-radius:50%;background:var(--acc);cursor:pointer}
.col{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:4px;flex:0 0 auto;display:inline-flex}
.col ha-icon{--mdc-icon-size:20px}
.val{font-size:0.8125rem;font-weight:600;color:var(--secondary-text-color);flex:0 0 40px;text-align:right;font-variant-numeric:tabular-nums}
.chips{display:flex;flex-wrap:wrap;gap:6px;flex:1 1 auto}
.chip{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:6px 12px;font-size:0.8125rem;font-weight:600;font-family:inherit;cursor:pointer;line-height:1}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.warn{padding:24px;color:var(--secondary-text-color);font-size:0.9375rem;text-align:center}

/* --- popup: scaled + styled like Home Assistant's more-info dialog --- */
dialog.pop{
  border:none;margin:auto;padding:0;
  width:min(500px, calc(100vw - 32px));
  max-width:min(500px, calc(100vw - 32px));
  max-height:calc(100% - 72px);
  border-radius:var(--ha-dialog-border-radius, 28px);
  color:var(--primary-text-color);
  background:var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));
  box-shadow:0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);
  font-family:var(--mdc-typography-body1-font-family, var(--ha-font-family-body, inherit));
  font-size:1rem;
  overflow:hidden;
  -webkit-backdrop-filter:blur(12px);
  backdrop-filter:blur(12px);
}
dialog.pop[open]{display:flex;flex-direction:column}
/* overlay stays transparent — the dashboard behind is always fully visible */
dialog.pop::backdrop{background:transparent}
.pop-hd{
  flex:0 0 auto;display:flex;align-items:center;gap:12px;
  padding:24px 24px 12px;
  font-size:1.574rem;font-weight:400;line-height:1.2;color:var(--primary-text-color);
}
.pop-hd>ha-icon{--mdc-icon-size:24px;color:var(--acc);flex:0 0 auto}
.pop-ttl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x{flex:0 0 auto;border:none;background:none;cursor:pointer;color:var(--secondary-text-color);width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
.x:hover{background:var(--secondary-background-color, rgba(127,127,127,.15))}
.x ha-icon{--mdc-icon-size:24px}
.pop-bd{flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 24px 24px}

@media all and (max-width:450px), all and (max-height:500px){
  dialog.pop{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0}
  .pop-hd{padding-top:max(24px, env(safe-area-inset-top))}
  .pop-bd{padding-bottom:max(24px, env(safe-area-inset-bottom))}
}
`;

const DEFAULTS = {
  mode: "popup", // "popup" | "dropdown"
  language: "auto", // "auto" | "de" | "en"
  power: "switch.smart_star_projector_master",
  nebula: "light.smart_star_projector_background",
  stars: "light.smart_star_projector_laser",
  rotation: "number.smart_star_projector_star_rotation_speed",
  timer: "time.smart_star_projector_timer",
};

class StarProjectorCard extends HTMLElement {
  static getStubConfig() {
    return {
      mode: DEFAULTS.mode, power: DEFAULTS.power, nebula: DEFAULTS.nebula,
      stars: DEFAULTS.stars, rotation: DEFAULTS.rotation, timer: DEFAULTS.timer,
    };
  }
  static getConfigElement() { return document.createElement("star-projector-card-editor"); }
  setConfig(c) {
    const prev = this._cfg && this._cfg.mode + "|" + this._cfg.language;
    this._cfg = Object.assign({}, DEFAULTS, c || {});
    this._popup = this._cfg.mode === "popup";
    this._inline = this._cfg.mode === "inline";
    this._drag = new Set();
    this._open = false;
    if (this.shadowRoot && prev !== undefined && prev !== this._cfg.mode + "|" + this._cfg.language) {
      this.shadowRoot.innerHTML = "";
      this._build();
      if (this._hass) this._render();
    }
  }
  getCardSize() { return 1; }
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

  _e(id) { return this._hass && this._hass.states[id]; }
  _on(id) { const e = this._e(id); return !!e && e.state === "on"; }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }
  _dom(id) { return (id || "").split(".")[0]; }
  _brPct(id) {
    const e = this._e(id);
    if (!e || e.state !== "on") return 0;
    const b = e.attributes && e.attributes.brightness;
    return b == null ? 100 : Math.max(1, Math.round((b / 255) * 100));
  }
  _timers() {
    return [
      ["00:00:00", this._t("t_off")], ["00:15:00", this._t("t_15")], ["00:30:00", this._t("t_30")],
      ["01:00:00", this._t("t_1h")], ["02:00:00", this._t("t_2h")],
    ];
  }
  _rows() {
    return `
  <div class="row">
   <button class="tg" id="bgTg" title="${this._t("nebula_toggle")}"><ha-icon icon="mdi:blur"></ha-icon></button>
   <span class="lbl">${this._t("nebula")}</span>
   <input class="sl" id="bgSl" type="range" min="1" max="100" value="100">
   <button class="col" id="bgCol" title="${this._t("color")}"><ha-icon icon="mdi:palette"></ha-icon></button>
  </div>
  <div class="row">
   <button class="tg" id="lsTg" title="${this._t("stars_toggle")}"><ha-icon icon="mdi:star-four-points"></ha-icon></button>
   <span class="lbl">${this._t("stars")}</span>
   <input class="sl" id="lsSl" type="range" min="1" max="100" value="100">
  </div>
  <div class="row">
   <ha-icon class="ic" icon="mdi:rotate-orbit"></ha-icon>
   <span class="lbl">${this._t("rotation")}</span>
   <input class="sl" id="rotSl" type="range" min="10" max="1000" step="10" value="500">
   <span class="val" id="rotVal">–</span>
  </div>
  <div class="row">
   <ha-icon class="ic" icon="mdi:timer-outline"></ha-icon>
   <span class="lbl">${this._t("timer")}</span>
   <span class="chips" id="tmr"></span>
  </div>`;
  }

  _toggle() {
    if (this._inline) return;
    if (this._popup) { this._openPop(); return; }
    this._open = !this._open;
    this.$("body").hidden = !this._open;
    this.$("toggleBtn").classList.toggle("open", this._open);
  }

  _openPop() {
    const d = this.$("pop");
    if (!d) return;
    // Clear a stale `open` left behind when the card was detached by a view
    // switch while the dialog was showing — otherwise showModal() throws and
    // the popup button appears dead from then on.
    if (d.open) { try { d.close(); } catch (_e) { /* ignore */ } }
    try {
      d.showModal();
    } catch (_e) {
      d.removeAttribute("open");
      try { d.showModal(); } catch (_e2) { /* ignore */ }
    }
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const popup = this._popup;
    const ttl = this._cfg.title || this._t("title");
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd" id="hd">
  <ha-icon icon="mdi:creation"></ha-icon>
  <span class="ttl" id="ttl">${ttl}</span>
  ${this._inline ? "" : `<button class="toggle-btn" id="toggleBtn" title="${popup ? this._t("settings") : this._t("expand")}"><ha-icon icon="${popup ? "mdi:tune-variant" : "mdi:chevron-down"}"></ha-icon></button>`}
  <button class="pwr" id="pwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 ${popup ? "" : `<div class="drop" id="body"${this._inline ? "" : " hidden"}>${this._rows()}</div>`}
</ha-card>
${popup ? `<dialog class="pop" id="pop">
 <div class="pop-hd">
  <ha-icon icon="mdi:creation"></ha-icon>
  <span class="pop-ttl" id="popTtl">${ttl}</span>
  <button class="pwr" id="popPwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
  <button class="x" id="closeBtn" title="${this._t("close")}"><ha-icon icon="mdi:close"></ha-icon></button>
 </div>
 <div class="pop-bd" id="body">${this._rows()}</div>
</dialog>` : ""}`;
    this.$ = (id) => r.getElementById(id);
    this.classList.toggle("inline", this._inline);
    const c = this._cfg;
    if (!this._inline) {
      // Open/close from the whole header — leading icon, title and the tune/chevron
      // icon; the power button keeps its own handler.
      this.$("hd").addEventListener("click", (e) => {
        if (e.target.closest("#pwr")) return;
        this._toggle();
      });
    }
    const togglePower = () => this._svc(this._dom(c.power), "toggle", { entity_id: c.power });
    if (popup) {
      this.$("closeBtn").onclick = () => this.$("pop").close();
      this.$("pop").addEventListener("click", (e) => { if (e.target === this.$("pop")) this.$("pop").close(); });
      this.$("popPwr").onclick = togglePower;
    }
    this.$("pwr").onclick = togglePower;
    this.$("bgTg").onclick = () => this._svc(this._dom(c.nebula), "toggle", { entity_id: c.nebula });
    this.$("lsTg").onclick = () => this._svc(this._dom(c.stars), "toggle", { entity_id: c.stars });
    this.$("bgCol").onclick = () => this._mi(c.nebula);
    this._wireSlider("bgSl", (v) => this._svc("light", "turn_on", { entity_id: c.nebula, brightness_pct: v }));
    this._wireSlider("lsSl", (v) => this._svc("light", "turn_on", { entity_id: c.stars, brightness_pct: v }));
    this._wireSlider("rotSl", (v) => this._svc("number", "set_value", { entity_id: c.rotation, value: v }), "rotVal");
    this.$("tmr").addEventListener("click", (e) => {
      const b = e.target.closest("[data-t]"); if (!b) return;
      this._svc("time", "set_value", { entity_id: c.timer, time: b.dataset.t });
    });
  }

  _wireSlider(id, onChange, liveId) {
    const el = this.$(id);
    el.addEventListener("input", () => { this._drag.add(id); if (liveId) this.$(liveId).textContent = el.value; });
    el.addEventListener("change", () => { this._drag.delete(id); onChange(Number(el.value)); });
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    if (!this._e(c.power) && !this._e(c.nebula)) {
      this.$("body").innerHTML = `<div class="warn">${this._t("not_found")}</div>`;
      if (!this._popup) this.$("body").hidden = false;
      return;
    }
    const t = c.title || this._t("title");
    this.$("ttl").textContent = t;
    if (this.$("popTtl")) this.$("popTtl").textContent = t;
    const powerOn = this._on(c.power);
    this.$("pwr").className = "pwr" + (powerOn ? " on" : "");
    if (this.$("popPwr")) this.$("popPwr").className = "pwr" + (powerOn ? " on" : "");

    const setTg = (tgId, slId, id) => {
      this.$(tgId).className = "tg" + (this._on(id) ? " on" : "");
      const sl = this.$(slId);
      if (!this._drag.has(slId)) sl.value = String(this._brPct(id) || 50);
    };
    setTg("bgTg", "bgSl", c.nebula);
    setTg("lsTg", "lsSl", c.stars);

    const rot = this._e(c.rotation);
    if (rot && !this._drag.has("rotSl")) {
      const v = parseFloat(rot.state);
      if (!isNaN(v)) { this.$("rotSl").value = String(v); this.$("rotVal").textContent = Math.round(v); }
    }

    const T = this._timers();
    const cur = (this._e(c.timer) || {}).state || "00:00:00";
    this.$("tmr").innerHTML = T.map(([v, l]) =>
      `<button class="chip${cur === v ? " on" : ""}" data-t="${v}">${l}</button>`).join("") +
      (T.some(([v]) => v === cur) ? "" : `<button class="chip on" data-t="${cur}">${cur.slice(0, 5)}</button>`);
  }
}

/* ---- visual editor ---- */
class StarProjectorCardEditor extends HTMLElement {
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
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: ev.detail.value }, bubbles: true, composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    const L = this._L();
    this._form.computeLabel = (s) => ({
      title: L.e_title, mode: L.e_mode, language: L.e_language,
      power: L.e_power, nebula: L.e_nebula, stars: L.e_stars,
      rotation: L.e_rotation, timer: L.e_timer,
    }[s.name] || s.name);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "title", selector: { text: {} } },
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "popup", label: L.e_popup }, { value: "dropdown", label: L.e_dropdown },
        { value: "inline", label: L.e_inline },
      ] } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en },
      ] } } },
      { name: "power", selector: { entity: {} } },
      { name: "nebula", selector: { entity: {} } },
      { name: "stars", selector: { entity: {} } },
      { name: "rotation", selector: { entity: {} } },
      { name: "timer", selector: { entity: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("star-projector-card-editor", StarProjectorCardEditor);

customElements.define("star-projector-card", StarProjectorCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "star-projector-card",
  name: "Star Projector",
  description: "Smart star projector — popup, dropdown or inline; every entity selectable; DE/EN.",
  preview: false,
});
