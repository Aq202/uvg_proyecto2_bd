function useApiFetch() {
  const apiFetch = async ({
    uri, method = 'GET', body, headers, signal,
  }) => {
    const reply = await fetch(uri, {
      method,
      body,
      headers,
      signal,
      credentials: 'include',
    });

    if (!reply.ok) {
      throw reply; // Si no es un error 'unauthorized'
    }
    return reply; // retorno exitoso
  };
  return { apiFetch };
}

export default useApiFetch;
