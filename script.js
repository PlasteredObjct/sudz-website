document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

document.querySelectorAll('.btn-pending-fsm').forEach(btn => {
  btn.addEventListener('click', (e) => e.preventDefault());
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
quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = "This is a rough-draft form — not yet connected to a real quote/booking system. Your info was not sent anywhere.";
});

// Cascading vehicle Make -> Model select, modeled on CARFAX's car search filter
const vehicleData = {
  "Honda": ["Accord", "Civic", "CR-V", "HR-V", "Pilot", "Odyssey", "Ridgeline", "Fit"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "4Runner", "Sienna"],
  "Ford": ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Fusion", "Bronco", "Ranger"],
  "Chevrolet": ["Silverado", "Equinox", "Malibu", "Tahoe", "Traverse", "Camaro", "Suburban", "Colorado"],
  "Nissan": ["Altima", "Rogue", "Sentra", "Murano", "Pathfinder", "Maxima", "Frontier", "Kicks"],
  "Jeep": ["Grand Cherokee", "Wrangler", "Cherokee", "Compass", "Renegade", "Gladiator"],
  "Ram": ["1500", "2500", "3500", "ProMaster"],
  "GMC": ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon"],
  "Dodge": ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Kona", "Accent"],
  "Kia": ["Optima", "Forte", "Sportage", "Sorento", "Telluride", "Soul", "Rio"],
  "Subaru": ["Outback", "Forester", "Impreza", "Crosstrek", "Legacy", "Ascent"],
  "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "MX-5 Miata"],
  "BMW": ["3 Series", "5 Series", "X1", "X3", "X5", "7 Series"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  "Audi": ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
  "Volkswagen": ["Golf", "Jetta", "Passat", "Tiguan", "Atlas", "Beetle"],
  "Lexus": ["ES", "IS", "RX", "NX", "GX"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "Chrysler": ["300", "Pacifica", "Voyager"],
  "Buick": ["Encore", "Envision", "Enclave", "LaCrosse"],
  "Cadillac": ["XT4", "XT5", "CT5", "Escalade"],
  "Lincoln": ["Corsair", "Nautilus", "Aviator", "Navigator"],
  "Mitsubishi": ["Mirage", "Eclipse Cross", "Outlander"],
  "Acura": ["ILX", "TLX", "RDX", "MDX"],
  "Infiniti": ["Q50", "QX60", "QX80"],
  "Volvo": ["S60", "XC60", "XC90"],
  "Porsche": ["911", "Macan", "Cayenne", "Panamera"],
  "Land Rover": ["Range Rover", "Discovery", "Defender"]
};

const makeSelect = document.getElementById('vehicleMake');
const modelSelect = document.getElementById('vehicleModel');
const vehicleOtherRow = document.getElementById('vehicleOtherRow');

const makeOptions = ['<option value="">Select Make</option>']
  .concat(Object.keys(vehicleData).sort().map(make => `<option>${make}</option>`))
  .concat(['<option value="Other">Other (not listed)</option>']);
makeSelect.innerHTML = makeOptions.join('');

makeSelect.addEventListener('change', () => {
  const make = makeSelect.value;

  if (make === 'Other') {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="">N/A</option>';
    vehicleOtherRow.hidden = false;
    return;
  }

  if (make && vehicleData[make]) {
    modelSelect.disabled = false;
    modelSelect.innerHTML = ['<option value="">Select Model</option>']
      .concat(vehicleData[make].map(model => `<option>${model}</option>`))
      .concat(['<option value="Other">Other (not listed)</option>'])
      .join('');
    vehicleOtherRow.hidden = true;
    return;
  }

  modelSelect.disabled = true;
  modelSelect.innerHTML = '<option value="">Select Make First</option>';
  vehicleOtherRow.hidden = true;
});

modelSelect.addEventListener('change', () => {
  if (modelSelect.value === 'Other') {
    vehicleOtherRow.hidden = false;
  } else if (makeSelect.value !== 'Other') {
    vehicleOtherRow.hidden = true;
  }
});
