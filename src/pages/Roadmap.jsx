import { motion, useViewportScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const milestones = [
  {
    year: "2026",
    title: "The Base — Fundament für die Zukunft",
    description:
      "NILL entwickelt die modulare KI-Basisplattform. Fokus: Ethik, Datensicherheit und smarte Automatisierungsbausteine. Ziel ist die schnelle Erweiterbarkeit neuer Funktionen.",
    side: "left",
  },
  {
    year: "2027",
    title: "Universal Automation für Unternehmen",
    description:
      "Repetitive Bürotätigkeiten werden branchenübergreifend automatisiert. Mensch + KI arbeiten Hand in Hand – produktiver, nicht ersetzend.",
    side: "right",
  },
  {
    year: "2028",
    title: "Expansion in neue Sektoren",
    description:
      "NILL erschließt Gesundheitswesen, Bildung und öffentliche Verwaltung. Technologie soll echten gesellschaftlichen Nutzen entfalten.",
    side: "left",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function Roadmap() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useViewportScroll();
  const yScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="roadmap"
      className="relative min-h-screen w-full pt-32 pb-24 bg-black text-white overflow-hidden"
      ref={containerRef}
    >
      {/* Glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/20 blur-[150px] rounded-full"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl md:text-5xl font-bold tracking-tight"
      >
        Roadmap
      </motion.h2>
      <p className="text-center text-gray-300 mt-3">
        Die Zukunft von NILL — Schritt für Schritt Realität ✨
      </p>

      {/* Timeline Container */}
      <div className="relative max-w-5xl mx-auto mt-20 pl-4 pr-4">
        {/* Scroll Line Background */}
        <div className="absolute left-1/2 top-0 w-1 bg-white/10 h-full -translate-x-1/2 rounded-full"></div>

        {/* Animated Scroll Line */}
        <motion.div
          style={{ scaleY: yScale }}
          className="absolute left-1/2 top-0 w-1 origin-top bg-primary -translate-x-1/2 rounded-full"
        ></motion.div>

        <div className="space-y-28">
          {milestones.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className={`relative w-full flex ${
                item.side === "left"
                  ? "justify-start text-left"
                  : "justify-end text-right"
              }`}
            >
              <div
                className={`w-full md:w-1/2 ${
                  item.side === "left"
                    ? "md:pr-10"
                    : "md:pl-10 flex flex-col items-end"
                }`}
              >
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                  <h3 className="text-primary text-2xl font-semibold">{item.year}</h3>
                  <h4 className="mt-2 text-lg font-medium">{item.title}</h4>
                  <p className="mt-2 text-gray-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Live Progress Bar */}
                  <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width: i === 0 ? "33%" : i === 1 ? "66%" : "100%",
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Node */}
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute left-1/2 -translate-x-1/2 top-6
                  w-5 h-5 rounded-full bg-primary shadow-[0_0_20px] shadow-primary/40"
              ></motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* End Quote */}
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="max-w-3xl mx-auto text-center mt-24 text-lg md:text-2xl text-primary italic"
      >
        „Wir bauen Zukunft — mit Verantwortung, Vision und Technologie für Menschen.“
      </motion.blockquote>
    </section>
  );
}
