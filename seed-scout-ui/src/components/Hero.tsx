'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="absolute inset-0 bg-[url('/grain-texture.png')] opacity-5" />
      <div className="text-center z-10 max-w-3xl mx-auto px-4">
        <motion.p 
          className="text-lg md:text-xl text-green-600 font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Smart Seed Selection
        </motion.p>
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Find your perfect seed variety and maximize your yield
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get data-driven seed recommendations tailored to your operation
        </motion.p>
      </div>
    </section>
  )
}