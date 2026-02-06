import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'

/* ==========================================================================
   DESIGN 5 — "BOTANICAL LOFT"
   Warm industrial meets botanical. Terracotta, sage, olive, warm cream.
   Organic flowing shapes, soft textures, nature-inspired elements.
   Fonts: Fraunces (serif display) + Nunito Sans.
   ========================================================================== */

const BOTAN = {
  terracotta: '#C0654A',
  sage: '#8B9E6B',
  olive: '#6B7F4E',
  cream: '#FAF5EF',
  warmGray: '#A69B8D',
  darkBg: '#1A1814',
  darkCard: '#22201B',
  lightBg: '#FAF5EF',
  lightCard: '#F2EBE0',
  sand: '#E8DFD0',
  rust: '#A84832',
}

// ─── 3D ORGANIC SHAPES ─────────────────────────────────────────────────────

function OrganicBlob({ position, color, size = 1 }: {
  position: [number, number, number]; color: string; size?: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.y += 0.002
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })
  return (
    <Float speed={1} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={0.5}
          speed={1.5}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

function LeafShape({ position, color, rotation }: {
  position: [number, number, number]; color: string; rotation?: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    ref.current.rotation.y += 0.003
  })
  return (
    <Float speed={0.8} floatIntensity={1}>
      <mesh ref={ref} position={position} rotation={rotation}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.0}
          flatShading
        />
      </mesh>
    </Float>
  )
}

function BotanicalScene({ isDark: _isDark }: { isDark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} color="#faf5ef" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#faf5ef" />
      <pointLight position={[-3, 2, 3]} intensity={0.4} color={BOTAN.terracotta} />
      <pointLight position={[3, -2, 2]} intensity={0.3} color={BOTAN.sage} />

      <OrganicBlob position={[-2.8, 1.2, -1]} color={BOTAN.terracotta} size={0.8} />
      <OrganicBlob position={[3, -0.8, 0]} color={BOTAN.sage} size={0.6} />
      <OrganicBlob position={[0.5, 2.3, -2]} color={BOTAN.olive} size={0.5} />
      <LeafShape position={[-1.5, -1.8, 0.5]} color={BOTAN.sage} />
      <LeafShape position={[2, 1.5, -1.5]} color={BOTAN.olive} rotation={[0.5, 0, 0.3]} />
    </Canvas>
  )
}

// ─── THEME TOGGLE ───────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 42, height: 42,
        borderRadius: '50%',
        background: isDark ? 'rgba(250,245,239,0.06)' : 'rgba(26,24,20,0.04)',
        border: `1.5px solid ${isDark ? 'rgba(250,245,239,0.12)' : 'rgba(26,24,20,0.08)'}`,
        color: isDark ? BOTAN.cream : BOTAN.darkBg,
        fontSize: '1.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >{isDark ? '☀' : '☾'}</motion.button>
  )
}

// ─── DECORATIVE ORGANIC SHAPE (SVG) ────────────────────────────────────────

