/* ============================================
   Toolverse — Shared Utilities
   All 100 tools include this via <script src="/shared/common.js">
   Vanilla JS, no modules, no dependencies.
   ============================================ */

/* --- Copy to Clipboard --- */
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(function () {
    if (!btn) return;
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = orig; }, 1500);
  }).catch(function () {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = orig; }, 1500);
    }
  });
}

/* --- AdSense Loader --- */
function initAds() {
  if (document.querySelector('script[src*="adsbygoogle"]')) return;
  if (!window.ADSENSE_ID) return;

  var s = document.createElement('script');
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + window.ADSENSE_ID;
  s.async = true;
  s.crossOrigin = 'anonymous';

  s.onerror = function () {
    document.querySelectorAll('.ad-slot').forEach(function (el) {
      el.style.display = 'none';
    });
  };

  s.onload = function () {
    document.querySelectorAll('.ad-slot[data-ad-slot]').forEach(function () {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  };

  document.head.appendChild(s);
}

/* --- Cloudflare Web Analytics --- */
function initAnalytics() {
  if (!window.CF_ANALYTICS_TOKEN) return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token":"' + window.CF_ANALYTICS_TOKEN + '"}');
  document.body.appendChild(s);
}

/* --- Tab Switching --- */
function initTabs() {
  document.querySelectorAll('.tab-group').forEach(function (group) {
    var tabs = group.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var target = tab.dataset.tab;
        if (!target) return;
        var parent = group.parentElement;
        parent.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.classList.toggle('hidden', panel.id !== target);
        });
      });
    });
  });
}

/* --- FAQ Accordion (smooth) --- */
function initFaq() {
  document.querySelectorAll('details.faq-item').forEach(function (details) {
    var content = details.querySelector('p');
    if (!content) return;

    details.querySelector('summary').addEventListener('click', function (e) {
      if (!details.open) return;
      e.preventDefault();
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.25s ease';
      content.addEventListener('transitionend', function handler() {
        details.open = false;
        content.style.maxHeight = '';
        content.style.overflow = '';
        content.style.transition = '';
        content.removeEventListener('transitionend', handler);
      });
    });
  });
}

/* --- Toast Notification --- */
function showToast(message, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.style.cssText = 'padding:0.75rem 1.25rem;border-radius:8px;color:#fff;font-size:0.875rem;opacity:0;transition:opacity 0.3s;'
    + (type === 'error' ? 'background:#ef4444' : type === 'success' ? 'background:#10b981' : 'background:#3b82f6');
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  container.appendChild(toast);
  requestAnimationFrame(function () { toast.style.opacity = '1'; });
  setTimeout(function () {
    toast.style.opacity = '0';
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}

/* --- Number Formatting --- */
function formatNumber(n, decimals) {
  decimals = decimals === undefined ? 2 : decimals;
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

function formatCurrency(n, currency) {
  currency = currency || 'USD';
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: currency });
}

/* --- Init on DOM Ready --- */
document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initFaq();
  setTimeout(initAds, 100);
  initAnalytics();
});
