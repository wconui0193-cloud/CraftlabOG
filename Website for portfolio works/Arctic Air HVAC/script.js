/* Ben's ProServ Concept — scroll reveals + testimonial carousel */

const testimonials = [
  {
    quote: '"We\'ve called Arctic Air for 20 years. There\'s no one else we\'d trust with our home."',
    body: 'From our first HVAC replacement to yearly tune-ups and a complete bathroom plumbing overhaul — Arctic Air has never let us down. Honest, prompt, and thorough every single time.',
    cite: '— Susan M., Freehold NJ'
  },
  {
    quote: '"Called at 11pm on a Friday — tech was at our door by midnight. Incredible service."',
    body: 'Our furnace died in January and Arctic Air had someone out within the hour. Fixed the same night. We\'ve been customers ever since and recommend them to everyone we know.',
    cite: '— James R., Marlboro NJ'
  },
  {
    quote: '"Honest estimates, clean work, and they actually showed up when they said they would."',
    body: 'Had three companies quote a new AC system. Arctic Air was straightforward, explained everything clearly, and completed the install ahead of schedule. No surprises on the bill.',
    cite: '— Patricia K., Howell NJ'
  }
]

let currentTestimonial = 0

function showTestimonial(index) {
  const card = document.querySelector('.testimonial-card')
  if (!card) return
  card.style.opacity = '0'
  card.style.transform = 'translateY(8px)'
  setTimeout(() => {
    document.getElementById('testimonial-quote').textContent = testimonials[index].quote
    document.getElementById('testimonial-body').textContent = testimonials[index].body
    document.getElementById('testimonial-cite').textContent = testimonials[index].cite
    card.style.opacity = '1'
    card.style.transform = 'translateY(0)'
  }, 200)
}

document.addEventListener('DOMContentLoaded', () => {
  const testimonialCard = document.querySelector('.testimonial-card')
  if (testimonialCard) {
    testimonialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  }

  const prevBtn = document.getElementById('prev-testimonial')
  const nextBtn = document.getElementById('next-testimonial')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length
      showTestimonial(currentTestimonial)
    })
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length
      showTestimonial(currentTestimonial)
    })
  }

  // Scroll reveals
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 60)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  revealEls.forEach(el => observer.observe(el))

  // Nav active on scroll
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav-links a')
  window.addEventListener('scroll', () => {
    let current = ''
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id
    })
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`)
    })
  }, { passive: true })
})
