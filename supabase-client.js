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
  if (!response.ok) throw new Error(body.error_description || body.msg || body.message || 'Não foi possível concluir a operação.');
  return body;
}

async function upSignUp({ email, password, fullName, creci, whatsapp, siteName, slug }) {
  const redirectTo = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}auth-callback.html`;
  const auth = await upFetch(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: fullName } }) });
  if (!auth.access_token) return { needsEmailConfirmation: true };
  localStorage.setItem(UPCORRETOR_SESSION_KEY, JSON.stringify(auth));
  const profile = { id: auth.user.id, full_name: fullName, creci: creci || null, whatsapp: whatsapp || null };
  await upFetch('/rest/v1/profiles', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify(profile) }, auth.access_token);
  await upFetch('/rest/v1/sites', { method: 'POST', body: JSON.stringify({ owner_id: auth.user.id, name: siteName, slug }) }, auth.access_token);
  return { session: auth };
}

async function upSignIn(email, password) {
  const auth = await upFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem(UPCORRETOR_SESSION_KEY, JSON.stringify(auth));
  return auth;
}

function upGetSession() {
  try { return JSON.parse(localStorage.getItem(UPCORRETOR_SESSION_KEY) || 'null'); } catch { return null; }
}

function upSignOut() { localStorage.removeItem(UPCORRETOR_SESSION_KEY); }
