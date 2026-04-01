import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'
import './components.css'
import './App.css'

/* =========================================
   DIGICHAIN LOGO
   ========================================= */
function DigiChainLogo({ size = 140, glowing = false }) {
  return (
    <img
      src="/digichain-logo.png"
      alt="DigiChain Logo"
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
        transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        filter: glowing
          ? 'drop-shadow(0 0 10px rgba(0,245,255,0.9)) drop-shadow(0 0 20px rgba(0,245,255,0.5))'
          : 'none',
      }}
    />
  )
}

/* =========================================
   GLITCH TEXT EFFECT
   ========================================= */
function GlitchText({ children, className = '', tag: Tag = 'span' }) {
  return (
    <Tag className={`glitch-text ${className}`} data-text={children}>
      {children}
    </Tag>
  )
}

/* =========================================
   DATA MATRIX RAIN CANVAS (Background Layer)
   ========================================= */
function MatrixRainCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ∑∆∏∫√∞≈≠≡÷×'
    let cols = []

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const colW = 18
      const numCols = Math.floor(canvas.width / colW)
      cols = Array(numCols).fill(0)
    }
    init()
    window.addEventListener('resize', init)

    const draw = () => {
      ctx.fillStyle = 'rgba(2,4,8,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '11px monospace'
      cols.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * 18
        // Head is brighter cyan
        ctx.fillStyle = `rgba(0,245,255,${Math.random() * 0.15 + 0.02})`
        ctx.fillText(char, x, y)
        if (y > canvas.height + Math.random() * 10000) {
          cols[i] = 0
        } else {
          cols[i] = y + 18
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init) }
  }, [])
  return <canvas ref={canvasRef} className="matrix-canvas" />
}

