document.addEventListener('DOMContentLoaded', () => {

  /* ===== HEADER SCROLL STATE ===== */
  const header = document.getElementById('site-header')
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* ===== MOBILE NAV ===== */
  const navToggle = document.getElementById('nav-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open')
      navToggle.classList.toggle('open', isOpen)
      navToggle.setAttribute('aria-expanded', String(isOpen))
      mobileMenu.setAttribute('aria-hidden', String(!isOpen))
    })
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open')
        navToggle.classList.remove('open')
        navToggle.setAttribute('aria-expanded', 'false')
        mobileMenu.setAttribute('aria-hidden', 'true')
      })
    })
  }

  /* ===== SCROLL REVEALS ===== */
  const revealEls = document.querySelectorAll('.reveal')
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const group = entry.target.closest('.values-inner')
        if (group) {
          const siblings = [...group.querySelectorAll('.reveal')]
          const idx = siblings.indexOf(entry.target)
          setTimeout(() => entry.target.classList.add('revealed'), idx * 90)
        } else {
          entry.target.classList.add('revealed')
        }
        revealObserver.unobserve(entry.target)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    revealEls.forEach(el => revealObserver.observe(el))
  }

})
