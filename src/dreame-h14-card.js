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
`;

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

function fmtDur(sec) {
  const m = Math.round((Number(sec) || 0) / 60);
  if (m <= 0) return "0 Min";
  if (m < 60) return m + " Min";
  return Math.floor(m / 60) + " Std " + String(m % 60).padStart(2, "0") + " Min";
}
function tstamp(iso) {
  if (!iso || iso === "unknown" || iso === "unavailable") return "–";
  const d = new Date(iso); if (isNaN(d)) return String(iso);
  const t = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  const md = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dd = Math.round((md(new Date()) - md(d)) / 86400000);
  if (dd <= 0) return "heute " + t;
  if (dd === 1) return "gestern " + t;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) + " " + t;
}
function statusDE(fr) {
  const s = (fr || "").toLowerCase();
  if (!s || s === "unknown" || s === "unavailable") return "–";
  if (/erreur|error|fault/.test(s)) return "Fehler";
  if (/charge|charg/.test(s)) return "Lädt";
  if (/auto.?net|automatique|self.?clean/.test(s)) return "Selbstreinigung";
  if (/s[ée]cha|drying|dry/.test(s)) return "Trocknung";
  if (/pause/.test(s)) return "Pausiert";
  if (/nettoy|clean|aspir/.test(s)) return "Reinigt";
  if (/veille|repos|standby|idle|pr[êe]t/.test(s)) return "Bereit";
  return fr;
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
    this._cfg = Object.assign({ prefix: "h14_pro" }, c || {});
    this._p = this._cfg.prefix;
    this._open = false;
  }
  getCardSize() { return 15; }

  _toggle() {
    this._open = !this._open;
    this.$("more").hidden = !this._open;
    this.$("disc").classList.toggle("open", this._open);
    this.classList.toggle("collapsed", !this._open);
    this.$("discTxt").textContent = this._open ? "Weniger" : "Tanks & Einstellungen";
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
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hdr">
  <div class="ttl"><span class="brand">DREAME</span><span class="model" id="model">H14 Pro</span></div>
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
 <button class="disc" id="disc" type="button"><span id="discTxt">Tanks &amp; Einstellungen</span><ha-icon icon="mdi:chevron-down"></ha-icon></button>
 <div class="more" id="more" hidden><div id="body"></div></div>
</ha-card>`;
    this.$ = (id) => r.getElementById(id);
    this.classList.add("collapsed");
    this.$("stage").addEventListener("click", () => this._mi(this._id("sensor", "status")));
    this.$("disc").addEventListener("click", () => this._toggle());
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
      this.$("body").innerHTML = `<div class="warn">Keine <b>${this._p}*</b>-Entitäten gefunden.</div>`;
      this.$("more").hidden = false;
      this.classList.remove("collapsed");
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

    this.$("model").textContent = this._cfg.title || "H14 Pro";
    const rawStatus = this._st("sensor", "status") || "";
    const label = statusDE(rawStatus);
    const charging = this._bool("binary_sensor", "charging");
    const online = this._bool("binary_sensor", "online");
    const cleaning = label === "Reinigt" || label === "Pausiert";
    const drying = label === "Trocknung" || label === "Selbstreinigung";
    const errCode = this._st("sensor", "error_codes");
    const warnCode = this._st("sensor", "warnings");
    const hasErr = errCode && !["0", "none", "unknown", "unavailable", ""].includes(String(errCode).toLowerCase());

    const acc = hasErr ? "#ef4444" : cleaning ? "#22c55e" : drying ? "#ffb020" : charging ? "#4f7cff" : "var(--disabled-text-color)";
    this.style.setProperty("--acc", acc);
    this.$("stage").className = "stage" + (cleaning ? " run" : "") + (drying ? " dry" : "") + (charging ? " charge" : "");

    // header
    this.$("dot").className = "dot" + (online ? " ok" : "");
    this.$("online").textContent = online ? "Verbunden" : "Offline";
    const pct = this._num("sensor", "battery");
    this.$("batt").textContent = pct == null ? "–" : Math.round(pct) + " %";
    this.$("batticon").setAttribute("icon", battIcon(pct, charging));

    // status block
    this.$("big").textContent = label;
    this.$("sub").textContent = charging && !cleaning && !drying ? "an der Ladestation" : "";
    const lastDur = this._num("sensor", "last_clean_duration");
    this.$("meta").textContent = pct != null ? "Akku " + Math.round(pct) + " %" + (lastDur ? " · letzte Reinigung " + fmtDur(lastDur) : "") : "";
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
      A("Frischwasser leer", "binary_sensor", "clean_water_tank_empty"),
      A("Schmutzwasser voll", "binary_sensor", "dirty_water_tank_full"),
      A("Tank reinigen", "binary_sensor", "dirty_water_tank_needs_cleaning"),
      A("Tank fehlt", "binary_sensor", "dirty_water_tank_missing"),
      A("Waschmittel leer", "binary_sensor", "detergent_empty"),
      A("Selbstreinigung nötig", "binary_sensor", "self_cleaning_recommended_dirty_brush_tube"),
    ];
    const active = alerts.filter((x) => x.on);
    if (hasErr) active.unshift({ label: "Fehler " + errCode, on: true, id: this._id("sensor", "error_codes") });
    if (warnCode && !["0", "unknown", ""].includes(String(warnCode))) active.push({ label: "Warnung " + warnCode, on: true, id: this._id("sensor", "warnings") });
    const alertHtml = active.length
      ? active.map((x) => `<span class="al bad" data-act="more|${x.id}"><ha-icon icon="mdi:alert-circle"></ha-icon>${x.label}</span>`).join("")
      : `<span class="al" data-act="more|${this._id("sensor", "status")}"><ha-icon icon="mdi:check-circle"></ha-icon>Alles bereit</span>`;

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
      const map = { "Léger": "Leicht", "Équilibré": "Ausgewogen", "Fort": "Stark" };
      const pills = trac.attributes.options.map((o) =>
        `<button class="pill${cur === o ? " on" : ""}" data-act="sel|${this._id("select", "traction_force")}|${o}">${map[o] || o}</button>`).join("");
      tracRow = `<div class="segrow"><span class="seglbl">Traktion</span><span class="pills">${pills}</span></div>`;
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
    if (tc != null) foot.push("Reinigungen " + Math.round(tc));
    const lc = this._st("sensor", "last_clean");
    if (lc) foot.push("Zuletzt " + tstamp(lc));
    const tsc = this._num("sensor", "total_self_clean_time");
    if (tsc != null) foot.push("Selbstreinigung " + fmtDur(tsc));
    const tsd = this._num("sensor", "total_self_dry_time");
    if (tsd != null) foot.push("Trocknung " + fmtDur(tsd));

    this.$("cmds").innerHTML =
      `<button class="cmd primary" data-act="press|${this._id("button", "start_self_cleaning")}"><ha-icon icon="mdi:auto-fix"></ha-icon>Selbstreinigung</button>` +
      `<button class="cmd" data-act="press|${this._id("button", "start_self_drying")}"><ha-icon icon="mdi:weather-sunny"></ha-icon>Trocknung</button>`;
    this.$("body").innerHTML =
      `<div class="sec"><ha-icon icon="mdi:water-alert"></ha-icon>Tanks &amp; Wartung</div>` +
      `<div class="alerts">${alertHtml}</div>` +

      `<div class="sec"><ha-icon icon="mdi:tune"></ha-icon>Einstellungen</div>` +
      lvl("Saugkraft", "number", "suction_power_custom", ["Eco", "Standard", "Stark", "Turbo"]) +
      lvl("Wasserzufuhr", "number", "water_flow_custom", ["Niedrig", "Mittel", "Hoch", "Max"]) +
      lvl("Bürste", "number", "brush_speed_custom", ["Sanft", "Normal", "Kräftig", "Max"]) +
      tracRow +
      `<div class="chips">
        ${tog("Auto-Trocknung", "switch", "auto_drying", "mdi:weather-sunny")}
        ${tog("Auto-Spülen", "switch", "auto_rinse", "mdi:water-sync")}
        ${tog("Auto-Waschmittel", "switch", "auto_detergent_mixing", "mdi:bottle-tonic")}
        ${tog("Licht", "switch", "light", "mdi:lightbulb")}
       </div>` +

      `<div class="sec"><ha-icon icon="mdi:wrench-clock"></ha-icon>Verschleiß</div>` +
      wear("Filter", "sensor", "filter_hours_left", "mdi:air-filter") +
      wear("Rollbürste vorne", "sensor", "front_roller_brush_hours_left", "mdi:rotate-right") +
      wear("Rollbürste hinten", "sensor", "back_roller_brush_hours_left", "mdi:rotate-left") +

      (foot.length ? `<div class="foot">${foot.map((x) => `<span>${x}</span>`).join("")}</div>` : "");
  }
}

/* ---- visual editor ---- */
class DreameH14CardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        prefix: "Entity-Präfix (Standard: h14_pro)",
        title: "Titel (optional)",
        image: "Bild-URL – ersetzt die Illustration (optional)",
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

