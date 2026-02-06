import { useRef, useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

/* ==========================================================================
   DESIGN 1 — "MIDNIGHT COSMOS"
   Deep space aesthetic, floating 3D orbs, constellation-like connections,
   rich purple/blue palette. Fonts: Playfair Display + DM Sans.
   ========================================================================== */

// ─── 3D SCENE COMPONENTS ────────────────────────────────────────────────────

function CosmicOrb({ position, color, speed = 1, distort = 0.4, size = 1 }: {
  position: [number, number, number]
  color: string
  speed?: number
  distort?: number
  size?: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2
    ref.current.rotation.y += 0.003 * speed
  })
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

function FloatingRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.2
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
  })
  return (
    <Float speed={1.5} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  )
}

function ParticleField({ count = 200, isDark }: { count?: number; isDark: boolean }) {
  const points = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [count])

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.02
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={isDark ? '#c4b5fd' : '#7c3aed'}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

function CosmicScene({ isDark }: { isDark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color={isDark ? '#a78bfa' : '#7c3aed'} />
      <pointLight position={[-3, -3, 2]} intensity={0.8} color="#c084fc" />
      <pointLight position={[3, 2, -2]} intensity={0.5} color="#818cf8" />

      <CosmicOrb position={[-2.5, 1, -1]} color={isDark ? '#7c3aed' : '#a78bfa'} speed={0.8} distort={0.5} size={0.8} />
      <CosmicOrb position={[2.8, -0.5, 0]} color={isDark ? '#6366f1' : '#818cf8'} speed={1.2} distort={0.3} size={0.6} />
      <CosmicOrb position={[0.5, 2, -2]} color="#c084fc" speed={0.6} distort={0.6} size={0.5} />
      <CosmicOrb position={[-1.5, -2, 1]} color="#a78bfa" speed={1} distort={0.4} size={0.4} />

      <FloatingRing position={[1.5, 1.5, -1]} color={isDark ? '#a78bfa' : '#7c3aed'} />
      <FloatingRing position={[-2, -1, 0]} color="#818cf8" />

      <ParticleField isDark={isDark} />
    </Canvas>
  )
}

// ─── THEME TOGGLE ───────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
        color: theme === 'dark' ? '#e2e8f0' : '#1e1b4b',
        fontSize: '1.2rem',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? isDark ? 'rgba(5,2,18,0.85)' : 'rgba(255,255,255,0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        borderBottom: scrolled
          ? `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(124,58,237,0.1)'}` : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s, border 0.4s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Playfair Display, serif', fontWeight: 800,
          color: '#fff', fontSize: '1.1rem',
        }}>R</div>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: '1.3rem',
          color: isDark ? '#f8fafc' : '#1e1b4b',
        }}>Roomease</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '2rem',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 500,
        color: isDark ? 'rgba(226,232,240,0.8)' : 'rgba(30,27,75,0.7)',
      }}>
        {['How it Works', 'Features', 'Testimonials', 'Pricing'].map(item => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
            whileHover={{ color: isDark ? '#c4b5fd' : '#7c3aed' }}
            style={{ transition: 'color 0.2s' }}
          >{item}</motion.a>
        ))}
        <ThemeToggle />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.6rem 1.5rem',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >Get Started</motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO SECTION ───────────────────────────────────────────────────────────

function Hero({ isDark }: { isDark: boolean }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: isDark
        ? 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(99,102,241,0.1) 0%, transparent 50%), #050212'
        : 'radial-gradient(ellipse at 30% 20%, rgba(196,181,253,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(165,180,252,0.2) 0%, transparent 50%), #faf8ff',
    }}>
      <CosmicScene isDark={isDark} />

      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center', maxWidth: 800, padding: '0 2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.4rem 1.2rem',
            borderRadius: 50,
            background: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(124,58,237,0.1)',
            border: `1px solid ${isDark ? 'rgba(139,92,246,0.3)' : 'rgba(124,58,237,0.2)'}`,
            color: isDark ? '#c4b5fd' : '#7c3aed',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            marginBottom: '1.5rem',
          }}>✨ Smart Roommate Matching</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: isDark ? '#f8fafc' : '#1e1b4b',
            marginBottom: '1.5rem',
          }}
        >
          Find Someone{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Who Gets</span>
          <br />Your Vibe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(30,27,75,0.6)',
            maxWidth: 560,
            margin: '0 auto 2.5rem',
          }}
        >
          Our cosmic algorithm analyzes lifestyle, habits, personality, and budget to connect you with your ideal roommate match.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: 50,
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              color: '#fff',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              boxShadow: '0 0 30px rgba(124,58,237,0.3)',
            }}
          >Find My Match →</motion.button>
          <motion.button
            whileHover={{ scale: 1.05, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: 50,
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              color: isDark ? '#e2e8f0' : '#1e1b4b',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '1.05rem',
            }}
          >See How It Works</motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          style={{
            marginTop: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            color: isDark ? 'rgba(226,232,240,0.5)' : 'rgba(30,27,75,0.4)',
          }}
        >
          <span>🏠 10K+ Matches Made</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', opacity: 0.5 }} />
          <span>⭐ 4.9 Rating</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', opacity: 0.5 }} />
          <span>🌍 50+ Cities</span>
        </motion.div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ───────────────────────────────────────────────────────────

