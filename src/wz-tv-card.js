/* Wohnzimmer TV — compact control card
 * Recreates the big "TV" tile from the Wohnzimmer > Geräte section as a
 * self-contained custom card, sized to match custom:star-projector-card.
 *
 * Entities (all overridable in config):
 *   media_player.samsungtv              power + state
 *   switch.a_wz_nachtton                Sonos night sound
 *   switch.a_wz_sprachverbesserung      Sonos speech enhancement
 *   scene.wz_alle_fernsehlicht          TV ambient light scene
 *   switch.sync_box_power               Philips Hue Play HDMI Sync Box power
 *   input_button.sync_box_sync          Sync Box "sync now" button
 *   select.sync_box_hdmi_input          Sync Box HDMI input (waipu.tv / Octagon / Apple TV / Blu-Ray)
 *
 * The three "Fernbedienung" buttons navigate to the existing remote subviews.
 * User-facing strings German; code comments English.
 *
 * config:
 *   type: custom:wz-tv-card
 *   title: "Fernseher"
 *   media_player: media_player.samsungtv
 *   remotes:
 *     - { label: "waipu.tv", icon: "phu:waiputv",  path: "/lovelace/firetv" }
 *     - { label: "Octagon",  icon: "mdi:octagon",  path: "/lovelace/octagon" }
 *     - { label: "Apple TV", icon: "phu:apple-tv", path: "/lovelace/apple-tv" }
 */

const STYLE = `
:host{--acc:#4b8bf5;display:block}
ha-card{padding:12px 14px}
.hd{display:flex;align-items:center;gap:9px}
.hd>ha-icon{--mdc-icon-size:20px;color:var(--acc)}
.ttl{font-weight:800;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
.src{font-size:11px;font-weight:700;color:var(--secondary-text-color);margin-right:2px;font-variant-numeric:tabular-nums}
.pwr{border:none;border-radius:12px;background:var(--divider-color);color:var(--primary-text-color);width:38px;height:32px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.pwr ha-icon{--mdc-icon-size:19px}
.pwr.on{background:var(--acc);color:#fff}
.row{display:flex;align-items:center;gap:7px;margin-top:9px;min-height:26px}
.row .lbl{font-size:12px;color:var(--secondary-text-color);flex:0 0 82px}
.btn{flex:1 1 auto;border:1px solid var(--divider-color);border-radius:9px;background:var(--card-background-color);color:var(--primary-text-color);height:30px;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:inherit;font-size:11.5px;font-weight:600;line-height:1;padding:0 6px}
.btn ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.btn:active{transform:translateY(1px)}
.btn.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.btn.on ha-icon{color:var(--acc)}
.ico{flex:0 0 auto;width:34px;padding:0}
.ico ha-icon{--mdc-icon-size:18px}
.chips{display:flex;gap:5px;flex:1 1 auto}
.chip{flex:1 1 auto;border:1px solid var(--divider-color);border-radius:999px;background:var(--card-background-color);color:var(--primary-text-color);height:28px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}
.chip ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.chip.on ha-icon{color:var(--acc)}
.warn{padding:14px;color:var(--secondary-text-color);font-size:12.5px;text-align:center}
.chev{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.chev ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.chev.open ha-icon{transform:rotate(180deg)}
#body[hidden]{display:none}
`;

// HDMI option -> icon (matches the icons the original tile used)
const HDMI_ICON = {
  "waipu.tv": "phu:waiputv",
  "Octagon": "mdi:octagon",
  "Apple TV": "phu:apple-tv",
  "Blu-Ray": "phu:bluray",
};

const DEF_REMOTES = [
  { label: "waipu.tv", icon: "phu:waiputv", path: "/lovelace/firetv" },
  { label: "Octagon", icon: "mdi:octagon", path: "/lovelace/octagon" },
  { label: "Apple TV", icon: "phu:apple-tv", path: "/lovelace/apple-tv" },
];

class WzTvCard extends HTMLElement {
  static getStubConfig() { return { media_player: "media_player.samsungtv" }; }
  static getConfigElement() { return document.createElement("wz-tv-card-editor"); }

  setConfig(c) {
    this._cfg = Object.assign({
      title: "Fernseher",
      media_player: "media_player.samsungtv",
      nachtton: "switch.a_wz_nachtton",
      speech: "switch.a_wz_sprachverbesserung",
      tv_light_scene: "scene.wz_alle_fernsehlicht",
      sync_power: "switch.sync_box_power",
      sync_button: "input_button.sync_box_sync",
      hdmi_select: "select.sync_box_hdmi_input",
    }, c || {});
    this._remotes = Array.isArray(this._cfg.remotes) && this._cfg.remotes.length
      ? this._cfg.remotes : DEF_REMOTES;
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
  _on(id) { const s = this._st(id); return s === "on"; }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }
  _nav(path) {
    history.pushState(null, "", path);
    this.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
  }

