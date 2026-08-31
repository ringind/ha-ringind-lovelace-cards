/* AEG 9000 Series washer-dryer-steamer card
 * Custom Lovelace card for the electrolux_status (AEG) integration.
 * User-facing strings are German; code comments are English.
 *
 * config:
 *   type: custom:aeg-waschtrockner-card
 *   prefix: aeg_waschtrockner   # entity_id prefix (default)
 *   image: /local/aeg9000.png   # optional real photo, replaces the SVG illustration
 */

const STYLE = `
:host{--acc:var(--primary-color);display:block}
ha-card{padding:14px 14px 10px;overflow:hidden}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ttl{display:flex;align-items:baseline;gap:8px;min-width:0}
.brand{font-weight:800;letter-spacing:.16em;font-size:20px;color:var(--primary-text-color)}
.model{font-size:11px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.09em;white-space:nowrap}
.hstat{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--secondary-text-color);flex:0 0 auto}
.dot{width:9px;height:9px;border-radius:50%;background:var(--disabled-text-color)}
.dot.ok{background:#22c55e}
.alert{background:var(--error-color,#e53935);color:#fff;border-radius:10px;padding:1px 7px;font-size:11px;font-weight:700;cursor:pointer}
.stage{position:relative;display:flex;gap:16px;align-items:center;padding:10px 4px 14px;cursor:pointer}
.stage svg,.photo{width:44%;max-width:208px;height:auto;flex:0 0 auto;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18))}
.photo{border-radius:12px;object-fit:contain}
.status{flex:1;min-width:0}
.big{font-size:26px;font-weight:800;line-height:1.05;color:var(--primary-text-color)}
.phase{margin-top:3px;font-size:12.5px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:.07em;min-height:15px}
.count{margin-top:8px;font-size:30px;font-weight:800;font-variant-numeric:tabular-nums;color:var(--primary-text-color);min-height:20px}
.finish{font-size:12px;color:var(--secondary-text-color);min-height:14px}
.bar{margin-top:10px;height:6px;border-radius:6px;background:var(--divider-color);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--acc);border-radius:6px;transition:width .8s ease}
.panel{display:flex;flex-direction:column;gap:9px;margin-top:2px}
.sec{font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--secondary-text-color);margin:4px 0 -2px}
.sec .hint{font-weight:600;letter-spacing:0;text-transform:none;opacity:.75}
.row{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);border-radius:999px;padding:6px 10px;font-size:12.5px;font-family:inherit;cursor:pointer;line-height:1}
.chip ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.chip b{font-weight:800}
.chip.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 16%,transparent)}
.chip.on ha-icon{color:var(--acc)}
.chip[disabled]{opacity:.4;pointer-events:none}
.cmds{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.cmd{flex:1 1 130px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:13px;padding:12px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer;background:var(--divider-color);color:var(--primary-text-color)}
.cmd ha-icon{--mdc-icon-size:19px}
.cmd.primary{background:var(--acc);color:#fff}
.cmd[disabled]{opacity:.4;pointer-events:none}
.foot{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:11px;color:var(--secondary-text-color);border-top:1px solid var(--divider-color);padding-top:8px;margin-top:4px}
.warn{padding:18px;color:var(--secondary-text-color);font-size:13px;text-align:center}
#drum{transform-box:fill-box;transform-origin:center}
.stage.run #drum{animation:aegspin 2.6s linear infinite}
.stage.p-spin #drum{animation-duration:.55s}
.stage.p-rinse #drum{animation-duration:1.5s}
@keyframes aegspin{to{transform:rotate(360deg)}}
#water{transform:translateY(120px);transition:transform 1s ease}
.stage.p-wash #water,.stage.p-prewash #water{transform:translateY(24px)}
.stage.p-rinse #water{transform:translateY(58px)}
.stage.p-steam #water{transform:translateY(100px)}
#glass{transition:fill .6s,fill-opacity .6s}
#steam{opacity:0;transition:opacity .6s}
.stage.p-steam #steam,.stage.p-dry #steam{opacity:.75;animation:aegrise 3s ease-in-out infinite}
@keyframes aegrise{0%{opacity:.1}50%{opacity:.75}100%{opacity:.1}}
#door{transform-box:fill-box;transform-origin:center;transition:transform .5s ease}
.stage.door #door{transform:translateX(9px) rotate(7deg)}
#prog{stroke:var(--acc);transition:stroke-dashoffset .8s ease}

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
@media(max-width:480px){.stage{flex-direction:column;text-align:center}.stage svg,.photo{width:62%}.bar{max-width:280px;margin-left:auto;margin-right:auto}}
`;

