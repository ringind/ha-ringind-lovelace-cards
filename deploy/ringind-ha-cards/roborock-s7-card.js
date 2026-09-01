/* Roborock S7 MaxV card
 * Bundles the "Roborock S7 MaxV" + "Wischeinstellungen" + "Reinigungsstatus" entities of the
 * Reinigung subview into one card, adds room (segment) cleaning via vacuum.clean_area, and
 * shows the live map image. Visual style matches custom:aeg-waschtrockner-card.
 * User-facing strings are German; code comments are English.
 *
 * config:
 *   type: custom:roborock-s7-card
 *   vacuum: vacuum.roborock_s7_maxv
 *   map_entity: image.roborock_s7_maxv_map_0_custom     # image shown as the map
 *   rooms_entity: image.roborock_s7_maxv_map_0_custom   # entity whose `rooms` attr lists segments
 *   title: "Roborock S7 MaxV"
 *   mode: popup                                        # "popup" (default) | "dropdown" | "inline"
 * All other entity ids have sensible defaults (see setConfig) and can be overridden in YAML.
 */

const STYLE = `
:host{--acc:var(--primary-color);display:block}
ha-card{padding:14px 14px 10px;overflow:hidden}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ttl{display:flex;align-items:baseline;gap:8px;min-width:0}
.brand{font-weight:800;letter-spacing:.14em;font-size:19px;color:var(--primary-text-color)}
.model{font-size:11px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.09em;white-space:nowrap}
.hstat{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--secondary-text-color);flex:0 0 auto}
.hstat ha-icon{--mdc-icon-size:16px}
.batt{display:inline-flex;align-items:center;gap:3px;font-weight:700}
.alert{background:var(--error-color,#e53935);color:#fff;border-radius:10px;padding:1px 7px;font-size:11px;font-weight:700;cursor:pointer}
.stage{display:flex;gap:14px;align-items:stretch;margin-top:8px}
.map{width:46%;max-width:230px;flex:0 0 auto;border-radius:12px;background:var(--divider-color);object-fit:contain;cursor:pointer;aspect-ratio:1/1}
.status{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}
.big{font-size:24px;font-weight:800;line-height:1.05;color:var(--primary-text-color)}
.sub{margin-top:3px;font-size:12.5px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:.05em;min-height:15px}
.meta{margin-top:8px;font-size:12px;color:var(--secondary-text-color)}
.bar{margin-top:9px;height:6px;border-radius:6px;background:var(--divider-color);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--acc);border-radius:6px;transition:width .8s ease}
.cmds{display:flex;gap:7px;margin-top:12px}
.cmd{flex:1 1 0;display:inline-flex;flex-direction:column;align-items:center;gap:3px;border:none;border-radius:12px;padding:9px 4px;font-size:10.5px;font-weight:700;font-family:inherit;cursor:pointer;background:var(--divider-color);color:var(--primary-text-color)}
.cmd ha-icon{--mdc-icon-size:21px}
.cmd.primary{background:var(--acc);color:#fff}
.sec{font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--secondary-text-color);margin:14px 0 6px;display:flex;align-items:center;gap:6px}
.sec ha-icon{--mdc-icon-size:15px}
.rooms{display:flex;flex-wrap:wrap;gap:6px}
.rm{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--divider-color);border-radius:999px;padding:6px 11px;font-size:12.5px;font-family:inherit;cursor:pointer;color:var(--primary-text-color);background:var(--card-background-color);line-height:1}
.rm.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 20%,transparent)}
.rm ha-icon{--mdc-icon-size:15px;color:var(--secondary-text-color)}
.rm.on ha-icon{color:var(--acc)}
.rm[disabled]{opacity:.4;pointer-events:none}
.gorow{display:flex;gap:8px;margin-top:8px}
.go{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:12px;padding:11px;font-size:13.5px;font-weight:800;font-family:inherit;cursor:pointer;background:var(--acc);color:#fff}
.go.ghost{background:var(--divider-color);color:var(--primary-text-color);flex:0 0 auto}
.go[disabled]{opacity:.4;pointer-events:none}
.segrow{display:flex;align-items:center;gap:8px;margin:6px 0;flex-wrap:wrap}
.seglbl{font-size:11px;font-weight:700;color:var(--secondary-text-color);flex:0 0 92px}
.pills{display:flex;flex-wrap:wrap;gap:5px;flex:1 1 auto}
.pill{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:5px 10px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;line-height:1}
.pill.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 18%,transparent)}
.extra{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:6px 10px;font-size:12.5px;font-family:inherit;cursor:pointer;line-height:1}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.chip ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.chip.on ha-icon{color:var(--acc)}
.pres{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--divider-color);border-radius:999px;padding:6px 10px;font-size:12px;color:var(--secondary-text-color)}
.pres b{width:8px;height:8px;border-radius:50%;background:var(--disabled-text-color)}
.pres b.on{background:#22c55e}
.stat{display:flex;align-items:center;gap:8px;padding:8px 2px;font-size:12.5px;color:var(--primary-text-color);border-bottom:1px solid var(--divider-color);cursor:pointer}
.stat ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.stat b{margin-left:auto;font-weight:700;color:var(--secondary-text-color)}
.stat.err b{color:var(--error-color,#e53935)}
.foot{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:11px;color:var(--secondary-text-color);border-top:1px solid var(--divider-color);padding-top:8px;margin-top:12px}
.warn{padding:18px;color:var(--secondary-text-color);font-size:13px;text-align:center}

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
@media(max-width:480px){.stage{flex-direction:column}.map{width:100%;max-width:none;aspect-ratio:16/10}}

dialog.pop{border:none;margin:auto;padding:0;width:min(540px, calc(100vw - 32px));max-width:min(540px, calc(100vw - 32px));max-height:calc(100% - 72px);border-radius:var(--ha-dialog-border-radius,28px);color:var(--primary-text-color);background:var(--ha-dialog-surface-background,var(--mdc-theme-surface,var(--card-background-color,#fff)));box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);font-family:var(--mdc-typography-body1-font-family,inherit);font-size:1rem;overflow:hidden;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
dialog.pop[open]{display:flex;flex-direction:column}
dialog.pop::backdrop{background:transparent}
.pop-hd{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:20px 22px 6px;font-size:1.35rem;font-weight:600}
.pop-hd .pt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pop-x{flex:0 0 auto;border:none;background:none;cursor:pointer;color:var(--secondary-text-color);width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
.pop-x:hover{background:var(--secondary-background-color,rgba(127,127,127,.15))}
.pop-x ha-icon{--mdc-icon-size:24px}
.pop-bd.more{display:block;margin:0;flex:1 1 auto;min-height:0;overflow-y:auto;padding:0 22px 22px}
.pop-bd.more .sec:first-child{margin-top:6px}
@media(max-width:480px){dialog.pop{width:100vw;max-width:100vw;height:100%;max-height:100%;margin:0;border-radius:0}}
`;

