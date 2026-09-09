/* Select-Button card (custom:select-button-card)
 *   A push-button tile: tapping the whole card selects one fixed option of a
 *   `select` entity (`select.select_option`). The round icon badge lights up in
 *   the active colour while that option is the one currently selected.
 *   Layout & sizing follow Home Assistant's built-in tile card.
 *
 *   - `entity`  (required): the target `select` entity.
 *   - `option`  (required): the option this button activates. Chosen from a
 *     dropdown of the entity's options in the graphical editor (free text too).
 *   - `name`   : card label. Falls back to the entity's friendly name.
 *   - `icon`   : mdi icon. Falls back to the entity icon, then a button icon.
 *   - `color`  : active colour — an HA theme colour name (`amber`, `blue`,
 *     `primary`, …) or any CSS colour / `#hex`. Default: HA's active-state amber.
 *   - `language`: "auto" (follows HA) | "de" | "en" — affects editor labels and
 *     the "entity not found" notice only.
 *   Tap = select the option. Hold = open the entity's more-info dialog.
 * Code comments English; user-facing strings in localization/{de,en}.js.
 *
 * config:
 *   type: custom:select-button-card
 *   entity: select.wohnzimmer_szene
 *   option: "Filmabend"
 *   name: "Filmabend"          # optional
 *   icon: mdi:movie-open        # optional
 *   color: amber               # optional
 *   language: auto             # optional
 */

// User-facing strings live in localization/{de,en}.js (one entry per card type).
// `npm run build` inlines the slice for this card; the imports are the source of truth.
import DE from "../localization/de.js";
import EN from "../localization/en.js";
const I18N = { de: DE["select-button-card"], en: EN["select-button-card"] };

const STYLE = `
:host{--sbc-color:var(--state-active-color, var(--amber-color, #ffa726));--sbc-off:var(--state-inactive-color, #7a7a7a);display:block}
ha-card{
  padding:10px;display:flex;align-items:center;gap:12px;
  cursor:pointer;-webkit-tap-highlight-color:transparent;
  transition:transform .12s ease, box-shadow .15s ease;
}
ha-card:focus-visible{outline:2px solid var(--sbc-color);outline-offset:2px}
ha-card:active{transform:scale(.98)}
:host(.invalid) ha-card{border:1px dashed var(--warning-color, #ff9800)}
.icon{
  flex:0 0 auto;width:40px;height:40px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:color-mix(in srgb, var(--sbc-off) 20%, transparent);
  color:var(--sbc-off);
  transition:background .2s ease, color .2s ease;
}
.icon.active{
  background:color-mix(in srgb, var(--sbc-color) 20%, transparent);
  color:var(--sbc-color);
}
.icon ha-icon{--mdc-icon-size:24px}
.txt{flex:1;min-width:0;display:flex;flex-direction:column}
.name{
  font-weight:500;font-size:.95rem;line-height:1.3;color:var(--primary-text-color);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.name.warn{color:var(--warning-color, #ff9800);font-weight:400;font-size:.9rem;white-space:normal}
`;

class SelectButtonCard extends HTMLElement {
  static getStubConfig(hass) {
    const sel = hass && Object.keys(hass.states).find((e) => e.startsWith("select."));
    const opts = sel && hass.states[sel].attributes.options;
    return { entity: sel || "select.example", option: (opts && opts[0]) || "" };
  }
  static getConfigElement() { return document.createElement("select-button-card-editor"); }

  setConfig(c) {
    this._cfg = Object.assign({ language: "auto" }, c || {});
  }
  getCardSize() { return 1; }
  set hass(h) { this._hass = h; if (!this.shadowRoot) this._build(); this._render(); }

  _lang() {
    const c = (this._cfg && this._cfg.language) || "auto";
    if (c === "de" || c === "en") return c;
    const hl = (this._hass && this._hass.language || "").toLowerCase();
    return hl.startsWith("de") ? "de" : "en";
  }
  _L() { return I18N[this._lang()] || I18N.de; }

  /* Resolve a config colour to a CSS value: HA theme colour name -> var(--<name>-color),
   * anything else (hex, rgb(), a CSS var) is passed through literally. */
  _colorCss(v) {
    if (!v) return "var(--state-active-color, var(--amber-color, #ffa726))";
    return /^[a-z]+(-[a-z]+)*$/.test(v) ? `var(--${v}-color, ${v})` : v;
  }

