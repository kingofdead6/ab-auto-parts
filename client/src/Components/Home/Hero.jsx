"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroBgPc from "../../assets/HeroBgPc.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <picture>
          <img
            src={HeroBgPc}
            alt="Pièces automobiles"
            className="w-full h-full object-cover"
          />
        </picture>

        {/* Dark overlay + gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl text-center text-white">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-2 bg-red-600/20 border border-red-500/40 text-red-400 text-sm rounded-full"
          >
            Pièces auto • Qualité garantie
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            Trouvez les meilleures
            <span className="block text-red-500">
              pièces pour votre voiture
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Explorez une large sélection de pièces automobiles par type de véhicule 
            ou par catégorie. Performance, fiabilité et prix compétitifs.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#products"
              className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
            >
              Voir les pièces
            </a>

          </motion.div>

          {/* Trust / Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
          >
            <span>✔ Large catalogue</span>
            <span>✔ Compatibilité multi-marques</span>
            <span>✔ Livraison rapide</span>
          </motion.div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}