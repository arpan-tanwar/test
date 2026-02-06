import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

/* ==========================================================================
   DESIGN 2 — "BAUHAUS LIVING"
   Bauhaus-inspired. Primary colors (red, yellow, blue) on cream/black.
   Bold geometric shapes, strict grid system, asymmetric compositions.
   Fonts: Archivo Black + Space Mono.
   ========================================================================== */

const COLORS = {
  red: '#E63946',
  yellow: '#FFB703',
  blue: '#2B59C3',
  black: '#111111',
  cream: '#F7F3E9',
  darkBg: '#0D0D0D',
  lightBg: '#F7F3E9',
}

// ─── 3D GEOMETRIC SCENE ─────────────────────────────────────────────────────

function GeoBlock({ position, color, rotation }: {
  position: [number, number, number]; color: string; rotation?: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.y += 0.005
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })
  return (
    <Float speed={2} floatIntensity={0.5}>
      <RoundedBox ref={ref} position={position} rotation={rotation} args={[1, 1, 1]} radius={0.05}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
    </Float>
  )
}

function GeoCylinder({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * 0.2
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
    </Float>
  )
}

function GeoSphere({ position, color, size = 0.6 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  )
}

function BauhausScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, 3, 2]} intensity={0.6} color={COLORS.yellow} />

      <GeoBlock position={[-3, 1.5, -1]} color={COLORS.red} />
      <GeoBlock position={[3, -1, 0]} color={COLORS.blue} rotation={[0.5, 0.5, 0]} />
      <GeoCylinder position={[2.5, 2, -2]} color={COLORS.yellow} />
      <GeoSphere position={[-2.5, -1.5, 0.5]} color={COLORS.yellow} size={0.7} />
      <GeoSphere position={[0.5, 2.5, -1]} color={COLORS.red} size={0.4} />

      <mesh position={[-1, -2, -1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={COLORS.blue} wireframe />
      </mesh>
    </Canvas>
  )
}

// ─── THEME TOGGLE ───────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 40, height: 40,
        border: `2px solid ${theme === 'dark' ? COLORS.cream : COLORS.black}`,
        background: 'transparent',
        color: theme === 'dark' ? COLORS.cream : COLORS.black,
        fontFamily: 'Space Mono, monospace',
        fontSize: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >{theme === 'dark' ? '◐' : '◑'}</motion.button>
  )
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

function Nav({ isDark }: { isDark: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const bg = isDark ? COLORS.darkBg : COLORS.lightBg
  const fg = isDark ? COLORS.cream : COLORS.black

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? bg : 'transparent',
        borderBottom: scrolled ? `3px solid ${fg}` : 'none',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 36, height: 36,
          background: COLORS.red,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Archivo Black, sans-serif',
          color: '#fff', fontSize: '1.1rem',
        }}>R</div>
        <span style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: '1.3rem',
          color: fg,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        }}>Roomease</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '2rem',
        fontFamily: 'Space Mono, monospace', fontSize: '0.8rem',
        textTransform: 'uppercase' as const, letterSpacing: '0.1em',
        color: fg,
      }}>
        {['Process', 'Features', 'Stories', 'Pricing'].map(item => (
          <motion.a
            key={item} href="#"
            whileHover={{ color: COLORS.red }}
            style={{ fontWeight: 700 }}
          >{item}</motion.a>
        ))}
        <ThemeToggle />
        <motion.button
          whileHover={{ background: COLORS.yellow, color: COLORS.black }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.6rem 1.5rem',
            background: fg, color: bg,
            fontFamily: 'Space Mono, monospace',
            fontWeight: 700, fontSize: '0.8rem',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            border: 'none', cursor: 'pointer',
          }}
        >Join Now</motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO SECTION ───────────────────────────────────────────────────────────

