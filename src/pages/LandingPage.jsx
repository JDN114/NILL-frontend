import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    window.location.replace("/LandingPage-2.html");
  }, []);

  return null;
}
