/* Bewegungssensoren WZ — compact motion/presence control card
 * Replaces the wide "Bewegungssensoren WZ" tile in Wohnzimmer > Geräte.
 * Sized to match custom:star-projector-card / custom:wz-tv-card.
 *
 * Per source it shows: name, a live "detecting now" dot, and an enable toggle.
 * The enable target may be a switch (Hue motion sensor) or an automation
 * (FP2 presence) — the service domain is derived from the entity_id.
 *
 * Entities (all overridable in config):
 *   input_boolean.wz_motion_state             master arm state (header button)
 *   binary_sensor.livingdining_motion         aggregate "any motion" state
 *   switch.hue_motion_spulbecken_motion  + binary_sensor.hue_motion_spulbecken_motion
 *   switch.hue_motion_wohnzimmer_motion  + binary_sensor.hue_motion_wohnzimmer_motion
 *   automation.wohn_esszimmer_yama_fp2_wz + binary_sensor.wz_fp2_presence
 *
 * User-facing strings German; code comments English.
 *
 * config:
 *   type: custom:wz-motion-card
 *   title: "Bewegungssensoren WZ"
 *   master: input_boolean.wz_motion_state
 *   aggregate: binary_sensor.livingdining_motion
 *   sources:
 *     - { name: "Spülbecken",   motion: binary_sensor.hue_motion_spulbecken_motion, enable: switch.hue_motion_spulbecken_motion }
 *     - { name: "Küchentheke",  motion: binary_sensor.hue_motion_wohnzimmer_motion, enable: switch.hue_motion_wohnzimmer_motion }
 *     - { name: "FP2 Präsenz",  motion: binary_sensor.wz_fp2_presence,              enable: automation.wohn_esszimmer_yama_fp2_wz }
 */

const STYLE = `
:host{--acc:#f0a020;--live:#ffb023;--armed:#3ec46d;display:block}
ha-card{padding:12px 14px}
.hd{display:flex;align-items:center;gap:9px}
.hd>ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color);transition:color .2s}
.hd.active>ha-icon{color:var(--live)}
.ttl{font-weight:800;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
.pwr{border:none;border-radius:12px;background:var(--divider-color);color:var(--primary-text-color);width:38px;height:32px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.pwr ha-icon{--mdc-icon-size:19px}
.pwr.on{background:var(--armed);color:#fff}
.row{display:flex;align-items:center;gap:9px;margin-top:9px;min-height:26px}
.status{margin-top:10px;border-radius:10px;padding:7px 11px;display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;background:color-mix(in srgb,var(--armed) 14%,transparent);color:var(--armed)}
.status.live{background:color-mix(in srgb,var(--live) 18%,transparent);color:var(--live)}
.status ha-icon{--mdc-icon-size:18px}
.nm{flex:1 1 auto;font-size:12.5px;color:var(--primary-text-color);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm.off{color:var(--secondary-text-color);opacity:.6}
.dot{flex:0 0 auto;width:9px;height:9px;border-radius:50%;background:var(--divider-color)}
.dot.live{background:var(--live);box-shadow:0 0 0 0 color-mix(in srgb,var(--live) 70%,transparent);animation:pulse 1.6s ease-out infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--live) 65%,transparent)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
.tg{flex:0 0 auto;border:1px solid var(--divider-color);border-radius:999px;background:var(--card-background-color);color:var(--secondary-text-color);height:26px;min-width:62px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;line-height:1}
.tg ha-icon{--mdc-icon-size:14px}
.tg.on{border-color:var(--armed);background:color-mix(in srgb,var(--armed) 16%,transparent);color:var(--armed)}
.tg:active{transform:translateY(1px)}
.warn{padding:14px;color:var(--secondary-text-color);font-size:12.5px;text-align:center}
.chev{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.chev ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.chev.open ha-icon{transform:rotate(180deg)}
#body[hidden]{display:none}
`;

const DEF_SOURCES = [
  { name: "Spülbecken", motion: "binary_sensor.hue_motion_spulbecken_motion", enable: "switch.hue_motion_spulbecken_motion" },
  { name: "Küchentheke", motion: "binary_sensor.hue_motion_wohnzimmer_motion", enable: "switch.hue_motion_wohnzimmer_motion" },
  { name: "FP2 Präsenz", motion: "binary_sensor.wz_fp2_presence", enable: "automation.wohn_esszimmer_yama_fp2_wz" },
];

