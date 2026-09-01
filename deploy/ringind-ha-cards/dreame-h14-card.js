/* Dreame H14 Pro wet/dry vacuum card
 * A hand-pushed floor washer that self-cleans/dries in its dock. This card is
 * status + tank/consumable alerts + dock actions + settings (no map / no autonomous run).
 * Entities are derived from a prefix (default h14_pro). Style matches the AEG card.
 * User-facing strings are German; code comments are English.
 *
 * config:
 *   type: custom:dreame-h14-card
 *   prefix: h14_pro
 *   title: "Dreame H14 Pro"
 *   mode: popup            # "popup" (default) | "dropdown" | "inline"
 *   image: /local/h14.png   # optional photo, replaces the SVG illustration
 */

const STYLE = `
:host{--acc:var(--primary-color);display:block}
ha-card{padding:14px 14px 10px;overflow:hidden}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ttl{display:flex;align-items:baseline;gap:8px;min-width:0}
.brand{font-weight:800;letter-spacing:.13em;font-size:18px;color:var(--primary-text-color)}
.model{font-size:11px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.09em;white-space:nowrap}
.hstat{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--secondary-text-color);flex:0 0 auto}
.hstat ha-icon{--mdc-icon-size:16px}
.dot{width:8px;height:8px;border-radius:50%;background:var(--disabled-text-color)}
.dot.ok{background:#22c55e}
.batt{display:inline-flex;align-items:center;gap:3px;font-weight:700}
.stage{display:flex;gap:16px;align-items:center;margin-top:8px}
.stage svg,.photo{width:38%;max-width:170px;height:auto;flex:0 0 auto;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18))}
.photo{border-radius:12px;object-fit:contain}
.status{flex:1;min-width:0}
.big{font-size:24px;font-weight:800;line-height:1.05;color:var(--primary-text-color)}
.sub{margin-top:3px;font-size:12.5px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:.05em;min-height:15px}
.meta{margin-top:8px;font-size:12px;color:var(--secondary-text-color)}
.bar{margin-top:9px;height:6px;border-radius:6px;background:var(--divider-color);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--acc);border-radius:6px;transition:width .8s ease}
.sec{font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--secondary-text-color);margin:14px 0 6px;display:flex;align-items:center;gap:6px}
.sec ha-icon{--mdc-icon-size:15px}
.alerts{display:flex;flex-wrap:wrap;gap:6px}
.al{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--divider-color);border-radius:999px;padding:6px 10px;font-size:12px;color:var(--secondary-text-color);cursor:pointer}
.al ha-icon{--mdc-icon-size:15px;color:#22c55e}
.al.warn{border-color:#f59e0b;color:var(--primary-text-color)}
.al.warn ha-icon{color:#f59e0b}
.al.bad{border-color:var(--error-color,#e53935);color:var(--primary-text-color)}
.al.bad ha-icon{color:var(--error-color,#e53935)}
.cmds{display:flex;gap:8px;margin-top:6px}
.cmd{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:13px;padding:12px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;background:var(--divider-color);color:var(--primary-text-color)}
.cmd ha-icon{--mdc-icon-size:19px}
.cmd.primary{background:var(--acc);color:#fff}
.segrow{display:flex;align-items:center;gap:8px;margin:6px 0;flex-wrap:wrap}
.seglbl{font-size:11px;font-weight:700;color:var(--secondary-text-color);flex:0 0 96px}
.pills{display:flex;flex-wrap:wrap;gap:5px;flex:1 1 auto}
.pill{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:5px 10px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;line-height:1}
.pill.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 18%,transparent)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:6px 10px;font-size:12.5px;font-family:inherit;cursor:pointer;line-height:1}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.chip ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.chip.on ha-icon{color:var(--acc)}
.stat{display:flex;align-items:center;gap:8px;padding:8px 2px;font-size:12.5px;color:var(--primary-text-color);border-bottom:1px solid var(--divider-color);cursor:pointer}
.stat ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.stat b{margin-left:auto;font-weight:700;color:var(--secondary-text-color)}
.foot{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:11px;color:var(--secondary-text-color);border-top:1px solid var(--divider-color);padding-top:8px;margin-top:12px}
.warn{padding:18px;color:var(--secondary-text-color);font-size:13px;text-align:center}
#roller{transform-box:fill-box;transform-origin:center}
.stage.run #roller{animation:h14spin 1.1s linear infinite}
@keyframes h14spin{to{transform:rotate(360deg)}}
#drips,#dry,#bolt{opacity:0;transition:opacity .5s}
.stage.run #drips{opacity:.8;animation:h14drip 1.6s ease-in-out infinite}
@keyframes h14drip{0%,100%{opacity:.15}50%{opacity:.85}}
.stage.dry #dry{opacity:.8;animation:h14rise 2.6s ease-in-out infinite}
@keyframes h14rise{0%{opacity:.1}50%{opacity:.8}100%{opacity:.1}}
.stage.charge #bolt{opacity:1;animation:h14pulse 2s ease-in-out infinite}
@keyframes h14pulse{0%,100%{opacity:.5}50%{opacity:1}}
#water{transition:y .8s ease,height .8s ease}

/* ---- collapsible layout (shared across the 4 Reinigung cards) ---- */
.brand{font-size:18px}
.hdr{min-height:30px}
.stage{align-items:center;min-height:150px}
.stage>svg,.stage .photo,.stage .map{max-height:140px}
.mainrow{margin-top:10px}
.mainrow .cmd{padding-top:9px;padding-bottom:9px}
.disc{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:10px;padding:9px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);color:var(--secondary-text-color);font-family:inherit;font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
.disc ha-icon{--mdc-icon-size:18px;transition:transform .25s}
.disc.open ha-icon{transform:rotate(180deg)}
.more[hidden]{display:none}
.more{margin-top:8px}
@media(min-width:481px){
  :host(.collapsed) ha-card{height:330px;overflow:hidden}
  :host(.collapsed) .stage{flex-direction:row;padding-top:6px;padding-bottom:6px}
}
@media(max-width:480px){.stage{flex-direction:column;text-align:center}.stage svg,.photo{width:52%}}

dialog.pop{border:none;margin:auto;padding:0;width:min(520px, calc(100vw - 32px));max-width:min(520px, calc(100vw - 32px));max-height:calc(100% - 72px);border-radius:var(--ha-dialog-border-radius,28px);color:var(--primary-text-color);background:var(--ha-dialog-surface-background,var(--mdc-theme-surface,var(--card-background-color,#fff)));box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);font-family:var(--mdc-typography-body1-font-family,inherit);font-size:1rem;overflow:hidden;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
dialog.pop[open]{display:flex;flex-direction:column}
dialog.pop::backdrop{background:transparent}
.pop-hd{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:20px 22px 6px;font-size:1.35rem;font-weight:600}
.pop-hd .pt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pop-x{flex:0 0 auto;border:none;background:none;cursor:pointer;color:var(--secondary-text-color);width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
.pop-x:hover{background:var(--secondary-background-color,rgba(127,127,127,.15))}
.pop-x ha-icon{--mdc-icon-size:24px}
.pop-bd.more{display:block;margin:0;flex:1 1 auto;min-height:0;overflow-y:auto;padding:0 22px 22px}
.pop-bd.more .sec:first-child{margin-top:6px}
@media(max-width:480px){dialog.pop{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0}.pop-hd{padding-top:max(20px, env(safe-area-inset-top))}}
`;

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
const DE = { "dreame-h14-card": {
  disc: "Tanks & Einstellungen",
  less: "Weniger",
  close: "Schließen",
  connected: "Verbunden",
  offline: "Offline",
  at_dock: "an der Ladestation",
  battery: (p, d) => "Akku " + p + " %" + (d ? " · letzte Reinigung " + d : ""),
  self_clean: "Selbstreinigung",
  drying: "Trocknung",
  tanks: "Tanks & Wartung",
  settings: "Einstellungen",
  wear: "Verschleiß",
  all_ready: "Alles bereit",
  err: (c) => "Fehler " + c,
  warncode: (c) => "Warnung " + c,
  a_fresh: "Frischwasser leer",
  a_dirty: "Schmutzwasser voll",
  a_clean_tank: "Tank reinigen",
  a_missing: "Tank fehlt",
  a_detergent: "Waschmittel leer",
  a_selfclean: "Selbstreinigung nötig",
  suction: "Saugkraft",
  waterflow: "Wasserzufuhr",
  brush: "Bürste",
  traction: "Traktion",
  s_eco: "Eco",
  s_std: "Standard",
  s_strong: "Stark",
  s_turbo: "Turbo",
  w_low: "Niedrig",
  w_mid: "Mittel",
  w_high: "Hoch",
  w_max: "Max",
  b_soft: "Sanft",
  b_normal: "Normal",
  b_firm: "Kräftig",
  b_max: "Max",
  tr_light: "Leicht",
  tr_bal: "Ausgewogen",
  tr_strong: "Stark",
  auto_dry: "Auto-Trocknung",
  auto_rinse: "Auto-Spülen",
  auto_det: "Auto-Waschmittel",
  light: "Licht",
  w_filter: "Filter",
  w_front: "Rollbürste vorne",
  w_back: "Rollbürste hinten",
  f_cleanings: (n) => "Reinigungen " + n,
  f_last: (t) => "Zuletzt " + t,
  f_selfclean: (t) => "Selbstreinigung " + t,
  f_drying: (t) => "Trocknung " + t,
  not_found: (p) => "Keine " + p + "*-Entitäten gefunden.",
  unit_min: "Min",
  unit_h: "Std",
  today: "heute",
  yesterday: "gestern",
  e_prefix: "Entity-Präfix (Standard: h14_pro)",
  e_title: "Titel",
  e_image: "Bild-URL (optional)",
  e_mode: "Anzeige",
  e_language: "Sprache",
  e_popup: "Popup",
  e_dropdown: "Ausklappen (Dropdown)",
  e_inline: "Inline (immer sichtbar)",
  e_auto: "Automatisch (HA)",
  e_de: "Deutsch",
  e_en: "Englisch"
} };
const EN = { "dreame-h14-card": {
  disc: "Tanks & settings",
  less: "Less",
  close: "Close",
  connected: "Connected",
  offline: "Offline",
  at_dock: "at the dock",
  battery: (p, d) => "Battery " + p + " %" + (d ? " · last clean " + d : ""),
  self_clean: "Self-cleaning",
  drying: "Drying",
  tanks: "Tanks & maintenance",
  settings: "Settings",
  wear: "Wear",
  all_ready: "All ready",
  err: (c) => "Error " + c,
  warncode: (c) => "Warning " + c,
  a_fresh: "Fresh water empty",
  a_dirty: "Waste tank full",
  a_clean_tank: "Clean tank",
  a_missing: "Tank missing",
  a_detergent: "Detergent empty",
  a_selfclean: "Self-clean needed",
  suction: "Suction",
  waterflow: "Water flow",
  brush: "Brush",
  traction: "Traction",
  s_eco: "Eco",
  s_std: "Standard",
  s_strong: "Strong",
  s_turbo: "Turbo",
  w_low: "Low",
  w_mid: "Mid",
  w_high: "High",
  w_max: "Max",
  b_soft: "Soft",
  b_normal: "Normal",
  b_firm: "Firm",
  b_max: "Max",
  tr_light: "Light",
  tr_bal: "Balanced",
  tr_strong: "Strong",
  auto_dry: "Auto-dry",
  auto_rinse: "Auto-rinse",
  auto_det: "Auto-detergent",
  light: "Light",
  w_filter: "Filter",
  w_front: "Front roller",
  w_back: "Back roller",
  f_cleanings: (n) => "Cleanings " + n,
  f_last: (t) => "Last " + t,
  f_selfclean: (t) => "Self-clean " + t,
  f_drying: (t) => "Drying " + t,
  not_found: (p) => "No " + p + "* entities found.",
  unit_min: "min",
  unit_h: "h",
  today: "today",
  yesterday: "yesterday",
  e_prefix: "Entity prefix (default: h14_pro)",
  e_title: "Title",
  e_image: "Image URL (optional)",
  e_mode: "Display",
  e_language: "Language",
  e_popup: "Popup",
  e_dropdown: "Dropdown",
  e_inline: "Inline (always shown)",
  e_auto: "Automatic (HA)",
  e_de: "German",
  e_en: "English"
} };
const I18N = { de: DE["dreame-h14-card"], en: EN["dreame-h14-card"] };

