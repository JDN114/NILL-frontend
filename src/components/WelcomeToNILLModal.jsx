import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeToNillModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-2xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

              {/* Soft Glow */}
              <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

              {/* Content */}
              <div className="relative text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Willkommen bei NILL
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-zinc-300">
                  Danke für dein Vertrauen.  
                  Dein intelligenter Workspace ist jetzt aktiviert.
                </p>

                <div className="mt-10 space-y-6 text-zinc-400 text-base leading-relaxed max-w-xl mx-auto">
                  <p>
                    NILL analysiert, priorisiert und strukturiert deine digitale Kommunikation –
                    damit du dich auf das Wesentliche konzentrieren kannst.
                  </p>

                  <p>
                    Automatisierte Workflows reduzieren Reibung, sparen Zeit
                    und schaffen Klarheit in komplexen Prozessen.
                  </p>

                  <p>
                    Digital-first bedeutet für uns auch Nachhaltigkeit:
                    weniger Papier, weniger unnötige Prozesse, weniger Ressourcenverbrauch.
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-12">
                  <button
                    onClick={onClose}
                    className="group relative rounded-full bg-white px-8 py-3 text-black font-medium transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="relative z-10">Workspace öffnen</span>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                  </button>
                </div>

                {/* Small Disclaimer */}
                <p className="mt-6 text-xs text-zinc-500">
                  Dein Plan ist jederzeit kündbar. Keine versteckten Kosten.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
