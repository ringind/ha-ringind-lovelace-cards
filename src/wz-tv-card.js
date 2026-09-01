/* Living-room TV — compact control card (popup / dropdown / inline, DE/EN)
 *
 * Collapsed = header (title + power). The chevron / tune icon opens the controls
 * as an inline dropdown or a modal popup; `mode: inline` shows them in the card
 * permanently (no toggle button). Everything is configurable in the visual
 * editor:
 *   - all entities (media_player, TV-light scene, Sync Box power + sync button +
 *     sync state, HDMI-source select)
 *   - "Remotes": 1–4 navigation buttons  (label / icon / navigation path)
 *   - "HDMI source": 1–4 chips           (select option / icon)
 *   - "Sound": 1–4 toggle entities        (entity / label / icon)
 * Code comments English.
 *
 * config:
 *   type: custom:wz-tv-card
 *   title: "Fernseher"
 *   mode: popup            # "popup" (default) | "dropdown" | "inline"
 *   language: auto         # "auto" | "de" | "en"
 *   media_player: media_player.samsungtv
 *   tv_light_scene: scene.wz_alle_fernsehlicht
 *   sync_power: switch.sync_box_power
 *   sync_button: input_button.sync_box_sync
 *   sync_state: switch.sync_box_light_sync
 *   hdmi_select: select.sync_box_hdmi_input
 *   remotes: [ { label, icon, path }, ... ]      # 1..4
 *   hdmi:    [ { option, icon }, ... ]           # 1..4
 *   ton:     [ { entity, label, icon }, ... ]    # 1..4
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
import DE from "../localization/de.js";
import EN from "../localization/en.js";
const I18N = { de: DE["wz-tv-card"], en: EN["wz-tv-card"] };

const STYLE = `
:host{--acc:#4b8bf5;display:block}
ha-card{padding:12px 14px}
.hd{display:flex;align-items:center;gap:9px;cursor:pointer}
.hd>ha-icon{--mdc-icon-size:20px;color:var(--acc)}
.ttl{font-weight:800;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--primary-text-color)}
:host(.inline) .hd{cursor:default}
.pwr{border:none;border-radius:12px;background:var(--divider-color);color:var(--primary-text-color);width:38px;height:32px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.pwr ha-icon{--mdc-icon-size:19px}
.pwr.on{background:var(--acc);color:#fff}
.toggle-btn{border:none;background:none;color:var(--secondary-text-color);cursor:pointer;padding:2px;flex:0 0 auto;display:inline-flex}
.toggle-btn ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.toggle-btn.open ha-icon{transform:rotate(180deg)}
.drop{padding-top:4px}
.drop[hidden],#body[hidden]{display:none}

.row{display:flex;align-items:center;gap:7px;margin-top:9px;min-height:30px}
.row .lbl{font-size:12px;color:var(--secondary-text-color);flex:0 0 88px}
.btn{flex:1 1 auto;border:1px solid var(--divider-color);border-radius:9px;background:var(--card-background-color);color:var(--primary-text-color);min-height:32px;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:inherit;font-size:11.5px;font-weight:600;line-height:1;padding:4px 8px}
.btn ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.btn:active{transform:translateY(1px)}
.btn.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.btn.on ha-icon{color:var(--acc)}
.chips{display:flex;gap:5px;flex:1 1 auto}
.chip{flex:1 1 auto;border:1px solid var(--divider-color);border-radius:999px;background:var(--card-background-color);color:var(--primary-text-color);min-height:30px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}
.chip ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.chip.on ha-icon{color:var(--acc)}
.warn{padding:16px;color:var(--secondary-text-color);font-size:12.5px;text-align:center}

dialog.pop{border:none;margin:auto;padding:0;width:min(500px, calc(100vw - 32px));max-width:min(500px, calc(100vw - 32px));max-height:calc(100% - 72px);border-radius:var(--ha-dialog-border-radius, 28px);color:var(--primary-text-color);background:var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);font-family:var(--mdc-typography-body1-font-family, var(--ha-font-family-body, inherit));font-size:1rem;overflow:hidden;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
dialog.pop[open]{display:flex;flex-direction:column}
dialog.pop::backdrop{background:transparent}
.pop-hd{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:24px 24px 8px;font-size:1.574rem;font-weight:400;line-height:1.2}
.pop-hd>ha-icon{--mdc-icon-size:24px;color:var(--acc);flex:0 0 auto}
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
  media_player: "media_player.samsungtv",
  tv_light_scene: "scene.wz_alle_fernsehlicht",
  sync_power: "switch.sync_box_power",
  sync_button: "input_button.sync_box_sync",
  sync_state: "switch.sync_box_light_sync",
  hdmi_select: "select.sync_box_hdmi_input",
  remotes: [
    { label: "waipu.tv", icon: "phu:waiputv", path: "/lovelace/firetv" },
    { label: "Octagon", icon: "mdi:octagon", path: "/lovelace/octagon" },
    { label: "Apple TV", icon: "phu:apple-tv", path: "/lovelace/apple-tv" },
  ],
  hdmi: [
    { option: "waipu.tv", icon: "phu:waiputv" },
    { option: "Octagon", icon: "mdi:octagon" },
    { option: "Apple TV", icon: "phu:apple-tv" },
    { option: "Blu-Ray", icon: "phu:bluray" },
  ],
  ton: [
    { entity: "switch.a_wz_nachtton", label: "Nachtton", icon: "mdi:chat-sleep" },
    { entity: "switch.a_wz_sprachverbesserung", label: "Sprache", icon: "mdi:ear-hearing" },
  ],
};

const clampList = (v, def) => {
  const a = Array.isArray(v) && v.length ? v.slice(0, 4) : def.slice();
  return a.length ? a : def.slice();
};

class WzTvCard extends HTMLElement {
  static getStubConfig() { return { media_player: "media_player.samsungtv" }; }
  static getConfigElement() { return document.createElement("wz-tv-card-editor"); }

  setConfig(c) {
    const prevSig = this._sig;
    this._cfg = Object.assign({}, DEFAULTS, c || {});
    this._cfg.remotes = clampList(c && c.remotes, DEFAULTS.remotes);
    this._cfg.hdmi = clampList(c && c.hdmi, DEFAULTS.hdmi);
    this._cfg.ton = clampList(c && c.ton, DEFAULTS.ton);
    this._popup = this._cfg.mode === "popup";
    this._inline = this._cfg.mode === "inline";
    this._open = false;
    this._sig = [this._cfg.mode, this._cfg.language, this._cfg.remotes.length,
      this._cfg.hdmi.length, this._cfg.ton.length].join("|");
    if (this.shadowRoot && prevSig !== undefined && prevSig !== this._sig) {
      this.shadowRoot.innerHTML = "";
      this._build();
      if (this._hass) this._render();
    }
  }
  getCardSize() { return 4; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  disconnectedCallback() {
    // A view switch tears the card down; never carry an open modal dialog across it.
    const d = this.shadowRoot && this.shadowRoot.getElementById("pop");
    if (d && d.open) { try { d.close(); } catch (_e) { /* ignore */ } }
  }

  _lang() {
    const c = this._cfg.language || "auto";
    if (c === "de" || c === "en") return c;
    return (this._hass && this._hass.language || "").toLowerCase().startsWith("de") ? "de" : "en";
  }
  _t(k) { return (I18N[this._lang()] || I18N.de)[k] || k; }

  _st(id) { const e = this._hass && this._hass.states[id]; return e ? e.state : undefined; }
  _on(id) { return this._st(id) === "on"; }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }
  _nav(path) {
    // Close the popup before navigating away — a dialog left open across a view
    // switch wedges the browser top-layer state and kills the button afterwards.
    const d = this.$("pop");
    if (d && d.open) { try { d.close(); } catch (_e) { /* ignore */ } }
    history.pushState(null, "", path);
    this.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
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

  _rows() {
    const c = this._cfg;
    const remoteBtns = c.remotes.map((rm, i) =>
      `<button class="btn" data-act="nav" data-i="${i}"><ha-icon icon="${rm.icon || "mdi:remote"}"></ha-icon>${rm.label || ""}</button>`).join("");
    const hdmiChips = c.hdmi.map((h) =>
      `<button class="chip" data-act="hdmi" data-o="${h.option}" title="${h.option}"><ha-icon icon="${h.icon || "mdi:hdmi-port"}"></ha-icon></button>`).join("");
    const tonBtns = c.ton.map((s, i) =>
      `<button class="btn" data-act="ton" data-i="${i}"><ha-icon icon="${s.icon || "mdi:volume-high"}"></ha-icon>${s.label || ""}</button>`).join("");
    return `
  <div class="row"><span class="lbl">${this._t("remote")}</span>${remoteBtns}</div>
  <div class="row"><span class="lbl">${this._t("hdmi")}</span><span class="chips" id="hdmi">${hdmiChips}</span></div>
  <div class="row">
   <span class="lbl">${this._t("light_sync")}</span>
   <button class="btn" data-act="light"><ha-icon icon="mdi:television-ambient-light"></ha-icon>${this._t("tv_light")}</button>
   <button class="btn" id="syncPwr" data-act="syncPwr"><ha-icon icon="hue:sync-box"></ha-icon>${this._t("sync_box")}</button>
   <button class="btn" id="syncGo" data-act="syncGo" title="${this._t("sync_now")}"><ha-icon icon="mdi:sync"></ha-icon>${this._t("sync")}</button>
  </div>
  <div class="row"><span class="lbl">${this._t("sound")}</span>${tonBtns}</div>`;
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const popup = this._popup;
    const ttl = this._cfg.title || this._t("title");
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd" id="hd">
  <ha-icon icon="mdi:television"></ha-icon>
  <span class="ttl" id="ttl">${ttl}</span>
  ${this._inline ? "" : `<button class="toggle-btn" id="toggleBtn" title="${popup ? this._t("settings") : this._t("expand")}"><ha-icon icon="${popup ? "mdi:tune-variant" : "mdi:chevron-down"}"></ha-icon></button>`}
  <button class="pwr" id="pwr" data-act="pwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 ${popup ? "" : `<div class="drop" id="body"${this._inline ? "" : " hidden"}>${this._rows()}</div>`}
</ha-card>
${popup ? `<dialog class="pop" id="pop">
 <div class="pop-hd">
  <ha-icon icon="mdi:television"></ha-icon>
  <span class="pop-ttl" id="popTtl">${ttl}</span>
  <button class="pwr" id="popPwr" data-act="pwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
  <button class="x" id="closeBtn" title="${this._t("close")}"><ha-icon icon="mdi:close"></ha-icon></button>
 </div>
 <div class="pop-bd" id="body">${this._rows()}</div>
</dialog>` : ""}`;
    this.$ = (id) => r.getElementById(id);
    this.classList.toggle("inline", this._inline);
    this.$("body").addEventListener("click", (ev) => this._tap(ev), false);
    this.$("pwr").addEventListener("click", (ev) => this._tap(ev), false);
    if (!this._inline) {
      // Open/close from the whole header — leading icon, title and the
      // tune/chevron icon; the power button keeps its own handler.
      this.$("hd").addEventListener("click", (e) => {
        if (e.target.closest("#pwr")) return;
        this._toggle();
      }, false);
    }
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
    const c = this._cfg;
    if (act === "pwr") return this._svc("media_player", "toggle", { entity_id: c.media_player });
    if (act === "nav") return this._nav((c.remotes[Number(el.dataset.i)] || {}).path || "/");
    if (act === "hdmi") return this._svc("select", "select_option", { entity_id: c.hdmi_select, option: el.dataset.o });
    if (act === "light") return this._svc("scene", "turn_on", { entity_id: c.tv_light_scene });
    if (act === "syncPwr") return this._svc(c.sync_power.split(".")[0], "toggle", { entity_id: c.sync_power });
    if (act === "syncGo") return this._svc(c.sync_button.split(".")[0], c.sync_button.startsWith("input_button") ? "press" : "toggle", { entity_id: c.sync_button });
    if (act === "ton") {
      const e = (c.ton[Number(el.dataset.i)] || {}).entity;
      if (e) this._svc(e.split(".")[0], "toggle", { entity_id: e });
    }
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    if (!this._hass || !this._hass.states[c.media_player]) {
      this.$("body").innerHTML = `<div class="warn"><b>${c.media_player}</b> — ?</div>`;
      if (!this._popup) this.$("body").hidden = false;
      return;
    }
    const ttl = c.title || this._t("title");
    this.$("ttl").textContent = ttl;
    if (this.$("popTtl")) this.$("popTtl").textContent = ttl;

    const mp = this._hass.states[c.media_player];
    const tvOn = !["off", "unavailable", "unknown", "standby", "idle"].includes(mp.state);
    this.$("pwr").className = "pwr" + (tvOn ? " on" : "");
    if (this.$("popPwr")) this.$("popPwr").className = "pwr" + (tvOn ? " on" : "");

    const cur = this._st(c.hdmi_select);
    this.shadowRoot.querySelectorAll("#hdmi .chip").forEach((ch) => ch.classList.toggle("on", ch.dataset.o === cur));
    if (this.$("syncPwr")) this.$("syncPwr").classList.toggle("on", this._on(c.sync_power));
    if (this.$("syncGo")) this.$("syncGo").classList.toggle("on", this._on(c.sync_state));
    this.shadowRoot.querySelectorAll('[data-act="ton"]').forEach((b) => {
      const e = (c.ton[Number(b.dataset.i)] || {}).entity;
      b.classList.toggle("on", e ? this._on(e) : false);
    });
  }
}

/* ---- visual editor ---- */
class WzTvCardEditor extends HTMLElement {
  setConfig(config) {
    const sig = [config.mode, config.language,
      (config.remotes || []).length, (config.hdmi || []).length, (config.ton || []).length].join("|");
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
  _list(key, title, itemSchema, mkNew) {
    const L = this._L();
    const items = Array.isArray(this._config[key]) ? this._config[key] : [];
    const wrap = document.createElement("div");
    wrap.style.cssText = "margin:14px 0 4px";
    const h = document.createElement("div");
    h.style.cssText = "font-weight:600;font-size:.95em;margin-bottom:6px";
    h.textContent = title;
    wrap.appendChild(h);
    items.forEach((item, idx) => {
      const rowEl = document.createElement("div");
      rowEl.style.cssText = "display:flex;align-items:flex-start;gap:6px;margin-bottom:10px";
      const f = document.createElement("ha-form");
      f.style.flex = "1 1 auto";
      f.hass = this._hass;
      f.schema = itemSchema(L);
      f.data = item;
      f.computeLabel = (s) => ({
        label: L.e_label, icon: L.e_icon, path: L.e_path, option: L.e_option, entity: L.e_entity,
      }[s.name] || s.name);
      f.addEventListener("value-changed", (ev) => {
        const next = items.slice(); next[idx] = ev.detail.value;
        this._emit(Object.assign({}, this._config, { [key]: next }));
      });
      rowEl.appendChild(f);
      const del = document.createElement("ha-icon-button");
      del.style.cssText = "--mdc-icon-button-size:36px;margin-top:2px";
      del.disabled = items.length <= 1;
      del.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
      del.addEventListener("click", () => {
        if (items.length <= 1) return;
        const next = items.slice(); next.splice(idx, 1);
        this._emit(Object.assign({}, this._config, { [key]: next }));
      });
      rowEl.appendChild(del);
      wrap.appendChild(rowEl);
    });
    if (items.length < 4) {
      const add = document.createElement("mwc-button");
      add.setAttribute("outlined", "");
      add.textContent = "+ " + L.e_add;
      add.addEventListener("click", () => {
        this._emit(Object.assign({}, this._config, { [key]: items.concat([mkNew()]) }));
      });
      wrap.appendChild(add);
    }
    return wrap;
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
      this.appendChild(this._list("remotes", L.e_remotes,
        (l) => [
          { name: "label", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
          { name: "path", selector: { text: {} } },
        ], () => ({ label: "", icon: "mdi:remote", path: "/lovelace/home" })));
      this.appendChild(this._list("hdmi", L.e_hdmi_list,
        (l) => [
          { name: "option", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ], () => ({ option: "", icon: "mdi:hdmi-port" })));
      this.appendChild(this._list("ton", L.e_ton,
        (l) => [
          { name: "entity", selector: { entity: {} } },
          { name: "label", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ], () => ({ entity: "", label: "", icon: "mdi:volume-high" })));
    }
    this._base.hass = this._hass;
    this._base.computeLabel = (s) => ({
      title: L.e_title, mode: L.e_mode, language: L.e_language,
      media_player: L.e_media, tv_light_scene: L.e_tv_light,
      sync_power: L.e_sync_power, sync_button: L.e_sync_button, sync_state: L.e_sync_state,
      hdmi_select: L.e_hdmi_select,
    }[s.name] || s.name);
    this._base.schema = [
      { name: "title", selector: { text: {} } },
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "popup", label: L.e_popup }, { value: "dropdown", label: L.e_dropdown },
        { value: "inline", label: L.e_inline },
      ] } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en },
      ] } } },
      { name: "media_player", selector: { entity: {} } },
      { name: "tv_light_scene", selector: { entity: { domain: "scene" } } },
      { name: "sync_power", selector: { entity: {} } },
      { name: "sync_button", selector: { entity: {} } },
      { name: "sync_state", selector: { entity: {} } },
      { name: "hdmi_select", selector: { entity: {} } },
    ];
    this._base.data = this._config;
  }
}
customElements.define("wz-tv-card-editor", WzTvCardEditor);

customElements.define("wz-tv-card", WzTvCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "wz-tv-card",
  name: "Living-room TV",
  description: "Compact TV control — power, remotes, HDMI source, Sync Box, sound. Popup/dropdown/inline, DE/EN.",
  preview: false,
});
