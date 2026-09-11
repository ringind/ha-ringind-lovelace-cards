/* Generic TV control card with a built-in Android TV remote (popup / dropdown / inline, DE/EN)
 *
 * A fork of wz-tv-card with two changes:
 *   1. No pre-filled entity IDs, labels, icons or paths anywhere — every field starts
 *      empty and is set entirely through the visual editor. A freshly-added card shows
 *      "please configure" until entities are picked; the repeatable lists ("remotes",
 *      "hdmi", "ton") start at 0 items instead of 1-4 example rows.
 *   2. An extra "waipu.tv remote" section: a fixed-layout on-screen replica of the
 *      physical waipu.tv Box remote (every button from the official manual — power, mic/
 *      Google Assistant, numeric keypad, guide, last-channel, live-TV, HDMI source,
 *      D-pad + OK/back/menu, home, mute, channel +/-, volume +/-, rewind/play-pause/FF,
 *      restart, record, next, waiputhek and Netflix). Every button sends a fixed Android
 *      TV command — see the table in `_remoteRows()` — to ONE configurable `remote.*`
 *      entity (the Home Assistant "Android TV Remote" integration). Two buttons have no
 *      exact 1:1 Android TV Remote equivalent and are a documented best effort:
 *        - "Letzter Sender" sends the raw Android keycode 229 (KEYCODE_LAST_CHANNEL) —
 *          not in HA's named-command list, so this depends on the integration passing
 *          unrecognized numeric strings straight through.
 *        - "Von Beginn starten" (restart current program) sends MEDIA_PREVIOUS, the
 *          closest standard media semantic — Android TV has no dedicated key for it.
 *      Netflix and waiputhek use `remote.turn_on` with an `activity` deep link (HA's
 *      documented app-launch mechanism); both links are plain user-supplied text fields
 *      (no default) since the correct deep link depends on the installed app build.
 *
 * Everything else (remotes/HDMI/Sync/Sound rows) is unchanged from wz-tv-card.
 *
 * config:
 *   type: custom:tv-remote-card
 *   title: "Fernseher"
 *   mode: popup                 # "popup" (default) | "dropdown" | "inline"
 *   language: auto               # "auto" | "de" | "en"
 *   media_player: media_player.xxx
 *   tv_light_scene: scene.xxx
 *   sync_power: switch.xxx
 *   sync_button: input_button.xxx
 *   sync_state: switch.xxx
 *   hdmi_select: select.xxx
 *   waipu_remote: remote.xxx          # Android TV Remote integration entity
 *   waipu_hdmi_option: "waipu.tv"     # option string on hdmi_select for the "Quelle" button
 *   netflix_link: "https://www.netflix.com"      # remote.turn_on activity deep link
 *   waiputhek_link: "https://..."                # remote.turn_on activity deep link
 *   remotes: [ { label, icon, path }, ... ]      # 0..4
 *   hdmi:    [ { option, icon }, ... ]           # 0..4
 *   ton:     [ { entity, label, icon }, ... ]    # 0..4
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
const DE = { "tv-remote-card": {
  title: "Fernseher",
  remote: "Fernbedienung",
  hdmi: "HDMI-Quelle",
  light_sync: "Licht & Sync",
  tv_light: "TV-Licht",
  sync_box: "Sync Box",
  sync: "Sync",
  sync_now: "Jetzt synchronisieren",
  sound: "Ton",
  settings: "Steuerung",
  expand: "Ein-/Ausklappen",
  power: "TV ein/aus",
  close: "Schließen",
  not_configured: "Bitte Entitäten in den Karteneinstellungen wählen.",
  waipu_remote_title: "waipu.tv Fernbedienung",
  btn_power: "Ein/Aus",
  btn_mic: "Google Assistant",
  btn_guide: "Programm (EPG)",
  btn_lastch: "Letzter Sender",
  btn_tv: "Live TV",
  btn_source: "Quelle (HDMI)",
  btn_up: "Navigation hoch",
  btn_down: "Navigation runter",
  btn_left: "Navigation links",
  btn_right: "Navigation rechts",
  btn_ok: "Bestätigen",
  btn_back: "Zurück",
  btn_menu: "Menü",
  btn_home: "Startseite",
  btn_mute: "Stumm",
  btn_ch_up: "Sender vor",
  btn_ch_down: "Sender zurück",
  btn_vol_up: "Lauter",
  btn_vol_down: "Leiser",
  btn_rewind: "Zurückspulen",
  btn_playpause: "Play/Pause",
  btn_ff: "Vorspulen",
  btn_restart: "Von Beginn starten",
  btn_rec: "Aufnehmen",
  btn_next: "Vor / nächster Inhalt",
  btn_waiputhek: "waiputhek",
  btn_netflix: "Netflix",
  e_title: "Titel",
  e_mode: "Anzeige",
  e_language: "Sprache",
  e_popup: "Popup",
  e_dropdown: "Ausklappen (Dropdown)",
  e_inline: "Inline (immer sichtbar)",
  e_auto: "Automatisch (HA)",
  e_de: "Deutsch",
  e_en: "Englisch",
  e_media: "TV Media-Player",
  e_tv_light: "TV-Licht Szene",
  e_sync_power: "Sync Box Power (switch)",
  e_sync_button: "Sync Box Sync (button)",
  e_sync_state: "Sync Box Sync-Status (switch)",
  e_hdmi_select: "HDMI-Quelle (select)",
  e_waipu_remote: "waipu.tv Remote-Entität (Android TV Remote)",
  e_waipu_hdmi_option: "HDMI-Option für waipu.tv (Quelle-Taste)",
  e_netflix_link: "Netflix App-Link (remote.turn_on activity)",
  e_waiputhek_link: "waiputhek App-Link (remote.turn_on activity)",
  e_remotes: "Fernbedienungen (0–4)",
  e_hdmi_list: "HDMI-Quellen (0–4)",
  e_ton: "Ton-Schalter (0–4)",
  e_label: "Beschriftung",
  e_icon: "Icon",
  e_path: "Navigationspfad",
  e_option: "Select-Option",
  e_entity: "Entität",
  e_add: "Hinzufügen"
} };
const EN = { "tv-remote-card": {
  title: "TV",
  remote: "Remotes",
  hdmi: "HDMI source",
  light_sync: "Light & Sync",
  tv_light: "TV light",
  sync_box: "Sync Box",
  sync: "Sync",
  sync_now: "Sync now",
  sound: "Sound",
  settings: "Controls",
  expand: "Expand / collapse",
  power: "TV on/off",
  close: "Close",
  not_configured: "Please select entities in the card settings.",
  waipu_remote_title: "waipu.tv remote",
  btn_power: "Power",
  btn_mic: "Google Assistant",
  btn_guide: "Guide (EPG)",
  btn_lastch: "Last channel",
  btn_tv: "Live TV",
  btn_source: "Source (HDMI)",
  btn_up: "Navigate up",
  btn_down: "Navigate down",
  btn_left: "Navigate left",
  btn_right: "Navigate right",
  btn_ok: "Confirm",
  btn_back: "Back",
  btn_menu: "Menu",
  btn_home: "Home",
  btn_mute: "Mute",
  btn_ch_up: "Channel up",
  btn_ch_down: "Channel down",
  btn_vol_up: "Volume up",
  btn_vol_down: "Volume down",
  btn_rewind: "Rewind",
  btn_playpause: "Play/Pause",
  btn_ff: "Fast forward",
  btn_restart: "Restart from beginning",
  btn_rec: "Record",
  btn_next: "Next / skip to live",
  btn_waiputhek: "waiputhek",
  btn_netflix: "Netflix",
  e_title: "Title",
  e_mode: "Display",
  e_language: "Language",
  e_popup: "Popup",
  e_dropdown: "Dropdown",
  e_inline: "Inline (always shown)",
  e_auto: "Automatic (HA)",
  e_de: "German",
  e_en: "English",
  e_media: "TV media player",
  e_tv_light: "TV light scene",
  e_sync_power: "Sync Box power (switch)",
  e_sync_button: "Sync Box sync (button)",
  e_sync_state: "Sync Box sync state (switch)",
  e_hdmi_select: "HDMI source (select)",
  e_waipu_remote: "waipu.tv remote entity (Android TV Remote)",
  e_waipu_hdmi_option: "HDMI option for waipu.tv (Source button)",
  e_netflix_link: "Netflix app link (remote.turn_on activity)",
  e_waiputhek_link: "waiputhek app link (remote.turn_on activity)",
  e_remotes: "Remote buttons (0–4)",
  e_hdmi_list: "HDMI sources (0–4)",
  e_ton: "Sound toggles (0–4)",
  e_label: "Label",
  e_icon: "Icon",
  e_path: "Navigation path",
  e_option: "Select option",
  e_entity: "Entity",
  e_add: "Add"
} };
const I18N = { de: DE["tv-remote-card"], en: EN["tv-remote-card"] };

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

.rc{margin-top:14px;padding-top:10px;border-top:1px solid var(--divider-color)}
.rc-hd{font-size:12px;font-weight:700;color:var(--secondary-text-color);margin:0 0 8px;text-align:center;text-transform:uppercase;letter-spacing:.03em}
.rc-row{display:flex;gap:6px;justify-content:center;margin-bottom:6px;max-width:230px;margin-left:auto;margin-right:auto}
.rc-btn{flex:1 1 0;max-width:64px;aspect-ratio:1/1;border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color);color:var(--primary-text-color);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;font-weight:700;font-size:13px;padding:0}
.rc-btn ha-icon{--mdc-icon-size:18px;color:var(--secondary-text-color)}
.rc-btn:active{transform:translateY(1px)}
.rc-btn[disabled]{opacity:.35;cursor:default;pointer-events:none}
.rc-ghost{flex:1 1 0;max-width:64px}
.rc-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:216px;margin:0 auto 6px}
.rc-grid3 .rc-btn{max-width:none}
.rc-num{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:200px;margin:0 auto 6px}
.rc-num .rc-btn{max-width:none}
.rc-pillrow{display:flex;gap:6px;max-width:230px;margin:2px auto 0}
.rc-pill{flex:1 1 auto;border:1px solid var(--divider-color);border-radius:999px;min-height:36px;background:var(--card-background-color);color:var(--primary-text-color);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;font-weight:700;font-size:12px;padding:0 10px}
.rc-pill:active{transform:translateY(1px)}
.rc-pill[disabled]{opacity:.35;cursor:default;pointer-events:none}

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

// Structural-only defaults — mode/language plus empty lists. No entity IDs, labels,
// icons or paths are ever pre-filled; every such field is set through the editor.
const BASE = { mode: "popup", language: "auto", remotes: [], hdmi: [], ton: [] };

const clampList = (v) => (Array.isArray(v) ? v.slice(0, 4) : []);

class TvRemoteCard extends HTMLElement {
  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement("tv-remote-card-editor"); }

  setConfig(c) {
    const prevSig = this._sig;
    this._cfg = Object.assign({}, BASE, c || {});
    this._cfg.remotes = clampList(c && c.remotes);
    this._cfg.hdmi = clampList(c && c.hdmi);
    this._cfg.ton = clampList(c && c.ton);
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
  getCardSize() { return 8; }
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

  _st(id) { const e = id && this._hass && this._hass.states[id]; return e ? e.state : undefined; }
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

  // ---- waipu.tv remote: fixed replica of the physical remote's button layout ----
  // Every button targets ONE configured `remote.*` entity (Android TV Remote
  // integration). Commands are fixed (not user-configurable) — only the target
  // entity and the two app-link / HDMI-option fields come from the editor.
  _remoteRows() {
    const L = this._L();
    const cmd = (c, icon, key, label) =>
      `<button class="rc-btn" data-act="wcmd|${c}" title="${label}"><ha-icon icon="${icon}"></ha-icon></button>`;
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => `<button class="rc-btn" data-act="wcmd|${n}">${n}</button>`).join("");
    return `
  <div class="rc">
   <div class="rc-hd">${L.waipu_remote_title}</div>
   <div class="rc-row">
    <button class="rc-btn" data-act="wpwr" title="${L.btn_power}"><ha-icon icon="mdi:power"></ha-icon></button>
    <span class="rc-ghost"></span>
    ${cmd("ASSIST", "mdi:microphone", "mic", L.btn_mic)}
   </div>
   <div class="rc-num">${digits}</div>
   <div class="rc-row">
    ${cmd("GUIDE", "mdi:view-list", "guide", L.btn_guide)}
    <button class="rc-btn" data-act="wcmd|0">0</button>
    ${cmd("229", "mdi:swap-vertical", "lastch", L.btn_lastch)}
   </div>
   <div class="rc-row">
    ${cmd("TV", "mdi:television-classic", "tv", L.btn_tv)}
    <span class="rc-ghost"></span>
    <button class="rc-btn" data-act="wsrc" title="${L.btn_source}"><ha-icon icon="mdi:hdmi-port"></ha-icon></button>
   </div>
   <div class="rc-grid3">
    <span></span>${cmd("DPAD_UP", "mdi:chevron-up", "up", L.btn_up)}<span></span>
    ${cmd("DPAD_LEFT", "mdi:chevron-left", "left", L.btn_left)}
    <button class="rc-btn" data-act="wcmd|DPAD_CENTER" title="${L.btn_ok}">OK</button>
    ${cmd("DPAD_RIGHT", "mdi:chevron-right", "right", L.btn_right)}
    ${cmd("BACK", "mdi:arrow-left", "back", L.btn_back)}
    ${cmd("DPAD_DOWN", "mdi:chevron-down", "down", L.btn_down)}
    ${cmd("MENU", "mdi:menu", "menu", L.btn_menu)}
   </div>
   <div class="rc-row">
    ${cmd("VOLUME_UP", "mdi:volume-plus", "volup", L.btn_vol_up)}
    ${cmd("HOME", "mdi:home", "home", L.btn_home)}
    ${cmd("CHANNEL_UP", "mdi:arrow-up-bold-box-outline", "chup", L.btn_ch_up)}
   </div>
   <div class="rc-row">
    ${cmd("VOLUME_DOWN", "mdi:volume-minus", "voldown", L.btn_vol_down)}
    ${cmd("VOLUME_MUTE", "mdi:volume-mute", "mute", L.btn_mute)}
    ${cmd("CHANNEL_DOWN", "mdi:arrow-down-bold-box-outline", "chdown", L.btn_ch_down)}
   </div>
   <div class="rc-row">
    ${cmd("MEDIA_REWIND", "mdi:rewind", "rew", L.btn_rewind)}
    ${cmd("MEDIA_PLAY_PAUSE", "mdi:play-pause", "playpause", L.btn_playpause)}
    ${cmd("MEDIA_FAST_FORWARD", "mdi:fast-forward", "ff", L.btn_ff)}
   </div>
   <div class="rc-row">
    ${cmd("MEDIA_PREVIOUS", "mdi:restart", "restart", L.btn_restart)}
    ${cmd("MEDIA_RECORD", "mdi:record-rec", "rec", L.btn_rec)}
    ${cmd("MEDIA_NEXT", "mdi:skip-next", "next", L.btn_next)}
   </div>
   <div class="rc-pillrow">
    <button class="rc-pill" data-act="wapp|waiputhek">${L.btn_waiputhek}</button>
    <button class="rc-pill" data-act="wapp|netflix">${L.btn_netflix}</button>
   </div>
  </div>`;
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
  <div class="row"><span class="lbl">${this._t("sound")}</span>${tonBtns}</div>
  ${this._remoteRows()}`;
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
    if (!el || el.hasAttribute("disabled")) return;
    const c = this._cfg;
    const [act, a] = el.dataset.act.split("|");
    if (act === "pwr") return this._svc("media_player", "toggle", { entity_id: c.media_player });
    if (act === "nav") return this._nav((c.remotes[Number(el.dataset.i)] || {}).path || "/");
    if (act === "hdmi") return this._svc("select", "select_option", { entity_id: c.hdmi_select, option: el.dataset.o });
    if (act === "light") return this._svc("scene", "turn_on", { entity_id: c.tv_light_scene });
    if (act === "syncPwr") return c.sync_power && this._svc(c.sync_power.split(".")[0], "toggle", { entity_id: c.sync_power });
    if (act === "syncGo") return c.sync_button && this._svc(c.sync_button.split(".")[0], c.sync_button.startsWith("input_button") ? "press" : "toggle", { entity_id: c.sync_button });
    if (act === "ton") {
      const e = (c.ton[Number(el.dataset.i)] || {}).entity;
      if (e) this._svc(e.split(".")[0], "toggle", { entity_id: e });
      return;
    }
    // waipu.tv remote — see the mapping table in the header comment.
    if (act === "wpwr") return this._svc("remote", "toggle", { entity_id: c.waipu_remote });
    if (act === "wcmd") return this._svc("remote", "send_command", { entity_id: c.waipu_remote, command: a });
    if (act === "wsrc") return this._svc("select", "select_option", { entity_id: c.hdmi_select, option: c.waipu_hdmi_option });
    if (act === "wapp") {
      const link = a === "netflix" ? c.netflix_link : c.waiputhek_link;
      if (link) this._svc("remote", "turn_on", { entity_id: c.waipu_remote, activity: link });
    }
  }

  _L() { return I18N[this._lang()] || I18N.de; }

  _render() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    if (!c.media_player) {
      this.$("body").innerHTML = `<div class="warn">${this._t("not_configured")}</div>`;
      if (!this._popup) this.$("body").hidden = false;
      this._renderWaipu();
      return;
    }
    if (!this._hass.states[c.media_player]) {
      this.$("body").innerHTML = `<div class="warn"><b>${c.media_player}</b> — ?</div>`;
      if (!this._popup) this.$("body").hidden = false;
      this._renderWaipu();
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
    this._renderWaipu();
  }

  // Disable each waipu-remote control until the entity/links it needs are configured —
  // a native `disabled` button can't be tapped, so this is the whole guard.
  _renderWaipu() {
    if (!this.shadowRoot) return;
    const c = this._cfg;
    const hasRemote = !!c.waipu_remote;
    this.shadowRoot.querySelectorAll('[data-act="wpwr"],[data-act^="wcmd|"]').forEach((b) => { b.disabled = !hasRemote; });
    const srcBtn = this.shadowRoot.querySelector('[data-act="wsrc"]');
    if (srcBtn) srcBtn.disabled = !(c.hdmi_select && c.waipu_hdmi_option);
    const netflixBtn = this.shadowRoot.querySelector('[data-act="wapp|netflix"]');
    if (netflixBtn) netflixBtn.disabled = !(hasRemote && c.netflix_link);
    const waiputhekBtn = this.shadowRoot.querySelector('[data-act="wapp|waiputhek"]');
    if (waiputhekBtn) waiputhekBtn.disabled = !(hasRemote && c.waiputhek_link);
  }
}

/* ---- visual editor ---- */
class TvRemoteCardEditor extends HTMLElement {
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
      del.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
      del.addEventListener("click", () => {
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
        ], () => ({ label: "", icon: "mdi:remote", path: "" })));
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
      hdmi_select: L.e_hdmi_select, waipu_remote: L.e_waipu_remote,
      waipu_hdmi_option: L.e_waipu_hdmi_option, netflix_link: L.e_netflix_link,
      waiputhek_link: L.e_waiputhek_link,
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
      { name: "waipu_remote", selector: { entity: { domain: "remote" } } },
      { name: "waipu_hdmi_option", selector: { text: {} } },
      { name: "netflix_link", selector: { text: {} } },
      { name: "waiputhek_link", selector: { text: {} } },
    ];
    this._base.data = this._config;
  }
}
customElements.define("tv-remote-card-editor", TvRemoteCardEditor);

customElements.define("tv-remote-card", TvRemoteCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "tv-remote-card",
  name: "TV Remote",
  description: "Fully configurable TV control card with a built-in waipu.tv Box remote (Android TV Remote integration). No pre-filled entities — everything set via the editor. Popup/dropdown/inline, DE/EN.",
  preview: false,
});
