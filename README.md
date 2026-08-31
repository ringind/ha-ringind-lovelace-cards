# HA Lovelace Cards (Ring)

A small collection of **vanilla JavaScript** custom Lovelace cards for Home Assistant —
no framework, no build tooling required to use them, each card self‑contained with its own
shadow DOM and a graphical editor (`ha-form`).

They were written for one specific Home Assistant instance, so **most cards ship with
default `entity_id`s that you will need to change** (in the card's visual editor or in YAML).
Every card exposes its entities as config options for exactly that reason.

| `type:` | Card | What it does |
|---|---|---|
| `custom:star-projector-card` | Sternenprojektor (kompakt) | Smart star projector — power + nebula/stars brightness, rotation speed, sleep timer. Collapses to the header; a chevron expands the controls inline. |
| `custom:star-projector-popup-card` | Sternenprojektor (Popup / Dropdown) | Same controls; `mode` (editor-choosable) shows them either in a **modal popup** (scaled like HA's more-info dialog, configurable overlay opacity) or as an inline **dropdown**. Every entity is an individually selectable field in the editor (no prefix). |
| `custom:wz-tv-card` | Wohnzimmer TV | Compact TV hub — power, three remote‑subview shortcuts, HDMI‑input selector, Hue Play Sync Box, Sonos night‑sound / speech‑enhancement, TV‑light scene. Collapsible. |
| `custom:wz-motion-card` | Bewegungssensoren | Motion/presence panel — master arm toggle, aggregate "any motion" banner, and per‑sensor live‑detection dot + enable toggle (target may be a `switch` or an `automation`). Collapsible. |
| `custom:aeg-waschtrockner-card` | AEG Waschtrockner | AEG 9000‑series washer‑dryer (`electrolux_status`) — animated illustration, cycle status/ETA, program & option chips, context‑aware start/pause/stop. Collapsible. |
| `custom:bosch-dishwasher-card` | Bosch Spülmaschine | "Non‑smart" dishwasher driven by a single `input_boolean` — elapsed time, estimated remaining, done state. Collapsible. |
| `custom:roborock-s7-card` | Roborock S7 MaxV | Live map image, start/pause/stop/dock/locate, **area cleaning** via `vacuum.clean_area`, fan speed, mop settings, status & lifetime stats. Collapsible. |
| `custom:dreame-h14-card` | Dreame H14 Pro | Hand‑pushed wet/dry vacuum — tank/consumable alerts, the two dock actions, suction/water/brush levels, wear counters. Collapsible. |

All user‑facing strings are German; all code comments are English.

---

## Installation

### Option A — HACS (custom repository)

This repository is **not** in the default HACS store, so you add it as a custom repository.

1. In Home Assistant open **HACS**.
2. Top‑right **⋮ → Custom repositories**.
3. **Repository:** the URL of this repo, e.g. `https://github.com/<you>/ha-lovelace-cards`
   **Type / Category:** `Dashboard` (a.k.a. *Lovelace* / *plugin*).
   Click **Add**.
4. Find **"HA Lovelace Cards (Ring)"** in the HACS list, open it, click **Download**, confirm.
5. HACS copies the bundle to `config/www/community/ha-lovelace-cards/ha-lovelace-cards.js`
   and, on a default (Storage/UI‑managed) dashboard setup, **registers the Lovelace resource
   for you**. If it does not (YAML‑mode dashboards), add it manually — see
   [*Register the resource*](#register-the-resource) below.
6. **Reload the browser** (Ctrl/Cmd‑Shift‑R). The cards now appear in the dashboard card
   picker ("Sternenprojektor", "Wohnzimmer TV", …).

Updating later: HACS shows an update on the repo; click **Update** and hard‑refresh.

### Option B — Manual

1. Copy `ha-lovelace-cards.js` (the file at the repo root — it is the built bundle of all
   `src/*.js`) into `config/www/` on your Home Assistant machine, e.g.
   `config/www/ha-lovelace-cards.js`.
2. Register the resource (below), pointing at `/local/ha-lovelace-cards.js`.
3. Hard‑refresh the browser.

### Register the resource

Only needed if HACS did not do it automatically, or for manual install.

**UI (Storage mode):** *Settings → Dashboards → ⋮ → Resources → + Add resource*
- **URL:** `/hacsfiles/ha-lovelace-cards/ha-lovelace-cards.js` (HACS)
  or `/local/ha-lovelace-cards.js` (manual)
- **Resource type:** `JavaScript Module`

**YAML mode** (`configuration.yaml` / `ui-lovelace.yaml`):

```yaml
lovelace:
  mode: yaml            # or storage
  resources:
    - url: /hacsfiles/ha-lovelace-cards/ha-lovelace-cards.js
      type: module
```

---

## Using the cards

Add via the dashboard **card picker** (each card has a visual editor), or in YAML. Minimal
examples below — open the card's editor to point every entity at your own.

### `custom:star-projector-card`

```yaml
type: custom:star-projector-card
prefix: smart_star_projector   # entity-id prefix; entities are derived as:
                               #   switch.<prefix>_master
                               #   light.<prefix>_background   (Nebel)
                               #   light.<prefix>_laser        (Sterne)
                               #   number.<prefix>_star_rotation_speed
                               #   time.<prefix>_timer
title: Sternenprojektor        # optional
```

| Option | Default | Notes |
|---|---|---|
| `prefix` | `smart_star_projector` | Used to build all five entity ids. |
| `title` | `Sternenprojektor` | Header label. |

Collapsed by default → shows only the header (title + power button). The chevron expands the
Nebel / Sterne / Rotation / Timer rows inline.

### `custom:star-projector-popup-card`

```yaml
type: custom:star-projector-popup-card
title: Sternenprojektor
mode: popup             # "popup" (default) or "dropdown"
overlay_opacity: 100    # popup only — 0..100, modal scrim opacity (default 100 = opaque)
power: switch.smart_star_projector_master
nebula: light.smart_star_projector_background
stars: light.smart_star_projector_laser
rotation: number.smart_star_projector_star_rotation_speed
timer: time.smart_star_projector_timer
```

| Option | Default | Notes |
|---|---|---|
| `title` | `Sternenprojektor` | Header + popup title. |
| `mode` | `popup` | `popup` = modal `<dialog>` scaled/styled like HA's more‑info dialog (desktop `min(500px, 100vw−32px)`, 28px radius; full‑screen below `max-width:450px` / `max-height:500px`; rem typography). `dropdown` = inline expand/collapse under the header (chevron), like the base card. Editor field: **Anzeige**. |
| `overlay_opacity` | `100` | Popup mode only — opacity of the modal overlay/scrim, `0`–`100` %. Editor field: slider. |
| `power` | `switch.smart_star_projector_master` | Any toggleable entity. |
| `nebula` | `light.smart_star_projector_background` | Brightness + color. |
| `stars` | `light.smart_star_projector_laser` | Brightness. |
| `rotation` | `number.smart_star_projector_star_rotation_speed` | 10–1000. |
| `timer` | `time.smart_star_projector_timer` | `HH:MM:SS`. |

In `popup` mode the tune icon opens the controls in the modal (Esc / backdrop / ✕ to close);
in `dropdown` mode the chevron expands them inline. The editor presents each entity as its
own picker.

### `custom:wz-tv-card`

```yaml
type: custom:wz-tv-card
title: Fernseher
media_player: media_player.samsungtv
nachtton: switch.a_wz_nachtton
speech: switch.a_wz_sprachverbesserung
tv_light_scene: scene.wz_alle_fernsehlicht
sync_power: switch.sync_box_power
sync_button: input_button.sync_box_sync
hdmi_select: select.sync_box_hdmi_input
remotes:
  - { label: waipu.tv, icon: "phu:waiputv",  path: /lovelace/firetv }
  - { label: Octagon,  icon: "mdi:octagon",  path: /lovelace/octagon }
  - { label: Apple TV, icon: "phu:apple-tv", path: /lovelace/apple-tv }
# hdmi_options: [waipu.tv, Octagon, Apple TV, Blu-Ray]   # override the HDMI chip list
```

Power runs through the `media_player` (`media_player.toggle`). `remotes` entries navigate to
existing dashboard views. Collapsible.

### `custom:wz-motion-card`

```yaml
type: custom:wz-motion-card
title: Bewegungssensoren WZ
master: input_boolean.wz_motion_state         # header power button
aggregate: binary_sensor.livingdining_motion  # drives the status banner + header glow
sources:
  - { name: Spülbecken,  motion: binary_sensor.hue_motion_spulbecken_motion, enable: switch.hue_motion_spulbecken_motion }
  - { name: Küchentheke, motion: binary_sensor.hue_motion_wohnzimmer_motion, enable: switch.hue_motion_wohnzimmer_motion }
  - { name: FP2 Präsenz, motion: binary_sensor.wz_fp2_presence,              enable: automation.wohn_esszimmer_yama_fp2_wz }
```

Each source's `enable` may be a `switch` **or** an `automation` — the toggle picks the
service from the entity's domain. Collapsible.

### `custom:aeg-waschtrockner-card`

```yaml
type: custom:aeg-waschtrockner-card
prefix: aeg_waschtrockner   # entity-id prefix for the electrolux_status entities
title: Waschtrockner        # optional
# image: /local/aeg9000.png # optional photo, replaces the built-in SVG
```

| Option | Default | Notes |
|---|---|---|
| `prefix` | `aeg_waschtrockner` | All `sensor.*` / `select.*` / `switch.*` / `button.*` ids are `<domain>.<prefix>_<suffix>`. |
| `title` | — | Header sub‑label. |
| `image` | — | Photo URL; hides the SVG illustration. |

> The `switch.*_userSelections_*` entities of `electrolux_status` are effectively read‑only
> (the cloud API ignores stand‑alone writes), so the card renders them as tap‑to‑more‑info
> chips. `switch.*_uiLockMode` (Kindersicherung) is a real toggle. Collapsible (fixed 330 px
> collapsed height, matching the other three appliance cards).

### `custom:bosch-dishwasher-card`

```yaml
type: custom:bosch-dishwasher-card
entity: input_boolean.livingdining_dishwasher   # on = läuft, off = aus
cycle_minutes: 165                              # assumed program length for the ETA
title: Bosch Super Silence                      # optional
# image: /local/bosch_dishwasher.png            # optional photo
```

| Option | Default | Notes |
|---|---|---|
| `entity` | `input_boolean.livingdining_dishwasher` | The on/off helper. |
| `cycle_minutes` | `195` | Used to estimate the remaining time. |
| `title` | `Super Silence` | Model sub‑label. |
| `image` | — | Photo URL; hides the SVG illustration. |

### `custom:roborock-s7-card`

```yaml
type: custom:roborock-s7-card
vacuum: vacuum.roborock_s7_maxv
map_entity: image.roborock_s7_maxv_map_0_custom     # image shown as the map
rooms_entity: image.roborock_s7_maxv_map_0_custom   # image whose `rooms` attr lists segments
title: Roborock S7 MaxV
```

Every other entity id (battery, progress, status, mop selects, DND switch, presence sensors,
…) has a sensible default in `src/roborock-s7-card.js` → `setConfig()` and can be overridden
in YAML. **Area cleaning** maps segment names from the `rooms` attribute to Home Assistant
`area_id`s and calls `vacuum.clean_area`. Collapsible.

### `custom:dreame-h14-card`

```yaml
type: custom:dreame-h14-card
prefix: h14_pro          # entity-id prefix
title: Dreame H14 Pro    # optional
# image: /local/h14.png  # optional photo
```

All entities derive from `prefix` (`<domain>.<prefix>_<suffix>`). This is a hand‑pushed
floor washer — the card has no autonomous run, only the two dock actions
(`*_start_self_cleaning`, `*_start_self_drying`). Collapsible.

---

## Development

The individual cards live in `src/`. `ha-lovelace-cards.js` at the repo root is a generated
bundle — each `src/*.js` wrapped in its own IIFE so their top‑level `const`s don't collide.

```bash
# edit src/<card>.js, then:
npm run build      # regenerates ha-lovelace-cards.js
```

CI (`.github/workflows/validate.yml`) runs the HACS action and fails the build if
`ha-lovelace-cards.js` is out of date with `src/`. `release.yml` rebuilds the bundle and
attaches it to every published GitHub Release (so HACS installs pin to a release asset).

To iterate against a live instance without HACS, you can also register each `src/*.js` file
as its own Lovelace resource.

---

## License

[MIT](LICENSE) © 2026 Daniel Ring
