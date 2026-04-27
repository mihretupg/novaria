/* ===================================================
   NOVARIA LIMO — script.js
   =================================================== */

const WHATSAPP_NUMBER = '14704190528';

/* ===================================================
   THEME
   =================================================== */
function applyTheme(dark) {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  const moon = document.querySelector('.icon-moon');
  const sun  = document.querySelector('.icon-sun');
  if (moon) moon.style.display = dark ? 'block' : 'none';
  if (sun)  sun.style.display  = dark ? 'none'  : 'block';
  localStorage.setItem('novaria-theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!document.documentElement.classList.contains('dark'));
}

// Init theme
(function() {
  const saved = localStorage.getItem('novaria-theme');
  applyTheme(saved ? saved === 'dark' : true);
})();

/* ===================================================
   NAVBAR SCROLL
   =================================================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ===================================================
   MOBILE MENU
   =================================================== */
let menuOpen = false;

function setMenuState(open) {
  menuOpen = open;
  const menu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('menuBtn');
  const menuIcon  = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  if (!menu) return;
  menu.classList.toggle('open', menuOpen);
  if (menuBtn) menuBtn.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  if (menuIcon)  menuIcon.style.display  = menuOpen ? 'none'  : 'block';
  if (closeIcon) closeIcon.style.display = menuOpen ? 'block' : 'none';
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

function toggleMenu() {
  setMenuState(!menuOpen);
}

function closeMenu() {
  setMenuState(false);
}

function mobileNavClick(e) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute('href');
  closeMenu();
  setTimeout(() => scrollToAnchor(href), 50);
}

/* ===================================================
   SMOOTH SCROLL
   =================================================== */
function navClick(e) {
  const href = e.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    e.preventDefault();
    scrollToAnchor(href);
  }
}

function scrollToAnchor(href) {
  const el = document.querySelector(href);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===================================================
   HERO PARALLAX
   =================================================== */
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * -0.35;
    heroBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

/* ===================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   =================================================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
      // Trigger stat counters when stats section enters view
      if (entry.target.classList.contains('stats-grid')) {
        startCounters();
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.aos').forEach(el => observer.observe(el));

/* ===================================================
   ANIMATED COUNTERS
   =================================================== */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const display = el.dataset.display || null;
    const steps = 50;
    const duration = 1400;
    const delay = parseInt(el.closest('.stat-item').style.getPropertyValue('--d')) || 0;
    let step = 0;

    setTimeout(() => {
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = display ? display : value.toLocaleString() + suffix;
        if (step >= steps) {
          clearInterval(timer);
          el.textContent = display ? display : target.toLocaleString() + suffix;
        }
      }, duration / steps);
    }, delay);
  });
}

/* ===================================================
   FLEET — Vehicle Selection
   =================================================== */
function selectVehicle(btn, vehicleName) {
  // Deselect all
  document.querySelectorAll('.fleet-card').forEach(card => {
    card.classList.remove('selected');
    const b = card.querySelector('.fleet-btn');
    if (b) b.textContent = 'Select & Book';
  });

  // Select clicked
  const card = btn.closest('.fleet-card');
  card.classList.add('selected');
  btn.textContent = 'Selected — Continue Booking';

  setVehicleType(vehicleName);

  // Scroll to booking
  setTimeout(() => scrollToAnchor('#booking'), 300);
}

/* ===================================================
   BOOKING FORM
   =================================================== */
let currentStep = 0;
let selectedService = '';
const formData = {};

function setVehicleType(vehicleName) {
  const vehicleInput = document.getElementById('vehicleType');
  const vehicleLabel = document.querySelector('[data-vehicle-label]');
  const options = document.querySelectorAll('.vehicle-option');

  if (vehicleInput) vehicleInput.value = vehicleName || '';
  if (vehicleLabel) vehicleLabel.textContent = vehicleName || 'No preference';
  options.forEach(option => {
    option.setAttribute('aria-selected', option.dataset.value === (vehicleName || '') ? 'true' : 'false');
  });
}

function getVehicleType() {
  return document.getElementById('vehicleType')?.value || '';
}