const STATUS = {
  de: {
    charging: "Lädt", charging_complete: "Vollgeladen", charging_problem: "Ladeproblem",
    idle: "Bereit", starting: "Startet", cleaning: "Reinigt", paused: "Pausiert",
    segment_cleaning: "Reinigt Bereich", segment_mopping: "Wischt Bereich",
    zoned_cleaning: "Zonenreinigung", zoned_mopping: "Zone wischen",
    spot_cleaning: "Punktreinigung", returning_home: "Fährt zur Basis", docking: "Dockt an",
    going_to_target: "Fährt zum Ziel", washing_the_mop: "Wäscht Mopp", washing_the_mop_2: "Wäscht Mopp",
    going_to_wash_the_mop: "Fährt zum Moppwaschen", emptying_the_bin: "Leert Behälter",
    air_drying_stopping: "Mopp-Trocknung", mapping: "Kartiert", error: "Fehler",
    charger_disconnected: "Ladestation getrennt", device_offline: "Offline", locked: "Gesperrt",
    attaching_the_mop: "Mopp anbringen", detaching_the_mop: "Mopp abnehmen",
    robot_status_mopping: "Wischt", clean_mop_mopping: "Wischt", segment_clean_mop_mopping: "Wischt Bereich",
  },
  en: {
    charging: "Charging", charging_complete: "Fully charged", charging_problem: "Charging problem",
    idle: "Ready", starting: "Starting", cleaning: "Cleaning", paused: "Paused",
    segment_cleaning: "Cleaning area", segment_mopping: "Mopping area",
    zoned_cleaning: "Zone cleaning", zoned_mopping: "Zone mopping",
    spot_cleaning: "Spot cleaning", returning_home: "Returning to dock", docking: "Docking",
    going_to_target: "Going to target", washing_the_mop: "Washing mop", washing_the_mop_2: "Washing mop",
    going_to_wash_the_mop: "Going to wash mop", emptying_the_bin: "Emptying bin",
    air_drying_stopping: "Drying mop", mapping: "Mapping", error: "Error",
    charger_disconnected: "Charger disconnected", device_offline: "Offline", locked: "Locked",
    attaching_the_mop: "Attaching mop", detaching_the_mop: "Detaching mop",
    robot_status_mopping: "Mopping", clean_mop_mopping: "Mopping", segment_clean_mop_mopping: "Mopping area",
  },
};

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
const DE = { "roborock-s7-card": {
  disc: "Bereiche & Einstellungen",
  less: "Weniger",
  close: "Schließen",
  start: "Start",
  pause: "Pause",
  stop: "Stopp",
  dock: "Basis",
  locate: "Orten",
  by_area: "Reinigung nach Bereich",
  suction: "Saugkraft",
  mop_settings: "Wischeinstellungen",
  clean_status: "Reinigungsstatus",
  active: "aktiv",
  select_areas: "Bereiche wählen",
  clean_n: (n) => n + " Bereich" + (n > 1 ? "e" : "") + " reinigen",
  all: "Alles",
  no_rooms: (e) => "Keine Raumdaten in " + e + ".",
  room: (r) => "Raum: " + r,
  at_dock: "an der Basis",
  fan_quiet: "Leise",
  fan_bal: "Standard",
  fan_turbo: "Turbo",
  fan_max: "Max",
  fan_maxplus: "Max+",
  mop_mode: "Modus",
  mop_vac: "Saugen",
  mop_vacmop: "Saugen & Wischen",
  mop_mop: "Wischen",
  mop_int: "Intensität",
  int_off: "Aus",
  int_mild: "Leicht",
  int_std: "Standard",
  int_intense: "Intensiv",
  mop_wmode: "Wisch-Modus",
  wm_std: "Standard",
  wm_deep: "Deep",
  wm_deepplus: "Deep+",
  wm_fast: "Schnell",
  last_start: "Letzter Start",
  last_end: "Letztes Ende",
  vac_err: "Sauger-Fehler",
  dock_err: "Dock-Fehler",
  none: "Keiner",
  presence_clean: "Präsenzsensitiv saugen",
  due_today: "Heute fällig",
  cleanings: (n) => "Reinigungen " + n,
  total_area: (n) => "Fläche gesamt " + n + " k m²",
  mop_attached: "Mopp angebracht",
  not_found: (e) => "Staubsauger " + e + " nicht gefunden.",
  e_vacuum: "Staubsauger (vacuum)",
  e_map: "Karten-Bild (image)",
  e_rooms: "Raumdaten (image mit `rooms`)",
  e_title: "Titel",
  e_mode: "Anzeige",
  e_language: "Sprache",
  e_popup: "Popup",
  e_dropdown: "Ausklappen (Dropdown)",
  e_inline: "Inline (immer sichtbar)",
  e_auto: "Automatisch (HA)",
  e_de: "Deutsch",
  e_en: "Englisch"
} };
const EN = { "roborock-s7-card": {
  disc: "Areas & settings",
  less: "Less",
  close: "Close",
  start: "Start",
  pause: "Pause",
  stop: "Stop",
  dock: "Dock",
  locate: "Locate",
  by_area: "Clean by area",
  suction: "Suction",
  mop_settings: "Mop settings",
  clean_status: "Cleaning status",
  active: "active",
  select_areas: "Select areas",
  clean_n: (n) => "Clean " + n + " area" + (n > 1 ? "s" : ""),
  all: "All",
  no_rooms: (e) => "No room data in " + e + ".",
  room: (r) => "Room: " + r,
  at_dock: "at the dock",
  fan_quiet: "Quiet",
  fan_bal: "Balanced",
  fan_turbo: "Turbo",
  fan_max: "Max",
  fan_maxplus: "Max+",
  mop_mode: "Mode",
  mop_vac: "Vacuum",
  mop_vacmop: "Vacuum & mop",
  mop_mop: "Mop",
  mop_int: "Intensity",
  int_off: "Off",
  int_mild: "Mild",
  int_std: "Standard",
  int_intense: "Intense",
  mop_wmode: "Mop mode",
  wm_std: "Standard",
  wm_deep: "Deep",
  wm_deepplus: "Deep+",
  wm_fast: "Fast",
  last_start: "Last start",
  last_end: "Last end",
  vac_err: "Vacuum error",
  dock_err: "Dock error",
  none: "None",
  presence_clean: "Presence-based clean",
  due_today: "Due today",
  cleanings: (n) => "Cleanings " + n,
  total_area: (n) => "Total area " + n + " k m²",
  mop_attached: "Mop attached",
  not_found: (e) => "Vacuum " + e + " not found.",
  e_vacuum: "Vacuum",
  e_map: "Map image (image)",
  e_rooms: "Room data (image with `rooms`)",
  e_title: "Title",
  e_mode: "Display",
  e_language: "Language",
  e_popup: "Popup",
  e_dropdown: "Dropdown",
  e_inline: "Inline (always shown)",
  e_auto: "Automatic (HA)",
  e_de: "German",
  e_en: "English"
} };
const I18N = { de: DE["roborock-s7-card"], en: EN["roborock-s7-card"] };


