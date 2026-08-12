(() => {
  const session = window.upGetSession?.();
  if (!session?.user?.id || !window.upFetch) return;
  const url = 'https://tknygjjxcbnvlkwgidfm.supabase.co/rest/v1/sites?owner_id=eq.' + encodeURIComponent(session.user.id) + '&select=trial_ends_at,subscription_status';
  upFetch(url, {}, session.access_token).then(rows => {
    const site = rows?.[0]; if (!site) return;
    const end = site.trial_ends_at ? new Date(site.trial_ends_at) : null;
    const days = end ? Math.max(0, Math.ceil((end - Date.now()) / 86400000)) : 0;
    const label = site.subscription_status === 'trial' ? `Teste grátis · ${days} dias restantes` : site.subscription_status === 'active' ? 'Plano ativo' : 'Assinatura pendente';
    const bar = document.createElement('div'); bar.className='trial-banner'; bar.innerHTML = `<strong>${label}</strong><span>Plano completo: R$ 69,99/mês</span>`;
    document.querySelector('.main-content')?.prepend(bar);
  }).catch(() => {});
})();