document.addEventListener('click', (e) => {
  const dropdown = e.target.closest('[data-vehicle-dropdown]');
  document.querySelectorAll('[data-vehicle-dropdown].open').forEach(openDropdown => {
    if (openDropdown !== dropdown) {
      openDropdown.classList.remove('open');
      openDropdown.querySelector('.vehicle-trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
});

document.querySelectorAll('[data-vehicle-dropdown]').forEach(dropdown => {
  const trigger = dropdown.querySelector('.vehicle-trigger');
  const options = dropdown.querySelectorAll('.vehicle-option');

  trigger?.addEventListener('click', () => {
    const open = !dropdown.classList.contains('open');
    dropdown.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      setVehicleType(option.dataset.value || '');
      dropdown.classList.remove('open');
      trigger?.setAttribute('aria-expanded', 'false');
    });
  });
});

function selectServiceType(btn) {
  document.querySelectorAll('.stype-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedService = btn.dataset.service;
  // Hide/show dropoff field depending on hourly
  updateDropoffVisibility();
  const err = document.getElementById('step0Error');
  if (err) err.style.display = 'none';
}

function updateDropoffVisibility() {
  const field = document.getElementById('dropoffField');
  const label = field ? field.querySelector('label') : null;
  if (!field) return;
  if (selectedService === 'Hourly Service') {
    field.style.opacity = '0.5';
    if (label) label.textContent = 'Drop-off Location (optional)';
  } else {
    field.style.opacity = '1';
    if (label) label.textContent = 'Drop-off Location *';
  }
}

function showStep(n) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  const step = document.getElementById('step' + n);
  if (step) step.classList.add('active');

  // Update step dots
  document.querySelectorAll('.step-dot').forEach(dot => {
    const i = parseInt(dot.dataset.dot);
    dot.classList.remove('active', 'done');
    if (i < n) dot.classList.add('done');
    else if (i === n) dot.classList.add('active');
  });

  currentStep = n;
}

function nextStep(from) {
  if (from === 0) {
    if (!selectedService) {
      const err = document.getElementById('step0Error');
      if (err) err.style.display = 'flex';
      return;
    }
    showStep(1);
    return;
  }

  if (from === 1) {
    if (!validateStep1()) return;
    // Populate form data
    formData.service  = selectedService;
    formData.name     = document.getElementById('fullName').value.trim();
    formData.phone    = document.getElementById('phone').value.trim();
    formData.pickup   = document.getElementById('pickup').value.trim();
    formData.dropoff  = document.getElementById('dropoff').value.trim();
    formData.date     = document.getElementById('tripDate').value;
    formData.time     = document.getElementById('tripTime').value;
    formData.vehicle  = getVehicleType();
    formData.notes    = document.getElementById('notes').value.trim();

    renderReview();
    showStep(2);
  }
}

function prevStep(from) {
  showStep(from - 1);
}

function validateStep1() {
  let valid = true;

  const fields = [
    { id: 'fullName',  errId: 'fullNameError',  label: 'Full name' },
    { id: 'phone',     errId: 'phoneError',     label: 'Phone number' },
    { id: 'pickup',    errId: 'pickupError',    label: 'Pickup location' },
    { id: 'tripDate',  errId: 'tripDateError',  label: 'Date' },
    { id: 'tripTime',  errId: 'tripTimeError',  label: 'Time' },
  ];

  fields.forEach(f => {
    const el  = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el || !err) return;
    if (!el.value.trim()) {
      err.textContent = f.label + ' is required.';
      el.style.borderColor = '#ef4444';
      valid = false;
    } else {
      err.textContent = '';
      el.style.borderColor = '';
    }
  });

  // Dropoff required unless hourly
  if (selectedService !== 'Hourly Service') {
    const el  = document.getElementById('dropoff');
    const err = document.getElementById('dropoffError');
    if (el && err) {
      if (!el.value.trim()) {
        err.textContent = 'Drop-off location is required.';
        el.style.borderColor = '#ef4444';
        valid = false;
      } else {
        err.textContent = '';
        el.style.borderColor = '';
      }
    }
  }

  return valid;
}

// Clear field error on input
['fullName','phone','pickup','dropoff','tripDate','tripTime'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      const err = document.getElementById(id + 'Error') ||
                  document.getElementById(id.charAt(0).toUpperCase() + id.slice(1) + 'Error');
      if (err) err.textContent = '';
    });
  }
});

