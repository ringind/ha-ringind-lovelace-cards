/* Smart Star Projector — popup variant
 * A copy of custom:star-projector-card, modified so that:
 *   - the "dropdown" controls open in a modal POPUP (native <dialog>) instead of
 *     expanding inline;
 *   - every entity is configured explicitly (no prefix / name wildcard) and each
 *     one is a selectable field in the graphical editor.
 * User-facing strings German; code comments English.
 *
 * config:
 *   type: custom:star-projector-popup-card
 *   title: "Sternenprojektor"
 *   power:    switch.smart_star_projector_master
 *   nebula:   light.smart_star_projector_background
 *   stars:    light.smart_star_projector_laser
 *   rotation: number.smart_star_projector_star_rotation_speed
 *   timer:    time.smart_star_projector_timer
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
.open-btn{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.open-btn ha-icon{--mdc-icon-size:20px}
.row{display:flex;align-items:center;gap:9px;margin-top:9px;min-height:26px}
.row .ic{--mdc-icon-size:17px;color:var(--secondary-text-color);width:32px;text-align:center}
.tg{border:1px solid var(--divider-color);border-radius:9px;background:var(--card-background-color);color:var(--secondary-text-color);width:32px;height:28px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.tg ha-icon{--mdc-icon-size:17px}
.tg.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.lbl{font-size:12.5px;color:var(--primary-text-color);flex:0 0 62px}
.sl{-webkit-appearance:none;appearance:none;flex:1 1 auto;height:5px;border-radius:5px;background:var(--divider-color);outline:none;cursor:pointer;min-width:60px}
.sl::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--acc);cursor:pointer}
.sl::-moz-range-thumb{width:15px;height:15px;border:none;border-radius:50%;background:var(--acc);cursor:pointer}
.col{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto}
.col ha-icon{--mdc-icon-size:17px}
.val{font-size:11.5px;font-weight:700;color:var(--secondary-text-color);flex:0 0 34px;text-align:right;font-variant-numeric:tabular-nums}
.chips{display:flex;flex-wrap:wrap;gap:5px;flex:1 1 auto}
.chip{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:4px 9px;font-size:11.5px;font-weight:600;font-family:inherit;cursor:pointer;line-height:1}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.warn{padding:14px;color:var(--secondary-text-color);font-size:12.5px;text-align:center}

dialog.pop{border:none;padding:0;border-radius:16px;width:340px;max-width:92vw;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color);box-shadow:0 14px 50px rgba(0,0,0,.45);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
dialog.pop::backdrop{background:rgba(0,0,0,.55)}
.pop-hd{display:flex;align-items:center;gap:9px;padding:14px 16px 10px}
.pop-hd>ha-icon{--mdc-icon-size:20px;color:var(--acc)}
.pop-ttl{font-weight:800;font-size:15px;flex:1;color:var(--primary-text-color)}
.x{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;display:inline-flex}
.x ha-icon{--mdc-icon-size:20px}
.pop-bd{padding:0 16px 16px}
`;

const TIMERS = [["00:00:00", "Aus"], ["00:15:00", "15m"], ["00:30:00", "30m"], ["01:00:00", "1 Std"], ["02:00:00", "2 Std"]];

const DEFAULTS = {
  title: "Sternenprojektor",
  power: "switch.smart_star_projector_master",
  nebula: "light.smart_star_projector_background",
  stars: "light.smart_star_projector_laser",
  rotation: "number.smart_star_projector_star_rotation_speed",
  timer: "time.smart_star_projector_timer",
};

class StarProjectorPopupCard extends HTMLElement {
  static getStubConfig() {
    return {
      power: DEFAULTS.power, nebula: DEFAULTS.nebula, stars: DEFAULTS.stars,
      rotation: DEFAULTS.rotation, timer: DEFAULTS.timer,
    };
  }
  static getConfigElement() { return document.createElement("star-projector-popup-card-editor"); }
  setConfig(c) {
    this._cfg = Object.assign({}, DEFAULTS, c || {});
    this._drag = new Set();
  }
  getCardSize() { return 1; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

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

  _build() {
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd">
  <ha-icon icon="mdi:creation"></ha-icon>
  <span class="ttl" id="ttl">Sternenprojektor</span>
  <button class="open-btn" id="openBtn" title="Einstellungen"><ha-icon icon="mdi:tune-variant"></ha-icon></button>
  <button class="pwr" id="pwr" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
</ha-card>
<dialog class="pop" id="pop">
 <div class="pop-hd">
  <ha-icon icon="mdi:creation"></ha-icon>
  <span class="pop-ttl" id="popTtl">Sternenprojektor</span>
  <button class="x" id="closeBtn" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></button>
 </div>
 <div class="pop-bd" id="body">
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
</dialog>`;
    this.$ = (id) => r.getElementById(id);
    const c = this._cfg;
    this.$("openBtn").onclick = () => this.$("pop").showModal();
    this.$("closeBtn").onclick = () => this.$("pop").close();
    // click on the backdrop (the dialog element itself, outside its content) closes it
    this.$("pop").addEventListener("click", (e) => { if (e.target === this.$("pop")) this.$("pop").close(); });
    this.$("pwr").onclick = () => this._svc(this._dom(c.power), "toggle", { entity_id: c.power });
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
      this.$("body").innerHTML = `<div class="warn">Entitäten nicht gefunden – bitte im Karten-Editor auswählen.</div>`;
      return;
    }
    const t = c.title || "Sternenprojektor";
    this.$("ttl").textContent = t;
    this.$("popTtl").textContent = t;
    this.$("pwr").className = "pwr" + (this._on(c.power) ? " on" : "");

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

    const cur = (this._e(c.timer) || {}).state || "00:00:00";
    this.$("tmr").innerHTML = TIMERS.map(([v, l]) =>
      `<button class="chip${cur === v ? " on" : ""}" data-t="${v}">${l}</button>`).join("") +
      (TIMERS.some(([v]) => v === cur) ? "" : `<button class="chip on" data-t="${cur}">${cur.slice(0, 5)}</button>`);
  }
}

/* ---- visual editor: every entity is its own selectable field, no prefix ---- */
class StarProjectorPopupCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        title: "Titel",
        power: "Power-Schalter",
        nebula: "Nebel-Licht",
        stars: "Sterne / Laser-Licht",
        rotation: "Rotationsgeschwindigkeit",
        timer: "Sleep-Timer",
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
      { name: "title", selector: { text: {} } },
      { name: "power", selector: { entity: {} } },
      { name: "nebula", selector: { entity: {} } },
      { name: "stars", selector: { entity: {} } },
      { name: "rotation", selector: { entity: {} } },
      { name: "timer", selector: { entity: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("star-projector-popup-card-editor", StarProjectorPopupCardEditor);

customElements.define("star-projector-popup-card", StarProjectorPopupCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "star-projector-popup-card",
  name: "Sternenprojektor (Popup)",
  description: "Sternenprojektor-Steuerung in einem Popup; jede Entität einzeln wählbar",
  preview: false,
});
