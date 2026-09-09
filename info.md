# HA Lovelace Cards (Ring)

Nine vanilla‑JS custom Lovelace cards (no framework, each with a visual editor):

- **`custom:star-projector-card`** – smart star projector; controls as a modal popup
  or an inline dropdown (`mode`), every entity a selectable editor field.
- **`custom:wz-tv-card`** – compact TV hub (power, 1–4 remotes, 1–4 HDMI chips, Hue Sync Box
  with a labelled Sync button, 1–4 Sonos sound toggles).
- **`custom:wz-motion-card`** – motion/presence panel with an add/remove list of per‑sensor
  live dot + enable toggle.
- **`custom:aeg-waschtrockner-card`** – AEG 9000 washer‑dryer (`electrolux_status`).
- **`custom:bosch-dishwasher-card`** – "non‑smart" dishwasher driven by one `input_boolean`.
- **`custom:roborock-s7-card`** – map, controls, area cleaning via `vacuum.clean_area`.
- **`custom:dreame-h14-card`** – hand‑pushed wet/dry vacuum, tank alerts, dock actions.
- **`custom:shutter-automation-card`** – sun/azimuth/temp/brightness shading automation with
  editable thresholds and manual close/open scripts.
- **`custom:select-button-card`** – tile‑style push button that activates one fixed option of
  a `select` entity; the icon lights up while that option is active.

Every card takes `language` (`auto` / `de` / `en`); all but `select-button-card` also take
`mode` (`popup` / `dropdown`). UI text is bilingual German/English; `auto` follows the HA UI
language.

**These cards ship with default entity IDs from one specific setup — change them in each
card's editor.** After download, hard‑refresh the browser and add the cards from the picker.

Full docs & per‑card config: see the repository README.