function OrganicDecor({ style, color }: { style: React.CSSProperties; color: string }) {
  return (
    <svg viewBox="0 0 200 200" style={{ ...style, position: 'absolute' }}>
      <path
        d="M 100,10 C 150,30 190,80 180,130 C 170,180 120,195 80,180 C 40,165 10,120 20,70 C 30,20 60,-10 100,10 Z"
        fill={color}
        opacity={0.08}
      />
    </svg>
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

  const fg = isDark ? BOTAN.cream : BOTAN.darkBg

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.2rem 3rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled
          ? isDark ? 'rgba(26,24,20,0.9)' : 'rgba(250,245,239,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? `1px solid ${isDark ? 'rgba(250,245,239,0.06)' : 'rgba(26,24,20,0.06)'}` : 'none',
        transition: 'all 0.4s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: BOTAN.terracotta,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fraunces, serif', fontWeight: 700,
          color: '#fff', fontSize: '1rem',
        }}>R</div>
        <span style={{
          fontFamily: 'Fraunces, serif', fontWeight: 600,
          fontSize: '1.3rem', color: fg,
        }}>Roomease</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '2rem',
        fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.9rem', fontWeight: 500,
        color: isDark ? 'rgba(250,245,239,0.6)' : 'rgba(26,24,20,0.5)',
      }}>
        {['About', 'How It Works', 'Features', 'Stories'].map(item => (
          <motion.a
            key={item} href="#"
            whileHover={{ color: BOTAN.terracotta }}
            style={{ transition: 'color 0.2s' }}
          >{item}</motion.a>
        ))}
        <ThemeToggle />
        <motion.button
          whileHover={{ scale: 1.05, background: BOTAN.rust }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.65rem 1.6rem',
            borderRadius: 50,
            background: BOTAN.terracotta,
            color: '#fff',
            fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >Get Started</motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO ───────────────────────────────────────────────────────────────────

function Hero({ isDark }: { isDark: boolean }) {
  const fg = isDark ? BOTAN.cream : BOTAN.darkBg

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
      background: isDark
        ? `radial-gradient(ellipse at 30% 40%, rgba(192,101,74,0.08) 0%, transparent 50%), ${BOTAN.darkBg}`
        : `radial-gradient(ellipse at 30% 40%, rgba(192,101,74,0.08) 0%, transparent 50%), ${BOTAN.lightBg}`,
    }}>
      <OrganicDecor style={{ top: '5%', right: '10%', width: 400, height: 400 }} color={BOTAN.sage} />
      <OrganicDecor style={{ bottom: '10%', left: '5%', width: 300, height: 300 }} color={BOTAN.terracotta} />

      <BotanicalScene isDark={isDark} />

      <div style={{
        position: 'relative', zIndex: 10,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxWidth: 1200, margin: '0 auto', padding: '0 3rem',
        gap: '4rem', alignItems: 'center',
        width: '100%',
      }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 50,
              background: isDark ? 'rgba(139,158,107,0.12)' : 'rgba(139,158,107,0.1)',
              border: `1px solid ${isDark ? 'rgba(139,158,107,0.2)' : 'rgba(139,158,107,0.15)'}`,
              marginBottom: '2rem',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>🌿</span>
            <span style={{
              fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
              fontWeight: 600, color: BOTAN.sage,
            }}>Thoughtful Roommate Matching</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: fg,
              marginBottom: '1.5rem',
            }}
          >
            A Home That{' '}
            <span style={{
              color: BOTAN.terracotta,
              fontStyle: 'italic',
            }}>Feels</span>{' '}
            Like Home
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontFamily: 'Nunito Sans, sans-serif',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: isDark ? 'rgba(250,245,239,0.55)' : 'rgba(26,24,20,0.5)',
              maxWidth: 460,
              marginBottom: '2.5rem',
            }}
          >We believe great living starts with great compatibility. Our algorithm thoughtfully considers lifestyle, habits, and values to connect you with someone who truly fits.</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(192,101,74,0.25)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '1rem 2.2rem',
                borderRadius: 50,
                background: BOTAN.terracotta,
                color: '#fff',
                fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700,
                fontSize: '1rem',
              }}
            >Find Your Match</motion.button>
            <motion.button
              whileHover={{ scale: 1.05, background: isDark ? 'rgba(250,245,239,0.08)' : 'rgba(26,24,20,0.06)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '1rem 2.2rem',
                borderRadius: 50,
                background: 'transparent',
                border: `1.5px solid ${isDark ? 'rgba(250,245,239,0.15)' : 'rgba(26,24,20,0.12)'}`,
                color: isDark ? 'rgba(250,245,239,0.8)' : 'rgba(26,24,20,0.7)',
                fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600,
                fontSize: '1rem',
              }}
            >Learn More</motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            background: isDark ? BOTAN.darkCard : BOTAN.lightCard,
            padding: '2.5rem',
            border: `1px solid ${isDark ? 'rgba(250,245,239,0.06)' : 'rgba(26,24,20,0.06)'}`,
          }}
        >
          {/* Mock compatibility card */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontFamily: 'Fraunces, serif', fontSize: '1.3rem',
              fontWeight: 600, color: fg, marginBottom: '0.3rem',
            }}>Your Match Profile</div>
            <div style={{
              fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.85rem',
              color: isDark ? 'rgba(250,245,239,0.4)' : 'rgba(26,24,20,0.4)',
            }}>Compatibility analysis preview</div>
          </div>

          {[
            { label: 'Lifestyle', value: 94, color: BOTAN.terracotta },
            { label: 'Budget', value: 88, color: BOTAN.sage },
            { label: 'Schedule', value: 91, color: BOTAN.olive },
            { label: 'Cleanliness', value: 96, color: BOTAN.terracotta },
            { label: 'Social Habits', value: 85, color: BOTAN.sage },
          ].map(bar => (
            <div key={bar.label} style={{ marginBottom: '1.2rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}>
                <span style={{
                  fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.85rem',
                  fontWeight: 600, color: isDark ? 'rgba(250,245,239,0.7)' : 'rgba(26,24,20,0.7)',
                }}>{bar.label}</span>
                <span style={{
                  fontFamily: 'Fraunces, serif', fontSize: '0.85rem',
                  fontWeight: 700, color: bar.color,
                }}>{bar.value}%</span>
              </div>
              <div style={{
                height: 6, borderRadius: 3,
                background: isDark ? 'rgba(250,245,239,0.06)' : 'rgba(26,24,20,0.06)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ duration: 1.5, delay: 1 + Math.random() * 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: bar.color,
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '2rem', padding: '1.2rem',
            borderRadius: 16,
            background: isDark ? 'rgba(192,101,74,0.08)' : 'rgba(192,101,74,0.06)',
            border: `1px solid ${isDark ? 'rgba(192,101,74,0.15)' : 'rgba(192,101,74,0.1)'}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Fraunces, serif', fontSize: '2rem',
              fontWeight: 800, color: BOTAN.terracotta,
            }}>91%</div>
            <div style={{
              fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
              fontWeight: 600, color: isDark ? 'rgba(250,245,239,0.5)' : 'rgba(26,24,20,0.4)',
            }}>Overall Compatibility</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ───────────────────────────────────────────────────────────

function HowItWorks({ isDark }: { isDark: boolean }) {
  const fg = isDark ? BOTAN.cream : BOTAN.darkBg
  const steps = [
    { num: '01', title: 'Share Your Story', desc: 'Tell us about your lifestyle, daily rhythm, budget, and what makes you feel at home.', icon: '🌱' },
    { num: '02', title: 'Thoughtful Analysis', desc: 'Our algorithm carefully weighs 50+ compatibility factors to find genuine matches.', icon: '🧠' },
    { num: '03', title: 'Meet Your Match', desc: 'Browse curated profiles, start warm conversations, and feel the connection.', icon: '🤝' },
    { num: '04', title: 'Settle In', desc: 'Found your person? We help make the transition smooth and natural.', icon: '🏡' },
  ]

  return (
    <section style={{
      padding: '8rem 3rem',
      background: isDark ? '#1d1b16' : '#F2EBE0',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{
            fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: BOTAN.sage,
          }}>The Journey</span>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700, color: fg,
            marginTop: '0.75rem',
          }}>Finding Home, <span style={{ color: BOTAN.terracotta, fontStyle: 'italic' }}>Naturally</span></h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
        }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{
                padding: '2.5rem 1.8rem',
                borderRadius: 24,
                background: isDark ? BOTAN.darkCard : '#fff',
                border: `1px solid ${isDark ? 'rgba(250,245,239,0.05)' : 'rgba(26,24,20,0.04)'}`,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{s.icon}</div>
              <div style={{
                fontFamily: 'Fraunces, serif', fontSize: '0.75rem',
                fontWeight: 700, color: BOTAN.terracotta,
                marginBottom: '0.5rem',
                letterSpacing: '0.1em',
              }}>Step {s.num}</div>
              <h3 style={{
                fontFamily: 'Fraunces, serif', fontSize: '1.15rem',
                fontWeight: 700, color: fg,
                marginBottom: '0.75rem',
              }}>{s.title}</h3>
              <p style={{
                fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.9rem',
                lineHeight: 1.7,
                color: isDark ? 'rgba(250,245,239,0.45)' : 'rgba(26,24,20,0.45)',
              }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ───────────────────────────────────────────────────────────────

function Features({ isDark }: { isDark: boolean }) {
  const fg = isDark ? BOTAN.cream : BOTAN.darkBg
  const features = [
    { title: 'Compatibility Science', desc: '50+ dimensions analyzed — from morning routines to social energy levels.', icon: '🔬', color: BOTAN.terracotta },
    { title: 'Trust & Safety', desc: 'ID verification and background checks create a community of trust.', icon: '🛡️', color: BOTAN.sage },
    { title: 'Financial Harmony', desc: 'Budget alignment built into every match. No surprises.', icon: '💰', color: BOTAN.olive },
    { title: 'Lifestyle Mapping', desc: 'Pets, noise, schedule, cleanliness — all the details that matter.', icon: '🗺️', color: BOTAN.terracotta },
    { title: 'Warm Introductions', desc: 'Ice-breaking prompts and guided conversations make connecting easy.', icon: '💌', color: BOTAN.sage },
    { title: 'Neighborhood Insights', desc: 'Local amenities, commute data, and community vibes for every area.', icon: '🏘️', color: BOTAN.olive },
  ]

  return (
    <section style={{
      padding: '8rem 3rem',
      background: isDark ? BOTAN.darkBg : BOTAN.lightBg,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{
            fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: BOTAN.sage,
          }}>What We Offer</span>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700, color: fg,
            marginTop: '0.75rem',
          }}>Rooted in <span style={{ color: BOTAN.sage, fontStyle: 'italic' }}>Care</span></h2>
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
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(26,24,20,0.06)' }}
              style={{
                padding: '2rem',
                borderRadius: 20,
                background: isDark ? BOTAN.darkCard : '#fff',
                border: `1px solid ${isDark ? 'rgba(250,245,239,0.05)' : 'rgba(26,24,20,0.04)'}`,
                display: 'flex', gap: '1.2rem', alignItems: 'flex-start',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: isDark ? `${f.color}15` : `${f.color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 700,
                  fontSize: '1.1rem', color: fg,
                  marginBottom: '0.4rem',
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: isDark ? 'rgba(250,245,239,0.45)' : 'rgba(26,24,20,0.45)',
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
  const fg = isDark ? BOTAN.cream : BOTAN.darkBg
  const stories = [
    { name: 'Sarah K.', where: 'New York', text: "Roomease felt different from the start. They matched me with someone who shares my love for quiet mornings and home-cooked meals. Eight months in and it still feels right.", avatar: '🌸' },
    { name: 'Marcus T.', where: 'San Francisco', text: "After a rough roommate experience, I needed something trustworthy. The compatibility analysis was remarkably accurate. My roommate and I just clicked.", avatar: '🌿' },
    { name: 'Priya M.', where: 'Austin', text: "The budget alignment was a game-changer. No awkward conversations about rent splits or utility expectations. Everything was transparent from day one.", avatar: '🌻' },
  ]

  return (
    <section style={{
      padding: '8rem 3rem',
      background: isDark ? '#1d1b16' : '#F2EBE0',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span style={{
            fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: BOTAN.sage,
          }}>Stories</span>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700, color: fg,
            marginTop: '0.75rem',
          }}>Grown from <span style={{ color: BOTAN.terracotta, fontStyle: 'italic' }}>Real Connections</span></h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
              style={{
                padding: '2.5rem',
                borderRadius: 24,
                background: isDark ? BOTAN.darkCard : '#fff',
                border: `1px solid ${isDark ? 'rgba(250,245,239,0.05)' : 'rgba(26,24,20,0.04)'}`,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1.2rem' }}>{s.avatar}</div>
              <p style={{
                fontFamily: 'Nunito Sans, sans-serif', fontSize: '1rem',
                lineHeight: 1.8, fontStyle: 'italic',
                color: isDark ? 'rgba(250,245,239,0.6)' : 'rgba(26,24,20,0.55)',
                marginBottom: '1.5rem',
              }}>"{s.text}"</p>
              <div>
                <div style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 700,
                  fontSize: '0.95rem', color: fg,
                }}>{s.name}</div>
                <div style={{
                  fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
                  color: isDark ? 'rgba(250,245,239,0.35)' : 'rgba(26,24,20,0.35)',
                }}>{s.where}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ────────────────────────────────────────────────────────────────────

function CTA({ isDark }: { isDark: boolean }) {
  const fg = isDark ? BOTAN.cream : BOTAN.darkBg
  return (
    <section style={{
      padding: '8rem 3rem',
      background: isDark ? BOTAN.darkBg : BOTAN.lightBg,
      position: 'relative', overflow: 'hidden',
    }}>
      <OrganicDecor style={{ top: '-10%', right: '-5%', width: 500, height: 500 }} color={BOTAN.sage} />
      <OrganicDecor style={{ bottom: '-10%', left: '-5%', width: 400, height: 400 }} color={BOTAN.terracotta} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          maxWidth: 650, margin: '0 auto',
          textAlign: 'center',
          position: 'relative', zIndex: 1,
        }}
      >
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1.5rem' }}>🌿</span>
        <h2 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
          fontWeight: 700, color: fg,
          lineHeight: 1.2,
          marginBottom: '1rem',
        }}>Ready to Find Your<br />
          <span style={{ color: BOTAN.terracotta, fontStyle: 'italic' }}>Perfect Living Companion?</span>
        </h2>
        <p style={{
          fontFamily: 'Nunito Sans, sans-serif', fontSize: '1.1rem',
          lineHeight: 1.8,
          color: isDark ? 'rgba(250,245,239,0.5)' : 'rgba(26,24,20,0.45)',
          maxWidth: 480, margin: '0 auto 2.5rem',
        }}>Join a community of 10,000+ people who found their ideal roommate. It starts with a simple step.</p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(192,101,74,0.25)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1.1rem 3rem',
            borderRadius: 50,
            background: BOTAN.terracotta,
            color: '#fff',
            fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700,
            fontSize: '1.1rem',
          }}
        >Start Your Journey →</motion.button>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer({ isDark }: { isDark: boolean }) {
  const fg = isDark ? BOTAN.cream : BOTAN.darkBg
  return (
    <footer style={{
      padding: '4rem 3rem 2rem',
      background: isDark ? '#15130f' : BOTAN.sand,
      borderTop: `1px solid ${isDark ? 'rgba(250,245,239,0.06)' : 'rgba(26,24,20,0.06)'}`,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: BOTAN.terracotta,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif', fontWeight: 700,
              color: '#fff', fontSize: '0.85rem',
            }}>R</div>
            <span style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600,
              fontSize: '1.1rem', color: fg,
            }}>Roomease</span>
          </div>
          <p style={{
            fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.85rem',
            lineHeight: 1.7, maxWidth: 260,
            color: isDark ? 'rgba(250,245,239,0.35)' : 'rgba(26,24,20,0.35)',
          }}>Finding your perfect living companion, rooted in thoughtful matching.</p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'How It Works', 'Pricing', 'Blog'] },
          { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
          { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600,
              fontSize: '0.9rem', color: fg,
              marginBottom: '1rem',
            }}>{col.title}</h4>
            {col.links.map(link => (
              <a key={link} href="#" style={{
                display: 'block',
                fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.85rem',
                color: isDark ? 'rgba(250,245,239,0.35)' : 'rgba(26,24,20,0.35)',
                marginBottom: '0.6rem',
              }}>{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        maxWidth: 1100, margin: '3rem auto 0',
        paddingTop: '1.5rem',
        borderTop: `1px solid ${isDark ? 'rgba(250,245,239,0.06)' : 'rgba(26,24,20,0.06)'}`,
        textAlign: 'center',
        fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.8rem',
        color: isDark ? 'rgba(250,245,239,0.25)' : 'rgba(26,24,20,0.25)',
      }}>© 2026 Roomease. All rights reserved.</div>
    </footer>
  )
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function Design5() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? BOTAN.darkBg : BOTAN.lightBg,
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
