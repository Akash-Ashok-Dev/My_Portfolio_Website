import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const FEATURED = [
  {
    id: 1,
    title: 'Strategic Decision Engine',
    tag: 'Systems Thinking',
    tagColor: '#a855f7',
    year: '2024',
    desc: 'A personal framework for decomposing high-stakes decisions — mapping second-order effects, stakeholder dynamics, and reversibility into a single mental model.',
    tech: ['First Principles', 'Decision Theory', 'Systems Design'],
    link: '#',
  },
  {
    id: 2,
    title: 'Knowledge OS',
    tag: 'Meta-Learning',
    tagColor: '#06b6d4',
    year: '2024',
    desc: 'A Zettelkasten-inspired note system built to surface unexpected connections between philosophy, technology, and strategy. Every idea is a node.',
    tech: ['Obsidian', 'Spaced Repetition', 'Linked Thinking'],
    link: '#',
  },
  {
    id: 3,
    title: 'Leadership Playbook',
    tag: 'Leadership',
    tagColor: '#e11d48',
    year: '2025',
    desc: 'A living document of distilled lessons from leading teams — what worked, what failed, and the principles extracted from both. Built from real experience.',
    tech: ['Team Dynamics', 'Conflict Frameworks', 'Vision Design'],
    link: '#',
  },
]

const SMALL = [
  { title: 'MEC Orientation Notes', tag: 'College', color: '#6366f1', desc: 'Structured observations from the first weeks — patterns in how institutions work.' },
  { title: 'Philosophy Reading Log', tag: 'Study', color: '#10b981', desc: 'Annotated summaries of Stoic, Analytic and Eastern philosophy texts.' },
  { title: 'Debate Case Files', tag: 'Competition', color: '#e11d48', desc: 'Research and argument structures from inter-school debate events.' },
  { title: 'Mental Models Index', tag: 'Thinking', color: '#06b6d4', desc: 'A personal index of 40+ mental models with real-world application notes.' },
  { title: 'Team Event Log', tag: 'Leadership', color: '#f59e0b', desc: 'Post-mortems from events I organised — what shipped, what broke, what I learned.' },
  { title: 'Cross-domain Connections', tag: 'Polymath', color: '#a855f7', desc: 'A map of surprising links between CS, economics, biology and art.' },
]

