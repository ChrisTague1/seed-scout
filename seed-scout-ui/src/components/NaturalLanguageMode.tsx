'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NaturalLanguageMode() {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Natural language input:', input)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <label htmlFor="nlInput" className="block text-sm font-medium text-gray-700 mb-2">
          Describe your ideal corn seed variety
        </label>
        <textarea
          id="nlInput"
          rows={4}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-green-500"
          placeholder="E.g., I need a corn variety suitable for the Midwest with good drought tolerance and resistance to Gray Leaf Spot."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button
  type="submit"
  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 
    text-white font-medium rounded-xl shadow-lg
    hover:shadow-xl hover:ring-2 hover:ring-green-400 hover:ring-opacity-50 
    transition-all duration-300 ease-in-out"
>
  Find Varieties
</button>
      </form>
    </motion.div>
  )
}
