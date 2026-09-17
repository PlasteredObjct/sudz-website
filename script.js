document.getElementById('year').textContent = new Date().getFullYear();

// Scroll-reveal animations — fade/slide elements in as they enter the viewport.
// Track scroll speed so fast scrolling shortens the reveal transition (and
// drops the staggered delay) enough to actually finish before the element
// scrolls past — normal/slow scrolling keeps the default timing untouched.
// Sampled every animation frame (not from a 'scroll' listener) because
// IntersectionObserver callbacks aren't guaranteed to fire after a same-tick
// scroll event has updated the speed — rAF sampling stays accurate regardless
// of that ordering.
let lastScrollY = window.scrollY;
let lastFrameTime = performance.now();
let currentScrollSpeed = 0; // px/ms

function sampleScrollSpeed(now) {
  const dt = now - lastFrameTime;
  if (dt > 0) currentScrollSpeed = Math.abs(window.scrollY - lastScrollY) / dt;
  lastScrollY = window.scrollY;
  lastFrameTime = now;
  requestAnimationFrame(sampleScrollSpeed);
}
requestAnimationFrame(sampleScrollSpeed);

const REVEAL_DEFAULT_DURATION = 700; // ms, matches the .reveal CSS transition
const REVEAL_MIN_DURATION = 180;     // ms floor when scrolling very fast
const REVEAL_NORMAL_SPEED = 0.3;     // px/ms — typical scroll; default speed at/below this
const REVEAL_FAST_SPEED = 2.5;       // px/ms — speed at which duration bottoms out

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (currentScrollSpeed > REVEAL_NORMAL_SPEED) {
          const t = Math.min(1, (currentScrollSpeed - REVEAL_NORMAL_SPEED) / (REVEAL_FAST_SPEED - REVEAL_NORMAL_SPEED));
          const duration = REVEAL_DEFAULT_DURATION - t * (REVEAL_DEFAULT_DURATION - REVEAL_MIN_DURATION);
          el.style.transitionDuration = `${Math.round(duration)}ms`;
          el.style.transitionDelay = '0ms';
        }
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Package detail modal — description text is a placeholder template until
// Silas provides the real per-package write-up (see TODO.md).
const packageDetails = {
  express: {
    name: 'Express Wash',
    price: '$89 starting',
    includes: ['Exterior wash', 'Tires & wheels cleaned', 'Quick wipe-down', 'Quick interior vacuum'],
    description: '[Placeholder] Full description of Express Wash goes here — what it covers, roughly how long it takes on site, and how pricing adjusts by vehicle size. Replace this text once the real write-up is ready.'
  },
  refresh: {
    name: 'Refresh Package',
    price: '$139 starting',
    includes: ['Everything in Express Wash', 'Steam-cleaned interior', 'Interior surfaces scrubbed', 'Full vacuum'],
    description: '[Placeholder] Full description of the Refresh Package goes here — what it covers, roughly how long it takes on site, and how pricing adjusts by vehicle size. Replace this text once the real write-up is ready.'
  },
  restore: {
    name: 'Restore Package',
    price: '$219 starting',
    includes: ['Everything in Refresh Package', 'Carpet shampooing', 'Iron decontamination', 'Wax/sealant exterior'],
    description: '[Placeholder] Full description of the Restore Package goes here — what it covers, roughly how long it takes on site, and how pricing adjusts by vehicle size. Replace this text once the real write-up is ready.'
  }
};

const packageModalOverlay = document.getElementById('packageModalOverlay');
const packageModalClose = document.getElementById('packageModalClose');
const packageModalTitle = document.getElementById('packageModalTitle');
const packageModalPrice = document.getElementById('packageModalPrice');
const packageModalIncludes = document.getElementById('packageModalIncludes');
const packageModalDescription = document.getElementById('packageModalDescription');

