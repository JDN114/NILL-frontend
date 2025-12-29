import { motion } from "framer-motion";
import FounderImg from "../assets/images/founder.jpg";

const textVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

export default function Founder() {
  return (
    <section
      id="founder"
      className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-24 bg-black text-white overflow-hidden"
    >
      {/* Futuristic Glow Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-primary/10 blur-[150px]" />

      {/* Portrait */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative"
      >
        <img
          src={FounderImg}
          alt="Founder"
          className="w-52 h-52 md:w-72 md:h-72 object-cover rounded-full shadow-2xl border border-white/10
          transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute inset-0 rounded-full border border-primary/30 blur-lg"></span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        viewport={{ once: true }}
        className="mt-10 text-3xl md:text-5xl font-bold tracking-tight"
      >
        Der Mensch hinter NILL
      </motion.h2>

      {/* Text */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-10 max-w-3xl px-6 md:px-0 space-y-6 text-center text-lg md:text-xl text-gray-200 leading-relaxed"
      >
        <motion.p variants={textVariants}>
          Julian David Nill – geboren und aufgewachsen in der Region Tübingen, Deutschland.
        </motion.p>

        <motion.p variants={textVariants}>
          Als Gründer von NILL verkörpert er die Vision eines technologischen Fortschritts,
          der nicht ersetzt, sondern erweitert. Sein Familienname steht für
          Tradition, Besessenheit und Willensstärke – und bildet zugleich
          die Basis für ein Akronym:
          <span className="block mt-1 font-semibold text-primary">
            Neural Intelligence for Less Labour
          </span>
        </motion.p>

        <motion.p variants={textVariants}>
          Ergänzend formuliert: <strong>„Technologie, die dem Menschen dient.“</strong>
        </motion.p>

        <motion.p variants={textVariants}>
          Für ihn gleicht der aktuelle KI-Wandel dem Internetboom der frühen 2000er –
          ein historischer Moment voller Chancen, Verantwortung und Bedeutung.
        </motion.p>

        <motion.p variants={textVariants}>
          Er glaubt fest daran:
          <br />
          <span className="italic text-white font-light">
            „Mensch + KI = ein Team, das smarter arbeitet – ohne Angst vor Jobverlust.“
          </span>
        </motion.p>

        <motion.p variants={textVariants}>
          Seine Mission: nachhaltige, ethische KI, die echten Nutzen bringt –
          besonders dort, wo monotone Arbeit wertvolle Lebenszeit frisst.
        </motion.p>

        <motion.blockquote
          variants={textVariants}
          className="pt-4 text-primary font-medium italic"
        >
          „Die Zukunft gehört denen, die Technologie mit Menschlichkeit verbinden.“
        </motion.blockquote>
      </motion.div>

      {/* Download Bio Section */}
      <motion.a
        href="/downloads/julian-nill-bio.pdf"
        download
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="mt-14 px-8 py-3 border border-primary text-primary rounded-full
        font-medium tracking-wide transition-colors hover:bg-primary hover:text-black"
      >
        Kurzportrait Downloaden
      </motion.a>
    </section>
  );
}
