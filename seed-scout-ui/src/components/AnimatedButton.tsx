'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface AnimatedButtonProps {
  href: string
  variant: 'primary' | 'secondary'
  children: React.ReactNode
}

export default function AnimatedButton({ href, variant, children }: AnimatedButtonProps) {
  const baseClasses = "px-6 py-3 rounded-md font-semibold text-lg transition-all duration-300 ease-in-out"
  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href} className={`${baseClasses} ${variantClasses[variant]}`}>
        {children}
      </Link>
    </motion.div>
  )
}