const MACHINE_SVG = `
<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dreame H14 Pro Wischsauger">
 <defs>
  <linearGradient id="h14b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f3f5"/><stop offset="1" stop-color="#c9ccd2"/></linearGradient>
  <clipPath id="h14tank"><rect x="80" y="104" width="40" height="70" rx="8"/></clipPath>
 </defs>
 <path d="M150 12 q14 2 14 16 q0 10 -12 16 l-30 40" fill="none" stroke="#b9bdc4" stroke-width="12" stroke-linecap="round"/>
 <rect x="140" y="6" width="26" height="16" rx="8" fill="#33373d"/>
 <rect x="72" y="92" width="56" height="96" rx="14" fill="url(#h14b)" stroke="#a9adb4" stroke-width="2"/>
 <rect x="80" y="104" width="40" height="70" rx="8" fill="#0d1013"/>
 <g clip-path="url(#h14tank)">
  <rect id="water" x="80" y="150" width="40" height="24" fill="#2f7ff0" fill-opacity="0.55"/>
 </g>
 <rect x="80" y="104" width="40" height="70" rx="8" fill="none" stroke="#3a3e44" stroke-width="2"/>
 <path d="M92 186 l-14 22 h44 l-14 -22Z" fill="url(#h14b)" stroke="#a9adb4" stroke-width="2"/>
 <rect x="46" y="204" width="108" height="30" rx="9" fill="url(#h14b)" stroke="#a9adb4" stroke-width="2"/>
 <ellipse id="roller" cx="100" cy="234" rx="50" ry="8" fill="#6b7078"/>
 <g id="dry" fill="none" stroke="#ffb020" stroke-width="3" stroke-linecap="round" stroke-opacity="0.85">
  <path d="M60 216 q-8 -8 0 -16"/><path d="M100 220 q-8 -8 0 -16"/><path d="M140 216 q-8 -8 0 -16"/>
 </g>
 <g id="drips" fill="#2f7ff0">
  <ellipse cx="66" cy="242" rx="3" ry="4"/><ellipse cx="100" cy="246" rx="3" ry="4"/><ellipse cx="134" cy="242" rx="3" ry="4"/>
 </g>
 <path id="bolt" d="M118 120 l-12 20 h8 l-6 16 l16 -22 h-9 Z" fill="#22c55e"/>
</svg>`;