function HowItWorks({ isDark }: { isDark: boolean }) {
  const steps = [
    { num: '01', title: 'Create Profile', desc: 'Tell us about your lifestyle, habits, budget, and what matters most to you in a living situation.', icon: '👤' },
    { num: '02', title: 'Smart Matching', desc: 'Our algorithm analyzes 50+ compatibility factors to find people who truly complement your lifestyle.', icon: '🧬' },
    { num: '03', title: 'Connect & Chat', desc: 'Browse your matches, start conversations, and find your perfect roommate at your own pace.', icon: '💬' },
    { num: '04', title: 'Move In', desc: 'Found your match? We help coordinate the move-in process and make the transition seamless.', icon: '🏡' },
  ]

  return (
    <section id="how-it-works" style={{
      padding: '8rem 2.5rem',
      background: isDark ? '#050212' : '#faf8ff',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: isDark ? '#a78bfa' : '#7c3aed',
          }}>How It Works</span>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: isDark ? '#f8fafc' : '#1e1b4b',
            marginTop: '0.75rem',
          }}>Four Steps to Your<br />
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Perfect Match</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
        }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{
                padding: '2.5rem 2rem',
                borderRadius: 24,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.04))'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.03))',
                border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(124,58,237,0.1)'}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: -20,
                right: -10,
                fontFamily: 'Playfair Display, serif',
                fontSize: '6rem',
                fontWeight: 900,
                color: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(124,58,237,0.05)',
                lineHeight: 1,
              }}>{step.num}</div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.2rem' }}>{step.icon}</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: isDark ? '#f8fafc' : '#1e1b4b',
                marginBottom: '0.75rem',
              }}>{step.title}</h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: isDark ? 'rgba(226,232,240,0.6)' : 'rgba(30,27,75,0.55)',
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
  const features = [
    { title: 'AI-Powered Matching', desc: 'Deep learning analyzes 50+ dimensions of compatibility — from sleep schedules to noise tolerance.', icon: '🤖' },
    { title: 'Verified Profiles', desc: 'Every user is ID-verified and background-checked for your peace of mind.', icon: '🛡️' },
    { title: 'Budget Alignment', desc: 'Find someone who shares your financial expectations — no awkward money conversations.', icon: '💰' },
    { title: 'Lifestyle Filters', desc: 'Pet-friendly? Night owl? Clean freak? Filter by the things that actually matter.', icon: '🎯' },
    { title: 'Smart Chat', desc: 'Built-in messaging with icebreaker prompts to make connecting effortless.', icon: '💬' },
    { title: 'Location Intel', desc: 'Neighborhood insights, commute times, and proximity to what matters to you.', icon: '📍' },
  ]

  return (
    <section id="features" style={{
      padding: '8rem 2.5rem',
      background: isDark
        ? 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 50%), #080420'
        : 'radial-gradient(ellipse at 50% 0%, rgba(196,181,253,0.2) 0%, transparent 50%), #f5f0ff',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: isDark ? '#a78bfa' : '#7c3aed',
          }}>Features</span>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: isDark ? '#f8fafc' : '#1e1b4b',
            marginTop: '0.75rem',
          }}>Everything You Need to<br />
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Find Your Person</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: isDark ? '0 0 40px rgba(124,58,237,0.15)' : '0 8px 40px rgba(124,58,237,0.1)',
                transition: { duration: 0.3 },
              }}
              style={{
                padding: '2rem',
                borderRadius: 20,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${isDark ? 'rgba(139,92,246,0.1)' : 'rgba(124,58,237,0.08)'}`,
                display: 'flex',
                gap: '1.2rem',
                alignItems: 'flex-start',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(124,58,237,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: isDark ? '#f8fafc' : '#1e1b4b',
                  marginBottom: '0.5rem',
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: isDark ? 'rgba(226,232,240,0.55)' : 'rgba(30,27,75,0.5)',
                }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

function Testimonials({ isDark }: { isDark: boolean }) {
  const testimonials = [
    { name: 'Sarah K.', role: 'NYC, Designer', text: "Roomease matched me with someone who has the same work schedule and cleanliness standards. We've been roommates for 8 months and it's been amazing.", avatar: '🧑‍🎨' },
    { name: 'Marcus T.', role: 'SF, Engineer', text: "I was dreading the roommate search after a bad experience. Roomease's matching algorithm actually understood what I needed. Found my match in 3 days.", avatar: '👨‍💻' },
    { name: 'Priya M.', role: 'Austin, Student', text: "The budget alignment feature is genius. No more awkward money conversations. My roommate and I were on the same page from day one.", avatar: '👩‍🎓' },
  ]

  return (
    <section id="testimonials" style={{
      padding: '8rem 2.5rem',
      background: isDark ? '#050212' : '#faf8ff',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: isDark ? '#a78bfa' : '#7c3aed',
          }}>Testimonials</span>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: isDark ? '#f8fafc' : '#1e1b4b',
            marginTop: '0.75rem',
          }}>Loved by <span style={{
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Thousands</span></h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                padding: '2.5rem',
                borderRadius: 24,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.03))'
                  : 'rgba(255,255,255,0.8)',
                border: `1px solid ${isDark ? 'rgba(139,92,246,0.12)' : 'rgba(124,58,237,0.08)'}`,
              }}
            >
              <div style={{
                display: 'flex',
                gap: '0.3rem',
                marginBottom: '1.2rem',
              }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ fontSize: '1rem' }}>⭐</span>
                ))}
              </div>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(30,27,75,0.6)',
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem',
                }}>{t.avatar}</div>
                <div>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 700,
                    color: isDark ? '#f8fafc' : '#1e1b4b',
                    fontSize: '0.95rem',
                  }}>{t.name}</div>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.8rem',
                    color: isDark ? 'rgba(226,232,240,0.4)' : 'rgba(30,27,75,0.4)',
                  }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA SECTION ────────────────────────────────────────────────────────────

function CTA({ isDark }: { isDark: boolean }) {
  return (
    <section style={{
      padding: '8rem 2.5rem',
      background: isDark
        ? 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 60%), #080420'
        : 'radial-gradient(ellipse at center, rgba(196,181,253,0.25) 0%, transparent 60%), #f5f0ff',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          color: isDark ? '#f8fafc' : '#1e1b4b',
          marginBottom: '1rem',
        }}>Ready to Find Your<br />
          <span style={{
            background: 'linear-gradient(135deg, #7c3aed, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Cosmic Match?</span>
        </h2>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          color: isDark ? 'rgba(226,232,240,0.6)' : 'rgba(30,27,75,0.5)',
          marginBottom: '2.5rem',
        }}>Join 10,000+ people who found their perfect roommate through Roomease. Your match is waiting.</p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(124,58,237,0.4)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1.1rem 3rem',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            color: '#fff',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 0 40px rgba(124,58,237,0.3)',
          }}
        >Start Matching — It's Free →</motion.button>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer style={{
      padding: '4rem 2.5rem 2rem',
      background: isDark ? '#030110' : '#f0ecff',
      borderTop: `1px solid ${isDark ? 'rgba(139,92,246,0.1)' : 'rgba(124,58,237,0.08)'}`,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '3rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Playfair Display, serif', fontWeight: 800,
              color: '#fff', fontSize: '0.9rem',
            }}>R</div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: isDark ? '#f8fafc' : '#1e1b4b',
            }}>Roomease</span>
          </div>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            color: isDark ? 'rgba(226,232,240,0.4)' : 'rgba(30,27,75,0.4)',
            maxWidth: 280,
            lineHeight: 1.7,
          }}>Finding your perfect roommate, powered by intelligent matching algorithms.</p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Pricing', 'How It Works', 'Blog'] },
          { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
          { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: isDark ? '#f8fafc' : '#1e1b4b',
              marginBottom: '1rem',
              letterSpacing: '0.05em',
            }}>{col.title}</h4>
            {col.links.map(link => (
              <a key={link} href="#" style={{
                display: 'block',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.85rem',
                color: isDark ? 'rgba(226,232,240,0.4)' : 'rgba(30,27,75,0.4)',
                marginBottom: '0.6rem',
              }}>{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        maxWidth: 1100,
        margin: '3rem auto 0',
        paddingTop: '2rem',
        borderTop: `1px solid ${isDark ? 'rgba(139,92,246,0.08)' : 'rgba(124,58,237,0.06)'}`,
        textAlign: 'center',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.8rem',
        color: isDark ? 'rgba(226,232,240,0.3)' : 'rgba(30,27,75,0.3)',
      }}>© 2026 Roomease. All rights reserved.</div>
    </footer>
  )
}

// ─── DESIGN 1 MAIN ──────────────────────────────────────────────────────────

export default function Design1() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#050212' : '#faf8ff',
      transition: 'background 0.5s',
    }}>
      <Nav isDark={isDark} />
      <Hero isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <Features isDark={isDark} />
      <Testimonials isDark={isDark} />
      <CTA isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  )
}
