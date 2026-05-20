# INDoS BrainHack Landing Page - Project Context

Use this file as the starting context if work on the website continues later.

## Project Purpose

This repository contains a static landing page for the INDoS OHBM BrainHack TrainTrack and workshop around two software tools:

- **BIDS Manager**: interactive raw-to-BIDS curation for MRI, MEG, and EEG workflows.
- **MEEGqc / MEGqc**: reproducible MEG/EEG quality assessment and quality-control reporting.

The page is intended to be hosted as a public URL and shared with the BrainHack organizers so they can attach it to their website.

Current page order:

1. Hero with tool GUI/MRI/topomap background images, a theme toggle, and a lightweight graph-style workflow animation.
2. Detailed June 12th TrainTrack and workshop programme, starting with a clear visual timeline.
3. Reproducibility workflow.
4. BIDS Manager software section.
5. MEEGqc software section.
6. Software/documentation links.
7. Interactive image modal used by the tool galleries.

Organizer context from Felix:

- INDoS and EEG101 should be listed separately on the BrainHack website because they happen in parallel.
- Traintrack submissions should include duration, target audience, and tags.
- The opening ceremony is June 11, 9:00-9:30, with concise 3-5 minute workshop advertisements.
- Hackproject pitches are June 11, 13:00-14:40, with 5-7 minute project pitches.
- Traintracks are best submitted 4-6 weeks before the event.

Current INDoS schedule shown on this page:

- **June 12th morning:** BIDS Manager TrainTrack for multimodal data curation and conversion, preferred 1h30 Deeper TrainTrack format.
- **June 12th morning fallback option:** BIDS Manager fast-track TrainTrack format, 45 minutes, if the schedule needs a shorter slot.
- **June 12th afternoon:** MEEGqc reproducible EEG/MEG quality assessment and quality-control workshop, duration to be confirmed.

Tutors for the TrainTrack and workshop: **Dr. Karel López Vilaret** and **Dr. Jorge F. Bosch-Bayard**.

The BIDS Manager contribution should be framed as one TrainTrack with two possible durations. The 1h30 version is the preferred hands-on/explanatory format; the 45-minute version is a lighter fallback option, not a separate workshop. MEEGqc is the separate afternoon workshop.

## Repository

Website repository:

```text
/Users/karelo/PycharmProjects/megqcpython14/INDoS_BrainHack
```

Main files:

```text
index.html      Main landing page content and modal markup
styles.css      Visual design, dark/light themes, layout, responsive styles, animation
script.js       Scroll reveal animation, theme toggle, interactive image gallery modal
README.md       Short repository overview
TESTING.md      Local testing and GitHub Pages instructions
PROJECT_INIT.md This project context file
assets/         Copied website images and GIFs
```

The site is dependency-free. It does not need Node, npm, or a build step.

## Testing Locally

From the website repo:

