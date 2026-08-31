/* Bosch "Super Silence" dishwasher card
 * Non-smart machine: driven by a single input_boolean that represents running/idle
 * (default input_boolean.livingdining_dishwasher). Elapsed time comes from the
 * boolean's last_changed; remaining time is estimated from a configurable cycle
 * length. Visual style matches custom:aeg-waschtrockner-card.
 * User-facing strings are German; code comments are English.
 *
 * Collapsed by default: only the illustration + the main start/stop button show.
 * The chevron reveals the footer details. Collapsed height is fixed so all four
 * Reinigung-subview cards line up.
 *
 * config:
 *   type: custom:bosch-dishwasher-card
 *   entity: input_boolean.livingdining_dishwasher   # the on/off helper (default)
 *   cycle_minutes: 195                              # assumed program length for the estimate
 *   image: /local/bosch_dishwasher.png             # optional photo, replaces the illustration
 *   title: "Bosch Super Silence"                    # optional
 */

const STYLE = `
:host{--acc:var(--primary-color);display:block}
ha-card{padding:14px 14px 10px;overflow:hidden}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ttl{display:flex;align-items:baseline;gap:8px;min-width:0}
.brand{font-weight:800;letter-spacing:.16em;font-size:20px;color:var(--primary-text-color)}
.model{font-size:11px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.09em;white-space:nowrap}
.hstat{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--secondary-text-color);flex:0 0 auto}
.db{border:1px solid var(--divider-color);border-radius:10px;padding:1px 7px;font-size:11px;font-weight:700}
.stage{position:relative;display:flex;gap:16px;align-items:center;padding:10px 4px 14px}
.stage svg,.photo{width:44%;max-width:200px;height:auto;flex:0 0 auto;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18))}
.photo{border-radius:12px;object-fit:contain}
.status{flex:1;min-width:0}
.big{font-size:26px;font-weight:800;line-height:1.05;color:var(--primary-text-color)}
.phase{margin-top:3px;font-size:12.5px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:.07em;min-height:15px}
.count{margin-top:8px;font-size:30px;font-weight:800;font-variant-numeric:tabular-nums;color:var(--primary-text-color);min-height:20px}
.finish{font-size:12px;color:var(--secondary-text-color);min-height:14px}
.bar{margin-top:10px;height:6px;border-radius:6px;background:var(--divider-color);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--acc);border-radius:6px;transition:width .8s ease}
.cmds{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.cmd{flex:1 1 160px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:13px;padding:12px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer;background:var(--divider-color);color:var(--primary-text-color)}
.cmd ha-icon{--mdc-icon-size:19px}
.cmd.primary{background:var(--acc);color:#fff}
.foot{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:11px;color:var(--secondary-text-color);border-top:1px solid var(--divider-color);padding-top:8px;margin-top:2px}
.warn{padding:18px;color:var(--secondary-text-color);font-size:13px;text-align:center}
#steam{opacity:0;transition:opacity .6s}
.stage.run #steam{opacity:.75;animation:bdrise 3s ease-in-out infinite}
@keyframes bdrise{0%{opacity:.1}50%{opacity:.75}100%{opacity:.1}}
#redlight{opacity:0;transition:opacity .5s}
.stage.run #redlight{opacity:1;animation:bdpulse 2.6s ease-in-out infinite}
.stage.done #redlight{opacity:.35}
@keyframes bdpulse{0%,100%{opacity:.55}50%{opacity:1}}
#svgfill{fill:var(--acc);transition:width .8s ease}

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
@media(max-width:480px){.stage{flex-direction:column;text-align:center}.stage svg,.photo{width:60%}.bar{max-width:280px;margin-left:auto;margin-right:auto}}
`;

