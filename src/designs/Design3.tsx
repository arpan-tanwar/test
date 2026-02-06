import { useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

/* ==========================================================================
   DESIGN 3 — "AURORA GLASS"
   Glassmorphism meets aurora borealis. Frosted glass cards, ethereal
   glowing backgrounds, fluid color transitions, floating glass elements.
   Fonts: Outfit + Sora.
   ========================================================================== */

// ─── AURORA BACKGROUND ──────────────────────────────────────────────────────

function AuroraBackground({ isDark }: { isDark: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: isDark
          ? "linear-gradient(180deg, #0a0e1a 0%, #0d1321 40%, #0a0e1a 100%)"
          : "linear-gradient(180deg, #e8f0fe 0%, #f0f4ff 40%, #e8eeff 100%)",
        overflow: "hidden",
      }}
    >
      {/* Aurora blobs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "5%",
          left: "10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.85, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "30%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{
          x: [0, -40, 80, 0],
          y: [0, 80, -60, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "60%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}

// ─── GLASS CARD COMPONENT ───────────────────────────────────────────────────

function GlassCard({
  children,
  style,
  hover = true,
  ...props
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
  [key: string]: any;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.02 } : undefined}
      transition={{ duration: 0.3 }}
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}`,
        borderRadius: 24,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── 3D GLASS ORBS ──────────────────────────────────────────────────────────

function GlassOrb({
  position,
  color,
  size = 1,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.003;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });
  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function AuroraScene({ isDark: _isDark }: { isDark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#22d3ee" />
      <pointLight position={[-3, 2, 3]} intensity={0.6} color="#a78bfa" />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#34d399" />

      <GlassOrb position={[-2.5, 1.2, -1]} color="#22d3ee" size={0.7} />
      <GlassOrb position={[2.8, -0.5, 0]} color="#a78bfa" size={0.5} />
      <GlassOrb position={[0.5, 2.2, -2]} color="#34d399" size={0.4} />
      <GlassOrb position={[-1.2, -1.8, 0.5]} color="#f472b6" size={0.55} />
    </Canvas>
  );
}

// ─── THEME TOGGLE ───────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
        color: isDark ? "#e2e8f0" : "#1e293b",
        fontSize: "1.1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </motion.button>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────────────

function Nav({ isDark }: { isDark: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 16,
        left: "15%",
        transform: "translateX(-50%)",
        zIndex: 100,
        width: "min(90%, 1100px)",
        padding: "0.8rem 1.5rem",
        borderRadius: 20,
        background: isDark
          ? `rgba(10,14,26,${scrolled ? 0.8 : 0.4})`
          : `rgba(255,255,255,${scrolled ? 0.7 : 0.3})`,
        backdropFilter: "blur(20px) saturate(1.5)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.4s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 800,
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          R
        </div>
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
        >
          Roomease
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.8rem",
          fontFamily: "Sora, sans-serif",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: isDark ? "rgba(248,250,252,0.7)" : "rgba(15,23,42,0.6)",
        }}
      >
        {["Features", "How it Works", "Pricing", "FAQ"].map((item) => (
          <motion.a key={item} href="#" whileHover={{ color: "#22d3ee" }}>
            {item}
          </motion.a>
        ))}
        <ThemeToggle />
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(34,211,238,0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "0.55rem 1.4rem",
            borderRadius: 14,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            color: "#fff",
            fontFamily: "Sora, sans-serif",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────

function Hero({ isDark }: { isDark: boolean }) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <AuroraScene isDark={isDark} />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: 780,
          padding: "0 2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <GlassCard
            hover={false}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1.2rem",
              borderRadius: 50,
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 10px rgba(52,211,153,0.5)",
              }}
            />
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: isDark ? "rgba(248,250,252,0.8)" : "rgba(15,23,42,0.7)",
              }}
            >
              AI-Powered Roommate Matching
            </span>
          </GlassCard>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "clamp(3rem, 6.5vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: isDark ? "#f8fafc" : "#0f172a",
            marginBottom: "1.5rem",
          }}
        >
          Living Together,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #22d3ee, #a78bfa, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Harmoniously
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            lineHeight: 1.8,
            color: isDark ? "rgba(248,250,252,0.55)" : "rgba(15,23,42,0.5)",
            maxWidth: 540,
            margin: "0 auto 2.5rem",
          }}
        >
          Our smart algorithm analyzes lifestyle, personality, budget, and
          habits to find your ideal roommate — like magic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 50px rgba(34,211,238,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 2.5rem",
              borderRadius: 16,
              background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
              color: "#fff",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              boxShadow: "0 0 30px rgba(34,211,238,0.2)",
            }}
          >
            Find My Match →
          </motion.button>
          <GlassCard
            hover={false}
            style={{
              padding: "1rem 2.5rem",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              color: isDark ? "#f8fafc" : "#0f172a",
              fontFamily: "Sora, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <span>Watch Demo</span>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{
            marginTop: "4rem",
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          {[
            { value: "10K+", label: "Happy Matches" },
            { value: "4.9★", label: "User Rating" },
            { value: "50+", label: "Cities" },
          ].map((s) => (
            <GlassCard
              key={s.label}
              hover={false}
              style={{
                padding: "1.2rem 2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: "0.75rem",
                  color: isDark
                    ? "rgba(248,250,252,0.4)"
                    : "rgba(15,23,42,0.4)",
                  marginTop: "0.25rem",
                }}
              >
                {s.label}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── FEATURES ───────────────────────────────────────────────────────────────

function Features({ isDark }: { isDark: boolean }) {
  const features = [
    {
      icon: "🧠",
      title: "AI Compatibility Engine",
      desc: "Analyzes 50+ lifestyle dimensions for precision matching.",
      gradient: "linear-gradient(135deg, #22d3ee, #06b6d4)",
    },
    {
      icon: "🛡️",
      title: "Verified & Safe",
      desc: "ID verification and background checks on every user.",
      gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    },
    {
      icon: "💰",
      title: "Budget Harmony",
      desc: "Financial alignment built into the matching process.",
      gradient: "linear-gradient(135deg, #34d399, #10b981)",
    },
    {
      icon: "🎯",
      title: "Precision Filters",
      desc: "Sleep schedule, pets, noise, cleanliness — every detail.",
      gradient: "linear-gradient(135deg, #f472b6, #ec4899)",
    },
    {
      icon: "💬",
      title: "Smart Connect",
      desc: "In-app chat with compatibility-driven conversation starters.",
      gradient: "linear-gradient(135deg, #22d3ee, #a78bfa)",
    },
    {
      icon: "📍",
      title: "Neighborhood Intel",
      desc: "Commute data, amenities, and neighborhood personality.",
      gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "8rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Features
          </span>
          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: isDark ? "#f8fafc" : "#0f172a",
              marginTop: "0.75rem",
            }}
          >
            Everything You Need,
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #22d3ee, #a78bfa, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nothing You Don't
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlassCard style={{ padding: "2rem", height: "100%" }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: f.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "1.2rem",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "0.5rem",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: isDark
                      ? "rgba(248,250,252,0.5)"
                      : "rgba(15,23,42,0.5)",
                  }}
                >
                  {f.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ───────────────────────────────────────────────────────────

function HowItWorks({ isDark }: { isDark: boolean }) {
  const steps = [
    {
      num: "01",
      title: "Build Your Profile",
      desc: "Share your lifestyle preferences, habits, and what matters most to you.",
      color: "#22d3ee",
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "Our engine processes your profile across 50+ compatibility dimensions.",
      color: "#a78bfa",
    },
    {
      num: "03",
      title: "Get Matched",
      desc: "Receive curated matches ranked by compatibility score.",
      color: "#34d399",
    },
    {
      num: "04",
      title: "Connect & Move In",
      desc: "Chat, meet, and move in with confidence.",
      color: "#f472b6",
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "8rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              background: "linear-gradient(135deg, #34d399, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Process
          </span>
          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: isDark ? "#f8fafc" : "#0f172a",
              marginTop: "0.75rem",
            }}
          >
            Simple as{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #22d3ee, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              1-2-3-4
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <GlassCard
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -15,
                    right: -5,
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 900,
                    fontSize: "5rem",
                    color: s.color,
                    opacity: 0.08,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: `${s.color}20`,
                    border: `2px solid ${s.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.2rem",
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: s.color,
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    color: isDark
                      ? "rgba(248,250,252,0.45)"
                      : "rgba(15,23,42,0.45)",
                  }}
                >
                  {s.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

function Testimonials({ isDark }: { isDark: boolean }) {
  const testimonials = [
    {
      name: "Sarah K.",
      role: "Designer, NYC",
      text: "Found my dream roommate in under a week. The compatibility score was spot-on — we have the same schedule, same vibe, same standards.",
      color: "#22d3ee",
    },
    {
      name: "Marcus T.",
      role: "Engineer, SF",
      text: "After a terrible roommate experience, I was anxious. Roomease matched me with someone perfect. I've never felt more at home.",
      color: "#a78bfa",
    },
    {
      name: "Priya M.",
      role: "Student, Austin",
      text: "The budget alignment feature is brilliant. No awkward money talks. My roommate and I were financially aligned from day one.",
      color: "#34d399",
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "8rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: isDark ? "#f8fafc" : "#0f172a",
            }}
          >
            What People{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Are Saying
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard
                style={{
                  padding: "2.5rem",
                  borderTop: `2px solid ${t.color}40`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.2rem",
                    marginBottom: "1rem",
                  }}
                >
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      style={{ color: "#fbbf24", fontSize: "0.9rem" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    fontStyle: "italic",
                    color: isDark
                      ? "rgba(248,250,252,0.65)"
                      : "rgba(15,23,42,0.6)",
                    marginBottom: "1.5rem",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: "0.9rem",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: isDark ? "#f8fafc" : "#0f172a",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "0.75rem",
                        color: isDark
                          ? "rgba(248,250,252,0.35)"
                          : "rgba(15,23,42,0.35)",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ────────────────────────────────────────────────────────────────────

function CTA({ isDark }: { isDark: boolean }) {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "8rem 2.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlassCard
          hover={false}
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "4rem 3rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${isDark ? "rgba(34,211,238,0.15)" : "rgba(34,211,238,0.2)"}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              left: -80,
              width: 250,
              height: 250,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: isDark ? "#f8fafc" : "#0f172a",
              marginBottom: "1rem",
              position: "relative",
            }}
          >
            Ready to Find Your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Perfect Match?
            </span>
          </h2>
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: isDark ? "rgba(248,250,252,0.5)" : "rgba(15,23,42,0.5)",
              marginBottom: "2.5rem",
              position: "relative",
            }}
          >
            Join thousands who found their ideal roommate. Start for free.
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 60px rgba(34,211,238,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 3rem",
              borderRadius: 16,
              background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
              color: "#fff",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              boxShadow: "0 0 40px rgba(34,211,238,0.2)",
              position: "relative",
            }}
          >
            Start Matching — Free →
          </motion.button>
        </GlassCard>
      </motion.div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        padding: "3rem 2.5rem",
      }}
    >
      <GlassCard
        hover={false}
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2rem 2.5rem",
          borderRadius: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
        >
          Roomease
        </span>
        <span
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: "0.8rem",
            color: isDark ? "rgba(248,250,252,0.35)" : "rgba(15,23,42,0.35)",
          }}
        >
          © 2026 Roomease. All rights reserved.
        </span>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontFamily: "Sora, sans-serif",
            fontSize: "0.8rem",
            color: isDark ? "rgba(248,250,252,0.5)" : "rgba(15,23,42,0.5)",
          }}
        >
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ color: "inherit" }}>
              {l}
            </a>
          ))}
        </div>
      </GlassCard>
    </footer>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function Design3() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AuroraBackground isDark={isDark} />
      <Nav isDark={isDark} />
      <Hero isDark={isDark} />
      <Features isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <Testimonials isDark={isDark} />
      <CTA isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  );
}
