import { LandingPageShell, MagBtn } from "../components/landing/chrome";
import WalkthroughSection from "../sections/walkthrough/WalkthroughSection";

/* Standalone marketing page: the full "Ein Tag, von der KI geführt"
   walkthrough, spun off the landing page. */
export default function WieEsArbeitetPage() {
  return (
    <LandingPageShell
      title="NILL — Wie es arbeitet"
      render={() => (
        <>
          <WalkthroughSection />
          <section style={{padding:'40px 0 120px',textAlign:'center'}}>
            <div className="wrap">
              <MagBtn className="btn btn-primary" href="https://nillai.de/register">
                <span>Kostenlos registrieren</span><span className="arrow">→</span>
              </MagBtn>
            </div>
          </section>
        </>
      )}
    />
  );
}
