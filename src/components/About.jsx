import { ChevronDown } from 'lucide-react'

const Dot = ({ className }) => <span className={`inline-block w-2.5 h-2.5 rounded-full ${className}`} />

export default function About() {
  return (
    <details className="group border-t border-line/15 pt-4">
      <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink select-none">
        <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        What you are looking at
      </summary>

      <div className="mt-5 grid gap-8 md:grid-cols-3 text-sm leading-relaxed text-ink/90 max-w-5xl">
        <section>
          <h3 className="font-display text-lg mb-2">Legend</h3>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <Dot className="bg-[#C8203A]" /> Blood entering through the renal artery and circulating the glomerulus
            </li>
            <li className="flex items-center gap-2">
              <Dot className="bg-filtrate" /> Filtrate leaving through the ureter
            </li>
            <li className="flex items-center gap-2">
              <Dot className="bg-albumin" /> Albumin leaking into the filtrate (proteinuria), CKD only
            </li>
          </ul>
          <p className="mt-3 text-muted">
            In the CKD panel, tissue desaturates and darkens as the stage rises; blood flow slows and the filtrate thins.
          </p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-2">Reading the gauge</h3>
          <p>
            Glomerular filtration rate, in mL/min/1.73 m², on the KDIGO colour scale. A healthy adult sits near 90 to 120. CKD is
            staged G1 through G5 by GFR; the stage stepper sets an illustrative value inside each band.
          </p>
          <p className="mt-3 text-muted">Drop counts tally completed filtration cycles and scale with the current GFR.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-2">Scope</h3>
          <p>
            A simplified teaching model. It omits tubular reabsorption and secretion, hormonal regulation, and renal hemodynamics,
            and the GFR values are illustrative. Clinical assessment of kidney function relies on serum creatinine or cystatin C,
            an eGFR equation, urinalysis with albumin-to-creatinine ratio, and imaging.
          </p>
        </section>
      </div>
    </details>
  )
}