function Hero({ isDark }: { isDark: boolean }) {
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg
  const fg = isDark ? COLORS.cream : COLORS.black

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: bg, overflow: 'hidden',
    }}>
      {/* Geometric background elements */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: 300, height: 300,
        background: COLORS.yellow, opacity: isDark ? 0.15 : 0.12,
        transform: 'rotate(15deg)',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '8%',
        width: 200, height: 200,
        borderRadius: '50%',
        background: COLORS.blue, opacity: isDark ? 0.15 : 0.1,
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        width: 150, height: 150,
        background: COLORS.red, opacity: isDark ? 0.1 : 0.08,
        transform: 'rotate(45deg)',
      }} />

      <BauhausScene />

      <div style={{
        position: 'relative', zIndex: 10,
        padding: '0 5rem', maxWidth: 700,
      }}>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            display: 'inline-block',
            background: COLORS.red, color: '#fff',
            padding: '0.3rem 1rem',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.15em',
            marginBottom: '2rem',
          }}>Smart Roommate Matching</div>
        </motion.div>

        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            lineHeight: 0.95,
            color: fg,
            textTransform: 'uppercase' as const,
            marginBottom: '2rem',
          }}
        >
          LIVE<br />
          <span style={{ color: COLORS.red }}>WITH</span><br />
          <span style={{ WebkitTextStroke: `2px ${fg}`, color: 'transparent' }}>PURPOSE</span>
        </motion.h1>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: isDark ? 'rgba(247,243,233,0.6)' : 'rgba(17,17,17,0.6)',
            maxWidth: 450,
            marginBottom: '2.5rem',
          }}
        >Precision-matched living. Our algorithm maps 50+ lifestyle dimensions to connect you with someone who truly fits.</motion.p>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: 'flex', gap: '1rem' }}
        >
          <motion.button
            whileHover={{ background: COLORS.yellow, color: COLORS.black }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2.5rem',
              background: COLORS.red, color: '#fff',
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: '0.9rem',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              cursor: 'pointer', border: 'none',
            }}
          >Find Match →</motion.button>
          <motion.button
            whileHover={{ background: fg, color: bg }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: `2px solid ${fg}`,
              color: fg,
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.8rem', fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >Learn More</motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            marginTop: '3rem',
            display: 'flex', gap: '3rem',
            fontFamily: 'Space Mono, monospace',
          }}
        >
          {[
            { num: '10K+', label: 'MATCHES' },
            { num: '50+', label: 'CITIES' },
            { num: '98%', label: 'SATISFACTION' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{
                fontSize: '2rem', fontWeight: 700,
                color: COLORS.yellow,
                fontFamily: 'Archivo Black, sans-serif',
              }}>{stat.num}</div>
              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: isDark ? 'rgba(247,243,233,0.4)' : 'rgba(17,17,17,0.4)',
                marginTop: '0.2rem',
              }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── PROCESS SECTION ────────────────────────────────────────────────────────

function Process({ isDark }: { isDark: boolean }) {
  const fg = isDark ? COLORS.cream : COLORS.black
  const steps = [
    { num: '01', title: 'PROFILE', desc: 'Build your living profile — habits, schedule, budget, personality.', color: COLORS.red },
    { num: '02', title: 'ALGORITHM', desc: 'Our engine maps compatibility across 50+ dimensions.', color: COLORS.blue },
    { num: '03', title: 'CONNECT', desc: 'Meet your top matches. Chat, ask questions, feel the vibe.', color: COLORS.yellow },
    { num: '04', title: 'MOVE IN', desc: 'Found the one? We smooth out the logistics.', color: COLORS.red },
  ]

  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? '#0A0A0A' : '#EDE8DC',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '5rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: COLORS.blue, color: '#fff',
            padding: '0.3rem 1rem',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem', fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.15em',
            marginBottom: '1.5rem',
          }}>Process</div>
          <h2 style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            color: fg,
            textTransform: 'uppercase' as const,
            lineHeight: 1,
          }}>HOW IT<br /><span style={{ color: COLORS.red }}>WORKS</span></h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
        }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -12 }}
              style={{
                padding: '2.5rem 2rem',
                borderLeft: i === 0 ? `3px solid ${step.color}` : `1px solid ${isDark ? 'rgba(247,243,233,0.1)' : 'rgba(17,17,17,0.1)'}`,
                borderTop: `3px solid ${step.color}`,
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: '4rem',
                color: step.color,
                opacity: 0.2,
                lineHeight: 1,
                marginBottom: '1rem',
              }}>{step.num}</div>
              <h3 style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: '1.3rem',
                color: fg,
                textTransform: 'uppercase' as const,
                marginBottom: '0.75rem',
              }}>{step.title}</h3>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.8rem',
                lineHeight: 1.8,
                color: isDark ? 'rgba(247,243,233,0.5)' : 'rgba(17,17,17,0.5)',
              }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ───────────────────────────────────────────────────────────────

function Features({ isDark }: { isDark: boolean }) {
  const fg = isDark ? COLORS.cream : COLORS.black
  const features = [
    { title: 'AI MATCHING', desc: 'Deep learning across 50+ lifestyle compatibility dimensions.', color: COLORS.red, shape: 'circle' },
    { title: 'VERIFIED IDS', desc: 'Every profile background-checked and identity-verified.', color: COLORS.blue, shape: 'square' },
    { title: 'BUDGET SYNC', desc: 'Financial alignment from day one. No surprises.', color: COLORS.yellow, shape: 'triangle' },
    { title: 'LIFESTYLE FILTER', desc: 'Pets, noise, schedule, cleanliness — all mapped.', color: COLORS.red, shape: 'square' },
    { title: 'SMART CHAT', desc: 'In-app messaging with compatibility icebreakers.', color: COLORS.yellow, shape: 'circle' },
    { title: 'LOCATION MAP', desc: 'Neighborhood data, commutes, and proximity scores.', color: COLORS.blue, shape: 'triangle' },
  ]

  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? COLORS.darkBg : COLORS.lightBg,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '5rem', textAlign: 'right' }}
        >
          <div style={{
            display: 'inline-block',
            background: COLORS.yellow, color: COLORS.black,
            padding: '0.3rem 1rem',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem', fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.15em',
            marginBottom: '1.5rem',
          }}>Features</div>
          <h2 style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            color: fg,
            textTransform: 'uppercase' as const,
            lineHeight: 1,
          }}>BUILT FOR<br /><span style={{ color: COLORS.blue }}>PRECISION</span></h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          background: isDark ? 'rgba(247,243,233,0.08)' : 'rgba(17,17,17,0.08)',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{
                background: f.color,
                color: f.color === COLORS.yellow ? COLORS.black : '#fff',
              }}
              style={{
                padding: '3rem 2rem',
                background: isDark ? COLORS.darkBg : COLORS.lightBg,
                cursor: 'pointer',
                transition: 'background 0.4s, color 0.4s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                width: f.shape === 'circle' ? 40 : 40,
                height: 40,
                borderRadius: f.shape === 'circle' ? '50%' : f.shape === 'triangle' ? '0' : '0',
                background: f.color,
                marginBottom: '1.5rem',
                clipPath: f.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              }} />
              <h3 style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: '1.1rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                color: 'inherit',
              }}>{f.title}</h3>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.8rem',
                lineHeight: 1.8,
                opacity: 0.6,
              }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

