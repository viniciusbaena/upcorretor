// Reject failed Storage uploads so the panel cannot report a false success.
(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    const method = String(init.method || (typeof input !== 'string' ? input?.method : 'GET')).toUpperCase();
    const response = await nativeFetch(input, init);
    if (url.includes('/storage/v1/object/property-images/') && method === 'POST' && !response.ok) {
      const match = url.match(/\/property-images\/[^/]+\/([^/]+)\//);
      const auth = init.headers?.Authorization || init.headers?.authorization;
      const propertyId = match?.[1];
      if (propertyId && auth) {
        const base = 'https://tknygjjxcbnvlkwgidfm.supabase.co';
        const headers = { apikey: UPCORRETOR_SUPABASE_KEY, Authorization: auth, 'Content-Type': 'application/json' };
        try { await nativeFetch(`${base}/functions/v1/delete-property-media`, { method: 'POST', headers, body: JSON.stringify({ property_id: propertyId }) }); } catch {}
        try { await nativeFetch(`${base}/rest/v1/properties?id=eq.${encodeURIComponent(propertyId)}`, { method: 'DELETE', headers }); } catch {}
      }
      throw new Error('Não foi possível enviar uma das fotos. O anúncio não foi concluído.');
    }
    return response;
  };
})();
