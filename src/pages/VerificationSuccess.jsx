import { Link } from "react-router-dom";

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
        ✅ Deine E-Mail wurde erfolgreich verifiziert!
      </h1>
      <p className="text-lg md:text-xl text-gray-700">
        Du kannst dich jetzt{" "}
        <Link
          to="/login"
          className="text-green-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
        >
          einloggen
        </Link>{" "}
        und das volle Produkt nutzen.
      </p>
    </div>
  );
}
