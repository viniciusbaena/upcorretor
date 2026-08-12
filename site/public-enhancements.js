(() => {
  const enhance = () => document.querySelectorAll('[data-photo-urls]').forEach(card => {
    if (card.dataset.galleryReady) return;
    let urls = [];
    try { urls = JSON.parse(card.dataset.photoUrls); } catch {}
    if (!urls.length) return;
    card.dataset.galleryReady = '1';
    const media = card.querySelector('.property-photo');
    if (media) {
      media.style.backgroundImage = `url("${String(urls[0]).replace(/"/g, '')}")`;
      media.textContent = '';
      media.setAttribute('role', 'img');
      media.setAttribute('aria-label', 'Foto do imóvel');
    }
  });
  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
  enhance();

  const form = document.querySelector('#contact-form');
  if (form) {
    const trap = document.createElement('input');
    trap.name = 'website'; trap.tabIndex = -1; trap.autocomplete = 'off';
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.append(trap);
    const started = Date.now();
    form.addEventListener('submit', e => {
      if (trap.value || Date.now() - started < 1200) {
        e.preventDefault();
        const feedback = document.querySelector('#feedback');
        if (feedback) feedback.textContent = 'Aguarde alguns segundos e tente novamente.';
      }
    }, true);
  }

  const slug = (new URLSearchParams(location.search).get('slug') || '').toLowerCase();
  document.querySelectorAll('[data-property-id]').forEach(async card => {
    try {
      const id = card.dataset.propertyId;
      const response = await fetch('https://tknygjjxcbnvlkwgidfm.supabase.co/functions/v1/public-property-media?slug=' + encodeURIComponent(slug) + '&property_id=' + encodeURIComponent(id));
      if (!response.ok) return;
      const data = await response.json();
      if (data.urls && data.urls[0]) { card.dataset.photoUrls = JSON.stringify(data.urls); enhance(); }
    } catch {}
  });
})();