function Testimonials({ isDark }: { isDark: boolean }) {
  const fg = isDark ? COLORS.cream : COLORS.black
  const testimonials = [
    { name: 'SARAH K.', city: 'NEW YORK', text: 'Matched in 48 hours. My roommate and I have the same schedule, same standards, same vibe. Roomease just gets it.', color: COLORS.red },
    { name: 'MARCUS T.', city: 'SAN FRANCISCO', text: 'After a nightmare roommate experience, I was skeptical. Roomease proved me wrong — best match I could ask for.', color: COLORS.blue },
    { name: 'PRIYA M.', city: 'AUSTIN', text: 'The budget alignment feature eliminated every awkward money conversation. We were aligned from the start.', color: COLORS.yellow },
  ]

  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? '#0A0A0A' : '#EDE8DC',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '5rem' }}
        >
          <h2 style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            color: fg,
            textTransform: 'uppercase' as const,
            lineHeight: 1,
          }}>REAL<br /><span style={{ color: COLORS.yellow }}>STORIES</span></h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                borderLeft: `4px solid ${t.color}`,
                padding: '2.5rem',
                background: isDark ? COLORS.darkBg : COLORS.lightBg,
              }}
            >
              <div>
                <div style={{
                  fontFamily: 'Archivo Black, sans-serif',
                  fontSize: '0.9rem',
                  color: fg,
                }}>{t.name}</div>
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: t.color,
                  marginTop: '0.3rem',
                }}>{t.city}</div>
              </div>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.9rem',
                lineHeight: 1.8,
                color: isDark ? 'rgba(247,243,233,0.7)' : 'rgba(17,17,17,0.7)',
              }}>"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ────────────────────────────────────────────────────────────────────

function CTA({ isDark }: { isDark: boolean }) {
  const fg = isDark ? COLORS.cream : COLORS.black
  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark ? COLORS.darkBg : COLORS.lightBg,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 400, height: 400,
        background: COLORS.red, opacity: 0.08,
        transform: 'rotate(30deg)',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -50,
        width: 250, height: 250,
        borderRadius: '50%',
        background: COLORS.blue, opacity: 0.08,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        <h2 style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          color: fg,
          textTransform: 'uppercase' as const,
          lineHeight: 0.95,
          marginBottom: '2rem',
        }}>
          STOP<br />
          <span style={{ color: COLORS.red }}>SEARCHING.</span><br />
          START<br />
          <span style={{ WebkitTextStroke: `2px ${COLORS.yellow}`, color: 'transparent' }}>LIVING.</span>
        </h2>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.9rem',
          lineHeight: 1.8,
          color: isDark ? 'rgba(247,243,233,0.5)' : 'rgba(17,17,17,0.5)',
          marginBottom: '2.5rem',
          maxWidth: 450,
        }}>Join 10,000+ people who found their perfect roommate. It's free to start.</p>
        <motion.button
          whileHover={{ background: COLORS.yellow, color: COLORS.black }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1.2rem 3rem',
            background: COLORS.red, color: '#fff',
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: '1rem',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.08em',
            cursor: 'pointer', border: 'none',
          }}
        >Get Matched Now →</motion.button>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer style={{
      padding: '3rem 2.5rem',
      background: isDark ? '#050505' : '#E5E0D4',
      borderTop: `3px solid ${isDark ? COLORS.cream : COLORS.black}`,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'Space Mono, monospace', fontSize: '0.75rem',
        color: isDark ? 'rgba(247,243,233,0.5)' : 'rgba(17,17,17,0.5)',
        textTransform: 'uppercase' as const, letterSpacing: '0.1em',
      }}>
        <span>© 2026 Roomease</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: 'inherit' }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function Design2() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? COLORS.darkBg : COLORS.lightBg,
      color: isDark ? COLORS.cream : COLORS.black,
      transition: 'background 0.5s, color 0.5s',
    }}>
      <Nav isDark={isDark} />
      <Hero isDark={isDark} />
      <Process isDark={isDark} />
      <Features isDark={isDark} />
      <Testimonials isDark={isDark} />
      <CTA isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  )
}
