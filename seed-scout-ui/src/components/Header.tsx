import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300">
          SeedScout
        </Link>
      </nav>
    </header>
  )
}