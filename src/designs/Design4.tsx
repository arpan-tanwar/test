import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

/* ==========================================================================
   DESIGN 4 — "NEO-TOKYO"
   Cyberpunk aesthetic. Neon pinks, cyans, electric purples on deep dark.
   Japanese-inspired design cues, scrolling marquee text, angular layouts,
   glitch effects. Fonts: Orbitron + Rajdhani.
   ========================================================================== */

const NEO = {
  cyan: '#00f5ff',
  pink: '#ff2d6f',
  purple: '#b829dd',
  yellow: '#ffe156',
  darkBg: '#0a0a12',
  lightBg: '#f0eef5',
  darkCard: '#0e0e1a',
  lightCard: '#e8e6f0',
}

// ─── CSS KEYFRAMES (injected once) ──────────────────────────────────────────

const styles = `
@keyframes glitch1 {
  0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
  20% { clip-path: inset(20% 0 60% 0); transform: translate(2px, 0); }
  40% { clip-path: inset(40% 0 40% 0); transform: translate(-1px, 0); }
  60% { clip-path: inset(60% 0 20% 0); transform: translate(1px, 0); }
  80% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes scanline {
  0% { top: -5%; }
  100% { top: 105%; }
}
@keyframes neonPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
`

// ─── 3D NEON SHAPES ─────────────────────────────────────────────────────────

function NeonTorus({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.3
    ref.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <Float speed={2} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </Float>
  )
}

function NeonOctahedron({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.y += 0.01
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
  })
  return (
    <Float speed={1.5} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.6]} />
        <MeshWobbleMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
          speed={1}
          factor={0.2}
        />
      </mesh>
    </Float>
  )
}

function CyberScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={1} color={NEO.cyan} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={NEO.pink} />
      <pointLight position={[0, 2, -3]} intensity={0.5} color={NEO.purple} />

      <NeonTorus position={[-2.5, 1, -1]} color={NEO.cyan} />
      <NeonTorus position={[2.5, -0.5, 0]} color={NEO.pink} />
      <NeonOctahedron position={[1, 2, -2]} color={NEO.purple} />
      <NeonOctahedron position={[-1.5, -1.5, 0.5]} color={NEO.cyan} />

      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial color="#0a0a12" wireframe transparent opacity={0.15} />
      </mesh>
    </Canvas>
  )
}

// ─── MARQUEE TEXT ────────────────────────────────────────────────────────────

function Marquee({ text, color, speed = 20 }: { text: string; color: string; speed?: number }) {
  return (
    <div style={{
      overflow: 'hidden', whiteSpace: 'nowrap' as const,
      borderTop: `1px solid ${color}30`,
      borderBottom: `1px solid ${color}30`,
      padding: '0.6rem 0',
    }}>
      <div style={{
        display: 'inline-block',
        animation: `marquee ${speed}s linear infinite`,
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase' as const,
        color: color,
        opacity: 0.6,
      }}>
        {Array(10).fill(text).join('   ///   ')}
      </div>
    </div>
  )
}

// ─── THEME TOGGLE ───────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ boxShadow: `0 0 20px ${NEO.cyan}60` }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 40, height: 40,
        border: `1px solid ${NEO.cyan}40`,
        background: isDark ? 'rgba(0,245,255,0.05)' : 'rgba(0,0,0,0.05)',
        color: isDark ? NEO.cyan : NEO.pink,
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.8rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      }}
    >{isDark ? '◇' : '◆'}</motion.button>
  )
}

// ─── NAV ────────────────────────────────────────────────────────────────────

function Nav({ isDark }: { isDark: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const fg = isDark ? '#e2e8f0' : '#1a1a2e'

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled
          ? isDark ? 'rgba(10,10,18,0.9)' : 'rgba(240,238,245,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${NEO.cyan}15` : 'none',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
          fontSize: '1.4rem', color: NEO.cyan,
          textShadow: `0 0 10px ${NEO.cyan}60, 0 0 20px ${NEO.cyan}30`,
          animation: 'neonPulse 3s ease-in-out infinite',
        }}>RE</div>
        <span style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
          fontSize: '1.1rem', color: fg,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
        }}>Roomease</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '2rem',
        fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', fontWeight: 600,
        letterSpacing: '0.15em', textTransform: 'uppercase' as const,
        color: isDark ? 'rgba(226,232,240,0.6)' : 'rgba(26,26,46,0.6)',
      }}>
        {['Protocol', 'Systems', 'Network', 'Access'].map(item => (
          <motion.a
            key={item} href="#"
            whileHover={{ color: NEO.cyan, textShadow: `0 0 8px ${NEO.cyan}60` }}
          >{item}</motion.a>
        ))}
        <ThemeToggle />
        <motion.button
          whileHover={{ boxShadow: `0 0 30px ${NEO.pink}50`, background: NEO.pink }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.6rem 1.5rem',
            background: `${NEO.pink}20`,
            border: `1px solid ${NEO.pink}60`,
            color: NEO.pink,
            fontFamily: 'Orbitron, sans-serif', fontWeight: 600,
            fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            cursor: 'pointer',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}
        >Initialize</motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO ───────────────────────────────────────────────────────────────────

