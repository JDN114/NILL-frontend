import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerificationFailed() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  const message =
    reason === "expired"
      ? "Dein Bestätigungslink ist abgelaufen. Bitte fordere einen neuen an."
      : "Der Bestätigungslink ist ungültig oder wurde bereits verwendet.";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#071023] to-[#03060a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-2xl shadow-xl text-center bg-black/40 backdrop-blur"
      >
        <h1 className="text-3xl font-bold text-red-400 mb-4">✖ Verifizierung fehlgeschlagen</h1>
        <p className="text-gray-300 mb-6">{message}</p>
        <Link
          to="/resend-verification"
          className="inline-block border border-[var(--accent)] text-[var(--accent)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent)] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          Neuen Link anfordern
        </Link>
      </motion.div>
    </section>
  );
}