const MACHINE_SVG = `
<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bosch Super Silence Spülmaschine">
 <defs>
  <linearGradient id="bdbody" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stop-color="#eceef1"/><stop offset=".5" stop-color="#c9ccd1"/><stop offset="1" stop-color="#dee0e4"/>
  </linearGradient>
  <radialGradient id="bdglow"><stop offset="0" stop-color="#ff3030" stop-opacity="0.85"/><stop offset="1" stop-color="#ff3030" stop-opacity="0"/></radialGradient>
 </defs>
 <rect x="12" y="8" width="176" height="224" rx="10" fill="url(#bdbody)" stroke="#a9adb4" stroke-width="2"/>
 <g stroke="#ffffff" stroke-opacity="0.35" stroke-width="1">
  <line x1="22" y1="78" x2="178" y2="78"/><line x1="22" y1="112" x2="178" y2="112"/>
  <line x1="22" y1="150" x2="178" y2="150"/><line x1="22" y1="188" x2="178" y2="188"/><line x1="22" y1="214" x2="178" y2="214"/>
 </g>
 <rect x="12" y="8" width="176" height="32" rx="10" fill="#26292e"/>
 <rect x="12" y="24" width="176" height="16" fill="#26292e"/>
 <text x="26" y="29" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="800" letter-spacing="1.6" fill="#eef0f2">BOSCH</text>
 <rect x="120" y="14" width="58" height="18" rx="3" fill="#08201e"/>
 <text id="svg-disp" x="149" y="27" text-anchor="middle" font-family="'Courier New',monospace" font-size="11" font-weight="700" fill="#39e0c8">--:--</text>
 <rect x="42" y="52" width="116" height="10" rx="5" fill="#b7bbc1" stroke="#9297a0"/>
 <rect x="30" y="70" width="140" height="6" rx="3" fill="#c7cace"/>
 <rect id="svgfill" x="30" y="70" width="0" height="6" rx="3" fill="var(--acc)"/>
 <circle cx="100" cy="140" r="17" fill="none" stroke="#c4c7cc" stroke-width="2" opacity="0.55"/>
 <g id="steam" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.8">
  <path d="M150 48 q-7 -9 0 -18 q7 -9 0 -18"/>
  <path d="M163 48 q-7 -9 0 -18 q7 -9 0 -18"/>
 </g>
 <rect x="26" y="232" width="16" height="8" rx="2" fill="#9297a0"/>
 <rect x="158" y="232" width="16" height="8" rx="2" fill="#9297a0"/>
 <g id="redlight">
  <ellipse cx="100" cy="246" rx="34" ry="7" fill="url(#bdglow)"/>
  <ellipse cx="100" cy="246" rx="4" ry="2" fill="#ff4d4d"/>
 </g>
</svg>`;