function fmtSecs(s) {
  const m = Math.round((Number(s) || 0) / 60);
  if (m < 60) return m + " Min";
  return Math.floor(m / 60) + " Std " + String(m % 60).padStart(2, "0") + " Min";
}
function battIcon(pct, charging) {
  if (charging) return "mdi:battery-charging";
  if (pct == null) return "mdi:battery-unknown";
  if (pct >= 95) return "mdi:battery";
  if (pct <= 5) return "mdi:battery-alert-variant-outline";
  return "mdi:battery-" + Math.round(pct / 10) * 10;
}
function tstamp(iso) {
  if (!iso) return "–";
  const d = new Date(iso);
  if (isNaN(d)) return String(iso);
  const t = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  const md = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dd = Math.round((md(new Date()) - md(d)) / 86400000);
  if (dd <= 0) return "heute " + t;
  if (dd === 1) return "gestern " + t;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) + " " + t;
}

class RoborockS7Card extends HTMLElement {
  static getStubConfig() { return { vacuum: "vacuum.roborock_s7_maxv" }; }
  static getConfigElement() { return document.createElement("roborock-s7-card-editor"); }
  setConfig(c) {
    const d = {
      vacuum: "vacuum.roborock_s7_maxv",
      map_entity: "image.roborock_s7_maxv_map_0_custom",
      rooms_entity: "image.roborock_s7_maxv_map_0_custom",
      status_sensor: "sensor.roborock_s7_maxv_status",
      battery_sensor: "sensor.roborock_s7_maxv_batterie",
      progress_sensor: "sensor.roborock_s7_maxv_reinigungsfortschritt",
      area_sensor: "sensor.roborock_s7_maxv_reinigungsbereich",
      time_sensor: "sensor.roborock_s7_maxv_reinigungszeit",
      current_room_sensor: "sensor.roborock_s7_maxv_aktueller_raum",
      last_start_sensor: "sensor.roborock_s7_maxv_letzter_reinigungsbeginn",
      last_end_sensor: "sensor.roborock_s7_maxv_letztes_reinigungsende",
      charging_sensor: "binary_sensor.roborock_s7_maxv_ladestatus",
      vac_error_sensor: "sensor.roborock_s7_maxv_staubsauger_fehler",
      dock_error_sensor: "sensor.roborock_s7_maxv_dock_dock_fehler",
      mop_attached_sensor: "binary_sensor.roborock_s7_maxv_mopp_angebracht",
      mop_active_sensor: "binary_sensor.wischmodus_aktiv",
      mode_select: "select.gastezimmer_roborock_s7_maxv_reinigungsmodus",
      mop_intensity_select: "select.roborock_s7_maxv_wisch_intensitat",
      mop_mode_select: "select.roborock_s7_maxv_mopp_modus",
      presence_script: "script.selektives_saugen_nach_prasenz",
      pending_boolean: "input_boolean.vacuum_cleaning_pending",
      total_count_sensor: "sensor.roborock_s7_maxv_gesamtzahl_reinigungen",
      total_area_sensor: "sensor.roborock_s7_maxv_gesamter_reinigungsbereich",
      dnd_switch: "switch.roborock_s7_maxv_bitte_nicht_storen",
      presence: [
        { entity: "binary_sensor.buro_fp2_presence", name: "Büro" },
        { entity: "binary_sensor.wz_fp2_presence", name: "WZ" },
      ],
    };
    d.mode = "popup"; d.language = "auto";
    const prevSig = this._psig;
    this._cfg = Object.assign(d, c || {});
    this._sel = new Set();
    this._open = false;
    this._popup = this._cfg.mode === "popup";
    this._inline = this._cfg.mode === "inline";
    this._psig = this._cfg.mode + "|" + this._cfg.language;
    if (this.shadowRoot && prevSig !== undefined && prevSig !== this._psig) {
      this.shadowRoot.innerHTML = ""; this._sig = null;
      this._build(); if (this._hass) this._render();
    }
  }
  getCardSize() { return 16; }

