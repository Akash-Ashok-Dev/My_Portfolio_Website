import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.1 + 0.3, alpha: Math.random() * 0.35 + 0.06,
      })
    }
    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168,85,247,${p.alpha})`
        ctx.fill()
      })
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 110) * 0.12})`
            ctx.lineWidth = 0.4; ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45 }} />
}

// Particle cloud that assembles around the photo
function CloudParticles() {
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2
        const r = 175 + Math.sin(i * 2.1) * 22
        const cx = Math.cos(angle) * r
        const cy = Math.sin(angle) * r
        const size = 2 + (i % 3)
        const color = i % 3 === 0
          ? 'var(--violet-glow)'
          : i % 3 === 1 ? 'var(--teal)' : 'var(--violet-bright)'
        return (
          <motion.div
            key={i}
            // starts scattered, assembles into orbit
            initial={{ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, opacity: 0, scale: 0 }}
            animate={{ x: cx, y: cy, opacity: [0, 0.9, 0.5, 0.9], scale: 1 }}
            transition={{
              delay: 0.8 + i * 0.06,
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 2.5 + (i % 4) * 0.4, repeat: Infinity, delay: 1.8 + i * 0.15 },
            }}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              marginLeft: -size / 2, marginTop: -size / 2,
              width: size, height: size,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${size * 3}px currentColor`,
              pointerEvents: 'none',
            }}
          />
        )
      })}
    </>
  )
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.5 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '0 6vw',
    }}>
      <ParticleCanvas />

      {/* Ambient bloom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 1100,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        gap: '5rem',
      }}>

        {/* ── LEFT: Photo with cloud assembly ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            position: 'relative',
            flexShrink: 0,
            width: 320, height: 420,
          }}
        >
          {/* Scattered-to-orbit cloud particles */}
          <CloudParticles />

          {/* Breathing glow rings */}
          {[1, 2].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 1.04, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 3.5 + i, repeat: Infinity, delay: i * 1 }}
              style={{
                position: 'absolute',
                inset: `${-i * 20}px`,
                borderRadius: '12px',
                border: `1px solid rgba(168,85,247,${0.25 - i * 0.08})`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* The photo — dissolves in from particles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(28px) saturate(0)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px) saturate(1)' }}
            transition={{ duration: 1.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 50px rgba(124,58,237,0.2), 0 0 100px rgba(124,58,237,0.08)',
            }}
          >
            <img
              src="/akash.webp"
              alt="Akash"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
            {/* Subtle violet tint overlay to blend with site palette */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 50%, rgba(3,0,10,0.55) 100%)',
              pointerEvents: 'none',
            }} />
          </motion.div>

          {/* Corner accent brackets */}
          {[
            { top: -6, left: -6, borderTop: '2px solid', borderLeft: '2px solid', borderColor: 'rgba(168,85,247,0.5)', width: 20, height: 20 },
            { top: -6, right: -6, borderTop: '2px solid', borderRight: '2px solid', borderColor: 'rgba(168,85,247,0.5)', width: 20, height: 20 },
            { bottom: -6, left: -6, borderBottom: '2px solid', borderLeft: '2px solid', borderColor: 'rgba(168,85,247,0.5)', width: 20, height: 20 },
            { bottom: -6, right: -6, borderBottom: '2px solid', borderRight: '2px solid', borderColor: 'rgba(168,85,247,0.5)', width: 20, height: 20 },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.08, duration: 0.5 }}
              style={{ position: 'absolute', borderRadius: '1px', ...s }}
            />
          ))}
        </motion.div>

        {/* ── RIGHT: Name + tagline + CTA ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ flex: 1, minWidth: 260 }}
        >
          <motion.p variants={fadeUp} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'var(--violet-bright)',
            marginBottom: '1rem',
          }}>
            Hello, I'm
          </motion.p>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 10vw, 8.5rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            marginBottom: '1.8rem',
            background: 'linear-gradient(140deg, #f8fafc 0%, #c084fc 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Akash
          </motion.h1>

          {/* Punchy tagline — supports who he is */}
          <motion.p variants={fadeUp} style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--silver)',
            lineHeight: 1.75,
            maxWidth: 360,
            marginBottom: '3rem',
            borderLeft: '2px solid rgba(124,58,237,0.4)',
            paddingLeft: '1.2rem',
          }}>
            A mind that refuses to stay in one lane — strategist, thinker, and builder of foundations.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#about" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--void)',
              background: 'linear-gradient(135deg, var(--violet-bright), var(--violet-core))',
              padding: '0.85rem 2.2rem', borderRadius: '2px',
              boxShadow: '0 0 28px rgba(124,58,237,0.38)',
            }}>
              Explore →
            </a>
            <a
              href="https://www.linkedin.com/in/akash-ashok-dev/"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--violet-glow)',
                border: '1px solid rgba(124,58,237,0.35)',
                padding: '0.85rem 2.2rem', borderRadius: '2px',
              }}
            >
              LinkedIn ↗
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '0.3em', color: 'rgba(148,163,184,0.25)',
        }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 1, height: 34, background: 'linear-gradient(to bottom, rgba(124,58,237,0.4), transparent)' }}
        />
      </motion.div>
    </section>
  )
}