const STATUS_WORDS = {
  de: { fehler: "Fehler", laedt: "Lädt", selbst: "Selbstreinigung", trocknung: "Trocknung", pause: "Pausiert", reinigt: "Reinigt", bereit: "Bereit" },
  en: { fehler: "Error", laedt: "Charging", selbst: "Self-cleaning", trocknung: "Drying", pause: "Paused", reinigt: "Cleaning", bereit: "Ready" },
};
function statusL(fr, lang) {
  const W = STATUS_WORDS[lang] || STATUS_WORDS.de;
  const s = (fr || "").toLowerCase();
  if (!s || s === "unknown" || s === "unavailable") return "–";
  if (/erreur|error|fault/.test(s)) return W.fehler;
  if (/charge|charg/.test(s)) return W.laedt;
  if (/auto.?net|automatique|self.?clean/.test(s)) return W.selbst;
  if (/s[ée]cha|drying|dry/.test(s)) return W.trocknung;
  if (/pause/.test(s)) return W.pause;
  if (/nettoy|clean|aspir/.test(s)) return W.reinigt;
  if (/veille|repos|standby|idle|pr[êe]t/.test(s)) return W.bereit;
  return fr;
}
// canonical status keys, independent of language, for the run/dry/charge logic
function statusKind(fr) {
  const s = (fr || "").toLowerCase();
  if (/auto.?net|automatique|self.?clean/.test(s)) return "selfclean";
  if (/s[ée]cha|drying|dry/.test(s)) return "drying";
  if (/pause/.test(s)) return "paused";
  if (/nettoy|clean|aspir/.test(s)) return "cleaning";
  return "other";
}
function battIcon(pct, charging) {
  if (charging) return "mdi:battery-charging";
  if (pct == null) return "mdi:battery-unknown";
  if (pct >= 95) return "mdi:battery";
  if (pct <= 5) return "mdi:battery-alert-variant-outline";
  return "mdi:battery-" + Math.round(pct / 10) * 10;
}

