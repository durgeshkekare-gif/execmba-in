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
  var form = document.getElementById(formId);
  var btn  = form.querySelector('button[type="submit"]');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

  // Collect all named fields
  var d = {};
  form.querySelectorAll('input[name], select[name]').forEach(function(el) {
    d[el.name] = el.value;
  });

  // Auto-attach source + UTM data
  var params = new URLSearchParams(window.location.search);
  d.sourceDomain  = window.location.hostname;
  d.sourcePage    = window.location.pathname;
  d.utmSource     = params.get('utm_source')   || '';
  d.utmMedium     = params.get('utm_medium')   || '';
  d.utmCampaign   = params.get('utm_campaign') || '';

  fetch('https://script.google.com/a/macros/jaro.in/s/AKfycbwkP_F6VWsRwjEawqDTcaqSD7p9Yyb6MkGpW39R9zr-ZbSAte47aJL3XMnXEgVmG6V80g/exec', {
    method : 'POST',
    mode   : 'no-cors',          // Apps Script needs no-cors
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(d)
  })
  .then(function() {
    if (form)                              form.style.display = 'none';
    var s = document.getElementById(successId);
    if (s)                                 s.style.display = 'block';
  })
  .catch(function() {
    // Show success anyway — Apps Script with no-cors always resolves opaquely
    if (form)                              form.style.display = 'none';
    var s = document.getElementById(successId);
    if (s)                                 s.style.display = 'block';
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