```bash
cd /Users/karelo/PycharmProjects/megqcpython14/INDoS_BrainHack
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Source Programme Text

The workshop programme copy should be synthesized from:

```text
/Users/karelo/PycharmProjects/megqcpython14/Workshop_Descriptions.md
/Users/karelo/PycharmProjects/megqcpython14/Workshop_Descriptions_v2.md
/Users/karelo/PycharmProjects/megqcpython14/Workshop_Descriptions_v3.md
```

Version 3 contains the strongest positioning and should be treated as the primary source. Versions 1 and 2 are useful for fallback phrasing and shorter descriptions.

Current programme entries on the page:

- `Multimodal raw-to-BIDS curation and conversion with BIDS Manager` as the INDoS TrainTrack.
- `Fast-track BIDS curation and conversion with BIDS Manager` as the optional shorter TrainTrack format.
- `MEEGqc workshop: reproducible EEG and MEG quality assessment and quality control` as the INDoS workshop.

## Related Repositories

BrainHack reference landing page:

```text
/Users/karelo/PycharmProjects/megqcpython14/hackathon2026
```

BIDS Manager software:

```text
/Users/karelo/PycharmProjects/megqcpython14/BIDS-Manager
https://github.com/ANCPLabOldenburg/BIDS-Manager
```

MEGqc software:

```text
/Users/karelo/PycharmProjects/megqcpython14/MEGqc
https://github.com/ANCPLabOldenburg/MEGqc
```

## Tool Feature Positioning

BIDS Manager must be presented as both a converter and an interactive curation environment. The page should never imply that it only inspects data; it converts raw datasets into BIDS-compliant outputs after allowing users to understand and correct the acquisition inventory. Its positioning is multimodal: MRI, MEG, and EEG workflows in one framework.

Key BIDS Manager points to preserve:

- Converts raw multimodal MRI, MEG, and EEG data into BIDS-compliant datasets using a software-guided workflow.
- Scans raw acquisitions into a metadata inventory before conversion.
- Shows studies, subjects, sessions, source folders, sequence names, acquisition times, file counts, series identifiers, inferred modalities, repeated acquisitions, and proposed BIDS names.
- Allows correction of subject labels, sessions, suffix mapping, inclusion/exclusion decisions, repeated runs, mixed-session folders, and protocol-specific patterns through the GUI.
- Provides general and specific filters by modality, subject, session, and sequence.
- Lets users preview the future BIDS dataset as text and as a tree before running conversion.
- Runs conversion with live logs, conversion heuristics, and post-conversion rename/review logic.
- Bridges conversion and post-conversion review with metadata editing, JSON/TSV review, graph views, IntendedFor-oriented fieldmap handling, and imaging/slice inspection.
- Advertisement framing: this is a software-guided curation workflow, not a manual BIDS naming walkthrough.

MEEGqc should be presented as a reproducible quality assessment and quality-control framework, with the two layers clearly separated:

- **Quality assessment:** descriptive measurement and characterization only. QA computes continuous descriptors and preserves distributions, quantiles, temporal footprints, spatial sensor patterns, spectral profiles, physiological-coupling summaries, event/stimulus summaries, and head-motion summaries. QA should not be described as deciding whether something is noisy, flat, contaminated, excluded, or bad.
- **Quality control:** criterion-based decision support on top of QA outputs. QC uses explicit thresholds/configuration criteria to transform continuous QA measurements into burden indicators, flags, ranking/screening outputs, exclusions, repair/interpolation candidates, GQI attempts, or other documented decisions.
- Assessment metrics include STD, peak-to-peak amplitude, PSD summaries, ECG/EOG correlation magnitudes, high-frequency muscle-burden profiles, stimulus/event summaries, and MEG head-motion summaries when available.
- Outputs include interactive subject HTML reports, metric TSV tables, JSON summaries, BIDS derivatives, group quality reports, and multi-sample comparisons.
- Supports GUI, command-line, and programmatic workflows.
- Supports MEG, standalone EEG, and EEG channels embedded in MEG recordings.
- EEG support includes BIDS channel-type correction, EEG montage handling, re-referencing, EEG-specific muscle frequency bands, and EEG report tabs.
- Positioning from the manuscript: MEEGqc's differentiator is a standalone persistent machine-readable quality-information layer, explicit assessment/control separation, interactive reports at subject/group/multi-sample levels, GUI/CLI/API access, scalable cohort processing, and auditable decision support.
- Do not display the GQI image. It is acceptable to discuss configurable criteria or summary outputs, but the page should not visually feature the old GQI screenshot.

## Documentation Sources And Visual Assets

BIDS Manager documentation repo:

```text
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation
https://ancplaboldenburg.github.io/bids_manager_documentation/
```

Useful asset folders:

```text
bids_manager_documentation/static/converter/
bids_manager_documentation/static/editor_gifs/
bids_manager_documentation/static/3d/
```

Current copied BIDS Manager assets:

```text
assets/bids-manager/software-logo.png
assets/bids-manager/gui-visual.png
assets/bids-manager/intro-3d.gif
assets/bids-manager/scanned-metadata.png
assets/bids-manager/filter-general.png
assets/bids-manager/filter-specific.png
assets/bids-manager/preview-tree.png
assets/bids-manager/editor-graph.png
assets/bids-manager/editor-json.png
assets/bids-manager/editor-metadata.png
assets/bids-manager/slices.gif
assets/bids-manager/logo.png
```

These were copied from the user-provided source paths:

```text
/Users/karelo/PycharmProjects/megqcpython14/BIDS-Manager/bids_manager/miscellaneous/images/Logo.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/converter/1_visual.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/3d/01_intro_2.gif
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/converter/3_scanned_metadata.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/converter/4_filter.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/converter/4_filter_specific.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/converter/5_preview_treee.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/editor/02_graph.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/editor/02_json.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/editor/02_metadata.png
/Users/karelo/PycharmProjects/megqcpython14/bids_manager_documentation/static/editor_gifs/2_slices.gif
```

MEGqc documentation repo:

```text
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation
https://ancplaboldenburg.github.io/megqc_documentation/
```

Useful asset folders:

```text
megqc_documentation/static/00_overview/
megqc_documentation/static/qa_subject/
megqc_documentation/static/qa_group/
megqc_documentation/static/gqi/
```

Current copied MEEGqc assets:

```text
assets/meegqc/software-logo.png
assets/meegqc/gui-main-dark.png
assets/meegqc/gui-main-light.png
assets/meegqc/report-tabs.gif
assets/meegqc/group-summary.gif
assets/meegqc/std-rotate.gif
assets/meegqc/std-cap.gif
assets/meegqc/psd-welch.gif
assets/meegqc/psd-topomap.gif
assets/meegqc/eog-topomap.gif
assets/meegqc/ecg-highest.gif
assets/meegqc/logo.png
```

`assets/meegqc/gqi-summary.png` may still exist locally from an earlier version, but it should not be displayed on the page.
The user asked to remove the GQI image and use only one topomap GIF for MEEGqc feature display.

These were copied from the user-provided source paths:

```text
/Users/karelo/PycharmProjects/megqcpython14/MEGqc/meg_qc/miscellaneous/GUI/logo.png
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation/static/gui/gui_main_dark.png
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation/static/gui/gui_main_light.png
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation/static/qa_subject/ecg/4_ecg_highest.gif
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation/static/qa_subject/psd/2_welch.gif
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation/static/qa_subject/psd/4_topomap.gif
/Users/karelo/PycharmProjects/megqcpython14/megqc_documentation/static/qa_subject/std/2_cap_on.gif
```

INDoS logo source:

```text
/Users/karelo/PycharmProjects/megqcpython14/indos-costaction.github.io/assets/images/logo/
```

Current copied INDoS asset:

```text
assets/indos-logo-white.png
```

## Design Notes

- The page supports dark and light themes through the header theme toggle. The selected theme is stored in `localStorage` under `indos-theme`.
- The header brand text is `INDoS TrainTrack and Workshop - OHBM BrainHack`; clicking the INDoS/logo brand opens `https://www.indos-costaction.eu` in a new tab.
- The hero includes overlapping software screenshots/GIFs from real tool GUIs, MRI/slice animations, and one MEEGqc topomap animation.
- The animation is a lightweight interactive graph-style SVG above the title, representing `Raw multimodal data -> Scan and inspect -> BIDS conversion -> Quality assessment: Measure -> Quality control: Decision -> Reports`.
- The animation should keep the full terms `Quality assessment` and `Quality control`, with the explanatory words `Measure` and `Decision`.
- The previous SVG `<animateMotion>` workflow was removed because it was buggy and slow to load; the current SVG uses static path geometry with CSS dash effects plus JavaScript `requestAnimationFrame` dots that travel along the real SVG paths.
- The normal continuous path markers should remain simple moving dots.
- The click-triggered marker is a brain image, not the continuous moving dot. It uses `assets/workflow/brain-start.png` and gradually crossfades/evolves toward `assets/workflow/brain-final.png` while moving continuously between nodes.
- The workflow SVG is clickable and keyboard accessible. A subtle `Click animation to play workflow` hint is shown below the animation. On click or Enter/Space, a larger spotlight and evolving brain marker move smoothly node by node through the workflow. Each arrival triggers a random-color flash burst. At the Reports node, the brain exits upward into the open space above the workflow, grows, and shows a large separated `BrainHack` text popup for 5 seconds unless the visitor clicks again.
- Safari compatibility note: the workflow glow effects use inline SVG filters plus `-webkit-filter` fallbacks instead of relying only on CSS `drop-shadow()`. The dark-theme brain uses real white PNG assets (`assets/workflow/brain-start-white.png` and `assets/workflow/brain-final-white.png`) selected in `setTheme()` so Safari does not depend on CSS or SVG image inversion.
- Tool screenshots and GIFs are interactive. Figures with `.media-frame` or inside `.media-strip` open in a modal. Add `data-title` and `data-detail` to a figure when a custom modal explanation is needed.
- Text was intentionally reduced from earlier versions because the original hero and section headings were too large.
- The programme must remain first after the hero. Tool-selling sections come after the detailed programme.
- Keep typography restrained: avoid hero-scale text inside cards or compact sections.
- Avoid heavy dependencies unless there is a strong reason; the current static site is easy to host with GitHub Pages.

## Important Public Links On The Page

```text
https://github.com/ANCPLabOldenburg/BIDS-Manager
https://ancplaboldenburg.github.io/bids_manager_documentation/
https://github.com/ANCPLabOldenburg/MEGqc
https://ancplaboldenburg.github.io/megqc_documentation/
```

## Publishing

The simplest publishing route is GitHub Pages:

1. Push this repository to GitHub.
2. Open repository `Settings`.
3. Open `Pages`.
4. Select `Deploy from a branch`.
5. Select `main` and root `/`.
6. Use the generated public URL for the BrainHack website.
