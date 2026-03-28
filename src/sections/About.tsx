import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const traits = [
  { label: 'Analyst', desc: 'Dissecting systems, finding patterns where others see noise.' },
  { label: 'Polymath', desc: 'Across CS, philosophy, strategy, art — depth in breadth.' },
  { label: 'Leader', desc: 'Guiding teams with vision, not just direction.' },
  { label: 'Creator', desc: 'Thinking laterally until the obvious becomes the impossible.' },
]

export default function About() {
  const { ref, inView } = useInView()

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: '10rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '4rem',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--violet-bright)', fontSize: '0.8rem' }}>01.</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silver)' }}>About</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)', maxWidth: 300 }} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, var(--white), var(--violet-glow))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Not yet a developer.<br />Already a thinker.
          </h2>
          <p style={{ color: 'var(--silver)', marginBottom: '1.2rem', fontSize: '1.05rem' }}>
            I'm Akash — a first-year Computer Science with Business Systems student at
            <strong style={{ color: 'var(--mist)' }}> Model Engineering College, Thrikkakara</strong>.
            While my peers race to ship code, I'm laying foundations: how to think, how to decide,
            how to lead.
          </p>
          <p style={{ color: 'var(--silver)', marginBottom: '1.2rem', fontSize: '1.05rem' }}>
            My edge isn't a framework or a language — it's the ability to step back from any problem,
            map the territory, and navigate it from first principles. That's the strategist's gift.
          </p>
          <p style={{ color: 'var(--silver)', fontSize: '1.05rem' }}>
            I believe in mastering the fundamentals before chasing the frontier. The polymath isn't
            someone who knows everything — it's someone who knows how everything connects.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <a
              href="https://github.com/Akash-Ashok-Dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.15em',
                color: 'var(--violet-bright)',
                border: '1px solid rgba(124,58,237,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '2px',
              }}
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/akash-ashok-dev/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.15em',
                color: 'var(--violet-bright)',
                border: '1px solid rgba(124,58,237,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '2px',
              }}
            >
              LinkedIn ↗
            </a>
          </div>
        </motion.div>

        {/* Right: trait cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {traits.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              whileHover={{ y: -4, borderColor: 'rgba(168,85,247,0.5)' }}
              style={{
                background: 'var(--glass)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '4px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.3s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                color: 'var(--violet-glow)',
                marginBottom: '0.6rem',
                letterSpacing: '0.05em',
              }}>
                {t.label}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--silver)', lineHeight: 1.6 }}>
                {t.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