class DreameH14Card extends HTMLElement {
  static getStubConfig() { return { prefix: "h14_pro" }; }
  static getConfigElement() { return document.createElement("dreame-h14-card-editor"); }
  setConfig(c) {
    const prevSig = this._psig;
    this._cfg = Object.assign({ prefix: "h14_pro", mode: "popup", language: "auto" }, c || {});
    this._p = this._cfg.prefix;
    this._open = false;
    this._popup = this._cfg.mode === "popup";
    this._inline = this._cfg.mode === "inline";
    this._psig = this._cfg.mode + "|" + this._cfg.language;
    if (this.shadowRoot && prevSig !== undefined && prevSig !== this._psig) {
      this.shadowRoot.innerHTML = ""; this._sig = null;
      this._build(); if (this._hass) this._render();
    }
  }
  getCardSize() { return 15; }

  _lang() {
    const c = this._cfg.language || "auto";
    if (c === "de" || c === "en") return c;
    return (this._hass && this._hass.language || "").toLowerCase().startsWith("de") ? "de" : "en";
  }
  _L() { return I18N[this._lang()] || I18N.de; }
  _fmtDur(sec) {
    const L = this._L();
    const m = Math.round((Number(sec) || 0) / 60);
    if (m <= 0) return "0 " + L.unit_min;
    if (m < 60) return m + " " + L.unit_min;
    return Math.floor(m / 60) + " " + L.unit_h + " " + String(m % 60).padStart(2, "0") + " " + L.unit_min;
  }
  _tstamp(iso) {
    const L = this._L();
    if (!iso || iso === "unknown" || iso === "unavailable") return "–";
    const d = new Date(iso); if (isNaN(d)) return String(iso);
    const t = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    const md = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const dd = Math.round((md(new Date()) - md(d)) / 86400000);
    if (dd <= 0) return L.today + " " + t;
    if (dd === 1) return L.yesterday + " " + t;
    return d.toLocaleDateString(this._lang() === "de" ? "de-DE" : "en-GB", { day: "2-digit", month: "2-digit" }) + " " + t;
  }

