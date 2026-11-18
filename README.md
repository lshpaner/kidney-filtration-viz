# Kidney Filtration Dynamics

Interactive comparison of glomerular filtration in a healthy kidney and across the five KDIGO stages of chronic kidney disease.

Live: https://lshpaner.github.io/kidney-filtration-viz

## What it shows

- Blood circulating the glomerulus, filtrate leaving through the ureter, and albumin leaking into the filtrate in CKD
- Tissue desaturating and darkening as the stage rises from G1 to G5
- A GFR gauge on the KDIGO colour scale for each kidney
- Light and dark themes, following the system by default

Keyboard: Space plays or pauses, R resets, arrow keys change the stage.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL (usually http://localhost:5173/kidney-filtration-viz/).

## Build and deploy

```bash
npm run build     # outputs to dist/
npm run deploy    # builds, then publishes dist/ to GitHub Pages
```

## Layout

```
src/
  App.jsx                  page layout and state
  components/
    Kidney.jsx             one kidney panel, healthy or CKD, with particles and labels
    GFRGauge.jsx           semicircular gauge on the KDIGO scale
    Controls.jsx           view switch, transport, stage stepper, toggles
    About.jsx              legend, gauge notes, scope
  hooks/
    useAnimation.js        requestAnimationFrame loop yielding a phase in [0, 1)
    useTheme.js            light / dark with localStorage
  data/stages.js           KDIGO stage definitions and gauge bands
```

Built with React 18, Vite, Tailwind CSS, and Lucide icons. The kidney cross-section is a raster illustration under `src/assets/`.

## Scope

A simplified teaching model. It omits tubular reabsorption and secretion, hormonal regulation, and renal hemodynamics, and the GFR values are illustrative.

© Leon Shpaner. Educational use.