function Hero({ isDark }: { isDark: boolean }) {
  const fg = isDark ? '#e2e8f0' : '#1a1a2e'

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
      background: isDark ? NEO.darkBg : NEO.lightBg,
    }}>
      {/* Scanline overlay */}
      {isDark && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }} />
      )}

      {/* Grid lines */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '40%',
        background: isDark
          ? `linear-gradient(transparent 0%, ${NEO.darkBg} 100%), repeating-linear-gradient(90deg, ${NEO.cyan}08 0, ${NEO.cyan}08 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, ${NEO.cyan}08 0, ${NEO.cyan}08 1px, transparent 1px, transparent 80px)`
          : `linear-gradient(transparent 0%, ${NEO.lightBg} 100%), repeating-linear-gradient(90deg, ${NEO.pink}08 0, ${NEO.pink}08 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, ${NEO.pink}08 0, ${NEO.pink}08 1px, transparent 1px, transparent 80px)`,
        perspective: '500px',
        transform: 'rotateX(60deg)',
        transformOrigin: 'bottom',
      }} />

      <CyberScene />

      <div style={{
        position: 'relative', zIndex: 10,
        padding: '0 5rem', maxWidth: 800,
      }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            border: `1px solid ${NEO.cyan}40`,
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.6rem', fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase' as const,
            color: NEO.cyan,
            marginBottom: '2rem',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}
        >◈ System Online — Matching Protocol Active</motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: fg,
            marginBottom: '1.5rem',
            position: 'relative',
          }}
        >
          YOUR NEXT<br />
          <span style={{
            color: NEO.cyan,
            textShadow: `0 0 20px ${NEO.cyan}60, 0 0 40px ${NEO.cyan}30`,
          }}>ROOMMATE</span><br />
          <span style={{
            color: NEO.pink,
            textShadow: `0 0 20px ${NEO.pink}60, 0 0 40px ${NEO.pink}30`,
          }}>AWAITS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.1rem', fontWeight: 500,
            lineHeight: 1.8,
            color: isDark ? 'rgba(226,232,240,0.5)' : 'rgba(26,26,46,0.5)',
            maxWidth: 500,
            marginBottom: '2.5rem',
          }}
        >Neural matching engine. 50+ compatibility vectors. Your living space, optimized by intelligence.</motion.p>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: 'flex', gap: '1rem' }}
        >
          <motion.button
            whileHover={{ boxShadow: `0 0 40px ${NEO.cyan}50` }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2.5rem',
              background: `linear-gradient(135deg, ${NEO.cyan}, ${NEO.purple})`,
              color: '#0a0a12',
              fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
              fontSize: '0.8rem', letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              border: 'none', cursor: 'pointer',
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
            }}
          >Launch Match →</motion.button>
          <motion.button
            whileHover={{ borderColor: NEO.cyan, color: NEO.cyan }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(226,232,240,0.2)' : 'rgba(26,26,46,0.2)'}`,
              color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(26,26,46,0.7)',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
              fontSize: '0.9rem', letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
            }}
          >View Protocol</motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: '3rem',
            display: 'flex', gap: '2.5rem',
          }}
        >
          {[
            { val: '10,247', label: 'CONNECTIONS' },
            { val: '98.7%', label: 'ACCURACY' },
            { val: '<72h', label: 'AVG MATCH' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'Orbitron, sans-serif', fontWeight: 800,
                fontSize: '1.5rem', color: NEO.cyan,
                textShadow: `0 0 10px ${NEO.cyan}40`,
              }}>{s.val}</div>
              <div style={{
                fontFamily: 'Rajdhani, sans-serif', fontSize: '0.7rem',
                fontWeight: 600, letterSpacing: '0.2em',
                color: isDark ? 'rgba(226,232,240,0.3)' : 'rgba(26,26,46,0.3)',
                marginTop: '0.2rem',
              }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── PROTOCOL (HOW IT WORKS) ────────────────────────────────────────────────

function Protocol({ isDark }: { isDark: boolean }) {
  const fg = isDark ? '#e2e8f0' : '#1a1a2e'
  const steps = [
    { phase: 'PHASE_01', title: 'DATA INPUT', desc: 'Upload your lifestyle matrix — habits, schedule, budget, personality vectors.', color: NEO.cyan },
    { phase: 'PHASE_02', title: 'NEURAL PROCESSING', desc: 'Our engine analyzes 50+ compatibility dimensions using advanced algorithms.', color: NEO.pink },
    { phase: 'PHASE_03', title: 'MATCH GENERATION', desc: 'Receive ranked compatibility scores. Browse curated matches in real-time.', color: NEO.purple },
    { phase: 'PHASE_04', title: 'DEPLOYMENT', desc: 'Connect, verify, and finalize your living arrangement. Seamless transition.', color: NEO.yellow },
  ]

  return (
    <section style={{
      background: isDark ? '#08080f' : '#e8e6f0',
      padding: '1rem 0',
    }}>
      <Marquee text="MATCHING PROTOCOL — NEURAL NETWORK — COMPATIBILITY ENGINE — ROOMEASE SYSTEM" color={NEO.cyan} />

      <div style={{ padding: '6rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '4rem' }}
          >
            <span style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
              fontWeight: 600, letterSpacing: '0.3em',
              color: NEO.cyan, opacity: 0.8,
            }}>◈ PROTOCOL</span>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900, color: fg,
              marginTop: '0.5rem',
            }}>MATCHING <span style={{ color: NEO.pink }}>SEQUENCE</span></h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.phase}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{
                  background: isDark ? `${s.color}08` : `${s.color}10`,
                }}
                style={{
                  display: 'grid', gridTemplateColumns: '140px 200px 1fr',
                  gap: '2rem', alignItems: 'center',
                  padding: '2rem',
                  borderLeft: `2px solid ${s.color}`,
                  background: isDark ? NEO.darkCard : NEO.lightCard,
                  transition: 'background 0.3s',
                }}
              >
                <span style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem',
                  fontWeight: 700, letterSpacing: '0.2em',
                  color: s.color,
                }}>{s.phase}</span>
                <h3 style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: '1rem',
                  fontWeight: 700, color: fg,
                }}>{s.title}</h3>
                <p style={{
                  fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem',
                  fontWeight: 500, lineHeight: 1.7,
                  color: isDark ? 'rgba(226,232,240,0.45)' : 'rgba(26,26,46,0.45)',
                }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Marquee text="AI POWERED — VERIFIED PROFILES — BUDGET SYNC — SMART FILTERS — LOCATION DATA" color={NEO.pink} speed={25} />
    </section>
  )
}

