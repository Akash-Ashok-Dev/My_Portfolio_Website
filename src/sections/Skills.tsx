import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

// ── Data ──────────────────────────────────────────────────────────────────────
const GRAPH = [
  {
    id: 'strategy',
    label: 'Strategy',
    color: '#a855f7',
    skills: ['First Principles', 'Systems Thinking', 'Decision Frameworks', 'Root Cause Analysis', 'Scenario Planning'],
  },
  {
    id: 'thinking',
    label: 'Critical Thinking',
    color: '#06b6d4',
    skills: ['Socratic Method', 'Logical Reasoning', 'Bayesian Thinking', 'Mental Models', 'Argument Mapping'],
  },
  {
    id: 'creative',
    label: 'Creativity',
    color: '#f59e0b',
    skills: ['Lateral Thinking', 'Synthesis', 'Reframing', 'Ideation', 'Analogical Reasoning'],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    color: '#e11d48',
    skills: ['Team Dynamics', 'Conflict Resolution', 'Vision Setting', 'Delegation', 'Motivating Others'],
  },
  {
    id: 'learning',
    label: 'Meta-Learning',
    color: '#10b981',
    skills: ['Rapid Acquisition', 'Spaced Repetition', 'Feynman Technique', 'Note-taking Systems', 'Curiosity-driven Study'],
  },
  {
    id: 'tech',
    label: 'Technology',
    color: '#6366f1',
    skills: ['Computer Science', 'Business Systems', 'Algorithmic Thinking', 'Data Intuition', 'Product Thinking'],
  },
]

// ── Layout maths ──────────────────────────────────────────────────────────────
const W = 900
const H = 680
const CX = W / 2
const CY = H / 2
const BRANCH_R = 195   // centre → category node
const SKILL_R = 88     // category node → skill node

function categoryPos(i: number, total: number) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2
  return { x: CX + Math.cos(angle) * BRANCH_R, y: CY + Math.sin(angle) * BRANCH_R, angle }
}

