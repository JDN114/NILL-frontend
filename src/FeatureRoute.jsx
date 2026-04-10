// src/FeatureRoute.jsx
// Wraps a route and checks hasFeature() + hasModule() before rendering.
// If the check fails, redirects to /upgrade with context about what's blocked.
//
// Usage in App.jsx:
//   <Route path="/dashboard/accounting" element={
//     <ProtectedRoute>
//       <FeatureRoute feature="accounting" module="accounting">
//         <AccountingPage />
//       </FeatureRoute>
//     </ProtectedRoute>
//   }/>
//
// Props:
//   feature  — string, checked against user OrgRole.permissions (skipped for admins)
//   module   — string, checked against org.modules (always enforced)
//   children — the page to render if access is granted

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function FeatureRoute({ feature, module: mod, children }) {
  const { user, org, isCompanyAdmin, isSolo, hasFeature, hasModule } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const moduleOk  = mod     ? hasModule(mod)       : true;
  const featureOk = feature ? hasFeature(feature)  : true;
  const allowed   = moduleOk && featureOk;

  useEffect(() => {
    if (!allowed) {
      navigate("/upgrade", {
        replace: true,
        state: {
          from: location.pathname,
          feature,
          module: mod,
          reason: !moduleOk ? "module" : "feature",
        },
      });
    }
  }, [allowed]);

  if (!allowed) return null;
  return <>{children}</>;
}