// ─── SYSTEMS (FEATURES) ─────────────────────────────────────────────────────

function Systems({ isDark }: { isDark: boolean }) {
  const fg = isDark ? '#e2e8f0' : '#1a1a2e'
  const features = [
    { id: 'SYS_01', title: 'Neural Match Engine', desc: 'Deep learning across 50+ lifestyle compatibility vectors.', color: NEO.cyan },
    { id: 'SYS_02', title: 'Identity Shield', desc: 'Military-grade verification and background scanning.', color: NEO.pink },
    { id: 'SYS_03', title: 'Budget Optimizer', desc: 'Financial alignment engine eliminates money friction.', color: NEO.yellow },
    { id: 'SYS_04', title: 'Lifestyle Matrix', desc: 'Pets, noise, schedule, cleanliness — every dimension mapped.', color: NEO.purple },
    { id: 'SYS_05', title: 'Encrypted Comms', desc: 'Secure messaging with AI-generated conversation bridges.', color: NEO.cyan },
    { id: 'SYS_06', title: 'Geo Intelligence', desc: 'Neighborhood data, commute analysis, proximity scoring.', color: NEO.pink },
  ]

  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? NEO.darkBg : NEO.lightBg,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '4rem', textAlign: 'right' }}
        >
          <span style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
            fontWeight: 600, letterSpacing: '0.3em',
            color: NEO.pink, opacity: 0.8,
          }}>◈ SYSTEMS</span>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900, color: fg,
            marginTop: '0.5rem',
          }}>CORE <span style={{ color: NEO.cyan }}>MODULES</span></h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: isDark ? 'rgba(226,232,240,0.05)' : 'rgba(26,26,46,0.05)',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{
                background: isDark ? `${f.color}08` : `${f.color}12`,
              }}
              style={{
                padding: '2.5rem 2rem',
                background: isDark ? NEO.darkBg : NEO.lightBg,
                borderTop: `2px solid ${f.color}40`,
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              <div style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem',
                fontWeight: 600, letterSpacing: '0.25em',
                color: f.color, opacity: 0.6,
                marginBottom: '1rem',
              }}>{f.id}</div>
              <h3 style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem',
                fontWeight: 700, color: fg,
                marginBottom: '0.75rem',
              }}>{f.title}</h3>
              <p style={{
                fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem',
                fontWeight: 500, lineHeight: 1.7,
                color: isDark ? 'rgba(226,232,240,0.4)' : 'rgba(26,26,46,0.4)',
              }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── NETWORK (TESTIMONIALS) ─────────────────────────────────────────────────

function Network({ isDark }: { isDark: boolean }) {
  const fg = isDark ? '#e2e8f0' : '#1a1a2e'
  const entries = [
    { handle: '@sarah_k', location: 'NYC-NODE', text: 'Matched in 48 hours. The compatibility matrix was incredibly accurate. Best roommate I\'ve ever had.', color: NEO.cyan },
    { handle: '@marcus_t', location: 'SF-NODE', text: 'After a terrible experience, I was skeptical. Roomease\'s neural engine proved me wrong — perfect match.', color: NEO.pink },
    { handle: '@priya_m', location: 'ATX-NODE', text: 'The budget optimizer eliminated every awkward money conversation. We were aligned from initialization.', color: NEO.yellow },
  ]

  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? '#08080f' : '#e8e6f0',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '4rem' }}
        >
          <span style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
            fontWeight: 600, letterSpacing: '0.3em',
            color: NEO.yellow, opacity: 0.8,
          }}>◈ NETWORK</span>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900, color: fg,
            marginTop: '0.5rem',
          }}>USER <span style={{ color: NEO.yellow }}>REPORTS</span></h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((e, i) => (
            <motion.div
              key={e.handle}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              style={{
                padding: '2rem',
                background: isDark ? NEO.darkCard : NEO.lightCard,
                borderLeft: `2px solid ${e.color}`,
                display: 'grid', gridTemplateColumns: '150px 1fr',
                gap: '2rem',
              }}
            >
              <div>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem',
                  fontWeight: 700, color: e.color,
                }}>{e.handle}</div>
                <div style={{
                  fontFamily: 'Rajdhani, sans-serif', fontSize: '0.7rem',
                  fontWeight: 600, letterSpacing: '0.15em',
                  color: isDark ? 'rgba(226,232,240,0.3)' : 'rgba(26,26,46,0.3)',
                  marginTop: '0.25rem',
                }}>{e.location}</div>
              </div>
              <p style={{
                fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem',
                fontWeight: 500, lineHeight: 1.8,
                color: isDark ? 'rgba(226,232,240,0.6)' : 'rgba(26,26,46,0.6)',
              }}>"{e.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ────────────────────────────────────────────────────────────────────

