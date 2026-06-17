import { LandingPageShell } from "../components/landing/chrome";
import SustainabilitySection from "../sections/sustainability/SustainabilitySection";

/* Standalone marketing page: the full Nachhaltigkeit section,
   spun off the landing page. The section brings its own hero +
   top padding, so the shell drops its default top offset to let
   it sit seamlessly under the (transparent) nav. `.nh2-page`
   adds a soft page-load fade — animation polish lives in
   styles/sustainability.css. */
export default function NachhaltigkeitPage() {
  return (
    <LandingPageShell
      title="NILL — Nachhaltigkeit"
      mainClassName="nh2-page"
      mainStyle={{ paddingTop: 0 }}
      render={(onCTA) => <SustainabilitySection onCTA={onCTA} />}
    />
  );
}