const MACHINE_SVG = `
<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AEG 9000 Waschtrockner">
 <defs>
  <linearGradient id="aegbody" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stop-color="#fdfdfe"/><stop offset="1" stop-color="#d5d9df"/>
  </linearGradient>
  <clipPath id="aegglass"><circle cx="100" cy="150" r="54"/></clipPath>
 </defs>
 <rect x="6" y="6" width="188" height="238" rx="18" fill="url(#aegbody)" stroke="#b4bac2" stroke-width="2"/>
 <path d="M6 24 a18 18 0 0 1 18 -18 h152 a18 18 0 0 1 18 18 v28 h-188 Z" fill="#2b2f36"/>
 <circle cx="33" cy="30" r="12" fill="#191c21" stroke="#4b515a" stroke-width="2"/>
 <rect x="29" y="19" width="8" height="12" rx="3" fill="#8b9096"/>
 <text x="56" y="27" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="800" letter-spacing="2" fill="#f5f5f6">AEG</text>
 <text x="56" y="39" font-family="Arial,Helvetica,sans-serif" font-size="7.5" letter-spacing="1.4" fill="#9aa0a6">9000 SERIES</text>
 <rect x="126" y="15" width="60" height="26" rx="5" fill="#08301f"/>
 <text id="svg-disp" x="156" y="33" text-anchor="middle" font-family="'Courier New',monospace" font-size="13" font-weight="700" fill="#46f5a6">--:--</text>
 <g id="door">
  <circle cx="100" cy="150" r="74" fill="#ecedf0" stroke="#c0c5cc" stroke-width="2"/>
  <circle id="prog" cx="100" cy="150" r="66" fill="none" stroke-width="6" stroke-linecap="round" transform="rotate(-90 100 150)" stroke-dasharray="414.7" stroke-dashoffset="414.7"/>
  <circle cx="100" cy="150" r="60" fill="#0c0e11"/>
  <circle id="glass" cx="100" cy="150" r="56" fill="#9aa0a6" fill-opacity="0.85"/>
  <g clip-path="url(#aegglass)">
   <rect id="water" x="44" y="96" width="112" height="150" fill="#2f7ff0" fill-opacity="0.5"/>
   <g id="drum">
    <circle cx="100" cy="150" r="50" fill="none" stroke="#eceef2" stroke-width="3" stroke-dasharray="2 9" stroke-opacity="0.5"/>
    <path d="M100 104 q15 9 8 24 q-11 -7 -8 -24Z" fill="#eceef2" fill-opacity="0.85"/>
    <path d="M141 166 q-3 17 -20 15 q7 -13 20 -15Z" fill="#eceef2" fill-opacity="0.85"/>
    <path d="M59 166 q3 17 20 15 q-7 -13 -20 -15Z" fill="#eceef2" fill-opacity="0.85"/>
   </g>
   <g id="steam" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.85">
    <path d="M84 152 q-8 -10 0 -20 q8 -10 0 -20"/>
    <path d="M100 158 q-8 -10 0 -20 q8 -10 0 -20"/>
    <path d="M116 152 q-8 -10 0 -20 q8 -10 0 -20"/>
   </g>
  </g>
  <circle cx="100" cy="150" r="56" fill="none" stroke="#3a3e44" stroke-width="3"/>
  <rect x="175" y="139" width="13" height="24" rx="5" fill="#b4bac2" stroke="#9aa0a6"/>
 </g>
 <rect x="24" y="236" width="20" height="10" rx="3" fill="#9aa0a6"/>
 <rect x="156" y="236" width="20" height="10" rx="3" fill="#9aa0a6"/>
</svg>`;

