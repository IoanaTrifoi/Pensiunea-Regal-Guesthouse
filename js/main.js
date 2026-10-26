/* Regal Guesthouse — interacțiuni comune */
(function () {
  'use strict';
  var CFG = window.REGAL_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + meniu mobil ---------- */
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav-links');
  function onScroll() {
    if (header && !header.classList.contains('solid')) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Parallax hero ---------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        heroBg.style.transform = 'translate3d(0,' + (y * 0.35) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Reveal la scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Date implicite pentru motoarele de rezervare ---------- */
  function iso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  var quick = document.getElementById('quick-booking');
  if (quick) {
    var ci = quick.querySelector('[name=checkin]');
    var co = quick.querySelector('[name=checkout]');
    var today = new Date();
    var tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    ci.min = iso(today); co.min = iso(tomorrow);
    if (!ci.value) ci.value = iso(today);
    if (!co.value) co.value = iso(tomorrow);
    ci.addEventListener('change', function () {
      var next = new Date(ci.value); next.setDate(next.getDate() + 1);
      co.min = iso(next);
      if (!co.value || co.value <= ci.value) co.value = iso(next);
    });
    quick.addEventListener('submit', function () {
      track('search_availability', { checkin: ci.value, checkout: co.value });
    });
  }

  /* ---------- Carusel facilități ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.carousel-track');
    var step = function () { var s = track.querySelector('.slide'); return s ? s.offsetWidth + 20 : 300; };
    var prev = car.querySelector('[data-prev]');
    var next = car.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() }); });
    if (next) next.addEventListener('click', function () {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) track.scrollTo({ left: 0 }); else track.scrollBy({ left: step() });
    });
  });

  /* ---------- Testimoniale (autoplay) ---------- */
  var tWrap = document.querySelector('[data-testimonials]');
  if (tWrap) {
    var tTrack = tWrap.querySelector('.t-track');
    var slides = tTrack.children;
    var dotsBox = tWrap.querySelector('.t-dots');
    var idx = 0, timer = null;
    for (var i = 0; i < slides.length; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Recenzia ' + (i + 1));
      b.dataset.i = i;
      dotsBox.appendChild(b);
    }
    var dots = dotsBox.children;
    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      tTrack.style.transform = 'translateX(' + (-idx * 100) + '%)';
      for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('active', j === idx);
    };
    var play = function () { if (!reduceMotion) timer = setInterval(function () { go(idx + 1); }, 5500); };
    var stop = function () { clearInterval(timer); };
    dotsBox.addEventListener('click', function (e) {
      if (e.target.dataset.i) { stop(); go(+e.target.dataset.i); play(); }
    });
    tWrap.addEventListener('mouseenter', stop);
    tWrap.addEventListener('mouseleave', play);
    go(0); play();
  }

  /* ---------- Lightbox galerie ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var lb = document.querySelector('.lightbox');
  if (items.length && lb) {
    var stage = lb.querySelector('.lightbox-stage');
    var cur = 0, lastFocus = null;
    var show = function (n) {
      cur = (n + items.length) % items.length;
      var it = items[cur];
      var media = it.querySelector('img, .ph').cloneNode(true);
      media.removeAttribute('loading');
      var cap = it.querySelector('figcaption');
      stage.innerHTML = '';
      stage.appendChild(media);
      var p = document.createElement('p');
      p.className = 'lightbox-cap';
      p.textContent = cap ? cap.textContent : '';
      stage.appendChild(p);
    };
    var open = function (n) {
      lastFocus = document.activeElement;
      show(n);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    };
    var close = function () {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    items.forEach(function (it, n) {
      it.addEventListener('click', function () { open(n); });
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---------- Hartă (încărcare leneșă) ---------- */
  document.querySelectorAll('iframe[data-src]').forEach(function (fr) {
    var load = function () { fr.src = fr.dataset.src; fr.removeAttribute('data-src'); };
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { load(); mo.disconnect(); }
      }, { rootMargin: '300px' });
      mo.observe(fr);
    } else { load(); }
  });

  /* ---------- Formulare -> CRM ---------- */
  function formToObject(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.page = location.pathname;
    data.submittedAt = new Date().toISOString();
    return data;
  }
  function fallbackMessage(data) {
    var lines = ['Bună ziua! Solicitare de pe site — Regal Guesthouse'];
    Object.keys(data).forEach(function (k) {
      if (['page', 'submittedAt', 'consent'].indexOf(k) === -1 && data[k]) lines.push(k + ': ' + data[k]);
    });
    return lines.join('\n');
  }
  window.REGAL_submitLead = function (form, extra, onDone) {
    var status = form.querySelector('.form-status');
    var data = Object.assign(formToObject(form), extra || {});
    var setStatus = function (html, err) {
      if (!status) return;
      status.innerHTML = html;
      status.classList.toggle('error', !!err);
    };
    var success = function () {
      track('generate_lead', { form: form.id || 'form' });
      setStatus('Mulțumim! Am primit solicitarea și revenim în cel mai scurt timp.');
      form.reset();
      if (onDone) onDone();
    };
    if (CFG.crmEndpoint) {
      setStatus('Se trimite…');
      fetch(CFG.crmEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        success();
      }).catch(function () {
        setStatus('Nu am putut trimite formularul. Vă rugăm sunați la <a href="tel:' + CFG.phone + '"><b>+40 756 348 896</b></a>.', true);
      });
    } else {
      var wa = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(fallbackMessage(data));
      track('generate_lead', { form: form.id || 'form', channel: 'whatsapp' });
      setStatus('Mesajul este pregătit. <a href="' + wa + '" target="_blank" rel="noopener"><b>Trimite-l pe WhatsApp →</b></a> sau sună direct la <a href="tel:' + CFG.phone + '"><b>+40 756 348 896</b></a>.');
      window.open(wa, '_blank', 'noopener');
    }
  };
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      window.REGAL_submitLead(form);
    });
  });

  /* ---------- Măsurare & retargetare (cu consimțământ) ---------- */
  var queue = [];
  var trackingReady = false;
  function track(name, params) {
    if (!trackingReady) { queue.push([name, params]); return; }
    if (window.gtag) window.gtag('event', name, params || {});
    if (window.fbq) {
      var map = { view_rooms: 'ViewContent', begin_checkout: 'InitiateCheckout', generate_lead: 'Lead', search_availability: 'Search' };
      if (map[name]) window.fbq('track', map[name], params || {});
      else window.fbq('trackCustom', name, params || {});
    }
    if (name === 'generate_lead' && window.gtag && CFG.googleAdsId && CFG.googleAdsLeadLabel) {
      window.gtag('event', 'conversion', { send_to: CFG.googleAdsId + '/' + CFG.googleAdsLeadLabel });
    }
  }
  window.REGAL_track = track;

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }
  function startTracking() {
    if (CFG.ga4Id || CFG.googleAdsId) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + (CFG.ga4Id || CFG.googleAdsId));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (CFG.ga4Id) window.gtag('config', CFG.ga4Id);
      if (CFG.googleAdsId) window.gtag('config', CFG.googleAdsId);
    }
    if (CFG.metaPixelId) {
      /* Meta Pixel base code */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CFG.metaPixelId);
      window.fbq('track', 'PageView');
    }
    trackingReady = true;
    queue.splice(0).forEach(function (q) { track(q[0], q[1]); });
  }

  var hasTracking = CFG.ga4Id || CFG.googleAdsId || CFG.metaPixelId;
  if (hasTracking) {
    var consent = null;
    try { consent = localStorage.getItem('regal-consent'); } catch (e) { /* storage indisponibil */ }
    if (consent === 'yes') startTracking();
    else if (consent !== 'no') {
      var bar = document.createElement('div');
      bar.className = 'consent';
      bar.innerHTML = '<p>Folosim cookie-uri pentru statistici și reclame relevante. </p>' +
        '<div><button type="button" class="btn btn-outline" data-c="no">Refuz</button> ' +
        '<button type="button" class="btn btn-gold" data-c="yes">Accept</button></div>';
      document.body.appendChild(bar);
      bar.addEventListener('click', function (e) {
        var c = e.target.dataset.c;
        if (!c) return;
        try { localStorage.setItem('regal-consent', c); } catch (err) { /* ignorat */ }
        bar.remove();
        if (c === 'yes') startTracking();
      });
    }
  }

  /* Audiență de retargetare: vizitatori care au văzut camerele */
  var roomsSection = document.getElementById('camere');
  if (roomsSection && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        track('view_rooms', { content_name: 'Camere de la 30€', value: CFG.pricePerNight, currency: 'EUR' });
        ro.disconnect();
      }
    }, { threshold: 0.35 });
    ro.observe(roomsSection);
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
