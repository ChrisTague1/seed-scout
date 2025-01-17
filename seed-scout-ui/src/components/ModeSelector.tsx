'use client'

import { motion } from 'framer-motion'

interface ModeSelectorProps {
  mode: 'natural' | 'manual'
  setMode: (mode: 'natural' | 'manual') => void
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className="flex justify-center mb-8 w-full max-w-md mx-auto">
      <div className="bg-gray-100 p-1.5 rounded-xl w-full shadow-inner">
        <div className="relative">
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-green-600 to-green-500 rounded-lg shadow-lg"
            initial={false}
            animate={{ x: mode === 'natural' ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <div className="flex relative">
            <button
              className={`z-10 px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 ${
                mode === 'natural' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setMode('natural')}
            >
              Natural Language
            </button>
            <button
              className={`z-10 px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 ${
                mode === 'manual' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setMode('manual')}
            >
              Manual Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}