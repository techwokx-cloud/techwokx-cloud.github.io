import { User, Code2, Sparkles, PenTool } from "lucide-react";

const roles = [
  { icon: Code2, label: "Builders" },
  { icon: User, label: "Problem Solvers" },
  { icon: Sparkles, label: "AI Enthusiasts" },
  { icon: PenTool, label: "Designers" },
];

/**
 * Placeholder illustration for the team section. Swap this component out
 * for a real team photo whenever you have one — just replace the usage in
 * app/about/page.tsx with:
 *   <img src="/team-photo.jpg" alt="The TechWokx team" className="rounded-2xl" />
 * and drop the photo into web/public/team-photo.jpg.
 */
export default function TeamIllustration() {
  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-navy-800">
      <div className="absolute h-72 w-72 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
      <div className="relative grid grid-cols-2 gap-6 sm:gap-8">
        {roles.map((r, i) => (
          <div key={r.label} className="flex flex-col items-center gap-2.5">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full border-2 sm:h-20 sm:w-20 ${
                i % 2 === 0 ? "border-violet/50" : "border-azure/50"
              } bg-navy-700`}
            >
              <r.icon size={26} className={i % 2 === 0 ? "text-violet" : "text-azure"} />
            </div>
            <span className="text-xs font-medium text-white/75">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
