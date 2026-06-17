import { LandingPageShell } from "../components/landing/chrome";
import PWASection from "../sections/pwa/PWASection";

/* Standalone marketing page: the full PWA / "App ohne App Store"
   section, spun off the landing page. */
export default function AppPage() {
  return (
    <LandingPageShell
      title="NILL — App ohne App Store"
      render={(onCTA) => <PWASection onCTA={onCTA} />}
    />
  );
}