function renderReview() {
  const container = document.getElementById('bookingReview');
  if (!container) return;

  const rows = [
    ['Service',    formData.service],
    ['Name',       formData.name],
    ['Phone',      formData.phone],
    ['Pickup',     formData.pickup],
    ['Drop-off',   formData.dropoff || '—'],
    ['Date',       formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'long', day:'numeric' }) : '—'],
    ['Time',       formData.time ? formatTime(formData.time) : '—'],
    ['Vehicle',    formData.vehicle || 'No preference'],
    ['Notes',      formData.notes || '—'],
  ];

  container.innerHTML = rows.map(([label, value]) =>
    `<div class="review-row"><span class="review-label">${label}</span><span class="review-value">${value}</span></div>`
  ).join('');
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2,'0')} ${ampm}`;
}

function buildWhatsAppMessage(d) {
  const lines = [
    '🚗 *NOVARIA LIMO BOOKING REQUEST*',
    '',
    `*Service:* ${d.service}`,
    `*Name:* ${d.name}`,
    `*Phone:* ${d.phone}`,
    `*Pickup:* ${d.pickup}`,
    d.dropoff ? `*Drop-off:* ${d.dropoff}` : '',
    `*Date:* ${d.date}`,
    `*Time:* ${d.time}`,
    d.vehicle ? `*Vehicle:* ${d.vehicle}` : '',
    d.notes ? `*Notes:* ${d.notes}` : '',
    '',
    '📋 *Status:* PENDING CONFIRMATION',
  ];
  return lines.filter(Boolean).join('\n');
}

function submitBooking() {
  const msg = buildWhatsAppMessage(formData);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  // Notify PHP (fire-and-forget — works only if running on a PHP server)
  const fd = new FormData();
  Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
  fetch('booking.php', { method: 'POST', body: fd }).catch(() => {});

  // Show success
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById('stepIndicator').style.display = 'none';
  const success = document.getElementById('formSuccess');
  success.style.display = 'flex';

  const nameSpan = document.getElementById('successName');
  if (nameSpan) nameSpan.textContent = formData.name;

  const summary = document.getElementById('successSummary');
  if (summary) {
    summary.innerHTML = `
      <div class="review-row"><span class="review-label">Service</span><span class="review-value">${formData.service}</span></div>
      <div class="review-row"><span class="review-label">Date &amp; Time</span><span class="review-value">${formData.date} at ${formatTime(formData.time)}</span></div>
      <div class="review-row"><span class="review-label">Pickup</span><span class="review-value">${formData.pickup}</span></div>
      <div class="review-row"><span class="review-label">Status</span><span class="review-value" style="color:#22c55e;font-weight:600">PENDING</span></div>
    `;
  }
}

function resetForm() {
  // Reset all state
  selectedService = '';
  currentStep = 0;
  Object.keys(formData).forEach(k => delete formData[k]);

  document.querySelectorAll('.stype-btn').forEach(b => b.classList.remove('selected'));
  ['fullName','phone','pickup','dropoff','tripDate','tripTime','notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  setVehicleType('');

  document.getElementById('formSuccess').style.display = 'none';
  document.getElementById('stepIndicator').style.display = 'flex';
  showStep(0);
}

// Set today as min date
(function() {
  const dateInput = document.getElementById('tripDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
})();

/* ===================================================
   FOOTER YEAR
   =================================================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===================================================
   PARALLAX BLOBS (subtle scroll effect)
   =================================================== */
const blobs = document.querySelectorAll('.parallax-blob');
if (blobs.length) {
  const factors = [0.18, 0.25, 0.20, 0.15, 0.10, 0.22, 0.18, 0.20, 0.15];
  window.addEventListener('scroll', () => {
    blobs.forEach((blob, i) => {
      const rect = blob.parentElement.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = centerY * (factors[i] || 0.20);
      blob.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}