function fmtMin(min) {
  const m = Math.max(0, Math.round(min));
  if (m === 0) return "0 Min";
  if (m < 60) return m + " Min";
  return Math.floor(m / 60) + " Std " + String(m % 60).padStart(2, "0") + " Min";
}
function hhmm(d) {
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
function whenLabel(d) {
  const n = new Date();
  const midnight = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.round((midnight(n) - midnight(d)) / 86400000);
  const t = hhmm(d);
  if (dayDiff <= 0) return "heute " + t;
  if (dayDiff === 1) return "gestern " + t;
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" }) + " " + t;
}

class BoschDishwasherCard extends HTMLElement {
  static getStubConfig() { return { entity: "input_boolean.livingdining_dishwasher" }; }
  static getConfigElement() { return document.createElement("bosch-dishwasher-card-editor"); }
  setConfig(c) {
    this._cfg = Object.assign(
      { entity: "input_boolean.livingdining_dishwasher", cycle_minutes: 195 },
      c || {}
    );
    this._cycle = Math.max(10, Number(this._cfg.cycle_minutes) || 195);
    this._open = false;
  }
  getCardSize() { return 7; }
  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) this._build();
    this._render();
    // keep the elapsed clock ticking while running, without waiting for a hass update
    if (!this._timer) this._timer = setInterval(() => this._render(), 30000);
  }
  disconnectedCallback() { if (this._timer) { clearInterval(this._timer); this._timer = null; } }

  _e() { return this._hass && this._hass.states[this._cfg.entity]; }
  _mi(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }

  _toggle() {
    this._open = !this._open;
    this.$("more").hidden = !this._open;
    this.$("disc").classList.toggle("open", this._open);
    this.classList.toggle("collapsed", !this._open);
    this.$("discTxt").textContent = this._open ? "Weniger" : "Details";
  }

  _build() {
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card>
 <div class="hdr">
  <div class="ttl"><span class="brand">BOSCH</span><span class="model" id="model">Super Silence</span></div>
  <div class="hstat"><span class="db">≈ 44 dB</span></div>
 </div>
 <div class="stage" id="stage">
  ${this._cfg.image ? `<img class="photo" src="${this._cfg.image}" alt="Bosch Super Silence">` : MACHINE_SVG}
  <div class="status">
   <div class="big" id="big">–</div>
   <div class="phase" id="phase"></div>
   <div class="count" id="count"></div>
   <div class="finish" id="finish"></div>
   <div class="bar"><i id="fill"></i></div>
  </div>
 </div>
 <div class="cmds mainrow" id="cmds"></div>
 <button class="disc" id="disc" type="button"><span id="discTxt">Details</span><ha-icon icon="mdi:chevron-down"></ha-icon></button>
 <div class="more" id="more" hidden>
  <div class="foot" id="foot"></div>
 </div>
</ha-card>`;
    this.$ = (id) => r.getElementById(id);
    this.classList.add("collapsed");
    this.$("stage").addEventListener("click", () => this._mi(this._cfg.entity));
    this.$("disc").addEventListener("click", () => this._toggle());
    this.$("cmds").addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      this._hass.callService("input_boolean", b.dataset.act, { entity_id: this._cfg.entity });
    });
  }

  _render() {
    if (!this.shadowRoot) return;
    const e = this._e();
    if (!e) {
      this.$("more").innerHTML = `<div class="warn">Entität <b>${this._cfg.entity}</b> nicht gefunden.</div>`;
      this.$("more").hidden = false;
      this.classList.remove("collapsed");
      return;
    }
    if (this.$("model")) this.$("model").textContent = this._cfg.title || "Super Silence";
    const running = e.state === "on";
    const lc = new Date(e.last_changed);
    const sinceMin = (Date.now() - lc.getTime()) / 60000;
    const elapsed = running ? sinceMin : 0;
    const remaining = Math.max(0, this._cycle - elapsed);
    const overdue = running && elapsed > this._cycle + 10;
    const recentlyDone = !running && sinceMin < 240; // "Fertig" look for 4 h after it stops

    const acc = overdue || recentlyDone ? "#22c55e" : running ? "#0aa3a3" : "var(--disabled-text-color)";
    this.style.setProperty("--acc", acc);
    this.$("stage").className = "stage" + (running ? " run" : recentlyDone ? " done" : "");

    // status text
    this.$("big").textContent = running ? (overdue ? "Fertig?" : "Läuft") : recentlyDone ? "Fertig" : "Aus";
    this.$("phase").textContent = running
      ? (overdue ? "Bitte ausräumen" : "Super Silence")
      : recentlyDone ? "Bitte ausräumen" : "";

    let count = "", finish = "";
    if (running) {
      count = fmtMin(elapsed);
      finish = overdue
        ? "seit " + fmtMin(elapsed - this._cycle) + " überfällig"
        : "≈ fertig um " + hhmm(new Date(lc.getTime() + this._cycle * 60000));
    } else if (recentlyDone) {
      finish = "gelaufen bis " + hhmm(lc);
    } else {
      finish = "zuletzt: " + whenLabel(lc);
    }
    this.$("count").textContent = count;
    this.$("finish").textContent = finish;

    // progress
    let prog = overdue || recentlyDone ? 1 : running ? elapsed / this._cycle : 0;
    prog = Math.max(0, Math.min(1, prog));
    this.$("fill").style.width = (prog * 100).toFixed(1) + "%";
    const sf = this.$("svgfill"); if (sf) sf.setAttribute("width", (prog * 140).toFixed(1));
    const disp = this.$("svg-disp");
    if (disp) disp.textContent = running
      ? (overdue ? "FERTIG" : Math.floor(remaining / 60) + ":" + String(Math.round(remaining % 60)).padStart(2, "0"))
      : (recentlyDone ? "FERTIG" : "--:--");

    // action button (the boolean is the only control on a non-smart machine).
    // Only rebuild when the state flips, so a background hass update can't replace
    // the button between pointer-down and click and swallow the tap.
    const cmdKey = running ? "on" : "off";
    if (cmdKey !== this._cmdKey) {
      this._cmdKey = cmdKey;
      this.$("cmds").innerHTML = running
        ? `<button class="cmd primary" data-act="turn_off"><ha-icon icon="mdi:check"></ha-icon>Als fertig markieren</button>`
        : `<button class="cmd primary" data-act="turn_on"><ha-icon icon="mdi:play"></ha-icon>Als gestartet markieren</button>`;
    }

    // footer
    const foot = [
      running ? "Gestartet " + hhmm(lc) : "Zuletzt " + whenLabel(lc),
      "Angenommene Laufzeit " + fmtMin(this._cycle),
      "Super Silence · Eco",
    ];
    const footHtml = foot.map((x) => `<span>${x}</span>`).join("");
    if (footHtml !== this._footHtml) { this._footHtml = footHtml; this.$("foot").innerHTML = footHtml; }
  }
}

/* ---- visual editor ---- */
class BoschDishwasherCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        entity: "Ein/Aus-Helfer (input_boolean)",
        cycle_minutes: "Angenommene Programmdauer (Min)",
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
      { name: "entity", selector: { entity: { domain: "input_boolean" } } },
      { name: "cycle_minutes", selector: { number: { min: 30, max: 360, step: 5, mode: "box", unit_of_measurement: "min" } } },
      { name: "title", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("bosch-dishwasher-card-editor", BoschDishwasherCardEditor);

customElements.define("bosch-dishwasher-card", BoschDishwasherCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "bosch-dishwasher-card",
  name: "Bosch Spülmaschine",
  description: "Bosch Super Silence – Status, Laufzeit-Schätzung, Fertig-Anzeige (nur input_boolean)",
  preview: false,
});
