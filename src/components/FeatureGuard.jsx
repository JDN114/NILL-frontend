// src/components/FeatureGuard.jsx
import { useAuth } from "../context/AuthContext";

export default function FeatureGuard({ feature, children }) {
  const { hasFeature } = useAuth();

  if (hasFeature(feature)) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" className="text-gray-400 mb-4">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <p className="text-gray-300 font-medium">
        Dieses Feature ist für deine Rolle nicht freigeschaltet.
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Wende dich an deinen Administrator.
      </p>
    </div>
  );
}
