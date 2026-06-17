import { LandingPageShell } from "../components/landing/chrome";
import SustainabilitySection from "../sections/sustainability/SustainabilitySection";

/* Standalone marketing page: the full Nachhaltigkeit section,
   spun off the landing page. */
export default function NachhaltigkeitPage() {
  return (
    <LandingPageShell
      title="NILL — Nachhaltigkeit"
      render={(onCTA) => <SustainabilitySection onCTA={onCTA} />}
    />
  );
}
