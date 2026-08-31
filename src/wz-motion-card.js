/* Motion / presence control card (popup / dropdown, DE/EN)
 *
 * Collapsed = header (title + master arm button; the header icon glows when the
 * room is active). Chevron / tune icon opens (dropdown or popup): a live status
 * banner + one row per motion source (name · live "detecting" dot · Active/Off
 * toggle). The toggle target may be a switch OR an automation — the service
 * domain is derived from the entity_id.
 *
 * The list of sources is fully editable in the visual editor (add / remove, up
 * to 8), as are the master + aggregate entities.
 *
 * config:
 *   type: custom:wz-motion-card
 *   title: "Bewegungssensoren WZ"
 *   mode: popup                 # "popup" (default) | "dropdown"
 *   language: auto              # "auto" | "de" | "en"
 *   master: input_boolean.wz_motion_state
 *   aggregate: binary_sensor.livingdining_motion
 *   sources:
 *     - { name, motion, enable }   # motion = binary_sensor, enable = switch or automation
 */

const I18N = {
  de: {
    title: "Bewegungssensoren", active: "Aktiv", off: "Aus",
    calm: "Ruhe", detected: "Bewegung erkannt",
    settings: "Sensoren", expand: "Ein-/Ausklappen", power: "Bewegungssteuerung ein/aus",
    close: "Schließen",
    e_title: "Titel", e_mode: "Anzeige", e_language: "Sprache",
    e_popup: "Popup", e_dropdown: "Ausklappen (Dropdown)",
    e_auto: "Automatisch (HA)", e_de: "Deutsch", e_en: "Englisch",
    e_master: "Master-Status (input_boolean)", e_aggregate: "Gesamt-Bewegung (binary_sensor)",
    e_sources: "Bewegungsmelder", e_name: "Name",
    e_motion: "Bewegungs-Sensor (binary_sensor)", e_enable: "Aktivieren (switch / automation)",
    e_add: "Sensor hinzufügen",
  },
  en: {
    title: "Motion sensors", active: "Active", off: "Off",
    calm: "Calm", detected: "Motion detected",
    settings: "Sensors", expand: "Expand / collapse", power: "Motion control on/off",
    close: "Close",
    e_title: "Title", e_mode: "Display", e_language: "Language",
    e_popup: "Popup", e_dropdown: "Inline dropdown",
    e_auto: "Automatic (HA)", e_de: "German", e_en: "English",
    e_master: "Master state (input_boolean)", e_aggregate: "Aggregate motion (binary_sensor)",
    e_sources: "Motion sources", e_name: "Name",
    e_motion: "Motion sensor (binary_sensor)", e_enable: "Enable (switch / automation)",
    e_add: "Add sensor",
  },
};