  _moreInfo(id) {
    if (!id) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: id }, bubbles: true, composed: true,
    }));
  }
  _press() {
    const c = this._cfg;
    if (!this._hass || !c.entity || !c.option) return;
    if (!this._hass.states[c.entity]) return;
    // light haptic on supported frontends (mobile app / companion)
    this.dispatchEvent(new CustomEvent("haptic", { detail: "light", bubbles: true, composed: true }));
    this._hass.callService("select", "select_option", { entity_id: c.entity, option: c.option });
  }

  _build() {
    const r = this.attachShadow({ mode: "open" });
    r.innerHTML = `<style>${STYLE}</style>
<ha-card id="card" role="button" tabindex="0">
 <div class="icon" id="icon"><ha-icon id="ic" icon="mdi:gesture-tap-button"></ha-icon></div>
 <div class="txt"><span class="name" id="name"></span></div>
</ha-card>`;
    this.$ = (id) => r.getElementById(id);

    const card = this.$("card");
    let holdTimer = null;
    let held = false;
    const clear = () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
    card.addEventListener("pointerdown", () => {
      held = false;
      clear();
      holdTimer = setTimeout(() => { held = true; this._moreInfo(this._cfg.entity); }, 500);
    });
    card.addEventListener("pointerup", () => { clear(); if (!held) this._press(); });
    card.addEventListener("pointerleave", clear);
    card.addEventListener("pointercancel", clear);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._press(); }
    });
  }

  _render() {
    if (!this.shadowRoot || !this._hass) return;
    const c = this._cfg;
    const L = this._L();
    this.style.setProperty("--sbc-color", this._colorCss(c.color));

    const st = c.entity && this._hass.states[c.entity];
    const nameEl = this.$("name");
    const iconWrap = this.$("icon");
    const iconEl = this.$("ic");

    if (!st) {
      nameEl.textContent = L.not_found(c.entity || "—");
      nameEl.classList.add("warn");
      iconWrap.classList.remove("active");
      iconEl.setAttribute("icon", "mdi:alert-circle-outline");
      this.classList.remove("invalid");
      this.$("card").removeAttribute("title");
      return;
    }

    nameEl.classList.remove("warn");
    const name = c.name || st.attributes.friendly_name || c.entity;
    nameEl.textContent = name;

    const active = c.option != null && st.state === c.option;
    iconWrap.classList.toggle("active", active);

    const icon = c.icon || st.attributes.icon || "mdi:gesture-tap-button";
    iconEl.setAttribute("icon", icon);

    const opts = st.attributes.options || [];
    const invalid = !!c.option && opts.length > 0 && !opts.includes(c.option);
    this.classList.toggle("invalid", invalid);
    this.$("card").title = invalid ? L.opt_missing(c.option) : name;
  }
}

/* ---- visual editor ---- */
class SelectButtonCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _L() {
    const c = (this._config && this._config.language) || "auto";
    if (c === "de" || c === "en") return I18N[c];
    const hl = (this._hass && this._hass.language || "").toLowerCase();
    return hl.startsWith("de") ? I18N.de : I18N.en;
  }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => {
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: ev.detail.value }, bubbles: true, composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    const L = this._L();
    const st = this._config.entity && this._hass.states[this._config.entity];
    const opts = (st && st.attributes && st.attributes.options) || [];
    // Offer the entity's live options as a dropdown (free text still allowed);
    // fall back to a plain text field until an entity is picked.
    const optionSelector = opts.length
      ? { select: { mode: "dropdown", custom_value: true, options: opts.map((o) => ({ value: o, label: o })) } }
      : { text: {} };

    this._form.computeLabel = (s) => ({
      entity: L.e_entity, option: L.e_option, name: L.e_name,
      icon: L.e_icon, color: L.e_color, language: L.e_language,
    }[s.name] || s.name);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "entity", selector: { entity: { domain: "select" } } },
      { name: "option", selector: optionSelector },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "color", selector: { ui_color: {} } },
      { name: "language", selector: { select: { mode: "dropdown", options: [
        { value: "auto", label: L.e_auto }, { value: "de", label: L.e_de }, { value: "en", label: L.e_en },
      ] } } },
    ];
    this._form.data = this._config;
  }
}
customElements.define("select-button-card-editor", SelectButtonCardEditor);

customElements.define("select-button-card", SelectButtonCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "select-button-card",
  name: "Select Button",
  description: "Push-button tile that activates one fixed option of a select entity; icon lights up while that option is active. DE/EN.",
  preview: false,
});
