import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

interface NavbarProps {
  onBlogToggle: () => void
  blogOpen: boolean
}

export default function Navbar({ onBlogToggle, blogOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '1.1rem 3rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(3,0,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <a href="#hero" style={{
        fontFamily: 'var(--font-display)', fontSize: '0.85rem',
        letterSpacing: '0.18em', color: 'var(--violet-glow)', fontWeight: 400,
      }}>
        Akash Ashok
      </a>

      <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
        {links.map((l, i) => (
          <motion.a key={l.label} href={l.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            onClick={blogOpen ? onBlogToggle : undefined}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--silver)' }}
            whileHover={{ color: 'var(--violet-glow)' }}
          >{l.label}</motion.a>
        ))}

        <motion.button onClick={onBlogToggle}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: blogOpen ? 'var(--void)' : 'var(--violet-glow)',
            background: blogOpen ? 'linear-gradient(135deg, var(--violet-bright), var(--violet-core))' : 'transparent',
            border: '1px solid rgba(124,58,237,0.4)',
            padding: '0.45rem 1.1rem', borderRadius: '2px', cursor: 'none', transition: 'all 0.3s',
          }}
        >{blogOpen ? '✕ Blog' : 'Blog'}</motion.button>

        <motion.a href="https://github.com/Akash-Ashok-Dev" target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--silver)', border: '1px solid rgba(124,58,237,0.2)',
            padding: '0.45rem 1.1rem', borderRadius: '2px',
          }}
        >GitHub ↗</motion.a>
      </div>
    </motion.nav>
  )
}
