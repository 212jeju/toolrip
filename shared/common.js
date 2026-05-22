/* ============================================
   Toolrip — Shared Utilities
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
  var adsenseId = window.ADSENSE_ID || 'ca-pub-1801576841825156';

  var s = document.createElement('script');
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adsenseId;
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

/* --- Google Analytics 4 --- */
function initGA4() {
  var id = 'G-C6WYD9X9TZ';
  if (document.querySelector('script[src*="googletagmanager"]')) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id);
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
  document.querySelectorAll('details.faq-item,details.qa-item,details.question-block').forEach(function (details) {
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

/* --- GA4 Custom Event Tracking --- */
function trackEvent(eventName, params) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params || {});
  }
}

function initEventTracking() {
  var toolName = document.querySelector('h1')
    ? document.querySelector('h1').textContent.trim() : document.title;
  var category = (document.querySelector('.breadcrumb a:nth-child(2)') || {}).textContent || 'unknown';

  // Track tool_use_complete on ANY tool-card button click (broader: primary, btn-primary, onclick, or generic buttons)
  document.querySelectorAll('.tool-card button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      trackEvent('tool_use_complete', {
        tool_name: toolName,
        tool_category: category.trim(),
        action: (btn.textContent || btn.getAttribute('aria-label') || 'unlabeled').trim().substring(0, 50)
      });
    });
  });

  // Track first form input as engagement signal (proves the user is actually using the tool)
  var firstInputFired = false;
  document.querySelectorAll('.tool-card input, .tool-card textarea, .tool-card select').forEach(function (el) {
    el.addEventListener('input', function () {
      if (firstInputFired) return;
      firstInputFired = true;
      trackEvent('tool_input_first', { tool_name: toolName, tool_category: category.trim() });
    });
  });

  // Track copy events
  var origCopy = window.copyToClipboard;
  if (typeof origCopy === 'function') {
    window.copyToClipboard = function (text, btn) {
      trackEvent('copy_result', { tool_name: toolName, content_length: text ? text.length : 0 });
      return origCopy(text, btn);
    };
  }

  // Track outbound link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (href && href.indexOf('http') === 0 && href.indexOf('toolrip.com') === -1) {
      trackEvent('outbound_click', { url: href, tool_name: toolName });
    }
  });

  // Track FAQ interactions
  document.querySelectorAll('details.faq-item,details.qa-item,details.question-block summary').forEach(function (summary) {
    summary.addEventListener('click', function () {
      trackEvent('faq_open', { tool_name: toolName, question: summary.textContent.trim().substring(0, 80) });
    });
  });

  // Track time on tool — lower threshold (15s) so we capture more real users; was 30s
  setTimeout(function () {
    trackEvent('engaged_user', { tool_name: toolName, seconds: 15 });
  }, 15000);

  // Track scroll depth (50% and 90%) as content engagement signal
  var scrollFired = { 50: false, 90: false };
  window.addEventListener('scroll', function () {
    var pct = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
    [50, 90].forEach(function (threshold) {
      if (!scrollFired[threshold] && pct >= threshold) {
        scrollFired[threshold] = true;
        trackEvent('scroll_depth', { tool_name: toolName, percent: threshold });
      }
    });
  }, { passive: true });
}

/* --- Init on DOM Ready --- */
document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initFaq();
  setTimeout(initAds, 100);
  setTimeout(initGA4, 2000);
  setTimeout(initEventTracking, 2500);
  initAnalytics();
});
