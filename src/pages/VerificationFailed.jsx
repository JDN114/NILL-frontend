import { Link } from "react-router-dom";

export default function VerificationFailed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
        ❌ Die Verifizierung ist fehlgeschlagen!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-2">
        Der Link ist möglicherweise abgelaufen oder ungültig.
      </p>
      <p className="text-lg md:text-xl text-gray-700">
        Fordere eine neue Verifizierungs-E-Mail an{" "}
        <Link
          to="/resend-verification"
          className="text-red-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
        >
          hier
        </Link>
        .
      </p>
    </div>
  );
}
