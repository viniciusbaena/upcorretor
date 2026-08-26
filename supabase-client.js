// Identidade consistente também nas rotas legadas/compactadas sem link explícito.
if (typeof document !== 'undefined' && !document.querySelector('link[rel="icon"]')) {
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.type = 'image/svg+xml';
  icon.href = location.pathname.includes('/painel/') || location.pathname.includes('/site/') || location.pathname.includes('/temas/') ? '../favicon.svg' : 'favicon.svg';
  document.head.appendChild(icon);
}
// Cliente mínimo do UpCorretor usando a API REST do Supabase.
// A chave publishable/anon é própria para frontend quando o RLS está ativo.
const UPCORRETOR_SUPABASE_URL = 'https://tknygjjxcbnvlkwgidfm.supabase.co';
const UPCORRETOR_SUPABASE_KEY = 'sb_publishable_QpH6OB3C0iNUIdJI2ajP_w_rjomdSvC';
const UPCORRETOR_SESSION_KEY = 'upcorretor.session';

async function upFetch(path, options = {}, token = '') {
  const headers = { apikey: UPCORRETOR_SUPABASE_KEY, 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${UPCORRETOR_SUPABASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(body.error_description || body.msg || body.message || 'Não foi possível concluir a operação.'); error.status = response.status; throw error; }
  return body;
}

async function upProvisionAccount(auth, details = {}) {
  if (!auth?.access_token || !auth?.user?.id) return;
  const profile = { id: auth.user.id, full_name: details.fullName || auth.user.user_metadata?.full_name || auth.user.email?.split('@')[0] || 'Corretor', creci: details.creci || null, whatsapp: details.whatsapp || null };
  await upFetch('/rest/v1/profiles', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify(profile) }, auth.access_token);
  const existing = await upFetch(`/rest/v1/sites?owner_id=eq.${encodeURIComponent(auth.user.id)}&select=id`, {}, auth.access_token);
  if (!existing.length) await upFetch('/rest/v1/sites', { method: 'POST', body: JSON.stringify({ owner_id: auth.user.id, name: details.siteName || `${profile.full_name} Imóveis`, slug: details.slug || `corretor-${auth.user.id.slice(0, 8)}` }) }, auth.access_token);
}

async function upSignUp({ email, password, fullName, creci, whatsapp, siteName, slug }) {
  const redirectTo = 'https://viniciusbaena.github.io/upcorretor/auth-callback.html';
  const auth = await upFetch(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: fullName } }) });
  if (!auth.access_token) return { needsEmailConfirmation: true };
  localStorage.setItem(UPCORRETOR_SESSION_KEY, JSON.stringify(auth));
  await upProvisionAccount(auth, { fullName, creci, whatsapp, siteName, slug });
  return { session: auth };
}

async function upResendConfirmation(email) {
  return upFetch('/auth/v1/resend', { method: 'POST', body: JSON.stringify({ type: 'signup', email }) });
}

async function upSendPasswordReset(email) {
  const redirectTo = 'https://viniciusbaena.github.io/upcorretor/recuperar.html';
  return upFetch(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: JSON.stringify({ email }) });
}

async function upSignIn(email, password) {
  const auth = await upFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem(UPCORRETOR_SESSION_KEY, JSON.stringify(auth));
  return auth;
}

let upRefreshInFlight = null;
function upGetSession() {
  try {
    const value = JSON.parse(localStorage.getItem(UPCORRETOR_SESSION_KEY) || 'null');
    if (!value) return null;
    if (value.expires_at && value.expires_at * 1000 <= Date.now()) { upSignOut(); return null; }
    if (value.expires_at && value.expires_at * 1000 <= Date.now() + 120000 && value.refresh_token && !upRefreshInFlight) {
      upRefreshInFlight = upRefreshSession().catch(() => { upSignOut(); return null; }).finally(() => { upRefreshInFlight = null; });
    }
    return value;
  } catch { return null; }
}

function upSignOut() { localStorage.removeItem(UPCORRETOR_SESSION_KEY); }

async function upRefreshSession() {
  const current = JSON.parse(localStorage.getItem(UPCORRETOR_SESSION_KEY) || 'null');
  if (!current?.refresh_token) return null;
  const auth = await upFetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: current.refresh_token }) });
  localStorage.setItem(UPCORRETOR_SESSION_KEY, JSON.stringify(auth)); return auth;
}
