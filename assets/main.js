/* execmba-in — shared JS */
document.addEventListener('DOMContentLoaded', function () {

  // NAV HAMBURGER
  var ham = document.querySelector('.nav-ham, .nav-hamburger');
  var links = document.querySelector('.nav-links');
  if (ham && links) {
    ham.addEventListener('click', function () {
      var open = links.classList.toggle('nav-open');
      Object.assign(links.style, open ? {
        display: 'flex', flexDirection: 'column', position: 'absolute',
        top: '62px', left: '0', right: '0', background: '#0D1B2A',
        padding: '1rem 4%', gap: '.75rem', zIndex: '298',
        borderBottom: '1px solid rgba(255,255,255,.08)'
      } : { display: 'none' });
    });
  }

  // ACTIVE NAV LINK
  var path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href !== '/' && href !== '' && path.startsWith(href.replace(/\/index\.html$/, ''))) {
      a.classList.add('active');
      a.classList.add('on');
    }
  });

  // NAV SEARCH (enter key)
  var ns = document.getElementById('nav-search');
  if (ns) {
    ns.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        window.location.href = '/universities/?q=' + encodeURIComponent(this.value.trim());
      }
    });
  }

});

// FAQ TOGGLE
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function (i) {
    i.classList.remove('open');
  });
  if (!isOpen) {
    item.classList.add('open');
  }
}

// FILTER TABLE
function filterTable(type, btn, tableId) {
  document.querySelectorAll('.fpill').forEach(function (b) { b.classList.remove('on'); });
  btn.classList.add('on');
  var rows = document.querySelectorAll((tableId || '#main-tbl') + ' tbody tr');
  rows.forEach(function (r) {
    var show = type === 'all' || (r.dataset.type || '').includes(type) || (r.dataset.tag || '').includes(type);
    r.style.display = show ? '' : 'none';
  });
}

// FILTER CARDS
function filterCards(type, btn) {
  document.querySelectorAll('.fpill').forEach(function (b) { b.classList.remove('on'); });
  btn.classList.add('on');
  document.querySelectorAll('[data-card]').forEach(function (c) {
    var show = type === 'all' || (c.dataset.type || '').includes(type) || (c.dataset.tag || '').includes(type);
    c.style.display = show ? '' : 'none';
  });
}

// LIVE SEARCH
function liveSearch(q, scope) {
  var els = document.querySelectorAll(scope || '[data-search]');
  els.forEach(function (el) {
    var t = (el.dataset.search || '').toLowerCase();
    el.style.display = (!q || t.includes(q.toLowerCase())) ? '' : 'none';
  });
}

// LEAD FORM SUBMIT — posts to /api/lead serverless function → Google Sheets
function submitLead(e, formId, successId) {
  e.preventDefault();

  var wrapper = document.getElementById(formId);
  if (!wrapper) {
    console.error('[Lead] Element not found: ' + formId);
    return;
  }
  var btn = wrapper.querySelector('button[type="submit"]');
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
  }

  // Collect all named form fields
  var d = {};
  wrapper.querySelectorAll('input[name], select[name]').forEach(function (el) {
    d[el.name] = el.value;
  });

  // Source and UTM tracking
  var params = new URLSearchParams(window.location.search);
  d.sourceDomain  = window.location.hostname;
  d.sourcePage    = window.location.pathname;
  d.utmSource     = params.get('utm_source')   || '';
  d.utmMedium     = params.get('utm_medium')   || '';
  d.utmCampaign   = params.get('utm_campaign') || '';

  // POST to Vercel serverless function
  fetch('/api/lead', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(d)
  })
  .then(function (r) {
    return r.text().then(function (txt) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ': ' + txt);
      return txt;
    });
  })
  .then(function () {
    wrapper.style.display = 'none';
    var s = document.getElementById(successId);
    if (s) s.style.display = 'block';
    if (btn) { btn.textContent = 'Done'; btn.disabled = false; }
  })
  .catch(function (err) {
    console.error('[Lead] error:', err.message);
    alert('Something went wrong: ' + err.message + '\n\nPlease call us: +91 80800 89898');
    if (btn) { btn.textContent = 'Submit'; btn.disabled = false; }
  });
}


// ── FILTER BUTTONS (programs page) ──
function setFilter(type, val, btn, groupId) {
  document.querySelectorAll('#' + groupId + ' .filter-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  window['filter_' + type] = val;
  applyFilters();
}

var filter_inst = 'all', filter_exp = 'all';

function applyFilters() {
  var cards = document.querySelectorAll('.prog-card[data-inst]');
  var count = 0;
  cards.forEach(function (card) {
    var instMatch = filter_inst === 'all' || card.dataset.inst === filter_inst;
    var expMatch  = filter_exp  === 'all' || parseInt(card.dataset.exp) <= parseInt(filter_exp);
    var show = instMatch && expMatch;
    card.style.display = show ? '' : 'none';
    if (show) count++;
  });
  var el = document.getElementById('prog-count');
  if (el) el.textContent = 'Showing ' + count + ' program' + (count !== 1 ? 's' : '');
}