  _build() {
    const r = this.attachShadow({ mode: "open" });
    const remoteBtns = this._remotes.map((rm, i) =>
      `<button class="btn" data-act="nav" data-i="${i}"><ha-icon icon="${rm.icon}"></ha-icon>${rm.label}</button>`
    ).join("");
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd">
  <ha-icon icon="mdi:television"></ha-icon>
  <span class="ttl" id="ttl">Fernseher</span>
  <span class="src" id="src"></span>
  <button class="chev" id="chev" title="Steuerung"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
  <button class="pwr" id="pwr" data-act="pwr" title="TV ein/aus"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 <div id="body" hidden>
  <div class="row">
   <span class="lbl">Fernbedienung</span>
   ${remoteBtns}
  </div>
  <div class="row">
   <span class="lbl">HDMI-Quelle</span>
   <span class="chips" id="hdmi"></span>
  </div>
  <div class="row">
   <span class="lbl">Licht &amp; Sync</span>
   <button class="btn" data-act="light"><ha-icon icon="mdi:television-ambient-light"></ha-icon>TV-Licht</button>
   <button class="btn" id="syncPwr" data-act="syncPwr"><ha-icon icon="hue:sync-box"></ha-icon>Sync Box</button>
   <button class="btn ico" data-act="syncGo" title="Jetzt synchronisieren"><ha-icon icon="mdi:sync"></ha-icon></button>
  </div>
  <div class="row">
   <span class="lbl">Ton</span>
   <button class="btn" id="ntTg" data-act="nacht"><ha-icon icon="mdi:chat-sleep"></ha-icon>Nachtton</button>
   <button class="btn" id="spTg" data-act="speech"><ha-icon icon="mdi:ear-hearing"></ha-icon>Sprache</button>
  </div>
 </div>
</ha-card>`;

    this.$ = (id) => r.getElementById(id);
    const hdmiOpts = (this._cfg.hdmi_options && this._cfg.hdmi_options.length)
      ? this._cfg.hdmi_options : ["waipu.tv", "Octagon", "Apple TV", "Blu-Ray"];
    r.getElementById("hdmi").innerHTML = hdmiOpts.map((o) =>
      `<button class="chip" data-act="hdmi" data-o="${o}" title="${o}"><ha-icon icon="${HDMI_ICON[o] || "mdi:hdmi-port"}"></ha-icon></button>`
    ).join("");

    r.querySelector("#body").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("pwr").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("chev").addEventListener("click", () => this._toggle(), false);
  }

  _tap(ev) {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    const c = this._cfg;
    if (act === "pwr") return this._svc("media_player", "toggle", { entity_id: c.media_player });
    if (act === "nav") return this._nav(this._remotes[Number(el.dataset.i)].path);
    if (act === "hdmi") return this._svc("select", "select_option", { entity_id: c.hdmi_select, option: el.dataset.o });
    if (act === "light") return this._svc("scene", "turn_on", { entity_id: c.tv_light_scene });
    if (act === "syncPwr") return this._svc("switch", "toggle", { entity_id: c.sync_power });
    if (act === "syncGo") return this._svc("input_button", "press", { entity_id: c.sync_button });
    if (act === "nacht") return this._svc("switch", "toggle", { entity_id: c.nachtton });
    if (act === "speech") return this._svc("switch", "toggle", { entity_id: c.speech });
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    if (!this._hass || !this._hass.states[c.media_player]) {
      this.$("body").innerHTML = `<div class="warn"><b>${c.media_player}</b> nicht gefunden.</div>`;
      this.$("body").hidden = false;
      return;
    }
    this.$("ttl").textContent = c.title || "Fernseher";

    const mp = this._hass.states[c.media_player];
    const tvOn = !["off", "unavailable", "unknown", "standby", "idle"].includes(mp.state);
    this.$("pwr").className = "pwr" + (tvOn ? " on" : "");
    // small status line: media title if playing, else on/off
    const title = mp.attributes && mp.attributes.media_title;
    this.$("src").textContent = tvOn ? (title || "Ein") : "Aus";

    // HDMI active chip
    const cur = this._st(c.hdmi_select);
    this.shadowRoot.querySelectorAll('#hdmi .chip').forEach((ch) => {
      ch.classList.toggle("on", ch.dataset.o === cur);
    });

    // toggles
    this.$("syncPwr").classList.toggle("on", this._on(c.sync_power));
    this.$("ntTg").classList.toggle("on", this._on(c.nachtton));
    this.$("spTg").classList.toggle("on", this._on(c.speech));
  }
}

/* ---- visual editor ---- */
class WzTvCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        title: "Titel",
        media_player: "TV Media-Player",
        nachtton: "Nachtton (switch)",
        speech: "Sprachverbesserung (switch)",
        tv_light_scene: "TV-Licht Szene",
        sync_power: "Sync Box Power (switch)",
        sync_button: "Sync Box Sync (button)",
        hdmi_select: "HDMI-Quelle (select)",
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
      { name: "media_player", selector: { entity: { domain: "media_player" } } },
      { name: "nachtton", selector: { entity: { domain: "switch" } } },
      { name: "speech", selector: { entity: { domain: "switch" } } },
      { name: "tv_light_scene", selector: { entity: { domain: "scene" } } },
      { name: "sync_power", selector: { entity: { domain: "switch" } } },
      { name: "sync_button", selector: { entity: { domain: "input_button" } } },
      { name: "hdmi_select", selector: { entity: { domain: "select" } } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("wz-tv-card-editor", WzTvCardEditor);

customElements.define("wz-tv-card", WzTvCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "wz-tv-card",
  name: "Wohnzimmer TV",
  description: "Kompakte TV-Steuerung: Power, Fernbedienungen, HDMI-Quelle, Sync Box, Ton",
  preview: false,
});