// ── Featured slider ───────────────────────────────────────────────────────────
function FeaturedSlider() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((next: number, direction: number) => {
    setDir(direction)
    setCurrent((next + FEATURED.length) % FEATURED.length)
  }, [])

  // Auto-advance
  useEffect(() => {
    timer.current = setInterval(() => go(current + 1, 1), 5000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [current, go])

  const prev = () => { if (timer.current) clearInterval(timer.current); go(current - 1, -1) }
  const next = () => { if (timer.current) clearInterval(timer.current); go(current + 1, 1) }

  const p = FEATURED[current]

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    centre: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Main card */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: 340,
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(124,58,237,0.2)',
        background: 'linear-gradient(135deg, rgba(13,1,24,0.98) 0%, rgba(7,1,15,0.98) 100%)',
      }}>
        {/* Background glow that shifts with slide */}
        <motion.div
          key={`glow-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 70% 60% at 70% 50%, ${p.tagColor}12 0%, transparent 70%)`,
          }}
        />

        {/* Top accent */}
        <motion.div
          key={`accent-${current}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${p.tagColor}, ${p.tagColor}00)`,
            transformOrigin: 'left',
          }}
        />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="centre"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '3rem 3.5rem', display: 'flex', gap: '3rem', alignItems: 'center' }}
          >
            {/* Left: index + tag */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '5rem', fontWeight: 900, lineHeight: 1,
                color: `${p.tagColor}18`,
                marginBottom: '0.5rem',
                userSelect: 'none',
              }}>
                {String(current + 1).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                letterSpacing: '0.2em', color: p.tagColor,
                border: `1px solid ${p.tagColor}40`,
                padding: '0.2rem 0.6rem', borderRadius: '2px',
                whiteSpace: 'nowrap',
              }}>
                {p.tag}
              </div>
            </div>

            {/* Right: content */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.2em', color: 'rgba(148,163,184,0.4)',
                marginBottom: '0.6rem',
              }}>{p.year}</div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 700, lineHeight: 1.15,
                color: 'var(--white)', marginBottom: '1rem',
              }}>{p.title}</h3>

              <p style={{
                fontSize: '0.95rem', color: 'var(--silver)',
                lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: 480,
              }}>{p.desc}</p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
                {p.tech.map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    letterSpacing: '0.1em', color: p.tagColor,
                    border: `1px solid ${p.tagColor}35`,
                    padding: '0.2rem 0.6rem', borderRadius: '2px',
                  }}>{t}</span>
                ))}
              </div>

              <a href={p.link} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--void)',
                background: `linear-gradient(135deg, ${p.tagColor}, ${p.tagColor}cc)`,
                padding: '0.65rem 1.6rem', borderRadius: '2px',
                display: 'inline-block',
                boxShadow: `0 0 20px ${p.tagColor}30`,
              }}>View Project →</a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '1.2rem', padding: '0 0.2rem',
      }}>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {FEATURED.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { if (timer.current) clearInterval(timer.current); go(i, i > current ? 1 : -1) }}
              whileHover={{ scale: 1.3 }}
              style={{
                width: i === current ? 20 : 6, height: 6,
                borderRadius: '3px',
                background: i === current ? 'var(--violet-bright)' : 'rgba(124,58,237,0.25)',
                border: 'none', cursor: 'none',
                transition: 'width 0.3s, background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {[{ fn: prev, label: '←' }, { fn: next, label: '→' }].map(({ fn, label }) => (
            <motion.button
              key={label} onClick={fn}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '1rem',
                color: 'var(--violet-glow)',
                border: '1px solid rgba(124,58,237,0.3)',
                background: 'rgba(13,1,24,0.8)',
                width: 38, height: 38, borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'none',
              }}
            >{label}</motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Small project card ────────────────────────────────────────────────────────
function SmallCard({ p, i, inView }: { p: typeof SMALL[0]; i: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.6 + i * 0.08 }}
      whileHover={{ y: -4, borderColor: `${p.color}50` }}
      style={{
        background: 'rgba(13,1,24,0.8)',
        border: `1px solid ${p.color}20`,
        borderRadius: '6px', padding: '1.4rem 1.5rem',
        backdropFilter: 'blur(16px)',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.3s',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, ${p.color}70, transparent)`,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.15em', color: p.color,
          border: `1px solid ${p.color}35`,
          padding: '0.15rem 0.5rem', borderRadius: '2px',
        }}>{p.tag}</span>
        <span style={{ fontSize: '1rem', color: `${p.color}60` }}>↗</span>
      </div>
      <h4 style={{
        fontFamily: 'var(--font-display)', fontSize: '0.9rem',
        color: 'var(--white)', marginBottom: '0.5rem', lineHeight: 1.3,
      }}>{p.title}</h4>
      <p style={{ fontSize: '0.78rem', color: 'var(--silver)', lineHeight: 1.65 }}>{p.desc}</p>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Projects() {
  const { ref, inView } = useInView(0.05)

  return (
    <section id="projects" style={{ padding: '10rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--violet-bright)', fontSize: '0.8rem' }}>04.</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silver)' }}>Projects</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)', maxWidth: 300 }} />
        </motion.div>

        {/* Featured slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ marginBottom: '5rem' }}
        >
          <FeaturedSlider />
        </motion.div>

        {/* Small projects grid */}
        <div style={{ marginBottom: '2rem' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.35)', marginBottom: '1.5rem',
            }}
          >Other work</motion.p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {SMALL.map((p, i) => (
              <SmallCard key={p.title} p={p} i={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
