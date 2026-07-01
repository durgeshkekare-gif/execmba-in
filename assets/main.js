/* execmba.in — shared JS */

// ── NAV HAMBURGER ──
document.addEventListener('DOMContentLoaded', function () {
  const ham = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (ham && links) {
    ham.addEventListener('click', function () {
      const open = links.classList.toggle('nav-open');
      ham.setAttribute('aria-expanded', open);
      if (open) {
        Object.assign(links.style, {
          display: 'flex', flexDirection: 'column',
          position: 'absolute', top: '64px', left: '0', right: '0',
          background: '#0D1B2A', padding: '1rem 5%', gap: '1rem', zIndex: '199',
          borderBottom: '1px solid rgba(201,168,76,0.15)'
        });
      } else {
        links.style.display = 'none';
      }
    });
  }

  // Mark active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('/index.html', '').replace('.html', ''))) {
      a.classList.add('active');
    }
  });
});

// ── FAQ ACCORDION ──
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// ── LEAD FORM SUBMIT ──
function submitLead(e, formId, successId) {
  e.preventDefault();
  console.log('[Lead] submitLead called formId=' + formId + ' successId=' + successId);

  var wrapper = document.getElementById(formId);
  var btn = wrapper ? wrapper.querySelector('button[type="submit"]') : null;

  console.log('[Lead] wrapper found:', wrapper ? 'YES id=' + wrapper.id : 'NO - NULL');

  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

  // Collect fields
  var d = {};
  if (wrapper) {
    wrapper.querySelectorAll('input[name], select[name]').forEach(function(el) {
      d[el.name] = el.value;
      console.log('[Lead] field:', el.name, '=', el.value);
    });
  }

  // Source tracking
  var params = new URLSearchParams(window.location.search);
  d.sourceDomain  = window.location.hostname;
  d.sourcePage    = window.location.pathname;
  d.utmSource     = params.get('utm_source')   || '';
  d.utmMedium     = params.get('utm_medium')   || '';
  d.utmCampaign   = params.get('utm_campaign') || '';

  console.log('[Lead] Posting data:', JSON.stringify(d));

  fetch('/api/lead', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(d)
  })
  .then(function(r) {
    console.log('[Lead] HTTP status:', r.status);
    return r.text().then(function(txt) {
      console.log('[Lead] Response body:', txt);
      if (!r.ok) throw new Error('HTTP ' + r.status + ': ' + txt);
      return txt;
    });
  })
  .then(function() {
    console.log('[Lead] Success - showing confirmation');
    if (wrapper) wrapper.style.display = 'none';
    var s = document.getElementById(successId);
    console.log('[Lead] success div:', s ? 'FOUND id=' + s.id : 'NOT FOUND');
    if (s) s.style.display = 'block';
    if (btn) { btn.textContent = 'Done'; btn.disabled = false; }
  })
  .catch(function(err) {
    console.error('[Lead] ERROR:', err.message);
    if (btn) { btn.textContent = 'Submit'; btn.disabled = false; }
    alert('Error: ' + err.message);
  });
}

)
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
