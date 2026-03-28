import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Splat {
  id: number; x: number; y: number
  rays: { angle: number; len: number; width: number }[]
}

// Each point carries a timestamp so we can fade by age
interface Pt { x: number; y: number; t: number }

const TRAIL_DURATION = 600   // ms — how long a point lives
const TRAIL_MAX = 80         // max points in buffer

function LineTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ptsRef = useRef<Pt[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      ptsRef.current.push({ x: e.clientX, y: e.clientY, t: now })
      // Trim buffer
      if (ptsRef.current.length > TRAIL_MAX) {
        ptsRef.current = ptsRef.current.slice(-TRAIL_MAX)
      }
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = performance.now()

      // Drop expired points
      ptsRef.current = ptsRef.current.filter(p => now - p.t < TRAIL_DURATION)

      const pts = ptsRef.current
      if (pts.length < 2) { rafRef.current = requestAnimationFrame(draw); return }

      // Draw ONE continuous bezier path with gradient alpha
      // Split into segments and vary opacity by age
      for (let i = 1; i < pts.length; i++) {
        const age = now - pts[i].t
        const life = 1 - age / TRAIL_DURATION           // 1 = fresh, 0 = dead
        const alpha = life * life * 0.75                // quadratic ease-out
        const width = 0.6 + life * 2.2                 // thin at tail, thick at head

        ctx.beginPath()

        if (i === 1) {
          ctx.moveTo(pts[0].x, pts[0].y)
        } else {
          // Use midpoint of previous segment as start for smooth curve
          const mx = (pts[i - 1].x + pts[i - 2].x) / 2
          const my = (pts[i - 1].y + pts[i - 2].y) / 2
          ctx.moveTo(mx, my)
        }

        // Quadratic bezier through previous point to current
        const cpx = pts[i - 1].x
        const cpy = pts[i - 1].y
        ctx.quadraticCurveTo(cpx, cpy, pts[i].x, pts[i].y)

        ctx.strokeStyle = `rgba(168,85,247,${alpha})`
        ctx.lineWidth = width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      // Bright glowing tip at the very newest point
      const head = pts[pts.length - 1]
      const headAge = now - head.t
      if (headAge < 80) {
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 7)
        g.addColorStop(0, 'rgba(192,132,252,0.85)')
        g.addColorStop(1, 'rgba(124,58,237,0)')
        ctx.beginPath()
        ctx.arc(head.x, head.y, 7, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, pointerEvents: 'none',
      zIndex: 99990, mixBlendMode: 'screen',
    }} />
  )
}

export default function Cursor() {
  const [hovered, setHovered] = useState(false)
  const [splats, setSplats] = useState<Splat[]>([])
  const splatId = useRef(0)
  const rotVal = useRef(0)
  const rotMV = useMotionValue(0)

  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)
  const cx = useSpring(mouseX, { stiffness: 700, damping: 38 })
  const cy = useSpring(mouseY, { stiffness: 700, damping: 38 })

  // Slow spin
  useEffect(() => {
    let raf: number; let last: number | null = null
    const tick = (ts: number) => {
      if (last !== null) rotVal.current += (ts - last) * 0.018
      last = ts; rotMV.set(rotVal.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [rotMV])

  // Ink splat on click
  const spawnSplat = (x: number, y: number) => {
    const id = splatId.current++
    const rays = Array.from({ length: 8 + Math.floor(Math.random() * 5) }, () => ({
      angle: Math.random() * 360,
      len: 12 + Math.random() * 26,
      width: 0.7 + Math.random() * 1.5,
    }))
    setSplats(prev => [...prev, { id, x, y, rays }])
    setTimeout(() => setSplats(prev => prev.filter(s => s.id !== id)), 800)
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX); mouseY.set(e.clientY)
      setHovered((e.target as HTMLElement).closest('a,button,[data-cursor]') !== null)
    }
    const onDown = (e: MouseEvent) => spawnSplat(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
  }, [mouseX, mouseY])

  const arm = hovered ? 13 : 9
  const gap = hovered ? 6 : 4
  const col = hovered ? '#c084fc' : '#a855f7'
  const sw  = hovered ? 1.5 : 1

  return (
    <>
      <LineTrailCanvas />

      {/* Ink splats on click */}
      {splats.map(s => (
        <motion.svg key={s.id}
          initial={{ opacity: 1 }} animate={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          viewBox="-60 -60 120 120" width={120} height={120}
          style={{
            position: 'fixed', left: s.x, top: s.y,
            x: '-50%', y: '-50%',
            pointerEvents: 'none', zIndex: 99997,
            mixBlendMode: 'screen', overflow: 'visible',
          }}
        >
          {s.rays.map((r, i) => {
            const rad = (r.angle * Math.PI) / 180
            const ex = Math.cos(rad) * r.len, ey = Math.sin(rad) * r.len
            const bx = Math.cos(rad) * (r.len + 4), by = Math.sin(rad) * (r.len + 4)
            return (
              <g key={i}>
                <motion.line x1={0} y1={0} x2={0} y2={0}
                  animate={{ x2: ex, y2: ey }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  stroke={col} strokeWidth={r.width} strokeLinecap="round"
                />
                <motion.circle cx={0} cy={0} r={0}
                  animate={{ cx: bx, cy: by, r: r.width * 1.3 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  fill={col}
                />
              </g>
            )
          })}
          <motion.circle cx={0} cy={0} r={0} animate={{ r: 4 }} transition={{ duration: 0.13 }} fill={col} opacity={0.5} />
        </motion.svg>
      ))}

      {/* Rotating crosshair */}
      <motion.div style={{
        position: 'fixed', left: cx, top: cy,
        x: '-50%', y: '-50%',
        pointerEvents: 'none', zIndex: 99999,
        rotate: rotMV,
      }}>
        <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ overflow: 'visible', display: 'block' }}>
          <defs>
            <filter id="cur-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g filter="url(#cur-glow)">
            {([[-1,-1],[1,-1],[1,1],[-1,1]] as [number,number][]).map(([sx, sy], i) => (
              <g key={i}>
                <line x1={sx*gap} y1={sy*(gap+arm)} x2={sx*(gap+arm)} y2={sy*(gap+arm)} stroke={col} strokeWidth={sw} strokeLinecap="round" />
                <line x1={sx*(gap+arm)} y1={sy*gap} x2={sx*(gap+arm)} y2={sy*(gap+arm)} stroke={col} strokeWidth={sw} strokeLinecap="round" />
              </g>
            ))}
            <line x1={-2.5} y1={0} x2={2.5} y2={0} stroke={col} strokeWidth={sw} strokeLinecap="round" />
            <line x1={0} y1={-2.5} x2={0} y2={2.5} stroke={col} strokeWidth={sw} strokeLinecap="round" />
            <circle cx={0} cy={0} r={hovered ? 2.2 : 1.4} fill={col} />
          </g>
        </svg>
      </motion.div>
    </>
  )
}
