# HA Lovelace Cards (Ring)

Eight vanilla‑JS custom Lovelace cards (no framework, each with a visual editor):

- **`custom:star-projector-card`** / **`custom:star-projector-popup-card`** – smart star
  projector (inline‑collapse vs. modal popup; the popup variant makes every entity a
  selectable editor field).
- **`custom:wz-tv-card`** – compact TV hub (power, remotes, HDMI input, Hue Sync Box, Sonos).
- **`custom:wz-motion-card`** – motion/presence panel with per‑sensor live dot + enable
  toggle.
- **`custom:aeg-waschtrockner-card`** – AEG 9000 washer‑dryer (`electrolux_status`).
- **`custom:bosch-dishwasher-card`** – "non‑smart" dishwasher driven by one `input_boolean`.
- **`custom:roborock-s7-card`** – map, controls, area cleaning via `vacuum.clean_area`.
- **`custom:dreame-h14-card`** – hand‑pushed wet/dry vacuum, tank alerts, dock actions.

All cards collapse to a compact header by default. UI text is German.

**These cards ship with default entity IDs from one specific setup — change them in each
card's editor.** After download, hard‑refresh the browser and add the cards from the picker.

Full docs & per‑card config: see the repository README.
