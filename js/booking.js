/* Regal Guesthouse — calendar de rezervare & sumar */
(function () {
  'use strict';
  var CFG = window.REGAL_CONFIG || {};
  var form = document.getElementById('booking-form');
  if (!form) return;

  var MONTHS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  var DOW = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
  var ROOMS = {
    dubla: { name: 'Cameră Dublă', price: CFG.pricePerNight || 30 },
    twin: { name: 'Cameră Twin', price: CFG.pricePerNight || 30 },
    tripla: { name: 'Cameră Triplă', price: null }
  };

  var monthsBox = document.getElementById('cal-months');
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  var inInput = form.querySelector('[name=checkin]');
  var outInput = form.querySelector('[name=checkout]');

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var start = null, end = null;

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function fmt(d) {
    return d ? d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear() : '—';
  }
  function nights() {
    return start && end ? Math.round((end - start) / 86400000) : 0;
  }

  function renderMonth(base) {
    var wrap = document.createElement('div');
    wrap.className = 'cal-month';
    var h = document.createElement('h4');
    h.textContent = MONTHS[base.getMonth()] + ' ' + base.getFullYear();
    wrap.appendChild(h);
    var grid = document.createElement('div');
    grid.className = 'cal-grid';
    DOW.forEach(function (d) {
      var s = document.createElement('span'); s.className = 'dow'; s.textContent = d; grid.appendChild(s);
    });
    var offset = (base.getDay() + 6) % 7;
    for (var i = 0; i < offset; i++) grid.appendChild(document.createElement('span'));
    var days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    for (var d = 1; d <= days; d++) {
      var date = new Date(base.getFullYear(), base.getMonth(), d);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal-day';
      b.textContent = d;
      b.dataset.date = iso(date);
      b.setAttribute('aria-label', fmt(date));
      if (date < today) b.disabled = true;
      if (+date === +today) b.classList.add('today');
      if (start && +date === +start) b.classList.add('start');
      if (end && +date === +end) b.classList.add('end');
      if (start && end && date > start && date < end) b.classList.add('in-range');
      if ((start && +date === +start) || (end && +date === +end)) b.setAttribute('aria-pressed', 'true');
      grid.appendChild(b);
    }
    wrap.appendChild(grid);
    return wrap;
  }

  function render() {
    monthsBox.innerHTML = '';
    monthsBox.appendChild(renderMonth(view));
    monthsBox.appendChild(renderMonth(new Date(view.getFullYear(), view.getMonth() + 1, 1)));
    prevBtn.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    inInput.value = start ? iso(start) : '';
    outInput.value = end ? iso(end) : '';
    updateSummary();
  }

  monthsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.cal-day');
    if (!b || b.disabled) return;
    var date = parse(b.dataset.date);
    if (!start || (start && end) || date <= start) {
      start = date; end = null;
    } else {
      end = date;
    }
    render();
  });
  prevBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
  nextBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });

  /* ---------- Sumar ---------- */
  var sum = {
    room: document.getElementById('sum-room'),
    in: document.getElementById('sum-in'),
    out: document.getElementById('sum-out'),
    nights: document.getElementById('sum-nights'),
    guests: document.getElementById('sum-guests'),
    total: document.getElementById('sum-total')
  };
  function updateSummary() {
    var roomKey = (form.querySelector('[name=camera]:checked') || {}).value || 'dubla';
    var room = ROOMS[roomKey];
    var n = nights();
    var guests = form.querySelector('[name=oaspeti]').value;
    sum.room.textContent = room.name;
    sum.in.textContent = fmt(start);
    sum.out.textContent = fmt(end);
    sum.nights.textContent = n ? n + (n === 1 ? ' noapte' : ' nopți') : '—';
    sum.guests.textContent = guests;
    if (!room.price) sum.total.textContent = 'La cerere';
    else sum.total.textContent = n ? '~' + (room.price * n) + '€' : 'de la ' + room.price + '€';
  }
  form.addEventListener('change', updateSummary);

  /* ---------- Preluare parametri din URL (motorul rapid de pe prima pagină) ---------- */
  var params = new URLSearchParams(location.search);
  var pIn = parse(params.get('checkin'));
  var pOut = parse(params.get('checkout'));
  if (pIn && pIn >= today) { start = pIn; view = new Date(pIn.getFullYear(), pIn.getMonth(), 1); }
  if (start && pOut && pOut > start) end = pOut;
  var g = params.get('guests');
  if (g) {
    var sel = form.querySelector('[name=oaspeti]');
    var opt = sel.querySelector('option[value="' + CSS.escape(g) + '"]');
    if (opt) sel.value = g;
    if (+g >= 3) {
      var tr = form.querySelector('[name=camera][value=tripla]');
      if (tr) tr.checked = true;
    }
  }
  var r = params.get('room');
  if (r && ROOMS[r]) form.querySelector('[name=camera][value="' + r + '"]').checked = true;
  render();

  if (window.REGAL_track) window.REGAL_track('begin_checkout', { value: CFG.pricePerNight || 30, currency: 'EUR' });

  /* ---------- Trimitere ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = form.querySelector('.form-status');
    if (!start || !end) {
      status.textContent = 'Vă rugăm selectați în calendar data sosirii și a plecării.';
      status.classList.add('error');
      document.getElementById('cal').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var roomKey = form.querySelector('[name=camera]:checked').value;
    window.REGAL_submitLead(form, {
      tip: 'Cerere rezervare',
      nopti: nights(),
      totalEstimat: sum.total.textContent,
      camera: ROOMS[roomKey].name
    }, function () {
      start = end = null;
      render();
    });
  });
})();