const STYLE = `
:host{--acc:#f0a020;--live:#ffb023;--armed:#3ec46d;display:block}
ha-card{padding:12px 14px}
.hd{display:flex;align-items:center;gap:9px}
.hd>ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color);transition:color .2s}
.hd.active>ha-icon{color:var(--live)}
.ttl{font-weight:800;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
.pwr{border:none;border-radius:12px;background:var(--divider-color);color:var(--primary-text-color);width:38px;height:32px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.pwr ha-icon{--mdc-icon-size:19px}
.pwr.on{background:var(--armed);color:#fff}
.toggle-btn{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.toggle-btn ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.toggle-btn.open ha-icon{transform:rotate(180deg)}
.drop{padding-top:4px}
.drop[hidden],#body[hidden]{display:none}
.row{display:flex;align-items:center;gap:9px;margin-top:9px;min-height:30px}
.status{margin-top:10px;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px;font-size:.9375rem;font-weight:700;background:color-mix(in srgb,var(--armed) 14%,transparent);color:var(--armed)}
.status.live{background:color-mix(in srgb,var(--live) 18%,transparent);color:var(--live)}
.status ha-icon{--mdc-icon-size:18px}
.nm{flex:1 1 auto;font-size:.9375rem;color:var(--primary-text-color);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm.off{color:var(--secondary-text-color);opacity:.6}
.dot{flex:0 0 auto;width:9px;height:9px;border-radius:50%;background:var(--divider-color)}
.dot.live{background:var(--live);box-shadow:0 0 0 0 color-mix(in srgb,var(--live) 70%,transparent);animation:pulse 1.6s ease-out infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--live) 65%,transparent)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
.tg{flex:0 0 auto;border:1px solid var(--divider-color);border-radius:999px;background:var(--card-background-color);color:var(--secondary-text-color);height:28px;min-width:66px;padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:inherit;font-size:.8125rem;font-weight:700;line-height:1}
.tg ha-icon{--mdc-icon-size:14px}
.tg.on{border-color:var(--armed);background:color-mix(in srgb,var(--armed) 16%,transparent);color:var(--armed)}
.tg:active{transform:translateY(1px)}
.warn{padding:16px;color:var(--secondary-text-color);font-size:.9375rem;text-align:center}

dialog.pop{border:none;margin:auto;padding:0;width:min(500px, calc(100vw - 32px));max-width:min(500px, calc(100vw - 32px));max-height:calc(100% - 72px);border-radius:var(--ha-dialog-border-radius, 28px);color:var(--primary-text-color);background:var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);font-family:var(--mdc-typography-body1-font-family, var(--ha-font-family-body, inherit));font-size:1rem;overflow:hidden;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
dialog.pop[open]{display:flex;flex-direction:column}
dialog.pop::backdrop{background:transparent}
.pop-hd{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:24px 24px 4px;font-size:1.574rem;font-weight:400;line-height:1.2}
.pop-hd>ha-icon{--mdc-icon-size:24px;color:var(--secondary-text-color);flex:0 0 auto}
.pop-hd.active>ha-icon{color:var(--live)}
.pop-ttl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x{flex:0 0 auto;border:none;background:none;cursor:pointer;color:var(--secondary-text-color);width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
.x:hover{background:var(--secondary-background-color, rgba(127,127,127,.15))}
.x ha-icon{--mdc-icon-size:24px}
.pop-bd{flex:1 1 auto;min-height:0;overflow-y:auto;padding:4px 24px 24px}
@media all and (max-width:450px), all and (max-height:500px){
  dialog.pop{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0}
  .pop-hd{padding-top:max(24px, env(safe-area-inset-top))}
  .pop-bd{padding-bottom:max(24px, env(safe-area-inset-bottom))}
}
`;

const DEFAULTS = {
  mode: "popup",
  language: "auto",
  master: "input_boolean.wz_motion_state",
  aggregate: "binary_sensor.livingdining_motion",
  sources: [
    { name: "Spülbecken", motion: "binary_sensor.hue_motion_spulbecken_motion", enable: "switch.hue_motion_spulbecken_motion" },
    { name: "Küchentheke", motion: "binary_sensor.hue_motion_wohnzimmer_motion", enable: "switch.hue_motion_wohnzimmer_motion" },
    { name: "FP2 Präsenz", motion: "binary_sensor.wz_fp2_presence", enable: "automation.wohn_esszimmer_yama_fp2_wz" },
  ],
};

class WzMotionCard extends HTMLElement {
  static getStubConfig() { return { master: "input_boolean.wz_motion_state" }; }
  static getConfigElement() { return document.createElement("wz-motion-card-editor"); }

  setConfig(c) {
    const prevSig = this._sig;
    this._cfg = Object.assign({}, DEFAULTS, c || {});
    this._src = Array.isArray(this._cfg.sources) && this._cfg.sources.length
      ? this._cfg.sources : DEFAULTS.sources;
    this._popup = this._cfg.mode !== "dropdown";
    this._open = false;
    this._sig = [this._cfg.mode, this._cfg.language, this._src.length].join("|");
    if (this.shadowRoot && prevSig !== undefined && prevSig !== this._sig) {
      this.shadowRoot.innerHTML = "";
      this._build();
      if (this._hass) this._render();
    }
  }
  getCardSize() { return 4; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  _lang() {
    const c = this._cfg.language || "auto";
    if (c === "de" || c === "en") return c;
    return (this._hass && this._hass.language || "").toLowerCase().startsWith("de") ? "de" : "en";
  }
  _t(k) { return (I18N[this._lang()] || I18N.de)[k] || k; }

  _st(id) { const e = this._hass && this._hass.states[id]; return e ? e.state : undefined; }
  _on(id) { return this._st(id) === "on"; }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }

