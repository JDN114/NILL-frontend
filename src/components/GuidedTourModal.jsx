import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Intelligente Priorisierung",
    description:
      "NILL analysiert eingehende Inhalte automatisch und hebt relevante Informationen hervor – damit du dich auf das Wesentliche konzentrierst.",
  },
  {
    title: "Automatisierte Workflows",
    description:
      "Wiederkehrende Prozesse laufen im Hintergrund. Aufgaben werden strukturiert, verteilt und effizient abgewickelt.",
  },
  {
    title: "Nachhaltig digital",
    description:
      "Durch digitale Prozesse reduzierst du Papier, unnötige Kommunikation und Ressourcenverbrauch – messbar und langfristig.",
  },
];

export default function GuidedTour({ isOpen, onFinish }) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-2xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          {/* Progress */}
          <div className="mb-6 text-xs text-zinc-500">
            {step + 1} / {steps.length}
          </div>

          <h2 className="text-3xl font-semibold text-white tracking-tight">
            {steps[step].title}
          </h2>

          <p className="mt-6 text-zinc-300 leading-relaxed">
            {steps[step].description}
          </p>

          {/* Navigation */}
          <div className="mt-10 flex justify-between items-center">
            <button
              onClick={onFinish}
              className="text-sm text-zinc-500 hover:text-white transition"
            >
              Tour überspringen
            </button>

            <button
              onClick={() =>
                isLast ? onFinish() : setStep((prev) => prev + 1)
              }
              className="rounded-full bg-white px-6 py-2 text-black font-medium transition hover:scale-[1.03]"
            >
              {isLast ? "Starten" : "Weiter"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