class WzMotionCard extends HTMLElement {
  static getStubConfig() { return { master: "input_boolean.wz_motion_state" }; }
  static getConfigElement() { return document.createElement("wz-motion-card-editor"); }

  setConfig(c) {
    this._cfg = Object.assign({
      title: "Bewegungssensoren WZ",
      master: "input_boolean.wz_motion_state",
      aggregate: "binary_sensor.livingdining_motion",
    }, c || {});
    this._src = Array.isArray(this._cfg.sources) && this._cfg.sources.length
      ? this._cfg.sources : DEF_SOURCES;
    this._open = false;
  }
  getCardSize() { return 4; }

  _toggle() {
    this._open = !this._open;
    this.$("body").hidden = !this._open;
    this.$("chev").classList.toggle("open", this._open);
  }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  _st(id) { const e = this._hass && this._hass.states[id]; return e ? e.state : undefined; }
  _on(id) { return this._st(id) === "on"; }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }

  _build() {
    const r = this.attachShadow({ mode: "open" });
    const rows = this._src.map((s, i) => `
  <div class="row" data-i="${i}">
   <span class="dot" id="dot${i}"></span>
   <span class="nm" id="nm${i}" data-act="more">${s.name}</span>
   <button class="tg" id="tg${i}" data-act="tg"><ha-icon icon="mdi:motion-sensor"></ha-icon><span id="tgl${i}">Aktiv</span></button>
  </div>`).join("");
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd" id="hd">
  <ha-icon icon="mdi:motion-sensor"></ha-icon>
  <span class="ttl" id="ttl">Bewegungssensoren WZ</span>
  <button class="chev" id="chev" title="Sensoren"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
  <button class="pwr" id="pwr" data-act="pwr" title="Bewegungssteuerung ein/aus"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 <div id="body" hidden>
  <div class="status" id="status"><ha-icon id="stIco" icon="mdi:sleep"></ha-icon><span id="stTxt">Ruhe</span></div>
  ${rows}
 </div>
</ha-card>`;

    this.$ = (id) => r.getElementById(id);
    r.querySelector("#body").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("pwr").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("chev").addEventListener("click", () => this._toggle(), false);
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
    if (act === "more") return this._mi(s.motion || s.enable);
    if (act === "tg") return this._svc(s.enable.split(".")[0], "toggle", { entity_id: s.enable });
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    if (!this._hass || !this._hass.states[c.master]) {
      this.$("body").innerHTML = `<div class="warn"><b>${c.master}</b> nicht gefunden.</div>`;
      this.$("body").hidden = false;
      return;
    }
    this.$("ttl").textContent = c.title || "Bewegungssensoren WZ";

    // aggregate / live state
    const live = this._on(c.aggregate);
    this.$("hd").className = "hd" + (live ? " active" : "");
    this.$("status").className = "status" + (live ? " live" : "");
    this.$("stIco").setAttribute("icon", live ? "mdi:motion-sensor" : "mdi:sleep");
    this.$("stTxt").textContent = live ? "Bewegung erkannt" : "Ruhe";

    // master arm button
    this.$("pwr").className = "pwr" + (this._on(c.master) ? " on" : "");

    // per source
    this._src.forEach((s, i) => {
      const enabled = this._on(s.enable);
      const detecting = enabled && this._on(s.motion);
      this.$("dot" + i).className = "dot" + (detecting ? " live" : "");
      this.$("nm" + i).className = "nm" + (enabled ? "" : " off");
      this.$("tg" + i).className = "tg" + (enabled ? " on" : "");
      this.$("tgl" + i).textContent = enabled ? "Aktiv" : "Aus";
    });
  }
}

/* ---- visual editor ---- */
class WzMotionCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        title: "Titel",
        master: "Master-Status (input_boolean)",
        aggregate: "Gesamt-Bewegung (binary_sensor)",
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
      { name: "master", selector: { entity: { domain: "input_boolean" } } },
      { name: "aggregate", selector: { entity: { domain: "binary_sensor" } } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("wz-motion-card-editor", WzMotionCardEditor);

customElements.define("wz-motion-card", WzMotionCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "wz-motion-card",
  name: "Bewegungssensoren WZ",
  description: "Kompakte Bewegungs-/Präsenzsteuerung: Live-Status + Aktiv-Schalter je Sensor",
  preview: false,
});
