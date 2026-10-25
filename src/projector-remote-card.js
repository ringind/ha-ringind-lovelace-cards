/* Projector remote card (custom:projector-remote-card) — popup / dropdown / inline, DE/EN
 *
 * On-screen remote for an Android projector/TV controlled over ADB with Home Assistant's
 * "Android Debug Bridge" integration (`androidtv`): D-pad + OK, back/home/menu/settings,
 * volume, media keys and 0-6 app shortcuts. No pre-filled entity IDs, labels or packages —
 * every field starts empty and is set through the visual editor.
 *
 * Commands use the ADB integration's key names (UP, DOWN, LEFT, RIGHT, ENTER, BACK, HOME,
 * MENU, SETTINGS, VOLUME_UP, VOLUME_DOWN, MUTE, PREVIOUS, PLAY_PAUSE, NEXT) sent through
 * `remote.send_command`. Power and the app shortcuts go through the media player
 * (`media_player.toggle`, `media_player.select_source` with the app's package name).
 *
 * config:
 *   type: custom:projector-remote-card
 *   title: "Beamer"
 *   mode: popup                 # "popup" (default) | "dropdown" | "inline"
 *   language: auto              # "auto" | "de" | "en"
 *   media_player: media_player.xxx   # power button, on/off state, app launch
 *   remote: remote.xxx               # key commands
 *   apps: [ { label, icon, source }, ... ]   # 0..6, source = Android package name
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
import DE from "../localization/de.js";
import EN from "../localization/en.js";
const I18N = { de: DE["projector-remote-card"], en: EN["projector-remote-card"] };

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
.warn{padding:16px;color:var(--secondary-text-color);font-size:12.5px;text-align:center}

.row{display:flex;align-items:center;gap:7px;margin-top:9px;min-height:30px}
.row .lbl{font-size:12px;color:var(--secondary-text-color);flex:0 0 60px}
.apps{display:flex;flex-wrap:wrap;gap:6px;flex:1 1 auto}
.btn{flex:1 1 auto;border:1px solid var(--divider-color);border-radius:9px;background:var(--card-background-color);color:var(--primary-text-color);min-height:32px;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:inherit;font-size:11.5px;font-weight:600;line-height:1;padding:4px 8px}
.btn ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.btn:active{transform:translateY(1px)}
.btn.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.btn.on ha-icon{color:var(--acc)}

.rc{margin-top:14px;padding-top:10px;border-top:1px solid var(--divider-color)}
.rc-hd{font-size:12px;font-weight:700;color:var(--secondary-text-color);margin:0 0 8px;text-align:center;text-transform:uppercase;letter-spacing:.03em}
.rc-row{display:flex;gap:6px;justify-content:center;margin-bottom:6px;max-width:230px;margin-left:auto;margin-right:auto}
.rc-btn{flex:1 1 0;max-width:64px;aspect-ratio:1/1;border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color);color:var(--primary-text-color);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;font-weight:700;font-size:15px;padding:0}
.rc-btn ha-icon{--mdc-icon-size:23px;color:var(--secondary-text-color)}
.rc-btn:active{transform:translateY(1px)}
.rc-btn[disabled]{opacity:.35;cursor:default;pointer-events:none}
.rc-btn.rc-nav{background:var(--secondary-background-color, rgba(127,127,127,.18));border-color:var(--secondary-background-color, rgba(127,127,127,.3))}
.rc-btn.rc-nav ha-icon{color:var(--primary-text-color)}
.rc-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:216px;margin:0 auto 6px}
.rc-grid3 .rc-btn{max-width:none}

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

// Structural-only defaults — no entity IDs, labels, icons or packages are pre-filled.
const BASE = { mode: "popup", language: "auto", apps: [] };

const clampList = (v) => (Array.isArray(v) ? v.slice(0, 6) : []);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

class ProjectorRemoteCard extends HTMLElement {
  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement("projector-remote-card-editor"); }

  setConfig(c) {
    const prevSig = this._sig;
    this._cfg = Object.assign({}, BASE, c || {});
    this._cfg.apps = clampList(c && c.apps);
    this._popup = this._cfg.mode === "popup";
    this._inline = this._cfg.mode === "inline";
    this._open = false;
    this._sig = [this._cfg.mode, this._cfg.language, this._cfg.apps.length].join("|");
    if (this.shadowRoot && prevSig !== undefined && prevSig !== this._sig) {
      this.shadowRoot.innerHTML = "";
      this._build();
      if (this._hass) this._render();
    }
  }
  getCardSize() { return 6; }
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
  _L() { return I18N[this._lang()] || I18N.de; }
  _t(k) { return this._L()[k] || k; }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }

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
    // Clear a stale `open` left behind when the card was detached while the dialog was
    // showing — otherwise showModal() throws and the popup button appears dead.
    if (d.open) { try { d.close(); } catch (_e) { /* ignore */ } }
    try {
      d.showModal();
    } catch (_e) {
      d.removeAttribute("open");
      try { d.showModal(); } catch (_e2) { /* ignore */ }
    }
  }

  // Fixed button layout; only the target entities and the app list come from the editor.
  _rows() {
    const L = this._L();
    const cmd = (c, icon, label, extra) =>
      `<button class="rc-btn${extra ? " " + extra : ""}" data-act="cmd|${c}" title="${label}"><ha-icon icon="${icon}"></ha-icon></button>`;
    const appBtns = this._cfg.apps.map((a, i) =>
      `<button class="btn" data-act="app" data-i="${i}"><ha-icon icon="${esc(a.icon || "mdi:application")}"></ha-icon>${esc(a.label)}</button>`).join("");
    return `
  ${this._cfg.apps.length ? `<div class="row"><span class="lbl">${L.apps}</span><span class="apps">${appBtns}</span></div>` : ""}
  <div class="rc">
   <div class="rc-hd">${L.remote_title}</div>
   <div class="rc-row">
    ${cmd("BACK", "mdi:arrow-left", L.btn_back)}
    ${cmd("HOME", "mdi:home", L.btn_home)}
    ${cmd("MENU", "mdi:menu", L.btn_menu)}
   </div>
   <div class="rc-grid3">
    <span></span>${cmd("UP", "mdi:chevron-up", L.btn_up, "rc-nav")}<span></span>
    ${cmd("LEFT", "mdi:chevron-left", L.btn_left, "rc-nav")}
    <button class="rc-btn rc-nav" data-act="cmd|ENTER" title="${L.btn_ok}">OK</button>
    ${cmd("RIGHT", "mdi:chevron-right", L.btn_right, "rc-nav")}
    <span></span>${cmd("DOWN", "mdi:chevron-down", L.btn_down, "rc-nav")}<span></span>
   </div>
   <div class="rc-row">
    ${cmd("VOLUME_DOWN", "mdi:volume-minus", L.btn_vol_down)}
    ${cmd("MUTE", "mdi:volume-mute", L.btn_mute)}
    ${cmd("VOLUME_UP", "mdi:volume-plus", L.btn_vol_up)}
   </div>
   <div class="rc-row">
    ${cmd("PREVIOUS", "mdi:skip-previous", L.btn_prev)}
    ${cmd("PLAY_PAUSE", "mdi:play-pause", L.btn_playpause)}
    ${cmd("NEXT", "mdi:skip-next", L.btn_next)}
   </div>
   <div class="rc-row">
    ${cmd("SETTINGS", "mdi:cog", L.btn_settings)}
   </div>
  </div>`;
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const popup = this._popup;
    const ttl = esc(this._cfg.title || this._t("title"));
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hd" id="hd">
  <ha-icon icon="mdi:projector"></ha-icon>
  <span class="ttl" id="ttl">${ttl}</span>
  ${this._inline ? "" : `<button class="toggle-btn" id="toggleBtn" title="${popup ? this._t("settings") : this._t("expand")}"><ha-icon icon="${popup ? "mdi:tune-variant" : "mdi:chevron-down"}"></ha-icon></button>`}
  <button class="pwr" id="pwr" data-act="pwr" title="${this._t("power")}"><ha-icon icon="mdi:power"></ha-icon></button>
 </div>
 ${popup ? "" : `<div class="drop" id="body"${this._inline ? "" : " hidden"}>${this._rows()}</div>`}
</ha-card>
${popup ? `<dialog class="pop" id="pop">
 <div class="pop-hd">
  <ha-icon icon="mdi:projector"></ha-icon>
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
      // Open/close from the whole header; the power button keeps its own handler.
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
    if (!el || el.hasAttribute("disabled")) return;
    const c = this._cfg;
    const [act, a] = el.dataset.act.split("|");
    if (act === "pwr") return c.media_player && this._svc("media_player", "toggle", { entity_id: c.media_player });
    if (act === "app") {
      const src = (c.apps[Number(el.dataset.i)] || {}).source;
      if (src && c.media_player) this._svc("media_player", "select_source", { entity_id: c.media_player, source: src });
      return;
    }
    if (act === "cmd") return this._svc("remote", "send_command", { entity_id: c.remote, command: a });
  }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    const ttl = c.title || this._t("title");
    this.$("ttl").textContent = ttl;
    if (this.$("popTtl")) this.$("popTtl").textContent = ttl;

    const mp = c.media_player && this._hass.states[c.media_player];
    const on = !!mp && !["off", "unavailable", "unknown", "standby"].includes(mp.state);
    this.$("pwr").className = "pwr" + (on ? " on" : "");
    if (this.$("popPwr")) this.$("popPwr").className = "pwr" + (on ? " on" : "");

    // Mark the app that is currently in the foreground (media player `app_id`).
    const cur = mp && mp.attributes.app_id;
    this.shadowRoot.querySelectorAll('[data-act="app"]').forEach((b) => {
      b.classList.toggle("on", !!cur && (c.apps[Number(b.dataset.i)] || {}).source === cur);
    });

    // A native `disabled` button can't be tapped, so this is the whole guard until
    // the entities each control needs are configured.
    const hasRemote = !!c.remote && !!this._hass.states[c.remote];
    this.shadowRoot.querySelectorAll('[data-act^="cmd|"]').forEach((b) => { b.disabled = !hasRemote; });
    this.shadowRoot.querySelectorAll('[data-act="app"]').forEach((b) => { b.disabled = !mp; });
    this.$("pwr").disabled = !mp;
    if (this.$("popPwr")) this.$("popPwr").disabled = !mp;
    this.shadowRoot.querySelectorAll(".warn").forEach((w) => w.remove());
    if (!c.media_player && !c.remote) {
      const w = document.createElement("div");
      w.className = "warn";
      w.textContent = this._t("not_configured");
      this.$("body").prepend(w);
      if (!this._popup) this.$("body").hidden = false;
    }
  }
}

/* ---- visual editor ---- */
class ProjectorRemoteCardEditor extends HTMLElement {
  setConfig(config) {
    const sig = [config.mode, config.language, (config.apps || []).length].join("|");
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
    // Read the *current* array at event time, not this closure's snapshot — config-changed
    // round-trips through setConfig() without a DOM rebuild (count unchanged), so a stale
    // `items` reference would make each edit clobber any other edit made since render.
    const cur = () => Array.isArray(this._config[key]) ? this._config[key] : items;
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
      f.computeLabel = (s) => ({ label: L.e_label, icon: L.e_icon, source: L.e_source }[s.name] || s.name);
      f.addEventListener("value-changed", (ev) => {
        const next = cur().slice(); next[idx] = ev.detail.value;
        this._emit(Object.assign({}, this._config, { [key]: next }));
      });
      rowEl.appendChild(f);
      const del = document.createElement("ha-icon-button");
      del.style.cssText = "--mdc-icon-button-size:36px;margin-top:2px";
      del.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
      del.addEventListener("click", () => {
        const next = cur().slice(); next.splice(idx, 1);
        this._emit(Object.assign({}, this._config, { [key]: next }));
      });
      rowEl.appendChild(del);
      wrap.appendChild(rowEl);
    });
    if (items.length < 6) {
      const add = document.createElement("mwc-button");
      add.setAttribute("outlined", "");
      add.textContent = "+ " + L.e_add;
      add.addEventListener("click", () => {
        this._emit(Object.assign({}, this._config, { [key]: cur().concat([mkNew()]) }));
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
      this.appendChild(this._list("apps", L.e_apps,
        () => [
          { name: "label", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
          { name: "source", selector: { text: {} } },
        ], () => ({ label: "", icon: "mdi:application", source: "" })));
    }
    this._base.hass = this._hass;
    this._base.computeLabel = (s) => ({
      title: L.e_title, mode: L.e_mode, language: L.e_language,
      media_player: L.e_media, remote: L.e_remote,
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
      { name: "media_player", selector: { entity: { domain: "media_player" } } },
      { name: "remote", selector: { entity: { domain: "remote" } } },
    ];
    this._base.data = this._config;
  }
}
customElements.define("projector-remote-card-editor", ProjectorRemoteCardEditor);

customElements.define("projector-remote-card", ProjectorRemoteCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "projector-remote-card",
  name: "Projector Remote",
  description: "On-screen remote for an Android projector/TV controlled over ADB (Android Debug Bridge integration): D-pad, home/back/menu, volume, media keys, app shortcuts. No pre-filled entities. Popup/dropdown/inline, DE/EN.",
  preview: false,
});
