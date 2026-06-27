// ── State ──
const state = { step: 1, selectedDate: null, selectedTime: null };

// ── Calendar setup ──
const calendarEl = document.getElementById('calendarWidget');
const today = new Date();
today.setHours(0, 0, 0, 0);

let calYear  = today.getFullYear();
let calMonth = today.getMonth();

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// Simulate some already-booked time slots
const BOOKED_TIMES = ['10:00 AM', '3:00 PM'];

const ALL_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM',  '2:00 PM',  '3:00 PM', '4:00 PM', '5:00 PM'
];

// ── Calendar render ──
function renderCalendar() {
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay    = new Date(calYear, calMonth, 1).getDay();

  let html = `
    <div class="cal-header">
      <button class="cal-nav" id="calPrev">&#8249;</button>
      <span class="cal-month-label">${MONTH_NAMES[calMonth]} ${calYear}</span>
      <button class="cal-nav" id="calNext">&#8250;</button>
    </div>
    <div class="cal-grid">
      ${DAY_NAMES.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
      ${'<div class="cal-cell cal-empty"></div>'.repeat(firstDay)}
  `;

  for (let day = 1; day <= daysInMonth; day++) {
    const date   = new Date(calYear, calMonth, day);
    const isPast = date < today;
    const isToday    = date.getTime() === today.getTime();
    const isSelected = state.selectedDate && date.getTime() === state.selectedDate.getTime();

    let cls = 'cal-cell';
    if (isPast)       cls += ' cal-past';
    if (isToday)      cls += ' cal-today';
    if (isSelected)   cls += ' cal-selected';

    const ts = isPast ? '' : `data-ts="${date.getTime()}"`;
    html += `<div class="${cls}" ${ts}>${day}</div>`;
  }

  html += '</div>';
  calendarEl.innerHTML = html;

  // Previous month
  document.getElementById('calPrev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    // Clamp: don't go before current month
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const viewDate = new Date(calYear, calMonth, 1);
    if (viewDate < minDate) { calYear = today.getFullYear(); calMonth = today.getMonth(); }
    renderCalendar();
  });

  // Next month
  document.getElementById('calNext').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    // Clamp: max 3 months ahead
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    const viewDate = new Date(calYear, calMonth, 1);
    if (viewDate > maxDate) { calYear = maxDate.getFullYear(); calMonth = maxDate.getMonth(); }
    renderCalendar();
  });

  // Day click
  calendarEl.querySelectorAll('.cal-cell:not(.cal-past):not(.cal-empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      const ts = cell.dataset.ts;
      if (!ts) return;
      state.selectedDate = new Date(parseInt(ts));
      state.selectedTime = null;
      renderCalendar();
      setTimeout(() => goToStep(2), 120);
    });
  });
}

// ── Time slots render ──
function renderTimeSlots() {
  const slotsEl = document.getElementById('timeSlots');
  slotsEl.innerHTML = ALL_SLOTS.map(time => {
    const isBooked   = BOOKED_TIMES.includes(time);
    const isSelected = state.selectedTime === time;
    let cls = 'slot';
    if (isBooked)   cls += ' slot--booked';
    if (isSelected && !isBooked) cls += ' slot--selected';
    return `<div class="${cls}" data-time="${isBooked ? '' : time}">${time}</div>`;
  }).join('');

  slotsEl.querySelectorAll('.slot:not(.slot--booked)').forEach(slot => {
    slot.addEventListener('click', () => {
      state.selectedTime = slot.dataset.time;
      renderTimeSlots();
      setTimeout(() => goToStep(3), 200);
    });
  });
}

// ── Helpers ──
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}

function updateProgress(step) {
  document.querySelectorAll('.bk-progress__step').forEach(el => {
    const n = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (n === step)      el.classList.add('active');
    else if (n < step)  el.classList.add('done');
  });
}

// ── Step navigation ──
function goToStep(step) {
  state.step = step;
  document.querySelectorAll('.bk-step-panel').forEach(p => p.classList.add('hidden'));

  if (step <= 3) updateProgress(step);

  if (step === 1) {
    document.getElementById('panelDate').classList.remove('hidden');

  } else if (step === 2) {
    document.getElementById('panelTime').classList.remove('hidden');
    document.getElementById('selectedDateDisplay').textContent =
      state.selectedDate ? formatDate(state.selectedDate) : '';
    renderTimeSlots();

  } else if (step === 3) {
    document.getElementById('panelDetails').classList.remove('hidden');
    const dateStr = state.selectedDate ? formatDate(state.selectedDate) : '';
    const timeStr = state.selectedTime  || '';
    document.getElementById('selectedTimeDisplay').textContent =
      dateStr + (timeStr ? ' · ' + timeStr : '');

  } else if (step === 4) {
    document.getElementById('panelConfirm').classList.remove('hidden');
    document.getElementById('bkProgress').style.opacity = '0';
    document.getElementById('bkProgress').style.pointerEvents = 'none';
  }
}

// ── Back buttons ──
document.getElementById('backToDate').addEventListener('click', () => goToStep(1));
document.getElementById('backToTime').addEventListener('click', () => goToStep(2));

// ── Form submit ──
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();

  const firstName = document.getElementById('firstName');
  const lastName  = document.getElementById('lastName');
  const email     = document.getElementById('email');
  const bizType   = document.getElementById('bizType');

  // Clear previous errors
  [firstName, lastName, email, bizType].forEach(el => el.classList.remove('error'));

  let hasError = false;
  if (!firstName.value.trim()) { firstName.classList.add('error'); hasError = true; }
  if (!lastName.value.trim())  { lastName.classList.add('error');  hasError = true; }
  if (!email.value.trim())     { email.classList.add('error');     hasError = true; }
  if (!bizType.value)          { bizType.classList.add('error');   hasError = true; }

  if (hasError) return;

  // Build confirmation summary
  document.getElementById('confirmSummary').innerHTML = `
    <strong>Date:</strong> ${state.selectedDate ? formatDate(state.selectedDate) : '—'}<br>
    <strong>Time:</strong> ${state.selectedTime || '—'}<br>
    <strong>Name:</strong> ${firstName.value.trim()} ${lastName.value.trim()}<br>
    <strong>Email:</strong> ${email.value.trim()}<br>
    <strong>Business:</strong> ${bizType.value}
  `;

  goToStep(4);
});

// ── Init ──
renderCalendar();
