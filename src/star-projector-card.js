/* Smart Star Projector — compact card
 * Uses the tuya_local ("Tuya Local") entities of the projector, derived from a prefix:
 *   switch.<prefix>_master               power
 *   light.<prefix>_background             nebula light (brightness)
 *   light.<prefix>_laser                  laser / stars (brightness)
 *   number.<prefix>_star_rotation_speed   rotation speed (10..1000)
 *   time.<prefix>_timer                   sleep timer (HH:MM:SS)
 * User-facing strings German; code comments English.
 *
 * config:
 *   type: custom:star-projector-card
 *   prefix: smart_star_projector
 *   title: "Sternenprojektor"
 */

const STYLE = `
:host{--acc:#7c5cff;display:block}
ha-card{padding:12px 14px}
.hd{display:flex;align-items:center;gap:9px}
.hd>ha-icon{--mdc-icon-size:20px;color:var(--acc)}
.ttl{font-weight:800;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
.pwr{border:none;border-radius:12px;background:var(--divider-color);color:var(--primary-text-color);width:38px;height:32px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.pwr ha-icon{--mdc-icon-size:19px}
.pwr.on{background:var(--acc);color:#fff}
.row{display:flex;align-items:center;gap:9px;margin-top:9px;min-height:26px}
.row .ic{--mdc-icon-size:17px;color:var(--secondary-text-color);width:32px;text-align:center}
.tg{border:1px solid var(--divider-color);border-radius:9px;background:var(--card-background-color);color:var(--secondary-text-color);width:32px;height:28px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.tg ha-icon{--mdc-icon-size:17px}
.tg.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.lbl{font-size:12.5px;color:var(--primary-text-color);flex:0 0 62px}
.sl{-webkit-appearance:none;appearance:none;flex:1 1 auto;height:5px;border-radius:5px;background:var(--divider-color);outline:none;cursor:pointer;min-width:60px}
.sl:disabled{opacity:.4;cursor:default}
.sl::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--acc);cursor:pointer}
.sl::-moz-range-thumb{width:15px;height:15px;border:none;border-radius:50%;background:var(--acc);cursor:pointer}
.col{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto}
.col ha-icon{--mdc-icon-size:17px}
.val{font-size:11.5px;font-weight:700;color:var(--secondary-text-color);flex:0 0 34px;text-align:right;font-variant-numeric:tabular-nums}
.chips{display:flex;flex-wrap:wrap;gap:5px;flex:1 1 auto}
.chip{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:4px 9px;font-size:11.5px;font-weight:600;font-family:inherit;cursor:pointer;line-height:1}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.warn{padding:14px;color:var(--secondary-text-color);font-size:12.5px;text-align:center}
.chev{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.chev ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.chev.open ha-icon{transform:rotate(180deg)}
#body[hidden]{display:none}
`;

const TIMERS = [["00:00:00", "Aus"], ["00:15:00", "15m"], ["00:30:00", "30m"], ["01:00:00", "1 Std"], ["02:00:00", "2 Std"]];

class StarProjectorCard extends HTMLElement {
  static getStubConfig() { return { prefix: "smart_star_projector" }; }
  static getConfigElement() { return document.createElement("star-projector-card-editor"); }
  setConfig(c) {
    this._cfg = Object.assign({ prefix: "smart_star_projector" }, c || {});
    this._p = this._cfg.prefix;
    this._drag = new Set();
    this._open = false;
  }

  _toggle() {
    this._open = !this._open;
    this.$("body").hidden = !this._open;
    this.$("chev").classList.toggle("open", this._open);
  }
  getCardSize() { return 4; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  _id(d, s) { return d + "." + this._p + "_" + s; }
  _e(d, s) { return this._hass && this._hass.states[this._id(d, s)]; }
  _on(d, s) { const e = this._e(d, s); return e && e.state === "on"; }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }
  _brPct(d, s) {
    const e = this._e(d, s);
    if (!e || e.state !== "on") return 0;
    const b = e.attributes && e.attributes.brightness;
    return b == null ? 100 : Math.max(1, Math.round((b / 255) * 100));
  }