  _toggle() {
    if (this._inline) return;
    if (this._popup) { this.$("pop").showModal(); return; }
    this._open = !this._open;
    this.$("more").hidden = !this._open;
    this.$("disc").classList.toggle("open", this._open);
    this.classList.toggle("collapsed", !this._open);
    this.$("discTxt").textContent = this._open ? this._L().less : this._L().disc;
  }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  _id(d, s) { return d + "." + this._p + "_" + s; }
  _e(d, s) { return this._hass && this._hass.states[this._id(d, s)]; }
  _st(d, s) { const e = this._e(d, s); return e ? e.state : undefined; }
  _num(d, s) { const v = parseFloat(this._st(d, s)); return isNaN(v) ? null : v; }
  _bool(d, s) { return this._st(d, s) === "on"; }
  _attr(d, s, a) { const e = this._e(d, s); return e && e.attributes ? e.attributes[a] : undefined; }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _svc(dom, srv, data) { this._hass.callService(dom, srv, data); }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const L = this._L();
    const ttl = this._cfg.title || "H14 Pro";
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hdr">
  <div class="ttl"><span class="brand">DREAME</span><span class="model" id="model">${ttl}</span></div>
  <div class="hstat">
   <span class="dot" id="dot"></span><span id="online"></span>
   <span class="batt"><ha-icon id="batticon" icon="mdi:battery"></ha-icon><span id="batt">–</span></span>
  </div>
 </div>
 <div class="stage" id="stage">
  ${this._cfg.image ? `<img class="photo" src="${this._cfg.image}" alt="Dreame H14 Pro">` : MACHINE_SVG}
  <div class="status">
   <div class="big" id="big">–</div>
   <div class="sub" id="sub"></div>
   <div class="meta" id="meta"></div>
   <div class="bar"><i id="fill"></i></div>
  </div>
 </div>
 <div class="cmds mainrow" id="cmds"></div>
 ${this._inline ? "" : `<button class="disc" id="disc" type="button"><span id="discTxt">${L.disc}</span><ha-icon icon="${this._popup ? "mdi:tune-variant" : "mdi:chevron-down"}"></ha-icon></button>`}
 ${this._popup ? "" : `<div class="more" id="more"${this._inline ? "" : " hidden"}><div id="body"></div></div>`}
</ha-card>
${this._popup ? `<dialog class="pop" id="pop">
 <div class="pop-hd"><span class="pt" id="popT">${ttl}</span><button class="pop-x" id="popX" title="${L.close}"><ha-icon icon="mdi:close"></ha-icon></button></div>
 <div class="pop-bd more" id="more"><div id="body"></div></div>
</dialog>` : ""}`;
    this.$ = (id) => r.getElementById(id);
    if (!this._inline) this.classList.add("collapsed");
    this.$("stage").addEventListener("click", () => this._mi(this._id("sensor", "status")));
    if (!this._inline) this.$("disc").addEventListener("click", () => this._toggle());
    if (this._popup) {
      this.$("popX").onclick = () => this.$("pop").close();
      this.$("pop").addEventListener("click", (e) => { if (e.target === this.$("pop")) this.$("pop").close(); });
    }
    const act = (e) => {
      const el = e.target.closest("[data-act]"); if (!el || el.hasAttribute("disabled")) return;
      const [k, a, b] = el.dataset.act.split("|");
      if (k === "press") this._svc("button", "press", { entity_id: a });
      else if (k === "num") this._svc("number", "set_value", { entity_id: a, value: Number(b) });
      else if (k === "sel") this._svc("select", "select_option", { entity_id: a, option: b });
      else if (k === "toggle") this._svc(a.split(".")[0], "toggle", { entity_id: a });
      else if (k === "more") this._mi(a);
    };
    this.$("body").addEventListener("click", act);
    this.$("cmds").addEventListener("click", act);
  }

  _render() {
    if (!this.shadowRoot) return;
    if (!this._e("sensor", "status") && !this._e("sensor", "battery")) {
      this.$("body").innerHTML = `<div class="warn">${this._L().not_found("<b>" + this._p + "</b>")}</div>`;
      if (!this._popup) { this.$("more").hidden = false; this.classList.remove("collapsed"); }
      return;
    }
    // render-signature guard: only rebuild the interactive body when a shown value changed
    const READ = [
      ["sensor", "status"], ["sensor", "battery"], ["binary_sensor", "charging"], ["binary_sensor", "online"],
      ["sensor", "water_level"], ["sensor", "error_codes"], ["sensor", "warnings"],
      ["binary_sensor", "clean_water_tank_empty"], ["binary_sensor", "dirty_water_tank_full"],
      ["binary_sensor", "dirty_water_tank_needs_cleaning"], ["binary_sensor", "dirty_water_tank_missing"],
      ["binary_sensor", "detergent_empty"], ["binary_sensor", "self_cleaning_recommended_dirty_brush_tube"],
      ["number", "suction_power_custom"], ["number", "water_flow_custom"], ["number", "brush_speed_custom"],
      ["select", "traction_force"], ["switch", "auto_drying"], ["switch", "auto_rinse"],
      ["switch", "auto_detergent_mixing"], ["switch", "light"],
      ["sensor", "filter_hours_left"], ["sensor", "front_roller_brush_hours_left"], ["sensor", "back_roller_brush_hours_left"],
      ["sensor", "total_clean_count"], ["sensor", "last_clean"], ["sensor", "last_clean_duration"],
      ["sensor", "total_self_clean_time"], ["sensor", "total_self_dry_time"],
    ];
    const sig = READ.map(([d, s]) => this._st(d, s)).join("|");
    if (sig === this._sig) return;
    this._sig = sig;

    const L = this._L();
    this.$("model").textContent = this._cfg.title || "H14 Pro";
    if (this.$("popT")) this.$("popT").textContent = this._cfg.title || "H14 Pro";
    const rawStatus = this._st("sensor", "status") || "";
    const label = statusL(rawStatus, this._lang());
    const kind = statusKind(rawStatus);
    const charging = this._bool("binary_sensor", "charging");
    const online = this._bool("binary_sensor", "online");
    const cleaning = kind === "cleaning" || kind === "paused";
    const drying = kind === "drying" || kind === "selfclean";
    const errCode = this._st("sensor", "error_codes");
    const warnCode = this._st("sensor", "warnings");
    const hasErr = errCode && !["0", "none", "unknown", "unavailable", ""].includes(String(errCode).toLowerCase());

    const acc = hasErr ? "#ef4444" : cleaning ? "#22c55e" : drying ? "#ffb020" : charging ? "#4f7cff" : "var(--disabled-text-color)";
    this.style.setProperty("--acc", acc);
    this.$("stage").className = "stage" + (cleaning ? " run" : "") + (drying ? " dry" : "") + (charging ? " charge" : "");

    // header
    this.$("dot").className = "dot" + (online ? " ok" : "");
    this.$("online").textContent = online ? L.connected : L.offline;
    const pct = this._num("sensor", "battery");
    this.$("batt").textContent = pct == null ? "–" : Math.round(pct) + " %";
    this.$("batticon").setAttribute("icon", battIcon(pct, charging));

    // status block
    this.$("big").textContent = label;
    this.$("sub").textContent = charging && !cleaning && !drying ? L.at_dock : "";
    const lastDur = this._num("sensor", "last_clean_duration");
    this.$("meta").textContent = pct != null ? L.battery(Math.round(pct), lastDur ? this._fmtDur(lastDur) : "") : "";
    this.$("fill").style.width = (pct != null ? Math.max(0, Math.min(100, pct)) : 0) + "%";

    // water level in the SVG tank (y grows downward; 0% => empty at bottom)
    const wl = this._num("sensor", "water_level");
    const wtr = this.$("water");
    if (wtr && wl != null) {
      const h = Math.max(0, Math.min(70, (wl / 100) * 70));
      wtr.setAttribute("y", (104 + (70 - h)).toFixed(1));
      wtr.setAttribute("height", h.toFixed(1));
    }

    // ---- alerts ----
    const A = (label2, d, s) => ({ label: label2, on: this._bool(d, s), id: this._id(d, s) });
    const alerts = [
      A(L.a_fresh, "binary_sensor", "clean_water_tank_empty"),
      A(L.a_dirty, "binary_sensor", "dirty_water_tank_full"),
      A(L.a_clean_tank, "binary_sensor", "dirty_water_tank_needs_cleaning"),
      A(L.a_missing, "binary_sensor", "dirty_water_tank_missing"),
      A(L.a_detergent, "binary_sensor", "detergent_empty"),
      A(L.a_selfclean, "binary_sensor", "self_cleaning_recommended_dirty_brush_tube"),
    ];
    const active = alerts.filter((x) => x.on);
    if (hasErr) active.unshift({ label: L.err(errCode), on: true, id: this._id("sensor", "error_codes") });
    if (warnCode && !["0", "unknown", ""].includes(String(warnCode))) active.push({ label: L.warncode(warnCode), on: true, id: this._id("sensor", "warnings") });
    const alertHtml = active.length
      ? active.map((x) => `<span class="al bad" data-act="more|${x.id}"><ha-icon icon="mdi:alert-circle"></ha-icon>${x.label}</span>`).join("")
      : `<span class="al" data-act="more|${this._id("sensor", "status")}"><ha-icon icon="mdi:check-circle"></ha-icon>${L.all_ready}</span>`;

    // ---- settings ----
    const lvl = (label2, d, s, labels) => {
      const cur = this._num(d, s);
      const id = this._id(d, s);
      const pills = labels.map((l, i) =>
        `<button class="pill${cur === i ? " on" : ""}" data-act="num|${id}|${i}">${l}</button>`).join("");
      return `<div class="segrow"><span class="seglbl">${label2}</span><span class="pills">${pills}</span></div>`;
    };
    const trac = this._e("select", "traction_force");
    let tracRow = "";
    if (trac && Array.isArray(trac.attributes.options) && trac.attributes.options.length) {
      const cur = trac.state;
      const map = { "Léger": L.tr_light, "Équilibré": L.tr_bal, "Fort": L.tr_strong };
      const pills = trac.attributes.options.map((o) =>
        `<button class="pill${cur === o ? " on" : ""}" data-act="sel|${this._id("select", "traction_force")}|${o}">${map[o] || o}</button>`).join("");
      tracRow = `<div class="segrow"><span class="seglbl">${L.traction}</span><span class="pills">${pills}</span></div>`;
    }
    const tog = (label2, d, s, icon) => {
      const id = this._id(d, s);
      const on = this._st(d, s) === "on";
      return `<button class="chip${on ? " on" : ""}" data-act="toggle|${id}"><ha-icon icon="${icon}"></ha-icon>${label2}</button>`;
    };

    // ---- consumables ----
    const wear = (label2, d, s, icon) => {
      const v = this._num(d, s);
      return `<div class="stat" data-act="more|${this._id(d, s)}"><ha-icon icon="${icon}"></ha-icon>${label2}<b>${v == null ? "–" : Math.round(v) + " h"}</b></div>`;
    };

    // ---- footer ----
    const foot = [];
    const tc = this._num("sensor", "total_clean_count");
    if (tc != null) foot.push(L.f_cleanings(Math.round(tc)));
    const lc = this._st("sensor", "last_clean");
    if (lc) foot.push(L.f_last(this._tstamp(lc)));
    const tsc = this._num("sensor", "total_self_clean_time");
    if (tsc != null) foot.push(L.f_selfclean(this._fmtDur(tsc)));
    const tsd = this._num("sensor", "total_self_dry_time");
    if (tsd != null) foot.push(L.f_drying(this._fmtDur(tsd)));

    this.$("cmds").innerHTML =
      `<button class="cmd primary" data-act="press|${this._id("button", "start_self_cleaning")}"><ha-icon icon="mdi:auto-fix"></ha-icon>${L.self_clean}</button>` +
      `<button class="cmd" data-act="press|${this._id("button", "start_self_drying")}"><ha-icon icon="mdi:weather-sunny"></ha-icon>${L.drying}</button>`;
    this.$("body").innerHTML =
      `<div class="sec"><ha-icon icon="mdi:water-alert"></ha-icon>${L.tanks}</div>` +
      `<div class="alerts">${alertHtml}</div>` +

      `<div class="sec"><ha-icon icon="mdi:tune"></ha-icon>${L.settings}</div>` +
      lvl(L.suction, "number", "suction_power_custom", [L.s_eco, L.s_std, L.s_strong, L.s_turbo]) +
      lvl(L.waterflow, "number", "water_flow_custom", [L.w_low, L.w_mid, L.w_high, L.w_max]) +
      lvl(L.brush, "number", "brush_speed_custom", [L.b_soft, L.b_normal, L.b_firm, L.b_max]) +
      tracRow +
      `<div class="chips">
        ${tog(L.auto_dry, "switch", "auto_drying", "mdi:weather-sunny")}
        ${tog(L.auto_rinse, "switch", "auto_rinse", "mdi:water-sync")}
        ${tog(L.auto_det, "switch", "auto_detergent_mixing", "mdi:bottle-tonic")}
        ${tog(L.light, "switch", "light", "mdi:lightbulb")}
       </div>` +

      `<div class="sec"><ha-icon icon="mdi:wrench-clock"></ha-icon>${L.wear}</div>` +
      wear(L.w_filter, "sensor", "filter_hours_left", "mdi:air-filter") +
      wear(L.w_front, "sensor", "front_roller_brush_hours_left", "mdi:rotate-right") +
      wear(L.w_back, "sensor", "back_roller_brush_hours_left", "mdi:rotate-left") +

      (foot.length ? `<div class="foot">${foot.map((x) => `<span>${x}</span>`).join("")}</div>` : "");
  }
}

/* ---- visual editor ---- */
class DreameH14CardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _L() {
    const c = (this._config && this._config.language) || "auto";
    if (c === "de" || c === "en") return I18N[c];
    return (this._hass && this._hass.language || "").toLowerCase().startsWith("de") ? I18N.de : I18N.en;
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
      prefix: L.e_prefix, title: L.e_title, image: L.e_image, mode: L.e_mode, language: L.e_language,
    }[s.name] || s.name);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "title", selector: { text: {} } },
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "popup", label: L.e_popup }, { value: "dropdown", label: L.e_dropdown },
        { value: "inline", label: L.e_inline } ] } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en } ] } } },
      { name: "prefix", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("dreame-h14-card-editor", DreameH14CardEditor);

customElements.define("dreame-h14-card", DreameH14Card);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "dreame-h14-card",
  name: "Dreame H14 Pro",
  description: "Dreame H14 Pro Wischsauger – Status, Tanks/Wartung, Dock-Aktionen, Einstellungen",
  preview: false,
});
