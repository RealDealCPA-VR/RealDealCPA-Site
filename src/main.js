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

/* ─── Lightbox ─────────────────────────────────────────────────────── */

const lightboxTriggers = document.querySelectorAll('[data-lightbox]')
if (lightboxTriggers.length) {
  const items = Array.from(lightboxTriggers).map((el) => ({
    src: el.dataset.src,
    title: el.dataset.title || '',
    series: el.dataset.series || '',
  }))
  let i = 0
  let lastFocused = null

  const lb = document.createElement('div')
  lb.className = 'lightbox'
  lb.setAttribute('aria-hidden', 'true')
  lb.setAttribute('role', 'dialog')
  lb.setAttribute('aria-modal', 'true')
  lb.innerHTML = `
    <button class="lightbox-btn lightbox-close" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
    </button>
    <button class="lightbox-btn lightbox-prev" aria-label="Previous image">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button class="lightbox-btn lightbox-next" aria-label="Next image">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <div class="lightbox-stage">
      <img src="" alt=""/>
      <div class="lightbox-meta">
        <span class="eyebrow"></span>
        <span class="lightbox-title"></span>
        <span class="lightbox-counter"></span>
      </div>
    </div>`
  document.body.appendChild(lb)

  const imgEl = lb.querySelector('img')
  const eyebrowEl = lb.querySelector('.eyebrow')
  const titleEl = lb.querySelector('.lightbox-title')
  const counterEl = lb.querySelector('.lightbox-counter')

  const show = (n) => {
    i = (n + items.length) % items.length
    const it = items[i]
    imgEl.src = it.src
    imgEl.alt = it.title
    eyebrowEl.textContent = it.series
    titleEl.textContent = it.title
    counterEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
  }

  const open = (n) => {
    lastFocused = document.activeElement
    show(n)
    lb.classList.add('is-open')
    lb.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    lb.querySelector('.lightbox-close').focus()
  }
  const close = () => {
    lb.classList.remove('is-open')
    lb.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    if (lastFocused && lastFocused.focus) lastFocused.focus()
  }

  lightboxTriggers.forEach((el, idx) => {
    el.addEventListener('click', () => open(idx))
  })
  lb.querySelector('.lightbox-close').addEventListener('click', close)
  lb.querySelector('.lightbox-prev').addEventListener('click', () => show(i - 1))
  lb.querySelector('.lightbox-next').addEventListener('click', () => show(i + 1))
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close()
  })
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowLeft') show(i - 1)
    else if (e.key === 'ArrowRight') show(i + 1)
  })
}

/* ─── Year stamp in footer ─────────────────────────────────────────── */

const yearEl = document.querySelectorAll('[data-year]')
yearEl.forEach((el) => (el.textContent = new Date().getFullYear()))
