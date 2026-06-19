import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerificationSuccess() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#071023] to-[#03060a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-2xl shadow-xl text-center bg-black/40 backdrop-blur"
      >
        <h1 className="text-3xl font-bold text-green-400 mb-4">✔ Erfolgreich verifiziert</h1>
        <p className="text-gray-300 mb-6">
          Deine E-Mail-Adresse wurde bestätigt. Du kannst dich jetzt einloggen.
        </p>
        <Link
          to="/login"
          className="inline-block bg-[var(--accent)] px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          Jetzt einloggen
        </Link>
      </motion.div>
    </section>
  );
}
