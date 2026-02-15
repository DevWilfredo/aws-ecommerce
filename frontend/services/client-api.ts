const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function clientApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API) throw new Error('NEXT_PUBLIC_API_BASE_URL no está configurada');

  const res = await fetch(`${API}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