  _lang() {
    const c = this._cfg.language || "auto";
    if (c === "de" || c === "en") return c;
    return (this._hass && this._hass.language || "").toLowerCase().startsWith("de") ? "de" : "en";
  }
  _L() { return I18N[this._lang()] || I18N.de; }
  _status(raw) { const m = STATUS[this._lang()] || STATUS.de; return m[raw] || (raw ? raw.replace(/_/g, " ") : "–"); }

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

  _e(id) { return this._hass && this._hass.states[id]; }
  _st(id) { const e = this._e(id); return e ? e.state : undefined; }
  _num(id) { const v = parseFloat(this._st(id)); return isNaN(v) ? null : v; }
  _attr(id, a) { const e = this._e(id); return e && e.attributes ? e.attributes[a] : undefined; }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _svc(dom, srv, data, target) { this._hass.callService(dom, srv, data || {}, target); }

  // update the "Bereiche reinigen" button label/disabled without rebuilding the section
  _syncGo() {
    const btn = this.shadowRoot.querySelector('.go[data-act="clean"]');
    if (!btn) return;
    const L = this._L();
    const n = this._rooms().filter((x) => x.area_id && this._sel.has(x.area_id)).length;
    if (n) btn.removeAttribute("disabled"); else btn.setAttribute("disabled", "");
    btn.innerHTML = `<ha-icon icon="mdi:robot-vacuum"></ha-icon>` + (n ? L.clean_n(n) : L.select_areas);
  }