// program uid -> short German-ish label
function prettyProgram(raw) {
  if (!raw) return "–";
  const parts = raw.split(/\s+Pr\s+/i);
  let s = (parts.length > 1 ? parts[1] : raw).trim();
  s = s.replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/\s+/g, " ");
  const map = {
    "Eco 40-60": "Eco 40–60", "Cottons": "Baumwolle", "Towels": "Handtücher",
    "Delicates": "Feinwäsche", "Baby": "Baby", "Denim": "Jeans", "Darkclothes": "Dunkles",
    "Wool Handwash": "Wolle/Handwäsche", "Silk": "Seide", "Synthetics": "Pflegeleicht",
    "Sportwear": "Sport", "Microfibre": "Mikrofaser", "Bedlinen": "Bettwäsche",
    "Antiallergy": "Anti-Allergie", "Machineclean": "Trommel reinigen", "Workingclothes": "Arbeitskleidung",
    "20 Min 3Kg": "Quick 20′", "Nonstop 3H 3Kg": "Non-Stop 3 kg", "Steam": "Dampf auffrischen",
    "Steamcashmere": "Dampf Kaschmir", "Rinse": "Spülen", "Drain Spin": "Abpumpen/Schleudern",
    "Duvet": "Bettdecke", "Outdoor": "Outdoor", "Down Jacket": "Daunenjacke", "Wool": "Wolle",
  };
  return map[s] || s;
}
function humLabel(v) {
  return ({ "Cupboard": "Schranktrocken", "Cupboard Plus": "Schrank+", "Iron": "Bügeltrocken",
    "Iron Dry": "Bügeltrocken", "Extra Dry": "Extratrocken", "Damp": "Nutzfeucht",
    "Hang Dry": "Leinentrocken" }[v]) || v;
}
function fmtMin(min) {
  const m = Math.max(0, Math.round(min));
  if (m === 0) return "gleich fertig";
  if (m < 60) return m + " Min";
  return Math.floor(m / 60) + " Std " + String(m % 60).padStart(2, "0") + " Min";
}
function clockPlus(min) {
  const d = new Date(Date.now() + Math.round(min) * 60000);
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

class AegWaschtrocknerCard extends HTMLElement {
  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement("aeg-waschtrockner-card-editor"); }
  setConfig(c) {
    this._cfg = Object.assign({ prefix: "aeg_waschtrockner" }, c || {});
    this._p = this._cfg.prefix;
    this._runMax = 0;
    this._open = false;
  }

  _toggle() {
    this._open = !this._open;
    this.$("more").hidden = !this._open;
    this.$("disc").classList.toggle("open", this._open);
    this.classList.toggle("collapsed", !this._open);
    this.$("discTxt").textContent = this._open ? "Weniger" : "Programm & Optionen";
  }
  getCardSize() { return 13; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  _id(suf) { const i = suf.indexOf("."); return suf.slice(0, i + 1) + this._p + "_" + suf.slice(i + 1); }
  _e(suf) { return this._hass && this._hass.states[this._id(suf)]; }
  _st(suf) { const e = this._e(suf); return e ? e.state : undefined; }
  _n(suf) { const v = parseFloat(this._st(suf)); return isNaN(v) ? null : v; }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }

  _build() {
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hdr">
  <div class="ttl"><span class="brand">AEG</span><span class="model">9000 · Waschtrockner</span></div>
  <div class="hstat"><span class="dot" id="dot"></span><span id="conn"></span><span class="alert" id="alert" hidden></span></div>
 </div>
 <div class="stage" id="stage">
  ${this._cfg.image ? `<img class="photo" src="${this._cfg.image}" alt="AEG 9000">` : MACHINE_SVG}
  <div class="status">
   <div class="big" id="big">–</div>
   <div class="phase" id="phase"></div>
   <div class="count" id="count"></div>
   <div class="finish" id="finish"></div>
   <div class="bar"><i id="fill"></i></div>
  </div>
 </div>
 <div class="cmds mainrow" id="cmds"></div>
 <button class="disc" id="disc" type="button"><span id="discTxt">Programm &amp; Optionen</span><ha-icon icon="mdi:chevron-down"></ha-icon></button>
 <div class="more" id="more" hidden><div class="panel" id="panel"></div></div>
</ha-card>`;
    this.$ = (id) => r.getElementById(id);
    this.classList.add("collapsed");
    this.$("stage").addEventListener("click", () => this._mi(this._id("sensor.appliancestate")));
    this.$("alert").addEventListener("click", (e) => { e.stopPropagation(); this._mi(this._id("sensor.alerts")); });
    this.$("disc").addEventListener("click", () => this._toggle());
    const panelTap = (e) => {
      const b = e.target.closest("[data-tap]"); if (!b || b.hasAttribute("disabled")) return;
      const [k, id] = b.dataset.tap.split("|");
      if (k === "more") this._mi(id);
      else if (k === "press") this._hass.callService("button", "press", { entity_id: id });
      else if (k === "tgl") this._hass.callService(id.split(".")[0], "toggle", { entity_id: id });
    };
    this.$("panel").addEventListener("click", panelTap);
    this.$("cmds").addEventListener("click", panelTap);
  }

  _render() {
    if (!this.shadowRoot) return;
    if (!this._e("sensor.appliancestate")) {
      this.$("panel").innerHTML = `<div class="warn">Keine <b>${this._p}*</b>-Entitäten gefunden.<br>Ist die AEG/Electrolux-Integration verbunden?</div>`;
      this.$("more").hidden = false;
      this.classList.remove("collapsed");
      return;
    }
    // `set hass` fires on every state change in HA. Skip the re-render unless a value
    // THIS card shows actually changed — keeps the panel DOM stable and cuts needless
    // work on a busy instance.
    const READ = [
      "sensor.appliancestate", "sensor.cyclephase", "sensor.cyclesubphase", "binary_sensor.doorstate",
      "sensor.timetoend", "number.starttime", "sensor.connectivitystate", "sensor.alerts", "sensor.remotecontrol",
      "select.userselections_programuid", "select.userselections_analogtemperature", "select.userselections_analogspinspeed",
      "select.userselections_steamvalue", "select.userselections_humiditytarget", "select.userselections_timemanagerlevel",
      "select.defaultextrarinse", "switch.userselections_prewashphase", "switch.userselections_stain",
      "switch.userselections_wmeconomy", "switch.userselections_nightcycle", "switch.userselections_anticreasenosteam",
      "switch.userselections_rinsehold", "switch.userselections_drymode", "switch.uilockmode",
      "sensor.totalcyclecounter", "sensor.totalwashcyclescount", "sensor.totaldrycyclescount",
      "sensor.totalwashdrycyclescount", "sensor.appliancetotalworkingtime", "sensor.measuredloadweight",
    ];
    const sig = READ.map((s) => this._st(s)).join("|");
    if (sig === this._sig) return;
    this._sig = sig;

    const stRaw = this._st("sensor.appliancestate") || "";
    const st = stRaw.toLowerCase().replace(/\s+/g, "");
    const phaseRaw = this._st("sensor.cyclephase") || "";
    const ph = phaseRaw.toLowerCase();
    const doorOpen = this._st("binary_sensor.doorstate") === "on";
    const rem = this._n("sensor.timetoend");
    const delay = this._n("number.starttime") || 0;
    const connRaw = (this._st("sensor.connectivitystate") || "").toLowerCase();
    const conn = connRaw.includes("connect") && !connRaw.includes("dis");
    const alerts = this._st("sensor.alerts");
    const rc = (this._st("sensor.remotecontrol") || "").toLowerCase();
    const rcBlocked = rc.includes("disabl") || rc === "off";

    const paused = st === "paused" || st.includes("pause");
    const done = /endofcycle|cycleend|finish|complete|programend/.test(st);
    const running = !paused && !done && (st === "running" || (rem != null && rem > 0 && /wash|dry|rins|spin|steam|run/.test(ph)));
    const delayed = st.includes("delay") || st.includes("schedul") || (delay > 0 && !running && !paused && !done);
    const off = st === "off" || st === "";

    // phase -> key/label/accent
    const P = [
      [/prewash|pre-wash|soak/, "prewash", "Vorwäsche", "#60a5fa"],
      [/mainwash|wash/, "wash", "Hauptwäsche", "#3b82f6"],
      [/rins/, "rinse", "Spülen", "#06b6d4"],
      [/spin|drain/, "spin", "Schleudern", "#6366f1"],
      [/dry/, "dry", "Trocknen", "#f59e0b"],
      [/steam/, "steam", "Dampf", "#a855f7"],
      [/anticrease|crease/, "wash", "Knitterschutz", "#94a3b8"],
    ];
    let pk = "wash", phLabel = "", acc = "var(--primary-color)";
    if (running) {
      let hit = false;
      for (const [re, k, lab, col] of P) if (re.test(ph)) { pk = k; phLabel = lab; acc = col; hit = true; break; }
      if (!hit) { pk = "wash"; phLabel = /not.?available|unavailable/i.test(phaseRaw) || !phaseRaw ? "Waschen" : phaseRaw; acc = "#3b82f6"; }
    } else if (done) acc = "#22c55e";
    else if (delayed) acc = "#f59e0b";
    else if (off) acc = "var(--disabled-text-color)";
    this.style.setProperty("--acc", acc);

    let cls = "stage";
    if (running) cls += " run p-" + pk;
    if (doorOpen) cls += " door";
    this.$("stage").className = cls;

    // status text
    let big;
    if (doorOpen && !running) big = "Tür offen";
    else if (off) big = "Aus";
    else if (running) big = "Läuft";
    else if (paused) big = "Pausiert";
    else if (delayed) big = "Startvorwahl";
    else if (done) big = "Fertig";
    else big = "Bereit";
    this.$("big").textContent = big;
    this.$("phase").textContent = running ? phLabel : (done ? "Wäsche entnehmen" : "");

    let count = "", finish = "";
    if (running && rem != null && rem > 0) { count = fmtMin(rem); finish = "fertig um " + clockPlus(rem); }
    else if (delayed && delay > 0) { count = "Start in " + fmtMin(delay); }
    else if (done) { count = "0 Min"; }
    else if (!paused && rem != null && rem > 0) { count = "ca. " + fmtMin(rem); finish = "Programmdauer"; }
    if (!running && !done && rcBlocked) finish = "Fernstart am Gerät aktivieren";
    this.$("count").textContent = count;
    this.$("finish").textContent = finish;

    // progress: capture the largest remaining-time seen this run
    if (running && rem != null) this._runMax = Math.max(this._runMax, rem);
    if (!running) this._runMax = 0;
    let prog = done ? 1 : (running && this._runMax > 0 ? (this._runMax - rem) / this._runMax : 0);
    prog = Math.max(0, Math.min(1, prog));
    this.$("fill").style.width = (prog * 100).toFixed(1) + "%";
    const pr = this.$("prog"); if (pr) pr.setAttribute("stroke-dashoffset", (414.7 * (1 - prog)).toFixed(1));
    const disp = this.$("svg-disp");
    if (disp) disp.textContent = running && rem != null
      ? (rem >= 60 ? Math.floor(rem / 60) + ":" + String(Math.round(rem % 60)).padStart(2, "0") : Math.round(rem) + " m")
      : (done ? "DONE" : (delayed && delay > 0 ? "DELAY" : "--:--"));

    // header
    this.$("dot").className = "dot" + (conn ? " ok" : "");
    this.$("conn").textContent = conn ? "Verbunden" : "Getrennt";
    const al = this.$("alert");
    if (alerts && !["0", "off", "none", "unknown", "unavailable"].includes(alerts.toLowerCase())) {
      al.hidden = false; al.textContent = "⚠ " + alerts;
    } else al.hidden = true;

    // ---- panel ----
    const chip = (label, val, tap, on, icon) =>
      `<button class="chip${on ? " on" : ""}"${tap ? ` data-tap="${tap}"` : ""}>` +
      `${icon ? `<ha-icon icon="${icon}"></ha-icon>` : ""}<span>${label}</span>` +
      `${val != null && val !== "" ? `<b>${val}</b>` : ""}</button>`;
    const P_ = this._p;

    // program summary chips (tap = open more-info to change)
    const pc = [];
    pc.push(chip("Programm", prettyProgram(this._st("select.userselections_programuid")),
      "more|select." + P_ + "_userselections_programuid", false, "mdi:tune-vertical"));
    const temp = (this._st("select.userselections_analogtemperature") || "").replace(" Celsius", "°").replace(/cold/i, "Kalt");
    if (temp) pc.push(chip("Temp.", temp, "more|select." + P_ + "_userselections_analogtemperature", false, "mdi:thermometer"));
    const spin = (this._st("select.userselections_analogspinspeed") || "").replace(/\s*Rpm/i, "").trim();
    if (spin) pc.push(chip("Schleudern", spin + (/\d/.test(spin) ? " U/min" : ""),
      "more|select." + P_ + "_userselections_analogspinspeed", false, "mdi:sync"));
    const steam = this._st("select.userselections_steamvalue");
    if (steam && !/off/i.test(steam)) pc.push(chip("Dampf", steam.replace(/steam/i, "").trim() || "an",
      "more|select." + P_ + "_userselections_steamvalue", true, "mdi:weather-fog"));
    const dryOn = this._st("switch.userselections_drymode") === "on";
    const hum = this._st("select.userselections_humiditytarget");
    if (dryOn && hum) pc.push(chip("Trockenziel", humLabel(hum),
      "more|select." + P_ + "_userselections_humiditytarget", false, "mdi:tumble-dryer"));
    const tm = this._st("select.userselections_timemanagerlevel");
    if (tm && !/normal/i.test(tm)) pc.push(chip("Zeit", tm,
      "more|select." + P_ + "_userselections_timemanagerlevel", false, "mdi:timer-cog-outline"));
    if (delay > 0) pc.push(chip("Startvorwahl", fmtMin(delay),
      "more|number." + P_ + "_starttime", true, "mdi:clock-start"));

    // The *_userSelections_* switches only mirror the CHOSEN PROGRAM's options — the AEG
    // cloud API does not apply them as standalone writes (turn_on/toggle silently no-ops),
    // so present them read-only: tap opens more-info. uiLockMode IS a real writable switch.
    const opt = (label, suf, icon, writable) =>
      chip(label, null, (writable ? "tgl|" : "more|") + this._id(suf), this._st(suf) === "on", icon);
    const oc = [
      opt("Vorwäsche", "switch.userselections_prewashphase", "mdi:water-plus-outline"),
      opt("Flecken", "switch.userselections_stain", "mdi:liquid-spot"),
      opt("Eco", "switch.userselections_wmeconomy", "mdi:leaf"),
      opt("Nachtprogramm", "switch.userselections_nightcycle", "mdi:weather-night"),
      opt("Knitterschutz", "switch.userselections_anticreasenosteam", "mdi:iron-outline"),
      opt("Spülstopp", "switch.userselections_rinsehold", "mdi:pause-octagon-outline"),
      opt("Trocknen", "switch.userselections_drymode", "mdi:tumble-dryer"),
      opt("Kindersicherung", "switch.uilockmode", "mdi:lock", true),
    ];
    const xr = this._st("select.defaultextrarinse");
    if (xr) oc.push(chip("Extra-Spülen", /off/i.test(xr) ? "aus" : (xr.replace(/extra rinse/i, "").trim() || "an"),
      "more|select." + P_ + "_defaultextrarinse", !/off/i.test(xr), "mdi:water-sync"));

    // context-aware command buttons
    const B = (label, icon, tap, primary, disabled) =>
      `<button class="cmd${primary ? " primary" : ""}" data-tap="${tap}"${disabled ? " disabled" : ""}>` +
      `<ha-icon icon="${icon}"></ha-icon>${label}</button>`;
    const cmds = [];
    if (off) {
      cmds.push(B("Einschalten", "mdi:power", "press|button." + P_ + "_executecommand_8", true));
    } else {
      if (running) cmds.push(B("Pause", "mdi:pause", "press|button." + P_ + "_executecommand_9", true));
      else if (paused) {
        cmds.push(B("Fortsetzen", "mdi:play", "press|button." + P_ + "_executecommand_10", true));
        cmds.push(B("Stopp", "mdi:stop", "press|button." + P_ + "_executecommand_12", false));
      } else if (!done) {
        cmds.push(B("Start", "mdi:play", "press|button." + P_ + "_executecommand_11", true, doorOpen || rcBlocked));
      }
      cmds.push(B("Ausschalten", "mdi:power", "press|button." + P_ + "_executecommand_7", false));
    }

    // lifetime footer
    const f = (suf) => { const v = this._n("sensor." + suf); return v == null ? "–" : Math.round(v); };
    const wt = this._n("sensor.appliancetotalworkingtime");
    const load = this._n("sensor.measuredloadweight");
    const foot = [];
    if (running && load != null && load < 60000) foot.push("Beladung ~" + (load / 1000).toFixed(1).replace(".", ",") + " kg");
    foot.push("Zyklen " + f("totalcyclecounter"));
    foot.push("Waschen " + f("totalwashcyclescount"));
    foot.push("Trocknen " + f("totaldrycyclescount"));
    foot.push("Wasch-Trocknen " + f("totalwashdrycyclescount"));
    if (wt != null) foot.push("Betrieb " + Math.round(wt / 60) + " h");

    this.$("cmds").innerHTML = cmds.join("");
    this.$("panel").innerHTML =
      `<div class="sec">Programm</div><div class="row">${pc.join("")}</div>` +
      `<div class="sec">Optionen <span class="hint">· vom Programm gesetzt, am Gerät änderbar</span></div>` +
      `<div class="row">${oc.join("")}</div>` +
      `<div class="foot">${foot.map((x) => `<span>${x}</span>`).join("")}</div>`;
  }
}

/* ---- visual editor ---- */
class AegWaschtrocknerCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        title: "Titel (optional)",
        prefix: "Entity-Präfix (Standard: aeg_waschtrockner)",
        image: "Bild-URL – ersetzt die Illustration (optional)",
      }[s.name] || s.name);
      this._form.addEventListener("value-changed", (e) => {
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: e.detail.value }, bubbles: true, composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "title", selector: { text: {} } },
      { name: "prefix", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("aeg-waschtrockner-card-editor", AegWaschtrocknerCardEditor);

customElements.define("aeg-waschtrockner-card", AegWaschtrocknerCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "aeg-waschtrockner-card",
  name: "AEG Waschtrockner",
  description: "AEG 9000 Series Waschtrockner – Status, Programm, Steuerung",
  preview: false,
});
