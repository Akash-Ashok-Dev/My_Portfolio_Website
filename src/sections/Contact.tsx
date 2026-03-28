import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'

type FormState = 'idle' | 'sending' | 'sent' | 'error'

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  type?: string
  multiline?: boolean
  color: string
}

function Field({ label, name, value, onChange, type = 'text', multiline, color }: FieldProps) {
  const [focused, setFocused] = useState(false)

  const sharedStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(13,1,24,0.8)',
    border: `1px solid ${focused ? color : 'rgba(124,58,237,0.2)'}`,
    borderRadius: '4px',
    padding: '1rem 1.2rem',
    color: 'var(--mist)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    fontWeight: 300,
    outline: 'none',
    resize: multiline ? 'vertical' : undefined,
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: focused ? `0 0 20px ${color}20` : 'none',
    backdropFilter: 'blur(10px)',
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.label
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: focused ? color : 'var(--silver)',
          marginBottom: '0.5rem',
          transition: 'color 0.3s',
        }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          style={sharedStyle}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      )}
    </div>
  )
}

const socials = [
  { label: 'GitHub', handle: '@Akash-Ashok-Dev', href: 'https://github.com/Akash-Ashok-Dev', color: 'var(--mist)', icon: '⌥' },
  { label: 'LinkedIn', handle: 'akash-ashok-dev', href: 'https://www.linkedin.com/in/akash-ashok-dev/', color: 'var(--teal)', icon: '⊕' },
]

export default function Contact() {
  const { ref, inView } = useInView()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  const handleSubmit = async () => {
    if (!name || !email || !message) return
    setFormState('sending')

    // Simulate sending (replace with your actual backend / Formspree / EmailJS endpoint)
    await new Promise(r => setTimeout(r, 1800))
    setFormState('sent')

    setTimeout(() => {
      setName('')
      setEmail('')
      setMessage('')
      setFormState('idle')
    }, 4000)
  }

  return (
    <section id="contact" style={{ padding: '10rem 2rem', position: 'relative' }}>
      {/* Bloom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(124,58,237,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '760px', margin: '0 auto' }} ref={ref}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', justifyContent: 'center' }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)', maxWidth: 80 }} />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--violet-bright)', fontSize: '0.8rem' }}>04.</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silver)' }}>Let's Connect</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)', maxWidth: 80 }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '1.2rem',
            background: 'linear-gradient(135deg, var(--white), var(--violet-glow))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Have a vision?<br />Let's think it through.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ textAlign: 'center', color: 'var(--silver)', fontSize: '1rem', marginBottom: '3.5rem', fontStyle: 'italic', lineHeight: 1.8 }}
        >
          Whether it's a collaboration, a conversation worth having, or just an idea worth bouncing — reach out.
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3.5rem', flexWrap: 'wrap' }}
        >
          {socials.map(s => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                background: 'rgba(13,1,24,0.8)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '4px',
                padding: '0.75rem 1.5rem',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.3s',
              }}
            >
              <span style={{ color: s.color, fontSize: '1.1rem' }}>{s.icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--white)' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--silver)' }}>{s.handle}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.1)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(148,163,184,0.3)', textTransform: 'uppercase' }}>or send a message</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.1)' }} />
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            background: 'rgba(13,1,24,0.6)',
            border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: '8px',
            padding: '2.5rem',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top glow line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)',
          }} />

          <AnimatePresence mode="wait">
            {formState === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '3rem 0' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>◎</div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--violet-glow)', fontSize: '1.3rem', marginBottom: '0.7rem' }}>
                  Message Received
                </h3>
                <p style={{ color: 'var(--silver)', fontSize: '0.9rem' }}>
                  I'll get back to you when I've thought it through properly.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <Field label="Name" name="name" value={name} onChange={setName} color="var(--violet-glow)" />
                  <Field label="Email" name="email" value={email} onChange={setEmail} type="email" color="var(--violet-glow)" />
                </div>
                <Field label="Message" name="message" value={message} onChange={setMessage} multiline color="var(--violet-glow)" />

                <motion.button
                  onClick={handleSubmit}
                  disabled={formState === 'sending' || !name || !email || !message}
                  whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
                  whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
                  style={{
                    alignSelf: 'flex-end',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: (!name || !email || !message) ? 'rgba(255,255,255,0.3)' : 'var(--void)',
                    background: (!name || !email || !message)
                      ? 'rgba(124,58,237,0.2)'
                      : 'linear-gradient(135deg, var(--violet-bright), var(--violet-core))',
                    border: 'none',
                    padding: '0.9rem 2.5rem',
                    borderRadius: '3px',
                    cursor: (!name || !email || !message) ? 'not-allowed' : 'none',
                    boxShadow: (!name || !email || !message) ? 'none' : '0 0 25px rgba(124,58,237,0.35)',
                    transition: 'all 0.3s',
                  }}
                >
                  {formState === 'sending' ? '◌ Sending...' : 'Send Message →'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 1 }}
          style={{ textAlign: 'center', marginTop: '5rem', borderTop: '1px solid rgba(124,58,237,0.08)', paddingTop: '2.5rem' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(148,163,184,0.25)', textTransform: 'uppercase' }}>
            Akash — CSBS '29 — Model Engineering College, Thrikkakara, Kerala
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(148,163,184,0.15)', marginTop: '0.4rem' }}>
            Designed & built by Akash himself · {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
