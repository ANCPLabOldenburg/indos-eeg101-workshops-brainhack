# INDoS x EEG101 at OHBM BrainHack Bordeaux 2026

Static landing page for the joint INDoS and EEG101 contribution to OHBM
BrainHack 2026 (Bordeaux, June 11-13).

Two COST Actions, two half-days, three parallel Hacktracks. The page is a
single dependency-free HTML/CSS/JS bundle, designed to be deployed as
GitHub Pages and linked from the OHBM BrainHack site, the INDoS COST
Action site, and the EEG101 COST Action site.

Live site: https://karellopez.github.io/indos-eeg101-workshops-brainhack/

## What the page covers

- **INDoS (CA24161)** brings two TrainTracks:
  - Friday afternoon: `BIDS Manager` (raw-to-BIDS curation for MRI / MEG / EEG)
  - Saturday morning: `MEEGqc` (reproducible MEG/EEG QA/QC on BIDS datasets)
- **EEG101 (CA24148)** brings the parallel WG1 / WG2 / WG3 programme:
  - WG1: ARTEM-IS demo, journals-implementation discussion, ARTEM-IS Lexicon Hacktrack, ARTEM-IS stress-testing Hacktrack
  - WG2: RS-BIDSify workshop, harmonisation community debate, open-source clinic, future-collaboration planning
  - WG3: EEG Community Framework introduction TrainTrack, Ambassador TrainTrack, Gamification Hacktrack, Stakeholder Mapping Hacktrack

The full programme (including session leads sourced from the OHBM
TrainTrack / Hacktrack tickets and the EEG101 Working Group pages) lives
on the Programme tab. Every session card carries a resources chip row
linking out to the tool, repository, paper, and OHBM ticket where
relevant.

## Site structure

Three single-page tabs, switched in-place via JS without page reloads:

| Tab | Contents |
|---|---|
| **Home** | Hero with the workflow animation; side-by-side COST Action briefs; a "TrainTracks / Workshops / Hacktracks" format-card row |
| **Programme** | Clickable two-day schedule table, sticky page-TOC, and colour-coded programme blocks (INDoS / WG1 / WG2 / WG3) with full session descriptions |
| **Links** | Three categories: Events and host organisations, Software websites, Source code repositories, each with brand wordmarks or macOS AppIcon256 |

Deep links work: `index.html#session-meegqc`, `index.html#wg2`,
`index.html#schedule` etc. activate the right tab and scroll to the
target anchor (96 px below the sticky header).

## Stack

- One HTML file, one CSS file, one JS file. No build step. No dependencies.
- Typography mirrors `megqc_documentation` (system font stack, 16 px base, 1.65 line-height).
- Dark theme by default; light theme toggle persists via `localStorage` under `indos-theme`.
- INDoS and EEG101 logos ship as theme-aware pairs (`indos-logo-{white,black}.png`, `eeg101-logo-{color,white}.png`) switched via `.theme-only-{dark,light}` rules - no `invert()` / `hue-rotate()` filter hacks.
- App icons in the Links page are the macOS `AppIcon256.png` files copied from `BIDS-Manager/bidsmgr/gui/assets/macos/` and `MEEGqc/meg_qc/miscellaneous/GUI/assets/macos/`.
- Workflow hero animation: a clickable SVG that walks a brain through six nodes (Acquire / Report ARTEM-IS / Curate BIDS Manager + RS-BIDSify / Quality control MEEGqc / Share FAIR / Community CF), ending in a "BrainHack" popup. Respects `prefers-reduced-motion`.
- Inline SVG favicon (`I.E` mark on the site's dark navy) so the tab icon doesn't auto-resolve to one of the page's PNGs.

## Local preview

```bash
cd indos-eeg101-workshops-brainhack
python3 -m http.server 8000
open http://localhost:8000
```

## Deploying

The repository is wired to GitHub Pages from `main` at root. After
pushing, the live site updates within ~1 minute.

## Repository layout

```
indos-eeg101-workshops-brainhack/
|-- index.html          Three-tab structure (Home / Programme / Links)
|-- styles.css          Theme tokens, typography, page-TOC, schedule, cards
|-- script.js           Tab routing, page-TOC IntersectionObserver,
|                       theme toggle, workflow animation
|-- README.md           This file
|-- CUSTOM_DOMAIN.md    Notes on switching to a custom domain
|-- TESTING.md          Local-preview and GitHub Pages instructions
|-- PROJECT_INIT.md     Project-context handoff doc
`-- assets/
    |-- indos-logo-black.png         INDoS wordmark, light-theme
    |-- indos-logo-white.png         INDoS wordmark, dark-theme
    |-- eeg101-logo-color.png        EEG101 wordmark, light-theme
    |-- eeg101-logo-white.png        EEG101 wordmark, dark-theme
    |-- bids-manager/
    |   |-- app-icon.png             AppIcon256 from BIDS-Manager
    |   `-- software-logo.png        (kept; not currently used)
    |-- meegqc/
    |   |-- app-icon.png             AppIcon256 from MEEGqc
    |   `-- software-logo.png        (kept; not currently used)
    `-- workflow/
        |-- brain-start.png          Light-theme brain (workflow finale)
        |-- brain-start-white.png    Dark-theme brain
        |-- brain-final.png
        `-- brain-final-white.png
```

## Source links referenced on the page

| Resource | URL |
|---|---|
| OHBM BrainHack 2026 | https://ohbm.github.io/hackathon2026/ |
| INDoS COST Action (CA24161) | https://www.indos-costaction.eu |
| EEG101 COST Action (CA24148) | https://eeg101.eu/ |
| EEG Community Framework | https://linktr.ee/eegcf |
| BIDS Manager (repo / docs) | https://github.com/ANCPLabOldenburg/BIDS-Manager . https://ancplaboldenburg.github.io/bids_manager_documentation/ |
| MEEGqc (repo / docs) | https://github.com/ANCPLabOldenburg/MEGqc . https://ancplaboldenburg.github.io/megqc_documentation/ |
| ARTEM-IS | https://artemis.incf.org/ |
| RS-BIDSify | https://github.com/ubdbra001/rs-bidsify |
| #EEGManyLabs | https://eegmanylabs.org/ |
| BIDS standard | https://bids.neuroimaging.io |
