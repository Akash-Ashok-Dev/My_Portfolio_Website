import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const events = [
  { year: '2006', title: 'Born in Kerala', subtitle: 'The beginning', desc: 'Born into Kerala — land of literacy and quiet intellectual fire.', color: '#4c1d95' },
  { year: '2011', title: 'First Day of School', subtitle: 'Curiosity unlocked', desc: 'Entered school asking why before how. The pattern-seeking instinct started here.', color: '#6d28d9' },
  { year: '2014', title: 'Formative Years', subtitle: 'Cross-discipline spark', desc: 'Thrived across subjects. Started connecting ideas others kept separate.', color: '#7c3aed' },
  { year: '2018', title: 'First Leadership Role', subtitle: 'Class rep & team captain', desc: 'Discovered leading is about aligning people, not being the loudest voice.', color: '#f59e0b' },
  { year: '2020', title: 'Lockdown Awakening', subtitle: 'Self-directed explosion', desc: 'Dove into philosophy, strategy, history of science. Learned how to learn.', color: '#06b6d4' },
  { year: '2021', title: 'Mental OS Built', subtitle: 'First principles & models', desc: 'Constructed a personal thinking system — Socratic, Bayesian, first principles.', color: '#06b6d4' },
  { year: '2022', title: 'Into the Arena', subtitle: 'Competitions & debates', desc: 'Quizzes, debates, strategy events. Thinking under pressure became a skill.', color: '#e11d48' },
  { year: '2023', title: 'Owning the Breadth', subtitle: 'Higher Secondary', desc: 'Stopped picking one discipline. Owned being a polymath — depth in breadth.', color: '#a855f7' },
  { year: '2024', title: 'Leadership Deepens', subtitle: 'Events & team dynamics', desc: 'Organised events, led groups, mediated conflict. Each experience added a layer.', color: '#f59e0b' },
  { year: '2025 →', title: 'Model Engineering College', subtitle: 'CSBS — Now', desc: 'Joined MEC, Thrikkakara. Bridging technology and strategy. The real work begins.', color: '#c084fc', current: true },
]

export default function Timeline() {
  const { ref, inView } = useInView(0.05)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to rightmost (current) card on mount
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Wait for layout then jump to end
    const timer = setTimeout(() => {
      el.scrollLeft = el.scrollWidth
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="timeline" style={{ padding: '10rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--violet-bright)', fontSize: '0.8rem' }}>03.</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silver)' }}>The Journey</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)', maxWidth: 300 }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
          style={{ fontStyle: 'italic', color: 'rgba(148,163,184,0.45)', fontSize: '0.82rem', marginBottom: '3.5rem' }}
        >
          ← Scroll back in time
        </motion.p>
      </div>

      {/* Scrollable track — starts at right end */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          overflowY: 'visible',
          padding: '0 6vw 2.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'relative',
        }}
      >
        <style>{`#timeline-track::-webkit-scrollbar { display:none; }`}</style>

        <div id="timeline-track" style={{ display: 'flex', gap: '0', position: 'relative', width: 'max-content' }}>

          {/* Spine — sits behind cards */}
          <div style={{
            position: 'absolute',
            top: 30, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #4c1d95 4%, #7c3aed 40%, #a855f7 75%, #c084fc 97%, transparent)',
            pointerEvents: 'none',
          }} />

          {events.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 230, flexShrink: 0, position: 'relative', padding: '3.8rem 1rem 0' }}
            >
              {/* Node */}
              <motion.div
                animate={e.current
                  ? { boxShadow: [`0 0 0 0 ${e.color}90`, `0 0 0 10px ${e.color}00`] }
                  : {}}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{
                  position: 'absolute', top: 23, left: '50%',
                  transform: 'translateX(-50%)',
                  width: e.current ? 16 : 12,
                  height: e.current ? 16 : 12,
                  borderRadius: '50%',
                  background: e.color,
                  border: `3px solid var(--void)`,
                  boxShadow: `0 0 10px ${e.color}70`,
                  zIndex: 2,
                }}
              />

              {/* Stem */}
              <div style={{
                position: 'absolute', top: e.current ? 39 : 35,
                left: '50%', width: 1, height: 22,
                background: `linear-gradient(to bottom, ${e.color}70, transparent)`,
              }} />

              {/* Card */}
              <motion.div
                whileHover={{ y: -4, borderColor: `${e.color}55` }}
                style={{
                  background: 'linear-gradient(135deg, rgba(13,1,24,0.95), rgba(7,1,15,0.95))',
                  border: `1px solid ${e.color}22`,
                  borderRadius: '6px',
                  padding: '1.1rem 1.2rem',
                  backdropFilter: 'blur(16px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, transform 0.3s',
                  minHeight: 140,
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, ${e.color}70, transparent)`,
                }} />

                {e.current && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                      letterSpacing: '0.2em', color: e.color,
                      border: `1px solid ${e.color}50`,
                      padding: '0.1rem 0.4rem', borderRadius: '2px',
                      marginBottom: '0.45rem',
                    }}
                  >● NOW</motion.span>
                )}

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: e.color, marginBottom: '0.28rem', letterSpacing: '0.1em' }}>
                  {e.year}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--white)', marginBottom: '0.18rem', lineHeight: 1.3 }}>
                  {e.title}
                </h3>
                <div style={{ fontStyle: 'italic', fontSize: '0.7rem', color: e.color, marginBottom: '0.55rem', opacity: 0.8 }}>
                  {e.subtitle}
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--silver)', lineHeight: 1.65 }}>
                  {e.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