/* =========================================
   PARTICLE NETWORK CANVAS
   ========================================= */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    })

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.8 + 0.3
        this.baseSpeedX = (Math.random() - 0.5) * 0.35
        this.baseSpeedY = (Math.random() - 0.5) * 0.35
        this.speedX = this.baseSpeedX
        this.speedY = this.baseSpeedY
        this.opacity = Math.random() * 0.65 + 0.1
        const r = Math.random()
        if (r > 0.65) this.color = `rgba(0,245,255,${this.opacity})`
        else if (r > 0.35) this.color = `rgba(179,71,255,${this.opacity})`
        else this.color = `rgba(255,45,120,${this.opacity * 0.7})`
      }
      update() {
        // Mouse repulsion
        const dx = this.x - mouseRef.current.x
        const dy = this.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          this.speedX = this.baseSpeedX + (dx / dist) * force * 1.5
          this.speedY = this.baseSpeedY + (dy / dist) * force * 1.5
        } else {
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05
        }
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    for (let i = 0; i < 140; i++) particles.push(new Particle())

    const drawConnections = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0,245,255,${alpha})`
            ctx.lineWidth = 0.4
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      drawConnections()
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

/* =========================================
   DATA STREAM COLUMN
   ========================================= */
function DataStreams() {
  return (
    <div className="data-streams" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="data-stream-col" style={{ animationDelay: `${i * 0.8}s`, left: `${10 + i * 15}%` }}>
          {[...Array(12)].map((_, j) => (
            <span key={j} style={{ animationDelay: `${j * 0.15}s` }}>
              {Math.random() > 0.5 ? '1' : '0'}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

/* =========================================
   NAVBAR
   ========================================= */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <a href="#home" className="navbar-logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <DigiChainLogo size={scrolled ? 105 : 140} glowing={true} />
          </a>

          {/* Desktop nav links */}
          <ul className="navbar-links">
            {[['about', 'About'], ['learn', 'Curriculum'], ['hosts', 'Hosts'], ['register', 'Register']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
            ))}
          </ul>

          {/* Right side group */}
          <div className="navbar-right">
            {/* Status indicator */}
            <div className="navbar-status">
              <span className="status-dot"></span>
              <span className="status-text">LIVE</span>
            </div>

            {/* Desktop CTA */}
            <a href="#register" className="navbar-cta" onClick={e => { e.preventDefault(); scrollTo('register') }}>
              Register Now
            </a>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Live stats ticker bar — BELOW navbar, not inside hero */}
      <LiveStatsTicker />

      {/* Mobile overlay */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>✕</button>
        <div className="mobile-nav-logo">
          <DigiChainLogo size={160} glowing={true} />
        </div>
        {[['about', 'About'], ['learn', 'Curriculum'], ['hosts', 'Hosts'], ['register', 'Register']].map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a>
        ))}
        <a href="#register" className="btn-primary" onClick={e => { e.preventDefault(); scrollTo('register') }} style={{ marginTop: '1rem' }}>
          Register Now ✦
        </a>
      </div>
    </>
  )
}

/* =========================================
   SCREEN CRACK ANIMATION
   ========================================= */
const CRACK_LINES = (() => {
  const lines = []
  const count = 16
  const offsets = [0.12, -0.18, 0.05, -0.08, 0.22, -0.14, 0.09, -0.21,
    0.16, -0.06, 0.19, -0.11, 0.03, -0.17, 0.13, -0.07]
  const lengths = [48, 42, 55, 38, 50, 44, 52, 40, 46, 58, 36, 54, 43, 49, 41, 56]
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const jitter = offsets[i]
    const len = lengths[i]
    const mid = 0.45
    lines.push({
      x1: 50, y1: 50,
      x2: 50 + Math.cos(angle + jitter) * len * mid,
      y2: 50 + Math.sin(angle + jitter) * len * mid,
      x3: 50 + Math.cos(angle) * len,
      y3: 50 + Math.sin(angle) * len,
      delay: i * 0.018,
    })
  }
  return lines
})()

function LocalCrackOverlay() {
  return (
    <div className="local-crack-overlay" aria-hidden="true">
      <div className="local-crack-flash" />
      <svg className="local-crack-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="local-crack-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {CRACK_LINES.map((c, i) => (
          <g key={i} filter="url(#local-crack-glow)">
            <polyline
              points={`${c.x1},${c.y1} ${c.x2},${c.y2} ${c.x3},${c.y3}`}
              stroke="rgba(0,245,255,0.95)"
              strokeWidth="0.6"
              fill="none"
              className="crack-line"
              style={{ animationDelay: `${c.delay}s` }}
            />
            <polyline
              points={`${c.x1},${c.y1} ${c.x2},${c.y2} ${c.x3},${c.y3}`}
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="0.2"
              fill="none"
              className="crack-line-core"
              style={{ animationDelay: `${c.delay}s` }}
            />
          </g>
        ))}
        <circle cx="50" cy="50" r="2.5" fill="rgba(0,245,255,0.7)" className="crack-epicenter" />
        <circle cx="50" cy="50" r="5" fill="none" stroke="rgba(0,245,255,0.4)" strokeWidth="0.6" className="crack-epicenter-ring" />
      </svg>
    </div>
  )
}

/* =========================================
   HEX NODE + FLOATING ELEMENTS
   ========================================= */
function HexNode({ style, size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className="hex-node" style={style}>
      <polygon points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5" stroke="rgba(0,245,255,0.55)" strokeWidth="1.5" fill="none" />
      <polygon points="30,15 45,22.5 45,37.5 30,45 15,37.5 15,22.5" stroke="rgba(179,71,255,0.35)" strokeWidth="1" fill="none" />
      <circle cx="30" cy="30" r="4" fill="rgba(0,245,255,0.35)" />
      <circle cx="30" cy="30" r="1.5" fill="rgba(0,245,255,0.9)" />
    </svg>
  )
}

/* Audio impact sound */
function playImpactSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const boomBuf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate)
    const boomData = boomBuf.getChannelData(0)
    for (let i = 0; i < boomData.length; i++) {
      boomData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12))
    }
    const boomSrc = ctx.createBufferSource()
    boomSrc.buffer = boomBuf
    const boomFilter = ctx.createBiquadFilter()
    boomFilter.type = 'lowpass'
    boomFilter.frequency.value = 120
    const boomGain = ctx.createGain()
    boomGain.gain.setValueAtTime(0.7, ctx.currentTime)
    boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    boomSrc.connect(boomFilter)
    boomFilter.connect(boomGain)
    boomGain.connect(ctx.destination)
    boomSrc.start()
    for (let s = 0; s < 6; s++) {
      const crackBuf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
      const crackData = crackBuf.getChannelData(0)
      for (let i = 0; i < crackData.length; i++) {
        crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02))
      }
      const crackSrc = ctx.createBufferSource()
      crackSrc.buffer = crackBuf
      const crackFilter = ctx.createBiquadFilter()
      crackFilter.type = 'highpass'
      crackFilter.frequency.value = 2000 + Math.random() * 4000
      const crackGain = ctx.createGain()
      crackGain.gain.setValueAtTime(0, ctx.currentTime)
      crackGain.gain.setValueAtTime(0.4 + Math.random() * 0.3, ctx.currentTime + s * 0.04)
      crackGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + s * 0.04 + 0.18)
      crackSrc.connect(crackFilter)
      crackFilter.connect(crackGain)
      crackGain.connect(ctx.destination)
      crackSrc.start()
    }
    setTimeout(() => ctx.close(), 2000)
  } catch (e) { }
}

/* =========================================
   LIVE STATS TICKER
   ========================================= */
function LiveStatsTicker() {
  const [stats, setStats] = useState({
    blockHeight: 19847362,
    gasPrice: 28,
    txPerSec: 14.3,
    ethPrice: 3247.82,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3),
        gasPrice: Math.max(12, prev.gasPrice + (Math.random() - 0.5) * 4),
        txPerSec: Math.max(8, prev.txPerSec + (Math.random() - 0.5) * 2),
        ethPrice: Math.max(2000, prev.ethPrice + (Math.random() - 0.5) * 30),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="live-ticker-bar" aria-label="Live blockchain stats">
      <div className="ticker-label">
        <span className="ticker-dot" />
        LIVE CHAIN
      </div>
      <div className="ticker-items">
        <div className="ticker-item">
          <span className="ticker-key">BLOCK</span>
          <span className="ticker-value">#{stats.blockHeight.toLocaleString()}</span>
        </div>
        <span className="ticker-sep" />
        <div className="ticker-item">
          <span className="ticker-key">GAS</span>
          <span className="ticker-value">{stats.gasPrice.toFixed(1)} gwei</span>
        </div>
        <span className="ticker-sep" />
        <div className="ticker-item">
          <span className="ticker-key">TPS</span>
          <span className="ticker-value">{stats.txPerSec.toFixed(1)}</span>
        </div>
        <span className="ticker-sep" />
        <div className="ticker-item">
          <span className="ticker-key">ETH</span>
          <span className="ticker-value ticker-green">${stats.ethPrice.toFixed(2)}</span>
        </div>
        <span className="ticker-sep" />
        <div className="ticker-item">
          <span className="ticker-key" style={{ color: 'var(--neon-purple)' }}>HASH</span>
          <span className="ticker-value" style={{ fontSize: '0.55rem', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>0x{Math.random().toString(16).slice(2, 8)}...{Math.random().toString(16).slice(2, 6)}</span>
        </div>
      </div>
    </div>
  )
}

/* =========================================
   HACKER TYPEWRITER — "Blockchain"
   ========================================= */
const HACK_CHARS = '0123456789ABCDEF∑∆∏√∞≈≠ABCDEFGHIJKLMNOPabcdefgh'
function HackerTypingText({ text, className = '', delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    let startTimer = setTimeout(() => {
      let i = 0
      let scrambleCount = 0
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          // Scramble phase: show random chars before locking in real char
          if (scrambleCount < 3) {
            const scrambled = text
              .slice(0, i)
              .split('')
              .map((c, idx) => idx === i - 1
                ? HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)]
                : c
              ).join('')
            setDisplayed(scrambled + HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)])
            scrambleCount++
          } else {
            setDisplayed(text.slice(0, i + 1))
            i++
            scrambleCount = 0
          }
        } else {
          clearInterval(typeInterval)
          setDone(true)
        }
      }, 55)
      return () => clearInterval(typeInterval)
    }, delay)
    return () => clearTimeout(startTimer)
  }, [text, delay])

  // Blink cursor
  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  return (
    <span className={className}>
      {displayed}
      <span className="hack-cursor" style={{ opacity: cursor ? 1 : 0 }}>_</span>
    </span>
  )
}

/* =========================================
   HERO SECTION
   ========================================= */
function Hero() {
  const [showCrack, setShowCrack] = useState(false)
  const [crackDone, setCrackDone] = useState(false)
  const [titleReady, setTitleReady] = useState(false)
  const scrollToRegister = () => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    // Slight delay so page loads before typing starts
    const titleTimer = setTimeout(() => setTitleReady(true), 300)
    const t = setTimeout(() => {
      setShowCrack(true)
      playImpactSound()
      setTimeout(() => setCrackDone(true), 2000)
    }, 1600)
    return () => { clearTimeout(t); clearTimeout(titleTimer) }
  }, [])

  return (
    <section className="hero" id="home">
      {/* Layered backgrounds */}
      <div className="hero-bg-grid" />
      <div className="hero-radial" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Cyber corners */}
      <div className="hero-corner hero-corner-tl" />
      <div className="hero-corner hero-corner-tr" />
      <div className="hero-corner hero-corner-bl" />
      <div className="hero-corner hero-corner-br" />

      {/* Holographic hex nodes */}
      <div className="hero-nodes">
        <HexNode style={{ top: '10%', left: '4%', opacity: 0.14, animationDuration: '9s' }} size={90} />
        <HexNode style={{ top: '68%', left: '2%', opacity: 0.09, animationDuration: '12s', animationDelay: '-3s' }} size={55} />
        <HexNode style={{ top: '18%', right: '5%', opacity: 0.11, animationDuration: '8s', animationDelay: '-5s' }} size={70} />
        <HexNode style={{ bottom: '18%', right: '3%', opacity: 0.08, animationDuration: '14s', animationDelay: '-2s' }} size={100} />
        <HexNode style={{ top: '48%', left: '48%', opacity: 0.03, animationDuration: '18s' }} size={240} />
        <HexNode style={{ top: '35%', left: '15%', opacity: 0.06, animationDuration: '11s', animationDelay: '-7s' }} size={45} />
      </div>

      <div className="hero-content">

        <h1 className="hero-title">
          <span className="hero-title-line1 hero-title-hacker">
            {titleReady && <HackerTypingText text="Blockchain" delay={0} />}
          </span>
          <span className="hero-title-line2">Master Class</span>
        </h1>

        <p className="hero-subtitle">
          Your complete journey from blockchain basics to advanced Web3 mastery
        </p>

        {/* COMING SOON wrapper — crack renders INSIDE */}
        <div className="coming-soon-wrapper">
          <div className="hero-coming-soon">⟡ Coming Soon ⟡</div>
          {showCrack && !crackDone && <LocalCrackOverlay />}
        </div>

        <p className="hero-launch-info">
          Launching in <span>May 2026</span> · Hosted by Varun &amp; Utkarsh
        </p>

        <div className="hero-cta-group">
          <button className="btn-primary" onClick={scrollToRegister} id="hero-register-btn">
            ✦ Register Now
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })} id="hero-learn-btn">
            Explore Curriculum →
          </button>
        </div>
      </div>

      {/* Scroll indicator — FIXED */}
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse" />
        <div className="scroll-chevrons">
          <svg className="scroll-chevron" width="18" height="10" viewBox="0 0 18 10" fill="none">
            <path d="M2 2L9 8L16 2" stroke="rgba(0,245,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className="scroll-chevron" width="18" height="10" viewBox="0 0 18 10" fill="none">
            <path d="M2 2L9 8L16 2" stroke="rgba(0,245,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className="scroll-chevron" width="18" height="10" viewBox="0 0 18 10" fill="none">
            <path d="M2 2L9 8L16 2" stroke="rgba(0,245,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="scroll-text">SCROLL</span>
      </div>
    </section>
  )
}

/* =========================================
   ANIMATED COUNTER
   ========================================= */
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const startTime = Date.now()
          const isInfinity = target === '∞'
          if (isInfinity) { setCount('∞'); return }
          const numTarget = parseFloat(target)
          const tick = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * numTarget))
            if (progress < 1) requestAnimationFrame(tick)
            else setCount(numTarget)
          }
          tick()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="counter-value">
      {prefix}{count === '∞' ? '∞' : count}{suffix}
    </span>
  )
}

/* =========================================
   ABOUT SECTION
   ========================================= */
function About() {
  return (
    <section className="about-section section-padding" id="about">
      <div className="container">
        <div className="about-grid">
          <div>
            <div className="section-tag reveal">About the Masterclass</div>
            <h2 className="section-title reveal delay-100">
              The Ultimate{' '}
              <span className="text-gradient">Web3 Learning</span>{' '}
              Experience
            </h2>
            <p style={{ marginBottom: '1.2rem', lineHeight: 1.8, fontSize: '0.95rem' }} className="reveal delay-200">
              The Blockchain Master Class is a comprehensive program designed to take you from a complete beginner to a confident blockchain developer and investor. Whether you're a student, professional, or entrepreneur — this is the course that bridges theory with real-world application.
            </p>
            <p style={{ marginBottom: '1.2rem', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-muted)' }} className="reveal delay-300">
              Curated by industry veterans and Web3 pioneers, every module is packed with live demonstrations, hands-on coding sessions, and actionable insights from real blockchain deployments.
            </p>
            <div className="about-stats reveal delay-400">
              {[
                { n: '10', suffix: '+', l: 'Modules' },
                { n: '40', suffix: '+', l: 'Hours Content' },
                { n: '100', suffix: '%', l: 'Hands-on' },
                { n: '∞', suffix: '', l: 'Lifetime Access' },
              ].map(({ n, suffix, l }) => (
                <div className="stat-item" key={l}>
                  <div className="stat-number">
                    <AnimatedCounter target={n} suffix={suffix} />
                  </div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual reveal-right">
            {/* 3D Holographic Blockchain Ring */}
            <div className="blockchain-ring float-anim">
              <div className="ring-outer" />
              <div className="ring-middle" />
              <div className="ring-inner">
                <div className="ring-center-content">
                  <span className="ring-center-icon">⛓</span>
                  <span className="ring-center-label">WEB3</span>
                </div>
              </div>
              {/* Orbit dots */}
              <div className="orbit-dot" style={{ top: 0, left: '50%', marginLeft: -6 }} />
              <div className="orbit-dot" />
              <div className="orbit-dot" />
              {/* Data labels */}
              <div className="orbit-label" style={{ top: '-12%', left: '50%', transform: 'translateX(-50%)' }}>ETH</div>
              <div className="orbit-label" style={{ bottom: '-8%', left: '50%', transform: 'translateX(-50%)' }}>BTC</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================
   CURRICULUM / WHAT YOU'LL LEARN
   ========================================= */
const TOPICS = [
  {
    icon: '🧱',
    title: 'Blockchain Fundamentals',
    desc: 'Understand distributed ledgers, consensus mechanisms, cryptographic hashing, and the architecture behind blockchain networks.',
    tag: 'Beginner',
    tagGrad: 'linear-gradient(90deg, rgba(0,255,157,0.18), rgba(0,220,229,0.12))',
    tagColor: 'var(--neon-green)',
    iconBg: 'rgba(0,255,157,0.1)',
    accentColor: '#00ff9d',
    module: '01',
  },
  {
    icon: '📜',
    title: 'Smart Contracts',
    desc: 'Write, deploy, and audit Solidity smart contracts on Ethereum. Learn ERC standards, gas optimization, and security best practices.',
    tag: 'Intermediate',
    tagGrad: 'linear-gradient(90deg, rgba(0,245,255,0.15), rgba(0,150,230,0.1))',
    tagColor: 'var(--neon-cyan)',
    iconBg: 'rgba(0,245,255,0.1)',
    accentColor: '#00f5ff',
    module: '02',
  },
  {
    icon: '🏦',
    title: 'DeFi & Protocols',
    desc: 'Deep-dive into Decentralized Finance — liquidity pools, AMMs, yield farming, lending protocols, and tokenomics design.',
    tag: 'Intermediate',
    tagGrad: 'linear-gradient(90deg, rgba(0,245,255,0.15), rgba(0,150,230,0.1))',
    tagColor: 'var(--neon-cyan)',
    iconBg: 'rgba(179,71,255,0.1)',
    accentColor: '#00f5ff',
    module: '03',
  },
  {
    icon: '🎨',
    title: 'NFTs & Digital Assets',
    desc: 'Create, mint, and trade NFTs. Explore metadata standards, royalty mechanisms, marketplaces, and real-world applications.',
    tag: 'Intermediate',
    tagGrad: 'linear-gradient(90deg, rgba(179,71,255,0.18), rgba(130,30,200,0.1))',
    tagColor: 'var(--neon-purple)',
    iconBg: 'rgba(255,45,120,0.1)',
    accentColor: '#b347ff',
    module: '04',
  },
  {
    icon: '🌐',
    title: 'Web3 Development',
    desc: 'Build full-stack dApps using React, ethers.js, and Hardhat. Connect wallets, interact with contracts, and deploy to testnets.',
    tag: 'Advanced',
    tagGrad: 'linear-gradient(90deg, rgba(255,45,120,0.18), rgba(200,0,80,0.1))',
    tagColor: 'var(--neon-pink)',
    iconBg: 'rgba(0,245,255,0.1)',
    accentColor: '#ff2d78',
    module: '05',
  },
  {
    icon: '⚡',
    title: 'Layer 2 & Scaling',
    desc: "Explore Polygon, Arbitrum, Optimism, and zkRollups. Understand how Layer 2 solutions solve Ethereum's scalability trilemma.",
    tag: 'Advanced',
    tagGrad: 'linear-gradient(90deg, rgba(255,45,120,0.18), rgba(200,0,80,0.1))',
    tagColor: 'var(--neon-pink)',
    iconBg: 'rgba(255,45,120,0.1)',
    accentColor: '#ff2d78',
    module: '06',
  },
  {
    icon: '🏛',
    title: 'DAOs & Governance',
    desc: 'Design decentralized organizations, create governance tokens, voting mechanisms, and deploy on-chain proposal systems.',
    tag: 'Advanced',
    tagGrad: 'linear-gradient(90deg, rgba(255,45,120,0.18), rgba(200,0,80,0.1))',
    tagColor: 'var(--neon-pink)',
    iconBg: 'rgba(0,255,157,0.1)',
    accentColor: '#ff2d78',
    module: '07',
  },
  {
    icon: '🚀',
    title: 'Real-World Use Cases',
    desc: 'Supply chain, healthcare, finance, identity — explore how blockchain is transforming industries and discover career pathways.',
    tag: 'Applied',
    tagGrad: 'linear-gradient(90deg, rgba(255,165,0,0.18), rgba(200,100,0,0.1))',
    tagColor: 'var(--neon-gold)',
    iconBg: 'rgba(255,165,0,0.1)',
    accentColor: '#ffaa00',
    module: '08',
  },
]

function Learn() {
  return (
    <section className="learn-section section-padding" id="learn">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <div className="section-tag reveal" style={{ justifyContent: 'center', display: 'flex' }}>Curriculum</div>
          <h2 className="section-title reveal delay-100">
            What You'll <span className="text-gradient">Master</span>
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8 }} className="reveal delay-200">
            A structured path from zero to Web3 hero — every topic builds on the last, with real projects at every stage.
          </p>
        </div>

        <div className="topics-grid">
          {TOPICS.map((topic, i) => (
            <div
              key={topic.title}
              className={`topic-card reveal delay-${Math.min((i % 4 + 1) * 100, 400)}`}
              style={{ '--accent': topic.accentColor }}
            >
              <div className="topic-module-num">MODULE {topic.module}</div>
              <div className="topic-icon" style={{ background: topic.iconBg }}>
                {topic.icon}
              </div>
              <div className="topic-title">{topic.title}</div>
              <p className="topic-desc">{topic.desc}</p>
              <div
                className="topic-tag"
                style={{ background: topic.tagGrad, color: topic.tagColor, border: `1px solid ${topic.accentColor}35` }}
              >
                {topic.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================================
   HOSTS SECTION
   ========================================= */
function Hosts() {
  return (
    <section className="hosts-section section-padding" id="hosts">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div className="section-tag reveal" style={{ justifyContent: 'center', display: 'flex' }}>Your Instructors</div>
          <h2 className="section-title reveal delay-100">
            Meet the <span className="text-gradient">DigiChain Pioneers</span>
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8 }} className="reveal delay-200">
            Industry veterans who've built, broken, and rebuilt blockchain systems — here to share everything they know.
          </p>
        </div>

        <div className="hosts-grid">
          <div className="host-card varun reveal-left">
            <div className="host-card-bg-accent" style={{ background: 'radial-gradient(circle at top left, rgba(0,245,255,0.07) 0%, transparent 70%)' }} />
            <div className="host-avatar-wrapper">
              <div className="host-avatar varun">⚡</div>
              <div className="host-badge">✦</div>
            </div>
            <div className="host-name">Varun</div>
            <div className="host-title">Blockchain Architect</div>
            <div className="host-skills">
              {['DeFi', 'Smart Contracts', 'Layer 2', 'Security'].map(s => (
                <span key={s} className="host-skill-tag">{s}</span>
              ))}
            </div>
            <p className="host-bio">
              Full-stack Web3 developer with expertise in DeFi protocol design, smart contract auditing, and Layer 2 scaling solutions. Passionate about making blockchain accessible to everyone.
            </p>
            <div className="digichain-badge">
              <DigiChainLogo size={14} /> DigiChain Pioneer
            </div>
          </div>

          <div className="host-card utkarsh reveal-right">
            <div className="host-card-bg-accent" style={{ background: 'radial-gradient(circle at top right, rgba(179,71,255,0.07) 0%, transparent 70%)' }} />
            <div className="host-avatar-wrapper">
              <div className="host-avatar utkarsh">🔮</div>
              <div className="host-badge">✦</div>
            </div>
            <div className="host-name">Utkarsh</div>
            <div className="host-title">Web3 Strategist</div>
            <div className="host-skills">
              {['NFTs', 'DAOs', 'dApps', 'Analytics'].map(s => (
                <span key={s} className="host-skill-tag purple">{s}</span>
              ))}
            </div>
            <p className="host-bio">
              NFT ecosystem builder, tokenomics designer, and dApp developer. Deep expertise in DAO governance, on-chain analytics, and real-world blockchain implementation across multiple industries.
            </p>
            <div className="digichain-badge">
              <DigiChainLogo size={14} /> DigiChain Pioneer
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================
   REGISTRATION SECTION
   ========================================= */
function Register() {
  const [form, setForm] = useState({ name: '', email: '', location: '', profession: '', contact: '' })
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setToast(true)
    setTimeout(() => setToast(false), 4500)
  }

  return (
    <section className="register-section section-padding" id="register">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <div className="section-tag reveal" style={{ justifyContent: 'center', display: 'flex' }}>Get Early Access</div>
          <h2 className="section-title reveal delay-100">
            Secure Your <span className="text-gradient">Spot</span>
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8 }} className="reveal delay-200">
            Register now and be the first to know when we launch in May. Limited early-bird seats available.
          </p>
        </div>

        <div className="register-wrapper reveal delay-300">
          <div className="register-card">
            <div className="register-card-glow" />
            <div className="register-card-corner rc-tl" />
            <div className="register-card-corner rc-tr" />
            <div className="register-card-corner rc-bl" />
            <div className="register-card-corner rc-br" />

            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-name">
                      Full Name
                      {focusedField === 'name' && <span className="form-scanning">Scanning...</span>}
                    </label>
                    <input id="reg-name" className="form-input" type="text" name="name"
                      placeholder="Your full name" value={form.name} onChange={handleChange}
                      onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">
                      Email Address
                      {focusedField === 'email' && <span className="form-scanning">Scanning...</span>}
                    </label>
                    <input id="reg-email" className="form-input" type="email" name="email"
                      placeholder="your@email.com" value={form.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-location">Location</label>
                    <input id="reg-location" className="form-input" type="text" name="location"
                      placeholder="City, Country" value={form.location} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-contact">Contact Number</label>
                    <input id="reg-contact" className="form-input" type="tel" name="contact"
                      placeholder="+91 9876543210" value={form.contact} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-profession">I Am A</label>
                  <select id="reg-profession" className="form-input" name="profession"
                    value={form.profession} onChange={handleChange} required>
                    <option value="" disabled>Select your profile</option>
                    <option value="student">🎓 Student</option>
                    <option value="professional">💼 Working Professional</option>
                    <option value="entrepreneur">🚀 Entrepreneur</option>
                    <option value="developer">💻 Developer</option>
                    <option value="investor">📈 Investor / Enthusiast</option>
                  </select>
                </div>
                <button id="register-submit-btn" className="form-submit" type="submit">
                  ✦ Reserve My Seat — It's Free
                </button>
                <p className="form-disclaimer">
                  🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <div className="success-icon">🎉</div>
                <h3 className="success-title">You're on the List!</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Thank you, <strong style={{ color: 'var(--neon-cyan)' }}>{form.name || 'Pioneer'}</strong>!<br />
                  We'll notify you as soon as the class launches in May. Get ready to master blockchain! ⛓
                </p>
                <button
                  className="btn-secondary"
                  style={{ marginTop: '2rem' }}
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', location: '', profession: '', contact: '' }) }}
                >
                  Register Another →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span className="toast-icon">✅</span>
          <div>
            <span className="toast-title">Registration Successful!</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>You're in — we'll see you in May!</span>
          </div>
        </div>
      )}
    </section>
  )
}

/* =========================================
   FOOTER
   ========================================= */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-divider" />
        <div className="footer-inner">
          <div className="footer-logo">
            <DigiChainLogo size={100} glowing={true} />
          </div>
          <p className="footer-copy">
            © 2026 DigiChain Pioneers · Blockchain Master Class<br />
            Crafted with ⚡ by Varun &amp; Utkarsh
          </p>
          <div className="footer-links">
            <a href="#about" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}>About</a>
            <a href="#learn" onClick={e => { e.preventDefault(); document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' }) }}>Curriculum</a>
            <a href="#register" onClick={e => { e.preventDefault(); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }) }}>Register</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* =========================================
   SCROLL REVEAL HOOK
   ========================================= */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* =========================================
   CURSOR GLOW EFFECT
   ========================================= */
function CursorGlow() {
  const glowRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const curRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    const move = (e) => { posRef.current = { x: e.clientX, y: e.clientY } }

    const animate = () => {
      const easing = 0.08
      curRef.current.x += (posRef.current.x - curRef.current.x) * easing
      curRef.current.y += (posRef.current.y - curRef.current.y) * easing
      if (glow) {
        glow.style.left = `${curRef.current.x}px`
        glow.style.top = `${curRef.current.y}px`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', move)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}

/* =========================================
   SCROLL PROGRESS BAR
   ========================================= */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />
}

/* =========================================
   MARQUEE SCROLLING TEXT
   ========================================= */
function Marquee() {
  const items = [
    'BLOCKCHAIN', 'SMART CONTRACTS', 'DEFI', 'WEB3', 'NFTs', 'LAYER 2',
    'CRYPTOGRAPHY', 'CONSENSUS', 'DAPPS', 'TOKENOMICS', 'DAOs', 'ZERO KNOWLEDGE',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="marquee-wrapper" style={{ padding: '2rem 0', borderTop: '1px solid rgba(0,245,255,0.04)', borderBottom: '1px solid rgba(0,245,255,0.04)' }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* =========================================
   WARP SPEED LINES (Ambient Background)
   ========================================= */
function WarpLines() {
  const lines = Array.from({ length: 8 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    width: `${60 + Math.random() * 100}px`,
    delay: `${i * 0.7 + Math.random() * 2}s`,
    duration: `${3 + Math.random() * 4}s`,
    opacity: 0.15 + Math.random() * 0.25,
  }))
  return (
    <div className="warp-lines" aria-hidden="true">
      {lines.map((l, i) => (
        <div key={i} className="warp-line" style={{
          top: l.top,
          width: l.width,
          animationDelay: l.delay,
          animationDuration: l.duration,
          opacity: l.opacity,
        }} />
      ))}
    </div>
  )
}

/* =========================================
   ROOT APP
   ========================================= */
export default function App() {
  useScrollReveal()
  return (
    <div className="app">
      <ScrollProgressBar />
      <CursorGlow />
      <MatrixRainCanvas />
      <ParticleCanvas />
      <WarpLines />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Learn />
        <Marquee />
        <Hosts />
        <Register />
      </main>
      <Footer />
    </div>
  )
}
