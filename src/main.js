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

/* ─── Mobile menu ──────────────────────────────────────────────────── */

const toggleBtn = document.querySelector('[data-menu-toggle]')
if (toggleBtn) {
  const overlay = document.createElement('div')
  overlay.className = 'mobile-menu'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.innerHTML = `
    <div class="mobile-menu-backdrop" data-menu-backdrop></div>
    <div class="mobile-menu-panel glass-strong">
      <ul class="flex flex-col">
        <li><a href="/" data-nav="/" class="mobile-link">Home<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a></li>
        <li><a href="/services/" data-nav="/services" class="mobile-link">Services<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a></li>
        <li><a href="/builds/" data-nav="/builds" class="mobile-link">Builds<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a></li>
        <li><a href="/gallery/" data-nav="/gallery" class="mobile-link">Gallery<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a></li>
        <li><a href="/notes/" data-nav="/notes" class="mobile-link">Notes<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a></li>
      </ul>
      <a href="/services/#contact" class="btn btn-primary mt-7 w-full justify-center">
        Work with me
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
    </div>`
  document.body.appendChild(overlay)

  // Mark active link in mobile menu
  overlay.querySelectorAll('[data-nav]').forEach((link) => {
    const target = link.getAttribute('data-nav')
    if (
      (target === '/' && path === '/') ||
      (target !== '/' && path.startsWith(target))
    ) {
      link.classList.add('is-active')
    }
  })

  const iconOpen = toggleBtn.querySelector('[data-icon-open]')
  const iconClose = toggleBtn.querySelector('[data-icon-close]')

  const open = () => {
    overlay.classList.add('is-open')
    overlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    toggleBtn.setAttribute('aria-expanded', 'true')
    iconOpen?.classList.add('hidden')
    iconClose?.classList.remove('hidden')
  }
  const close = () => {
    overlay.classList.remove('is-open')
    overlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    toggleBtn.setAttribute('aria-expanded', 'false')
    iconOpen?.classList.remove('hidden')
    iconClose?.classList.add('hidden')
  }

  toggleBtn.addEventListener('click', () => {
    overlay.classList.contains('is-open') ? close() : open()
  })
  overlay.querySelector('[data-menu-backdrop]').addEventListener('click', close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close()
  })
}

/* ─── Year stamp in footer ─────────────────────────────────────────── */

const yearEl = document.querySelectorAll('[data-year]')
yearEl.forEach((el) => (el.textContent = new Date().getFullYear()))
