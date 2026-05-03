import './styles.css'
import Lenis from 'lenis'
import VanillaTilt from 'vanilla-tilt'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ─── Lenis smooth scroll ──────────────────────────────────────────── */

if (!prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // anchor links → smooth scroll via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (id && id.length > 1) {
        const el = document.querySelector(id)
        if (el) {
          e.preventDefault()
          lenis.scrollTo(el, { offset: -80 })
        }
      }
    })
  })
}

/* ─── IntersectionObserver scroll reveals ──────────────────────────── */

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
)
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

/* ─── 3D tilt on flagged cards ─────────────────────────────────────── */

if (!prefersReducedMotion) {
  const tiltTargets = document.querySelectorAll('[data-tilt]')
  if (tiltTargets.length) {
    VanillaTilt.init(tiltTargets, {
      max: 6,
      speed: 700,
      glare: true,
      'max-glare': 0.18,
      perspective: 1400,
      scale: 1.01,
    })
  }
}

/* ─── Active nav link ──────────────────────────────────────────────── */

const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/'
document.querySelectorAll('[data-nav]').forEach((link) => {
  const target = link.getAttribute('data-nav')
  if (
    (target === '/' && path === '/') ||
    (target !== '/' && path.startsWith(target))
  ) {
    link.classList.add('is-active')
  }
})

/* ─── Year stamp in footer ─────────────────────────────────────────── */

const yearEl = document.querySelector('[data-year]')
if (yearEl) yearEl.textContent = new Date().getFullYear()