  _build() {
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd">
  <ha-icon icon="mdi:creation"></ha-icon>
  <span class="ttl" id="ttl">Sternenprojektor</span>
  <button class="chev" id="chev" title="Einstellungen"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
  <button class="pwr" id="pwr" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 <div id="body" hidden>
  <div class="row">
   <button class="tg" id="bgTg" title="Nebel ein/aus"><ha-icon icon="mdi:blur"></ha-icon></button>
   <span class="lbl">Nebel</span>
   <input class="sl" id="bgSl" type="range" min="1" max="100" value="100">
   <button class="col" id="bgCol" title="Farbe"><ha-icon icon="mdi:palette"></ha-icon></button>
  </div>
  <div class="row">
   <button class="tg" id="lsTg" title="Sterne ein/aus"><ha-icon icon="mdi:star-four-points"></ha-icon></button>
   <span class="lbl">Sterne</span>
   <input class="sl" id="lsSl" type="range" min="1" max="100" value="100">
  </div>
  <div class="row">
   <ha-icon class="ic" icon="mdi:rotate-orbit"></ha-icon>
   <span class="lbl">Rotation</span>
   <input class="sl" id="rotSl" type="range" min="10" max="1000" step="10" value="500">
   <span class="val" id="rotVal">–</span>
  </div>
  <div class="row">
   <ha-icon class="ic" icon="mdi:timer-outline"></ha-icon>
   <span class="lbl">Timer</span>
   <span class="chips" id="tmr"></span>
  </div>
 </div>
</ha-card>`;
    this.$ = (id) => r.getElementById(id);
    this.$("chev").onclick = () => this._toggle();
    this.$("pwr").onclick = () => this._svc("switch", "toggle", { entity_id: this._id("switch", "master") });
    this.$("bgTg").onclick = () => this._svc("light", "toggle", { entity_id: this._id("light", "background") });
    this.$("lsTg").onclick = () => this._svc("light", "toggle", { entity_id: this._id("light", "laser") });
    this.$("bgCol").onclick = () => this._mi(this._id("light", "background"));
    this._wireSlider("bgSl", (v) => this._svc("light", "turn_on", { entity_id: this._id("light", "background"), brightness_pct: v }));
    this._wireSlider("lsSl", (v) => this._svc("light", "turn_on", { entity_id: this._id("light", "laser"), brightness_pct: v }));
    this._wireSlider("rotSl", (v) => this._svc("number", "set_value", { entity_id: this._id("number", "star_rotation_speed"), value: v }), "rotVal");
    this.$("tmr").addEventListener("click", (e) => {
      const b = e.target.closest("[data-t]"); if (!b) return;
      this._svc("time", "set_value", { entity_id: this._id("time", "timer"), time: b.dataset.t });
    });
  }

  _wireSlider(id, onChange, liveId) {
    const el = this.$(id);
    el.addEventListener("input", () => { this._drag.add(id); if (liveId) this.$(liveId).textContent = el.value; });
    el.addEventListener("change", () => { this._drag.delete(id); onChange(Number(el.value)); });
  }

  _render() {
    if (!this.shadowRoot) return;
    if (!this._e("switch", "master") && !this._e("light", "background")) {
      this.$("body").innerHTML = `<div class="warn">Keine <b>${this._p}_*</b>-Entitäten (Tuya Local) gefunden.</div>`;
      this.$("body").hidden = false;
      return;
    }
    this.$("ttl").textContent = this._cfg.title || "Sternenprojektor";
    const power = this._on("switch", "master");
    this.$("pwr").className = "pwr" + (power ? " on" : "");

    const setTg = (tgId, slId, d, s) => {
      const on = this._on(d, s);
      this.$(tgId).className = "tg" + (on ? " on" : "");
      const sl = this.$(slId);
      if (!this._drag.has(slId)) sl.value = String(this._brPct(d, s) || 50);
    };
    setTg("bgTg", "bgSl", "light", "background");
    setTg("lsTg", "lsSl", "light", "laser");

    const rot = this._e("number", "star_rotation_speed");
    if (rot && !this._drag.has("rotSl")) {
      const v = parseFloat(rot.state);
      if (!isNaN(v)) { this.$("rotSl").value = String(v); this.$("rotVal").textContent = Math.round(v); }
    }

    const cur = (this._e("time", "timer") || {}).state || "00:00:00";
    this.$("tmr").innerHTML = TIMERS.map(([v, l]) =>
      `<button class="chip${cur === v ? " on" : ""}" data-t="${v}">${l}</button>`).join("") +
      (TIMERS.some(([v]) => v === cur) ? "" : `<button class="chip on" data-t="${cur}">${cur.slice(0, 5)}</button>`);
  }
}

/* ---- visual editor ---- */
class StarProjectorCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        prefix: "Entity-Präfix (Tuya-Local-Gerät)",
        title: "Titel (optional)",
      }[s.name] || s.name);
      this._form.addEventListener("value-changed", (ev) => {
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: ev.detail.value }, bubbles: true, composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "prefix", selector: { text: {} } },
      { name: "title", selector: { text: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("star-projector-card-editor", StarProjectorCardEditor);

customElements.define("star-projector-card", StarProjectorCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "star-projector-card",
  name: "Sternenprojektor",
  description: "Kompakte Steuerung für den Smart Star Projector (Tuya Local)",
  preview: false,
});
