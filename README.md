# HA Lovelace Cards (Ring)

A small collection of **vanilla JavaScript** custom Lovelace cards for Home Assistant —
no framework, no build tooling required to use them, each card self‑contained with its own
shadow DOM and a graphical editor (`ha-form`).

They were written for one specific Home Assistant instance, so **most cards ship with
default `entity_id`s that you will need to change** (in the card's visual editor or in YAML).
Every card exposes its entities as config options for exactly that reason.

| `type:` | Card | What it does |
|---|---|---|
| `custom:star-projector-card` | Sternenprojektor | Smart star projector — power + nebula/stars brightness, rotation speed, sleep timer. `mode` (editor-choosable) shows the controls either in a **modal popup** (scaled like HA's more-info dialog; transparent overlay so the dashboard stays 100 % visible) or as an inline **dropdown**. Power button is available in the popup header too. Every entity is an individually selectable field in the editor (no prefix). |
| `custom:wz-tv-card` | Wohnzimmer TV | Compact TV hub — power, 1–4 remote‑subview shortcuts, 1–4 HDMI‑input chips, Hue Play Sync Box (with a labelled **Sync** button), 1–4 Sonos sound toggles (night‑sound / speech‑enhancement / …), TV‑light scene. Popup or dropdown. |
| `custom:wz-motion-card` | Bewegungssensoren | Motion/presence panel — master arm toggle, aggregate "any motion" banner, and an add/remove list of per‑sensor live‑detection dot + enable toggle (target may be a `switch` or an `automation`). Popup or dropdown. |
| `custom:aeg-waschtrockner-card` | AEG Waschtrockner | AEG 9000‑series washer‑dryer (`electrolux_status`) — animated illustration, cycle status/ETA, program & option chips, context‑aware start/pause/stop. Popup or dropdown. |
| `custom:bosch-dishwasher-card` | Bosch Spülmaschine | "Non‑smart" dishwasher driven by a single `input_boolean` — elapsed time, estimated remaining, done state. Popup or dropdown. |
| `custom:roborock-s7-card` | Roborock S7 MaxV | Live map image, start/pause/stop/dock/locate, **area cleaning** via `vacuum.clean_area`, fan speed, mop settings, status & lifetime stats. Popup or dropdown. |
| `custom:dreame-h14-card` | Dreame H14 Pro | Hand‑pushed wet/dry vacuum — tank/consumable alerts, the two dock actions, suction/water/brush levels, wear counters. Popup or dropdown. |

Code comments are English. User‑facing text is bilingual: every card takes a
`language` option (`auto` / `de` / `en`) — `auto` follows the Home Assistant UI
language and falls back to German.

### Common options (all cards)

| Option | Default | Notes |
|---|---|---|
| `mode` | `popup` | `popup` = controls open in a modal `<dialog>` scaled/styled like HA's more‑info dialog (desktop ≈ `min(520px, 100vw−32px)`, 28 px radius, rem typography; full‑screen on small viewports; overlay **always transparent** so the dashboard stays visible). `dropdown` = inline expand/collapse under the header via a chevron. Editor field: **Anzeige / Display**. |
| `language` | `auto` | `auto` → HA UI language (German fallback), or force `de` / `en`. Editor field: **Sprache / Language**. |
| `title` | per card | Header label (and popup title in `popup` mode). |

The four appliance/cleaning cards (`aeg-…`, `bosch-…`, `roborock-…`, `dreame-…`) keep a
fixed collapsed height so they line up side by side.

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
title: Sternenprojektor
mode: popup                # "popup" (default) or "dropdown"
language: auto             # auto | de | en
power: switch.smart_star_projector_master
nebula: light.smart_star_projector_background
stars: light.smart_star_projector_laser
rotation: number.smart_star_projector_star_rotation_speed
timer: time.smart_star_projector_timer
```

Plus the [common options](#common-options-all-cards) (`mode`, `language`, `title`).

| Option | Default | Notes |
|---|---|---|
| `power` | `switch.smart_star_projector_master` | Any toggleable entity. |
| `nebula` | `light.smart_star_projector_background` | Brightness + color. |
| `stars` | `light.smart_star_projector_laser` | Brightness. |
| `rotation` | `number.smart_star_projector_star_rotation_speed` | 10–1000. |
| `timer` | `time.smart_star_projector_timer` | `HH:MM:SS`. |

In `popup` mode the tune icon opens the controls in the modal (Esc / backdrop / ✕ to close),
and the power button is mirrored into the popup header; in `dropdown` mode the chevron
expands them inline. The editor presents each entity as its own picker (no prefix).

### `custom:wz-tv-card`

```yaml
type: custom:wz-tv-card
title: Fernseher
mode: popup            # popup | dropdown
language: auto         # auto | de | en
media_player: media_player.samsungtv
tv_light_scene: scene.wz_alle_fernsehlicht
sync_power: switch.sync_box_power
sync_button: input_button.sync_box_sync   # a labelled "Sync" button in the card
hdmi_select: select.sync_box_hdmi_input
remotes:                                   # 1–4, add/remove in the visual editor
  - { label: waipu.tv, icon: "phu:waiputv",  path: /lovelace/firetv }
  - { label: Octagon,  icon: "mdi:octagon",  path: /lovelace/octagon }
  - { label: Apple TV, icon: "phu:apple-tv", path: /lovelace/apple-tv }
hdmi:                                       # 1–4, add/remove in the visual editor
  - { option: "HDMI 1", icon: "mdi:television" }
  - { option: "HDMI 2", icon: "mdi:gamepad-variant" }
ton:                                        # 1–4 sound toggles, add/remove in the editor
  - { entity: switch.a_wz_nachtton,            label: Nachtton, icon: "mdi:weather-night" }
  - { entity: switch.a_wz_sprachverbesserung,  label: Sprache,  icon: "mdi:account-voice" }
```

Plus the [common options](#common-options-all-cards). Power runs through the `media_player`
(`media_player.toggle`). `remotes` entries navigate to existing dashboard views; `hdmi`
chips call `select.select_option` on `hdmi_select`; `ton` toggles switch on the entity's own
domain. Each list is 1–4 items, edited inline in the visual editor.

### `custom:wz-motion-card`

```yaml
type: custom:wz-motion-card
title: Bewegungssensoren WZ
mode: popup                                    # popup | dropdown
language: auto                                 # auto | de | en
master: input_boolean.wz_motion_state         # header power button
aggregate: binary_sensor.livingdining_motion  # drives the status banner + header glow
sources:                                       # add/remove in the visual editor (1–8)
  - { name: Spülbecken,  motion: binary_sensor.hue_motion_spulbecken_motion, enable: switch.hue_motion_spulbecken_motion }
  - { name: Küchentheke, motion: binary_sensor.hue_motion_wohnzimmer_motion, enable: switch.hue_motion_wohnzimmer_motion }
  - { name: FP2 Präsenz, motion: binary_sensor.wz_fp2_presence,              enable: automation.wohn_esszimmer_yama_fp2_wz }
```

Plus the [common options](#common-options-all-cards). The motion sources are an add/remove
list in the visual editor. Each source's `enable` may be a `switch` **or** an `automation` —
the toggle picks the service from the entity's domain.

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

Plus the [common options](#common-options-all-cards) (`mode`, `language`, `title`).

> The `switch.*_userSelections_*` entities of `electrolux_status` are effectively read‑only
> (the cloud API ignores stand‑alone writes), so the card renders them as tap‑to‑more‑info
> chips. `switch.*_uiLockMode` (Kindersicherung) is a real toggle. In `dropdown` mode the
> collapsed card is a fixed 330 px, matching the other three appliance cards.

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

Plus the [common options](#common-options-all-cards) (`mode`, `language`).

### `custom:roborock-s7-card`

```yaml
type: custom:roborock-s7-card
vacuum: vacuum.roborock_s7_maxv
map_entity: image.roborock_s7_maxv_map_0_custom     # image shown as the map
rooms_entity: image.roborock_s7_maxv_map_0_custom   # image whose `rooms` attr lists segments
title: Roborock S7 MaxV
```

Plus the [common options](#common-options-all-cards). Every other entity id (battery,
progress, status, mop selects, DND switch, presence sensors, …) has a sensible default in
`src/roborock-s7-card.js` → `setConfig()` and can be overridden in YAML. **Area cleaning**
maps segment names from the `rooms` attribute to Home Assistant `area_id`s and calls
`vacuum.clean_area`.

### `custom:dreame-h14-card`

```yaml
type: custom:dreame-h14-card
prefix: h14_pro          # entity-id prefix
title: Dreame H14 Pro    # optional
# image: /local/h14.png  # optional photo
```

Plus the [common options](#common-options-all-cards). All entities derive from `prefix`
(`<domain>.<prefix>_<suffix>`). This is a hand‑pushed floor washer — the card has no
autonomous run, only the two dock actions (`*_start_self_cleaning`, `*_start_self_drying`).

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