  _rooms() {
    const raw = this._attr(this._cfg.rooms_entity, "rooms");
    if (!raw) return [];
    const byName = {};
    const areas = this._hass.areas || {};
    for (const aid of Object.keys(areas)) byName[(areas[aid].name || "").toLowerCase()] = aid;
    const out = [];
    for (const k of Object.keys(raw)) {
      const nm = raw[k] && raw[k].name;
      if (!nm || nm.toLowerCase() === "unknown") continue;
      out.push({ seg: k, name: nm, area_id: byName[nm.toLowerCase()] });
    }
    out.sort((a, b) => a.name.localeCompare(b.name, "de"));
    return out;
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({ mode: "open" });
    const L = this._L();
    const ttl = this._cfg.title || "S7 MaxV";
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hdr">
  <div class="ttl"><span class="brand">ROBOROCK</span><span class="model" id="model">${ttl}</span></div>
  <div class="hstat">
   <span class="pres" id="dnd" hidden><ha-icon icon="mdi:sleep"></ha-icon></span>
   <span class="batt"><ha-icon id="batticon" icon="mdi:battery"></ha-icon><span id="batt">–</span></span>
   <span class="alert" id="alert" hidden></span>
  </div>
 </div>
 <div class="stage">
  <img class="map" id="map" alt="map">
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
    if (!this._inline) this.$("disc").addEventListener("click", () => this._toggle());
    if (this._popup) {
      this.$("popX").onclick = () => this.$("pop").close();
      this.$("pop").addEventListener("click", (e) => { if (e.target === this.$("pop")) this.$("pop").close(); });
    }
    this.$("map").addEventListener("click", () => this._mi(this._cfg.map_entity));
    this.$("dnd").style.cursor = "pointer";
    this.$("dnd").addEventListener("click", () => this._svc("switch", "toggle", { entity_id: this._cfg.dnd_switch }));
    this.$("alert").addEventListener("click", (e) => { e.stopPropagation(); this._mi(this._cfg.vac_error_sensor); });
    this.$("cmds").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cmd]"); if (!b) return;
      const map = { start: ["vacuum", "start"], pause: ["vacuum", "pause"], stop: ["vacuum", "stop"],
        dock: ["vacuum", "return_to_base"], locate: ["vacuum", "locate"] };
      const m = map[b.dataset.cmd]; if (m) this._svc(m[0], m[1], { entity_id: this._cfg.vacuum });
    });
    this.$("body").addEventListener("click", (e) => {
      const el = e.target.closest("[data-act]"); if (!el || el.hasAttribute("disabled")) return;
      const [k, a, b] = el.dataset.act.split("|");
      if (k === "room") {
        // toggle in place — no innerHTML rebuild, so other chips can't be swapped mid-tap
        if (!a) return;
        const on = !this._sel.has(a);
        if (on) this._sel.add(a); else this._sel.delete(a);
        el.classList.toggle("on", on);
        const ic = el.querySelector("ha-icon");
        if (ic) ic.setAttribute("icon", on ? "mdi:check-circle" : "mdi:checkbox-blank-circle-outline");
        this._syncGo();
      } else if (k === "clean") {
        const ids = this._rooms().filter((x) => x.area_id && this._sel.has(x.area_id)).map((x) => x.area_id);
        if (!ids.length) return;
        this._hass.callService("vacuum", "clean_area", { cleaning_area_id: ids }, { entity_id: this._cfg.vacuum });
        this._sel.clear();
        this.shadowRoot.querySelectorAll(".rm.on").forEach((r) => {
          r.classList.remove("on");
          const ic = r.querySelector("ha-icon"); if (ic) ic.setAttribute("icon", "mdi:checkbox-blank-circle-outline");
        });
        this._syncGo();
      } else if (k === "all") {
        this._svc("vacuum", "start", { entity_id: this._cfg.vacuum });
      } else if (k === "sel") {
        this._svc("select", "select_option", { entity_id: a, option: b });
      } else if (k === "fan") {
        this._svc("vacuum", "set_fan_speed", { entity_id: this._cfg.vacuum, fan_speed: a });
      } else if (k === "script") {
        this._svc("script", "turn_on", { entity_id: a });
      } else if (k === "toggle") {
        this._svc(a.split(".")[0], "toggle", { entity_id: a });
      } else if (k === "more") {
        this._mi(a);
      }
    });
  }

  _render() {
    if (!this.shadowRoot) return;
    if (!this._e(this._cfg.vacuum)) {
      this.$("body").innerHTML = `<div class="warn">${this._L().not_found("<b>" + this._cfg.vacuum + "</b>")}</div>`;
      if (!this._popup) { this.$("more").hidden = false; this.classList.remove("collapsed"); }
      return;
    }
    // map <img> is refreshed on every tick (cheap, no interactive DOM)
    const mp = this._e(this._cfg.map_entity);
    if (mp && mp.attributes && mp.attributes.entity_picture) {
      const ep = mp.attributes.entity_picture;
      const url = ep + (ep.includes("?") ? "&" : "?") + "s=" + encodeURIComponent(mp.state || "");
      if (this.$("map").getAttribute("src") !== url) this.$("map").setAttribute("src", url);
    }
    // everything else only rebuilds when a shown value changed, so a background state
    // update can't replace a chip/pill mid-tap.
    const C = this._cfg;
    const RD = [C.vacuum, C.status_sensor, C.battery_sensor, C.progress_sensor, C.area_sensor, C.time_sensor,
      C.current_room_sensor, C.last_start_sensor, C.last_end_sensor, C.charging_sensor, C.vac_error_sensor,
      C.dock_error_sensor, C.mop_attached_sensor, C.mop_active_sensor, C.mode_select, C.mop_intensity_select,
      C.mop_mode_select, C.pending_boolean, C.total_count_sensor, C.total_area_sensor, C.dnd_switch, C.rooms_entity]
      .concat((C.presence || []).map((p) => p.entity));
    const sig = RD.map((id) => this._st(id)).join("|") + "||" + (this._attr(C.vacuum, "fan_speed") || "");
    if (sig === this._sig) return;
    this._sig = sig;

    const L = this._L();
    this.$("model").textContent = this._cfg.title || "S7 MaxV";
    if (this.$("popT")) this.$("popT").textContent = this._cfg.title || "S7 MaxV";
    const vac = this._st(this._cfg.vacuum);
    const rawStatus = this._st(this._cfg.status_sensor) || vac || "";
    const cleaning = /clean|mopp|zone|spot|segment|going_to_target|starting/.test(rawStatus) && !/complete/.test(rawStatus);
    const returning = /return|docking/.test(rawStatus);
    const paused = rawStatus === "paused" || vac === "paused";
    const charging = this._st(this._cfg.charging_sensor) === "on" || /^charging/.test(rawStatus);
    const vacErr = (this._st(this._cfg.vac_error_sensor) || "none").toLowerCase();
    const dockErr = (this._st(this._cfg.dock_error_sensor) || "ok").toLowerCase();
    const err = !["none", "no_error", "ok", "unknown", ""].includes(vacErr) || !["ok", "none", "unknown", ""].includes(dockErr);

    const acc = err ? "#ef4444" : cleaning ? "#22c55e" : paused || returning ? "#f59e0b" : "#4f7cff";
    this.style.setProperty("--acc", acc);

    // header
    const pct = this._num(this._cfg.battery_sensor);
    this.$("batt").textContent = pct == null ? "–" : Math.round(pct) + " %";
    this.$("batticon").setAttribute("icon", battIcon(pct, charging));
    const al = this.$("alert");
    if (err) { al.hidden = false; al.textContent = "⚠ " + (vacErr !== "none" ? vacErr : dockErr); } else al.hidden = true;
    this.$("dnd").hidden = this._st(this._cfg.dnd_switch) !== "on";

    // status
    this.$("big").textContent = this._status(rawStatus);
    const room = this._st(this._cfg.current_room_sensor);
    this.$("sub").textContent = cleaning && room && room !== "unknown" ? L.room(room) : (charging ? L.at_dock : "");
    const area = this._num(this._cfg.area_sensor);
    const secs = this._num(this._cfg.time_sensor);
    const parts = [];
    if (cleaning || paused) {
      if (area != null) parts.push(area.toFixed(1) + " m²");
      if (secs != null) parts.push(fmtSecs(secs));
    }
    this.$("meta").textContent = parts.join(" · ");
    const prog = this._num(this._cfg.progress_sensor);
    this.$("fill").style.width = (cleaning && prog != null ? Math.max(0, Math.min(100, prog)) : 0) + "%";

    // command bar
    const cb = (cmd, icon, label, primary) =>
      `<button class="cmd${primary ? " primary" : ""}" data-cmd="${cmd}"><ha-icon icon="${icon}"></ha-icon>${label}</button>`;
    this.$("cmds").innerHTML =
      cb("start", "mdi:play", L.start, !cleaning) +
      cb("pause", "mdi:pause", L.pause, cleaning) +
      cb("stop", "mdi:stop", L.stop) +
      cb("dock", "mdi:home-import-outline", L.dock) +
      cb("locate", "mdi:map-marker", L.locate);

    // ---- body ----
    const rooms = this._rooms();
    const selCount = rooms.filter((x) => x.area_id && this._sel.has(x.area_id)).length;
    const roomChips = rooms.map((x) =>
      `<button class="rm${this._sel.has(x.area_id) ? " on" : ""}" data-act="room|${x.area_id || ""}"${x.area_id ? "" : " disabled"}>` +
      `<ha-icon icon="mdi:${this._sel.has(x.area_id) ? "check-circle" : "checkbox-blank-circle-outline"}"></ha-icon>${x.name}</button>`
    ).join("");

    const seg = (label, entId, opts) => {
      const cur = this._st(entId);
      const pills = opts.map((o) =>
        `<button class="pill${cur === o.v ? " on" : ""}" data-act="sel|${entId}|${o.v}">${o.l}</button>`).join("");
      return `<div class="segrow"><span class="seglbl">${label}</span><span class="pills">${pills}</span></div>`;
    };
    const statRow = (icon, label, val, isErr, entId) =>
      `<div class="stat${isErr ? " err" : ""}" data-act="more|${entId}"><ha-icon icon="${icon}"></ha-icon>${label}<b>${val}</b></div>`;
    const fanCur = this._attr(this._cfg.vacuum, "fan_speed");
    const fanPills = [["quiet", L.fan_quiet], ["balanced", L.fan_bal], ["turbo", L.fan_turbo], ["max", L.fan_max], ["max_plus", L.fan_maxplus]]
      .map(([v, l]) => `<button class="pill${fanCur === v ? " on" : ""}" data-act="fan|${v}">${l}</button>`).join("");

    const mopActive = this._st(this._cfg.mop_active_sensor) === "on";
    const mopOn = this._st(this._cfg.mop_attached_sensor) === "on";
    const pending = this._st(this._cfg.pending_boolean) === "on";
    const presHtml = (this._cfg.presence || []).map((p) =>
      `<span class="pres"><b class="${this._st(p.entity) === "on" ? "on" : ""}"></b>${p.name}</span>`).join("");

    const totalCount = this._num(this._cfg.total_count_sensor);
    const totalArea = this._num(this._cfg.total_area_sensor);
    const foot = [];
    if (totalCount != null) foot.push(L.cleanings(Math.round(totalCount)));
    if (totalArea != null) foot.push(L.total_area(Math.round(totalArea / 1000)));
    if (mopOn) foot.push(L.mop_attached);

    this.$("body").innerHTML =
      `<div class="sec"><ha-icon icon="mdi:vector-square"></ha-icon>${L.by_area}</div>` +
      (rooms.length
        ? `<div class="rooms">${roomChips}</div>
           <div class="gorow">
            <button class="go" data-act="clean"${selCount ? "" : " disabled"}>
              <ha-icon icon="mdi:robot-vacuum"></ha-icon>${selCount ? L.clean_n(selCount) : L.select_areas}
            </button>
            <button class="go ghost" data-act="all"><ha-icon icon="mdi:play"></ha-icon>${L.all}</button>
           </div>`
        : `<div class="warn" style="text-align:left;padding:6px 0">${L.no_rooms("<b>" + this._cfg.rooms_entity + "</b>")}</div>`) +

      `<div class="sec"><ha-icon icon="mdi:fan"></ha-icon>${L.suction}</div><div class="segrow"><span class="pills">${fanPills}</span></div>` +

      `<div class="sec"><ha-icon icon="phu:vac_mop"></ha-icon>${L.mop_settings}${mopActive ? " · " + L.active : ""}</div>` +
      seg(L.mop_mode, this._cfg.mode_select, [{ v: "vacuum", l: L.mop_vac }, { v: "vac_and_mop", l: L.mop_vacmop }, { v: "mop", l: L.mop_mop }]) +
      seg(L.mop_int, this._cfg.mop_intensity_select, [{ v: "off", l: L.int_off }, { v: "mild", l: L.int_mild }, { v: "standard", l: L.int_std }, { v: "intense", l: L.int_intense }]) +
      seg(L.mop_wmode, this._cfg.mop_mode_select, [{ v: "standard", l: L.wm_std }, { v: "deep", l: L.wm_deep }, { v: "deep_plus", l: L.wm_deepplus }, { v: "fast", l: L.wm_fast }]) +

      `<div class="sec"><ha-icon icon="mdi:robot-vacuum"></ha-icon>${L.clean_status}</div>` +
      statRow("mdi:clock-start", L.last_start, tstamp(this._st(this._cfg.last_start_sensor)), false, this._cfg.last_start_sensor) +
      statRow("mdi:clock-end", L.last_end, tstamp(this._st(this._cfg.last_end_sensor)), false, this._cfg.last_end_sensor) +
      statRow("mdi:alert-circle-outline", L.vac_err, vacErr === "none" ? L.none : vacErr, vacErr !== "none", this._cfg.vac_error_sensor) +
      statRow("mdi:alert-circle-outline", L.dock_err, dockErr === "ok" ? "OK" : dockErr, dockErr !== "ok", this._cfg.dock_error_sensor) +

      `<div class="extra">
        <button class="chip" data-act="script|${this._cfg.presence_script}"><ha-icon icon="mdi:robot-vacuum-alert"></ha-icon>${L.presence_clean}</button>
        <button class="chip${pending ? " on" : ""}" data-act="toggle|${this._cfg.pending_boolean}"><ha-icon icon="mdi:calendar-check"></ha-icon>${L.due_today}</button>
        ${presHtml}
      </div>` +
      (foot.length ? `<div class="foot">${foot.map((x) => `<span>${x}</span>`).join("")}</div>` : "");
  }
}

/* ---- visual editor ---- */
class RoborockS7CardEditor extends HTMLElement {
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
      vacuum: L.e_vacuum, map_entity: L.e_map, rooms_entity: L.e_rooms,
      title: L.e_title, mode: L.e_mode, language: L.e_language,
    }[s.name] || s.name);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "title", selector: { text: {} } },
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "popup", label: L.e_popup }, { value: "dropdown", label: L.e_dropdown },
        { value: "inline", label: L.e_inline } ] } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en } ] } } },
      { name: "vacuum", selector: { entity: {} } },
      { name: "map_entity", selector: { entity: {} } },
      { name: "rooms_entity", selector: { entity: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("roborock-s7-card-editor", RoborockS7CardEditor);

customElements.define("roborock-s7-card", RoborockS7Card);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "roborock-s7-card",
  name: "Roborock S7 MaxV",
  description: "Roborock S7 MaxV – Karte, Steuerung, Reinigung nach Bereich, Wisch- & Statuswerte",
  preview: false,
});
