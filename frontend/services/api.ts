export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: string,
  ) {
    super(message);
  }
}

function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error('API_BASE_URL no está configurada');
  return baseUrl.replace(/\/$/, '');
}

export async function apiFetch<T>(
  path: string,
  opts: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeoutMs?: number;
    cache?: RequestCache;
    cookieHeader?: string;
  } = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const method = opts.method ?? 'GET';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);

  try {
    const res = await fetch(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
        ...(opts.cookieHeader ? { Cookie: opts.cookieHeader } : {}),
        ...(opts.headers ?? {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
      cache: opts.cache ?? 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError('Error desde backend', res.status, text);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado al llamar al backend', 504);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