function openPackageModal(key) {
  const data = packageDetails[key];
  if (!data) return;
  packageModalTitle.textContent = data.name;
  packageModalPrice.textContent = data.price;
  packageModalIncludes.innerHTML = data.includes.map(item => `<li>${item}</li>`).join('');
  packageModalDescription.textContent = data.description;
  packageModalOverlay.hidden = false;
  document.body.classList.add('modal-open');
}

function closePackageModal() {
  packageModalOverlay.hidden = true;
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.price-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    openPackageModal(card.dataset.detail);
  });
});
document.querySelectorAll('[data-detail-trigger]').forEach(btn => {
  btn.addEventListener('click', () => openPackageModal(btn.dataset.detailTrigger));
});
packageModalClose.addEventListener('click', closePackageModal);
packageModalOverlay.addEventListener('click', (e) => {
  if (e.target === packageModalOverlay) closePackageModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !packageModalOverlay.hidden) closePackageModal();
});

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function closeCustomMonthDropdown() {
  const existing = document.querySelector('.custom-month-dropdown');
  if (existing) existing.remove();
}

function openCustomMonthDropdown(fp) {
  closeCustomMonthDropdown();

  const curMonthEl = fp.calendarContainer.querySelector('.flatpickr-current-month .cur-month');
  const rect = curMonthEl.getBoundingClientRect();

  const minDate = fp.config.minDate;
  const maxDate = fp.config.maxDate;
  const year = fp.currentYear;

  let startMonth = 0;
  let endMonth = 11;
  if (minDate && minDate.getFullYear() === year) startMonth = minDate.getMonth();
  if (maxDate && maxDate.getFullYear() === year) endMonth = maxDate.getMonth();

  const dropdown = document.createElement('div');
  dropdown.className = 'custom-month-dropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.top = (rect.bottom + 6) + 'px';
  dropdown.style.left = rect.left + 'px';

  // Dropdown lives outside fp.calendarContainer (to escape its overflow:hidden),
  // so stop mousedown here or flatpickr's own outside-click detection closes the whole calendar.
  dropdown.addEventListener('mousedown', (e) => e.stopPropagation());

  for (let m = startMonth; m <= endMonth; m++) {
    const option = document.createElement('div');
    option.className = 'custom-month-option' + (m === fp.currentMonth ? ' selected' : '');
    option.textContent = MONTH_NAMES[m];
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      fp.changeMonth(m, false);
      closeCustomMonthDropdown();
    });
    dropdown.appendChild(option);
  }

  document.body.appendChild(dropdown);
}

flatpickr('#date', {
  dateFormat: 'F j, Y',
  minDate: 'today',
  disableMobile: true,
  monthSelectorType: 'static',
  onReady: (selectedDates, dateStr, fp) => {
    const curMonth = fp.calendarContainer.querySelector('.flatpickr-current-month .cur-month');
    curMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.querySelector('.custom-month-dropdown')) {
        closeCustomMonthDropdown();
      } else {
        openCustomMonthDropdown(fp);
      }
    });
    document.addEventListener('click', () => closeCustomMonthDropdown());
  },
  onMonthChange: () => closeCustomMonthDropdown(),
  onClose: () => closeCustomMonthDropdown()
});

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

const quoteForm = document.getElementById('quoteForm');
const formNote = document.getElementById('formNote');
const quoteSubmitBtn = quoteForm.querySelector('button[type="submit"]');

const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => {
  const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  if (digits.length > 6) {
    phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 3) {
    phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else if (digits.length > 0) {
    phoneInput.value = `(${digits}`;
  } else {
    phoneInput.value = '';
  }
});

quoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = Object.fromEntries(new FormData(quoteForm));

  quoteSubmitBtn.disabled = true;
  formNote.classList.remove('form-note-error');
  formNote.textContent = 'Sending...';

  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Request failed');
    }

    formNote.textContent = "Thanks! We got your request and will text or call you back shortly.";
    quoteForm.reset();
  } catch (err) {
    formNote.classList.add('form-note-error');
    formNote.textContent = "Something went wrong sending that. Please call or text us at 434-489-1525 instead.";
  } finally {
    quoteSubmitBtn.disabled = false;
  }
});

