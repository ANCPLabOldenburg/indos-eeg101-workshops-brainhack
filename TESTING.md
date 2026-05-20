# Testing the INDoS BrainHack Landing Page

This landing page is a static website. It does not need Node, npm, Next.js, or a build step.

## Option 1: Open the HTML File Directly

Open this file in your browser:

```text
/Users/karelo/PycharmProjects/megqcpython14/INDoS_BrainHack/index.html
```

This is enough for a quick visual check.

## Option 2: Run a Local Static Server

From the repository folder:

```bash
cd /Users/karelo/PycharmProjects/megqcpython14/INDoS_BrainHack
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Stop the server with `Ctrl+C` in the terminal.

## What to Check

- The hero section loads with the BIDS Manager and MEEGqc visuals.
- Navigation links scroll to the correct sections:
  - `BIDS Manager`
  - `MEEGqc`
  - `Sessions`
  - `Links`
- The GIFs animate correctly.
- The page looks good on desktop and mobile widths.
- The software links open in a new tab:
  - BIDS Manager repository
  - BIDS Manager documentation
  - MEEGqc repository
  - MEEGqc documentation

## Publish With GitHub Pages

After pushing the repository to GitHub:

1. Go to the repository on GitHub.
2. Open `Settings`.
3. Open `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select the branch, usually `main`.
6. Select the root folder `/`.
7. Save.

GitHub will provide a public URL. That is the URL you can ask the BrainHack organizers to attach to their website.

## Troubleshooting

If images do not load, check that the `assets/` folder was pushed together with `index.html`.

If the page works locally but not on GitHub Pages, check that GitHub Pages is serving from the repository root and not from `/docs`.
