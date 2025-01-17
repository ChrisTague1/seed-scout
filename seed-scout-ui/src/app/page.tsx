'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ModeSelector from '../components/ModeSelector'
import NaturalLanguageMode from '../components/NaturalLanguageMode'
import ManualMode from '../components/ManualMode'

export default function Home() {
  const [mode, setMode] = useState<'natural' | 'manual'>('natural')

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <ModeSelector mode={mode} setMode={setMode} />
        <div className="mt-6">
          {mode === 'natural' ? <NaturalLanguageMode /> : <ManualMode />}
        </div>
      </section>
    </main>
  )
}