function skillPos(cx: number, cy: number, catAngle: number, si: number, total: number) {
  const spread = Math.min(Math.PI * 0.55, (total - 1) * 0.22)
  const step = total > 1 ? spread / (total - 1) : 0
  const a = catAngle - spread / 2 + si * step
  return { x: cx + Math.cos(a) * SKILL_R, y: cy + Math.sin(a) * SKILL_R }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const { ref, inView } = useInView(0.1)
  const [active, setActive] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (svgRef.current && !svgRef.current.contains(e.target as Node)) setActive(null)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [])

  return (
    <section id="skills" style={{ padding: '10rem 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--violet-bright)', fontSize: '0.8rem' }}>02.</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silver)' }}>
            Skills
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)', maxWidth: 300 }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.25 }}
          style={{ fontStyle: 'italic', color: 'rgba(148,163,184,0.45)', fontSize: '0.82rem', marginBottom: '3rem' }}
        >
          Click a category to explore
        </motion.p>

        {/* Graph canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ maxWidth: W, overflow: 'visible', userSelect: 'none' }}
          >
            <defs>
              <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="centre-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {GRAPH.map((cat, ci) => {
              const total = GRAPH.length
              const cp = categoryPos(ci, total)
              const isActive = active === cat.id
              const isDimmed = active !== null && !isActive

              return (
                <g key={cat.id}>
                  {/* Centre → category line */}
                  <motion.line
                    x1={CX} y1={CY} x2={cp.x} y2={cp.y}
                    stroke={cat.color}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeOpacity={isDimmed ? 0.08 : isActive ? 0.7 : 0.25}
                    style={{ transition: 'all 0.35s' }}
                  />

                  {/* Category → skill lines */}
                  {cat.skills.map((_, si) => {
                    const sp = skillPos(cp.x, cp.y, cp.angle, si, cat.skills.length)
                    return (
                      <motion.line
                        key={si}
                        x1={cp.x} y1={cp.y} x2={sp.x} y2={sp.y}
                        stroke={cat.color}
                        strokeWidth={0.7}
                        strokeOpacity={isActive ? 0.55 : 0}
                        style={{ transition: 'stroke-opacity 0.3s' }}
                      />
                    )
                  })}

                  {/* Skill boxes — only when category active */}
                  {cat.skills.map((skill, si) => {
                    const sp = skillPos(cp.x, cp.y, cp.angle, si, cat.skills.length)
                    const bw = 104, bh = 28
                    return (
                      <motion.g
                        key={si}
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.7 }}
                        transition={{ duration: 0.25, delay: isActive ? si * 0.04 : 0 }}
                        style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
                      >
                        <rect
                          x={sp.x - bw / 2} y={sp.y - bh / 2}
                          width={bw} height={bh}
                          rx={3}
                          fill={`${cat.color}18`}
                          stroke={cat.color}
                          strokeWidth={0.8}
                          strokeOpacity={0.6}
                        />
                        <text
                          x={sp.x} y={sp.y + 4.5}
                          textAnchor="middle"
                          fill={cat.color}
                          fontSize={10}
                          fontFamily="'Space Mono', monospace"
                          opacity={0.9}
                        >
                          {skill}
                        </text>
                      </motion.g>
                    )
                  })}

                  {/* Category node */}
                  <g
                    onClick={() => setActive(isActive ? null : cat.id)}
                    style={{ cursor: 'none' }}
                    filter={isActive ? 'url(#node-glow)' : undefined}
                  >
                    <motion.rect
                      x={cp.x - 52} y={cp.y - 16}
                      width={104} height={32}
                      rx={4}
                      fill={isActive ? cat.color : `${cat.color}22`}
                      stroke={cat.color}
                      strokeWidth={isActive ? 0 : 1}
                      strokeOpacity={isDimmed ? 0.2 : 0.7}
                      animate={{ opacity: isDimmed ? 0.25 : 1 }}
                      style={{ transition: 'fill 0.3s, opacity 0.3s' }}
                    />
                    <text
                      x={cp.x} y={cp.y + 5}
                      textAnchor="middle"
                      fill={isActive ? '#03000a' : cat.color}
                      fontSize={11}
                      fontFamily="'Cinzel', serif"
                      fontWeight={isActive ? '700' : '400'}
                      opacity={isDimmed ? 0.25 : 1}
                      style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}
                    >
                      {cat.label}
                    </text>
                  </g>
                </g>
              )
            })}

            {/* Centre node */}
            <g filter="url(#centre-glow)">
              <motion.circle
                cx={CX} cy={CY} r={46}
                fill="rgba(124,58,237,0.12)"
                stroke="rgba(168,85,247,0.5)"
                strokeWidth={1}
                animate={{ r: [46, 49, 46] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
              <circle cx={CX} cy={CY} r={38} fill="rgba(13,1,24,0.9)" stroke="rgba(168,85,247,0.35)" strokeWidth={1} />
              <text x={CX} y={CY - 6} textAnchor="middle" fill="#c084fc" fontSize={11} fontFamily="'Cinzel', serif" fontWeight="700">My</text>
              <text x={CX} y={CY + 10} textAnchor="middle" fill="#c084fc" fontSize={11} fontFamily="'Cinzel', serif" fontWeight="700">Skills</text>
            </g>
          </svg>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '2.5rem' }}
        >
          {GRAPH.map(cat => (
            <div
              key={cat.id}
              onClick={() => setActive(active === cat.id ? null : cat.id)}
              data-cursor
              style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.12em', color: cat.color,
                border: `1px solid ${cat.color}35`,
                padding: '0.3rem 0.8rem', borderRadius: '3px',
                cursor: 'none', opacity: active && active !== cat.id ? 0.3 : 1,
                transition: 'opacity 0.3s',
                background: active === cat.id ? `${cat.color}15` : 'transparent',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '1px', background: cat.color }} />
              {cat.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
