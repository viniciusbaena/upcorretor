// Reject failed Storage uploads so the panel cannot report a false success.
(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    const method = String(init.method || (typeof input !== 'string' ? input?.method : 'GET')).toUpperCase();
    const response = await nativeFetch(input, init);
    if (url.includes('/storage/v1/object/property-images/') && method === 'POST' && !response.ok) {
      throw new Error('Não foi possível enviar uma das fotos. O anúncio não foi concluído.');
    }
    return response;
  };
})();
