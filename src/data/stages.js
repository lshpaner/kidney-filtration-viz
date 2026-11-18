// KDIGO 2012 GFR categories. `gfr` is the illustrative value animated for each stage.
export const STAGES = [
  { id: 1, label: 'G1', range: '≥ 90', description: 'Normal or high GFR with evidence of kidney damage', gfr: 95 },
  { id: 2, label: 'G2', range: '60 – 89', description: 'Mildly decreased', gfr: 75 },
  { id: 3, label: 'G3', range: '30 – 59', description: 'Moderately decreased', gfr: 45 },
  { id: 4, label: 'G4', range: '15 – 29', description: 'Severely decreased', gfr: 20 },
  { id: 5, label: 'G5', range: '< 15', description: 'Kidney failure', gfr: 8 },
]

export const HEALTHY_GFR = 105
export const GFR_MAX = 120

// KDIGO heat-map bands, low to high risk. Used by the gauge.
export const GFR_BANDS = [
  { min: 90, max: 120, color: '#2E9E6B' },
  { min: 60, max: 90, color: '#9FBF3B' },
  { min: 45, max: 60, color: '#E3B13A' },
  { min: 30, max: 45, color: '#E88A2E' },
  { min: 15, max: 30, color: '#D9532B' },
  { min: 0, max: 15, color: '#A61E2B' },
]

export const bandFor = (gfr) => GFR_BANDS.find((b) => gfr >= b.min) ?? GFR_BANDS.at(-1)
