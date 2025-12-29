import React from "react";
import { motion } from "framer-motion";
import FounderImg from "../assets/images/founder.jpg";

const textBlocks = [
  {
    id: 1,
    content: `Ich bin Julian David Nill und bin in der wunderschönen Region Tübingen aufgewachsen. Schon früh habe ich ein Bewusstsein für unsere Umwelt entwickelt – Nachhaltigkeit und Umweltschutz sind Werte, die ich nicht nur theoretisch, sondern durch konkrete Aktionen lebe.`,
  },
  {
    id: 2,
    content: `Meine Leidenschaft für Physik hat mir gezeigt, wie faszinierend die Naturgesetze sind, während die Musik mir Kreativität und Rhythmus lehrt. Diese Kombination aus Rationalität und Intuition prägt auch meine Arbeit bei NILL.`,
  },
  {
    id: 3,
    content: `Sport ist ein wesentlicher Teil meines Lebens. Besonders American Football hat mich geprägt: Mehrfach Jugendauswahl, 3 Jahre Jugendbundesliga, 3x Südmeister – die Teamarbeit, Disziplin und Durchhaltevermögen aus dem Sport bringe ich direkt in meine Projekte ein. Gleichzeitig reizt mich Ausdauersport, besonders Triathlon, als Herausforderung für Körper und Geist.`,
  },
  {
    id: 4,
    content: `Mit NILL möchte ich Technologie erschaffen, die Menschen erweitert, ohne sie zu ersetzen. „NILL“ steht nicht nur für meinen Familiennamen, sondern auch für Neural Intelligence for Less Labour – eine Vision, die Verantwortung, Ethik und nachhaltige KI-Entwicklung in den Vordergrund stellt.`,
  },
];

export default function Founder() {
  return (
    <section
      id="founder"
      className="relative w-full min-h-screen bg-black text-white pt-32 pb-24 overflow-hidden"
    >
      {/* Futuristic Glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600/20 blur-[200px] rounded-full"></div>

      {/* Portrait */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl shadow-primary/50 hover:scale-105 transition-transform"
        >
          <img
            src={FounderImg}
            alt="Julian David Nill"
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </div>

      {/* Name & Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-4xl md:text-5xl font-bold mt-8"
      >
        Der Mensch hinter NILL
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center text-primary text-2xl md:text-3xl mt-2 font-semibold"
      >
        Julian David Nill
      </motion.h2>

      {/* Text Blocks */}
      <div className="max-w-3xl mx-auto mt-12 space-y-8 px-4 md:px-0">
        {textBlocks.map((block, idx) => (
          <motion.p
            key={block.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.3 }}
            className="text-gray-300 leading-relaxed text-lg md:text-xl"
          >
            {block.content}
          </motion.p>
        ))}
      </div>

      {/* Footer Quote */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: textBlocks.length * 0.3 }}
        className="max-w-2xl mx-auto text-center mt-16 text-primary italic text-xl md:text-2xl"
      >
        „Mensch + KI = ein Team, das smarter arbeitet, ohne Menschen zu ersetzen.“
      </motion.blockquote>
    </section>
  );
}