  _toggle() {
    if (this._popup) { this.$("pop").showModal(); return; }
    this._open = !this._open;
    this.$("body").hidden = !this._open;
    this.$("toggleBtn").classList.toggle("open", this._open);
  }

  _rows() {
    return `<div class="status" id="status"><ha-icon id="stIco" icon="mdi:sleep"></ha-icon><span id="stTxt">${this._t("calm")}</span></div>` +
      this._src.map((s, i) => `
  <div class="row" data-i="${i}">
   <span class="dot" id="dot${i}"></span>
   <span class="nm" id="nm${i}" data-act="more">${s.name || s.motion || s.enable || ""}</span>
   <button class="tg" id="tg${i}" data-act="tg"><ha-icon icon="mdi:motion-sensor"></ha-icon><span id="tgl${i}">${this._t("active")}</span></button>
  </div>`).join("");
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const popup = this._popup;
    const ttl = this._cfg.title || this._t("title");
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd" id="hd">
  <ha-icon icon="mdi:motion-sensor"></ha-icon>
  <span class="ttl" id="ttl">${ttl}</span>
  <button class="toggle-btn" id="toggleBtn" title="${popup ? this._t("settings") : this._t("expand")}"><ha-icon icon="${popup ? "mdi:tune-variant" : "mdi:chevron-down"}"></ha-icon></button>
  <button class="pwr" id="pwr" data-act="pwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 ${popup ? "" : `<div class="drop" id="body" hidden>${this._rows()}</div>`}
</ha-card>
${popup ? `<dialog class="pop" id="pop">
 <div class="pop-hd" id="popHd">
  <ha-icon icon="mdi:motion-sensor"></ha-icon>
  <span class="pop-ttl" id="popTtl">${ttl}</span>
  <button class="pwr" id="popPwr" data-act="pwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
  <button class="x" id="closeBtn" title="${this._t("close")}"><ha-icon icon="mdi:close"></ha-icon></button>
 </div>
 <div class="pop-bd" id="body">${this._rows()}</div>
</dialog>` : ""}`;
    this.$ = (id) => r.getElementById(id);
    this.$("body").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("pwr").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("toggleBtn").addEventListener("click", () => this._toggle(), false);
    if (popup) {
      this.$("popPwr").addEventListener("click", (ev) => this._tap(ev), false);
      this.$("closeBtn").onclick = () => this.$("pop").close();
      this.$("pop").addEventListener("click", (e) => { if (e.target === this.$("pop")) this.$("pop").close(); });
    }
  }

  _tap(ev) {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act === "pwr") {
      const m = this._cfg.master;
      return this._svc(m.split(".")[0], "toggle", { entity_id: m });
    }
    const row = el.closest("[data-i]");
    if (!row) return;
    const s = this._src[Number(row.dataset.i)];
    if (!s) return;
    if (act === "more") return this._mi(s.motion || s.enable);
    if (act === "tg" && s.enable) return this._svc(s.enable.split(".")[0], "toggle", { entity_id: s.enable });
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    if (!this._hass || !this._hass.states[c.master]) {
      this.$("body").innerHTML = `<div class="warn"><b>${c.master}</b> — ?</div>`;
      if (!this._popup) this.$("body").hidden = false;
      return;
    }
    const ttl = c.title || this._t("title");
    this.$("ttl").textContent = ttl;
    if (this.$("popTtl")) this.$("popTtl").textContent = ttl;

    const live = this._on(c.aggregate);
    this.$("hd").className = "hd" + (live ? " active" : "");
    if (this.$("popHd")) this.$("popHd").className = "pop-hd" + (live ? " active" : "");
    this.$("status").className = "status" + (live ? " live" : "");
    this.$("stIco").setAttribute("icon", live ? "mdi:motion-sensor" : "mdi:sleep");
    this.$("stTxt").textContent = live ? this._t("detected") : this._t("calm");

    const armed = this._on(c.master);
    this.$("pwr").className = "pwr" + (armed ? " on" : "");
    if (this.$("popPwr")) this.$("popPwr").className = "pwr" + (armed ? " on" : "");

    this._src.forEach((s, i) => {
      const enabled = this._on(s.enable);
      const detecting = enabled && this._on(s.motion);
      this.$("dot" + i).className = "dot" + (detecting ? " live" : "");
      this.$("nm" + i).className = "nm" + (enabled ? "" : " off");
      this.$("tg" + i).className = "tg" + (enabled ? " on" : "");
      this.$("tgl" + i).textContent = enabled ? this._t("active") : this._t("off");
    });
  }
}

/* ---- visual editor: base fields + add/remove list of motion sources ---- */
class WzMotionCardEditor extends HTMLElement {
  setConfig(config) {
    const sig = [config.mode, config.language, (config.sources || []).length].join("|");
    this._config = config;
    if (sig !== this._sig) { this._sig = sig; this._dirty = true; }
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }
  _L() {
    const c = (this._config && this._config.language) || "auto";
    if (c === "de" || c === "en") return I18N[c];
    return (this._hass && this._hass.language || "").toLowerCase().startsWith("de") ? I18N.de : I18N.en;
  }
  _emit(cfg) {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
  }
  _render() {
    if (!this._hass || !this._config) return;
    const L = this._L();
    if (this._dirty || !this._base) {
      this._dirty = false;
      this.innerHTML = "";
      this._base = document.createElement("ha-form");
      this._base.addEventListener("value-changed", (ev) => this._emit(ev.detail.value));
      this.appendChild(this._base);

      const items = Array.isArray(this._config.sources) ? this._config.sources : [];
      const wrap = document.createElement("div");
      wrap.style.cssText = "margin:14px 0 4px";
      const h = document.createElement("div");
      h.style.cssText = "font-weight:600;font-size:.95em;margin-bottom:6px";
      h.textContent = L.e_sources;
      wrap.appendChild(h);
      items.forEach((item, idx) => {
        const rowEl = document.createElement("div");
        rowEl.style.cssText = "display:flex;align-items:flex-start;gap:6px;margin-bottom:10px";
        const f = document.createElement("ha-form");
        f.style.flex = "1 1 auto";
        f.hass = this._hass;
        f.schema = [
          { name: "name", selector: { text: {} } },
          { name: "motion", selector: { entity: { domain: "binary_sensor" } } },
          { name: "enable", selector: { entity: {} } },
        ];
        f.data = item;
        f.computeLabel = (s) => ({ name: L.e_name, motion: L.e_motion, enable: L.e_enable }[s.name] || s.name);
        f.addEventListener("value-changed", (ev) => {
          const next = items.slice(); next[idx] = ev.detail.value;
          this._emit(Object.assign({}, this._config, { sources: next }));
        });
        rowEl.appendChild(f);
        const del = document.createElement("ha-icon-button");
        del.style.cssText = "--mdc-icon-button-size:36px;margin-top:2px";
        del.disabled = items.length <= 1;
        del.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
        del.addEventListener("click", () => {
          if (items.length <= 1) return;
          const next = items.slice(); next.splice(idx, 1);
          this._emit(Object.assign({}, this._config, { sources: next }));
        });
        rowEl.appendChild(del);
        wrap.appendChild(rowEl);
      });
      if (items.length < 8) {
        const add = document.createElement("mwc-button");
        add.setAttribute("outlined", "");
        add.textContent = "+ " + L.e_add;
        add.addEventListener("click", () => {
          this._emit(Object.assign({}, this._config, {
            sources: items.concat([{ name: "", motion: "", enable: "" }]),
          }));
        });
        wrap.appendChild(add);
      }
      this.appendChild(wrap);
    }
    this._base.hass = this._hass;
    this._base.computeLabel = (s) => ({
      title: L.e_title, mode: L.e_mode, language: L.e_language,
      master: L.e_master, aggregate: L.e_aggregate,
    }[s.name] || s.name);
    this._base.schema = [
      { name: "title", selector: { text: {} } },
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "popup", label: L.e_popup }, { value: "dropdown", label: L.e_dropdown },
      ] } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en },
      ] } } },
      { name: "master", selector: { entity: {} } },
      { name: "aggregate", selector: { entity: {} } },
    ];
    this._base.data = this._config;
  }
}
customElements.define("wz-motion-card-editor", WzMotionCardEditor);

customElements.define("wz-motion-card", WzMotionCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "wz-motion-card",
  name: "Motion sensors",
  description: "Compact motion/presence control — live dot + enable toggle per source. Popup/dropdown, DE/EN, editable list.",
  preview: false,
});