function CTA({ isDark }: { isDark: boolean }) {
  const fg = isDark ? '#e2e8f0' : '#1a1a2e'
  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? NEO.darkBg : NEO.lightBg,
      textAlign: 'center',
      position: 'relative',
    }}>
      {isDark && <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${NEO.cyan}08 0%, transparent 60%)`,
      }} />}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 900, color: fg,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
        }}>
          INITIALIZE<br />
          <span style={{ color: NEO.cyan, textShadow: `0 0 20px ${NEO.cyan}60` }}>YOUR</span>{' '}
          <span style={{ color: NEO.pink, textShadow: `0 0 20px ${NEO.pink}60` }}>MATCH</span>
        </h2>
        <p style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem',
          fontWeight: 500, lineHeight: 1.7,
          color: isDark ? 'rgba(226,232,240,0.4)' : 'rgba(26,26,46,0.4)',
          maxWidth: 500, margin: '0 auto 2.5rem',
        }}>10,000+ users in the network. Free initialization. Your optimal roommate is one algorithm away.</p>
        <motion.button
          whileHover={{ boxShadow: `0 0 50px ${NEO.cyan}50, 0 0 100px ${NEO.pink}30` }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1.2rem 3.5rem',
            background: `linear-gradient(135deg, ${NEO.cyan}, ${NEO.purple})`,
            color: '#0a0a12',
            fontFamily: 'Orbitron, sans-serif', fontWeight: 800,
            fontSize: '0.85rem', letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            border: 'none', cursor: 'pointer',
            clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
            boxShadow: `0 0 30px ${NEO.cyan}30`,
          }}
        >Begin Protocol →</motion.button>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer style={{
      padding: '2rem 2.5rem',
      background: isDark ? '#050508' : '#dddae5',
      borderTop: `1px solid ${NEO.cyan}15`,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem',
        fontWeight: 600, letterSpacing: '0.15em',
        color: isDark ? 'rgba(226,232,240,0.3)' : 'rgba(26,26,46,0.3)',
        textTransform: 'uppercase' as const,
      }}>
        <span>© 2026 Roomease Systems</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Protocol', 'Privacy', 'Terms'].map(l => (
            <a key={l} href="#" style={{ color: 'inherit' }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function Design4() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? NEO.darkBg : NEO.lightBg,
      transition: 'background 0.5s',
    }}>
      <style>{styles}</style>
      <Nav isDark={isDark} />
      <Hero isDark={isDark} />
      <Protocol isDark={isDark} />
      <Systems isDark={isDark} />
      <Network isDark={isDark} />
      <CTA isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  )
}
