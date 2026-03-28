import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  id: number
  date: string
  title: string
  excerpt: string
  tag: string
  readTime: string
}

const POSTS: Post[] = [
  {
    id: 1,
    date: 'Mar 2025',
    title: 'Why I stopped calling myself a developer',
    excerpt: 'The label we choose shapes what we become. When I realised I was optimising for the wrong identity, everything changed.',
    tag: 'Identity',
    readTime: '3 min',
  },
  {
    id: 2,
    date: 'Feb 2025',
    title: 'First principles: the most overused phrase in tech',
    excerpt: 'Everyone claims to think from first principles. Almost nobody actually does. Here\'s the test I use to tell the difference.',
    tag: 'Thinking',
    readTime: '5 min',
  },
  {
    id: 3,
    date: 'Jan 2025',
    title: 'What the lockdown taught me about learning',
    excerpt: 'Stripped of school, routines, and external structure — I had to figure out what learning actually meant to me.',
    tag: 'Growth',
    readTime: '4 min',
  },
]

const tagColors: Record<string, string> = {
  Identity: 'var(--violet-glow)',
  Thinking: 'var(--teal)',
  Growth: 'var(--gold)',
}

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      data-cursor
      style={{
        background: 'rgba(13,1,24,0.7)',
        border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: '6px', padding: '2rem',
        backdropFilter: 'blur(20px)',
        cursor: 'none', position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${tagColors[post.tag] ?? 'var(--violet-bright)'}60, transparent)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em',
          color: tagColors[post.tag] ?? 'var(--violet-bright)',
          border: `1px solid ${tagColors[post.tag] ?? 'var(--violet-bright)'}40`,
          padding: '0.2rem 0.6rem', borderRadius: '2px',
        }}>{post.tag}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--silver)', opacity: 0.5 }}>{post.readTime} read</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--white)', marginBottom: '0.8rem', lineHeight: 1.35 }}>{post.title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--silver)', lineHeight: 1.75, marginBottom: '1.2rem' }}>{post.excerpt}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(148,163,184,0.4)', letterSpacing: '0.1em' }}>{post.date}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--violet-bright)' }}>Read →</span>
      </div>
    </motion.div>
  )
}

function PostView({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: 680, margin: '0 auto', paddingTop: '2rem' }}
    >
      <button onClick={onBack} style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em',
        color: 'var(--violet-bright)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        cursor: 'none', background: 'none', border: 'none',
      }}>
        ← Back to writing
      </button>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em',
        color: tagColors[post.tag] ?? 'var(--violet-bright)',
        border: `1px solid ${tagColors[post.tag] ?? 'var(--violet-bright)'}40`,
        padding: '0.2rem 0.6rem', borderRadius: '2px',
      }}>{post.tag}</span>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        color: 'var(--white)', marginTop: '1rem', marginBottom: '0.5rem', lineHeight: 1.2,
      }}>{post.title}</h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(148,163,184,0.4)', marginBottom: '3rem' }}>
        {post.date} · {post.readTime} read
      </p>
      <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: '2.5rem' }}>
        <p style={{ fontSize: '1rem', color: 'var(--silver)', lineHeight: 1.9, marginBottom: '1.5rem' }}>{post.excerpt}</p>
        <p style={{ fontSize: '1rem', color: 'var(--silver)', lineHeight: 1.9, opacity: 0.7, fontStyle: 'italic' }}>
          Full post coming soon. Writing takes time worth spending.
        </p>
      </div>
    </motion.div>
  )
}

interface BlogProps {
  visible: boolean
  onClose: () => void
}

export default function Blog({ visible, onClose }: BlogProps) {
  const [activePost, setActivePost] = useState<Post | null>(null)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="blog-overlay"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(3,0,10,0.97)',
            backdropFilter: 'blur(24px)',
            overflowY: 'auto',
          }}
        >
          {/* Ambient gradient */}
          <div style={{
            position: 'fixed', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,58,237,0.07) 0%, transparent 70%)',
          }} />

          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 2rem 8rem' }}>
            {/* Header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--violet-bright)', fontSize: '0.8rem' }}>05.</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silver)' }}>
                  Writing
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setActivePost(null); onClose() }}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em',
                  color: 'var(--silver)', border: '1px solid rgba(124,58,237,0.25)',
                  padding: '0.5rem 1.2rem', borderRadius: '2px', background: 'none', cursor: 'none',
                }}
              >
                ✕ Close
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {activePost ? (
                <PostView key="post" post={activePost} onBack={() => setActivePost(null)} />
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 700, color: 'var(--white)', marginBottom: '0.6rem',
                  }}>
                    Thinking out loud.
                  </h2>
                  <p style={{ color: 'var(--silver)', fontStyle: 'italic', marginBottom: '3.5rem', fontSize: '1rem' }}>
                    Ideas, observations, and things I'm still figuring out.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {POSTS.map(p => <PostCard key={p.id} post={p} onClick={() => setActivePost(p)} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
