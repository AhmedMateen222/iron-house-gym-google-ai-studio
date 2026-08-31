/**
 * Iron House Gym - Master Client Script (script.js)
 * High-performance Vanilla JavaScript handling interactive features:
 * - Responsive Navbar & Mobile Drawer
 * - Scroll Spy & Sticky Header
 * - Animated Hero Counter Stats
 * - Interactive Pricing Period Toggle (Monthly / Quarterly / Annual)
 * - Auto-fill Plan & Trainer Selection in Contact Form
 * - Gallery Category Filtering & Image Lightbox Modal
 * - Testimonials Carousel with Auto-advance & Touch Swipe
 * - Contact Form Validation & Submission Feedback
 * - Scroll Reveal Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
  
    /* ==========================================================================
       1. STICKY HEADER & ACTIVE NAVIGATION SCROLL SPY
       ========================================================================== */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id="top"]');
  
    const handleHeaderScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
  
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180;
  
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
  
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };
  
    window.addEventListener('scroll', () => {
      handleHeaderScroll();
      handleScrollSpy();
    }, { passive: true });
    handleHeaderScroll();
  
    /* ==========================================================================
       2. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-join-btn');
  
    const toggleMobileMenu = (openState) => {
      const shouldOpen = openState !== undefined ? openState : !mobileDrawer.classList.contains('open');
      if (shouldOpen) {
        mobileDrawer.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    };
  
    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener('click', () => toggleMobileMenu());
  
      mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
          toggleMobileMenu(false);
        });
      });
  
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          toggleMobileMenu(false);
        }
      });
    }
  
    /* ==========================================================================
       3. ANIMATED HERO COUNTERS
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
  
    const animateCounters = () => {
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const isPercentage = stat.innerText.includes('%');
        const isPlus = stat.innerText.includes('+');
        const duration = 1800; // ms
        const startTime = performance.now();
  
        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Easing function (easeOutQuad)
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = Math.floor(easeProgress * target);
  
          let formatted = currentVal.toLocaleString();
          if (isPlus) formatted += '+';
          if (isPercentage) formatted += '%';
          stat.innerText = formatted;
  
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        };
  
        requestAnimationFrame(updateCount);
      });
    };
  
    const heroStatsSection = document.getElementById('hero-stats');
    if (heroStatsSection && 'IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe(heroStatsSection);
    }
  
    /* ==========================================================================
       4. MEMBERSHIP PRICING PERIOD SWITCHER
       ========================================================================== */
    const switchBtns = document.querySelectorAll('.switch-btn');
    const priceValues = document.querySelectorAll('.price-value');
    const pricePeriods = document.querySelectorAll('.price-period');
  
    const periodLabels = {
      monthly: '/ month',
      quarterly: '/ 3 months',
      annual: '/ year'
    };
  
    switchBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        switchBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
  
        const period = btn.getAttribute('data-period');
        const periodLabel = periodLabels[period] || '/ month';
  
        priceValues.forEach((val) => {
          const newPrice = val.getAttribute(`data-${period}`);
          if (newPrice) {
            val.style.opacity = '0';
            setTimeout(() => {
              val.innerText = newPrice;
              val.style.opacity = '1';
            }, 150);
          }
        });
  
        pricePeriods.forEach((p) => {
          p.innerText = periodLabel;
        });
      });
    });
  
    /* ==========================================================================
       5. PLAN & SERVICE SELECTION -> AUTOFILL CONTACT FORM
       ========================================================================== */
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    const programSelect = document.getElementById('selected-program');
    const contactSection = document.getElementById('contact');
    const userNameInput = document.getElementById('user-name');
  
    const selectProgramAndScroll = (programName) => {
      if (programSelect) {
        let optionFound = false;
        for (let i = 0; i < programSelect.options.length; i++) {
          if (programSelect.options[i].value.toLowerCase().includes(programName.toLowerCase()) || 
              programName.toLowerCase().includes(programSelect.options[i].value.toLowerCase())) {
            programSelect.selectedIndex = i;
            optionFound = true;
            break;
          }
        }
        if (!optionFound) {
          // Fallback: match or set custom text
          programSelect.value = programName;
        }
      }
  
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (userNameInput) userNameInput.focus();
        }, 600);
      }
    };
  
    selectPlanBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const planName = btn.getAttribute('data-plan') || 'Iron Pro Membership';
        selectProgramAndScroll(planName);
      });
    });
  
    // Service Links
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = link.getAttribute('data-service') || 'Training Services';
        selectProgramAndScroll(serviceName);
      });
    });
  
    // Trainer Consultations
    const trainerBookBtns = document.querySelectorAll('.trainer-book-btn');
    trainerBookBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const trainerName = btn.getAttribute('data-trainer') || 'Trainer';
        selectProgramAndScroll(`Personal Training 1-on-1 (Coach ${trainerName})`);
      });
    });
  
    /* ==========================================================================
       6. GALLERY FILTERING & LIGHTBOX MODAL
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  
    // Filtering
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
  
        const filter = btn.getAttribute('data-filter');
  
        galleryItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (filter === 'all' || itemCategory === filter) {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (btn.classList.contains('active')) {
                item.style.display = 'none';
              }
            }, 250);
          }
        });
      });
    });
  
    // Lightbox View
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-thumb');
        const title = item.querySelector('.gallery-item-title');
        const tag = item.querySelector('.gallery-tag');
  
        if (img && lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Iron House Facility Preview';
          if (lightboxCaption && title) {
            const tagText = tag ? `[${tag.innerText}] ` : '';
            lightboxCaption.innerText = `${tagText}${title.innerText}`;
          }
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  
    const closeLightbox = () => {
      if (lightbox) {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
      }
    };
  
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  
    /* ==========================================================================
       7. TESTIMONIALS SLIDER
       ========================================================================== */
    const track = document.getElementById('testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dots = document.querySelectorAll('.slider-dot');
    let currentIndex = 0;
    let autoSlideTimer = null;
  
    const updateSlider = (index) => {
      if (!track || cards.length === 0) return;
      if (index < 0) index = cards.length - 1;
      if (index >= cards.length) index = 0;
      currentIndex = index;
  
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
  
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };
  
    const nextSlide = () => updateSlider(currentIndex + 1);
    const prevSlide = () => updateSlider(currentIndex - 1);
  
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        updateSlider(idx);
      });
    });
  
    // Touch Swipe Support
    let startX = 0;
    let endX = 0;
    if (track) {
      track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
  
      track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
          nextSlide();
        } else if (endX - startX > 50) {
          prevSlide();
        }
      }, { passive: true });
    }
  
    // Auto Advance
    const startAutoSlide = () => {
      autoSlideTimer = setInterval(nextSlide, 6000);
    };
    const stopAutoSlide = () => {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    };
  
    const sliderContainer = document.getElementById('testimonials-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
      startAutoSlide();
    }
  
    /* ==========================================================================
       8. CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
  
    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');
    const emailInput = document.getElementById('user-email');
    const branchInput = document.getElementById('preferred-branch');
    const messageInput = document.getElementById('user-message');
  
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
  
    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
  
    const validatePhone = (phone) => {
      // Validates standard Pakistani phone format (e.g. 03001234567, +923001234567, 0300-1234567)
      const cleaned = phone.replace(/[\s-]/g, '');
      return /^(03[0-9]{9}|\+923[0-9]{9}|923[0-9]{9})$/.test(cleaned);
    };
  
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
  
        // Reset errors
        if (nameError) nameError.innerText = '';
        if (phoneError) phoneError.innerText = '';
        if (emailError) emailError.innerText = '';
        if (formMessage) {
          formMessage.className = 'form-message';
          formMessage.innerText = '';
        }
  
        // Name validation
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          if (nameError) nameError.innerText = 'Please enter your full name (minimum 2 letters).';
          nameInput.classList.add('is-invalid');
          isValid = false;
        } else {
          nameInput.classList.remove('is-invalid');
        }
  
        // Phone validation
        if (!phoneInput.value.trim()) {
          if (phoneError) phoneError.innerText = 'WhatsApp or Mobile number is required.';
          phoneInput.classList.add('is-invalid');
          isValid = false;
        } else if (!validatePhone(phoneInput.value.trim())) {
          if (phoneError) phoneError.innerText = 'Please enter a valid Pakistani number (e.g., 0300 1234567).';
          phoneInput.classList.add('is-invalid');
          isValid = false;
        } else {
          phoneInput.classList.remove('is-invalid');
        }
  
        // Email validation
        if (!emailInput.value.trim()) {
          if (emailError) emailError.innerText = 'Email address is required.';
          emailInput.classList.add('is-invalid');
          isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
          if (emailError) emailError.innerText = 'Please enter a valid email address.';
          emailInput.classList.add('is-invalid');
          isValid = false;
        } else {
          emailInput.classList.remove('is-invalid');
        }
  
        if (!isValid) return;
  
        // Submission simulation
        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
        }
  
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
          }
  
          const userName = nameInput.value.trim();
          const userBranch = branchInput ? branchInput.value : 'Lahore - Gulberg III';
          const userProg = programSelect ? programSelect.value : 'Iron Pro Membership';
  
          if (formMessage) {
            formMessage.className = 'form-message success';
            formMessage.innerHTML = `
              <strong>Inquiry Received, ${userName}!</strong><br>
              Our head coordinator at <em>${userBranch}</em> has received your request for <strong>${userProg}</strong>. You will receive a WhatsApp message and call within 30 minutes.
            `;
          }
  
          // Reset form inputs
          contactForm.reset();
        }, 1000);
      });
    }
  
    /* ==========================================================================
       9. SCROLL REVEAL OBSERVER
       ========================================================================== */
    const revealElements = document.querySelectorAll(
      '.service-card, .pricing-card, .trainer-card, .gallery-item, .about-image-card, .about-text-content, .contact-info-card, .contact-form-wrapper'
    );
  
    revealElements.forEach((el) => {
      el.classList.add('reveal-on-scroll');
    });
  
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
  
      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach((el) => el.classList.add('revealed'));
    }
  });