import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPage } from "../utils/analytics";

export default function RouteTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPage(pathname + search);
  }, [pathname, search]);
  return null;
}
