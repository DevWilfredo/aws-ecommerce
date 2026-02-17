const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 12000);

type ClientApiErrorCode = 'CONFIG' | 'TIMEOUT' | 'UNAVAILABLE' | 'HTTP';

type ClientApiErrorOptions = {
  status?: number;
  code: ClientApiErrorCode;
  details?: string;
  retryable?: boolean;
};

export class ClientApiError extends Error {
  status?: number;
  code: ClientApiErrorCode;
  details?: string;
  retryable: boolean;

  constructor(message: string, options: ClientApiErrorOptions) {
    super(message);
    this.name = 'ClientApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.retryable = Boolean(options.retryable);
  }
}

type ClientApiRequestInit = RequestInit & {
  timeoutMs?: number;
};

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function resolveTimeout(timeoutMs?: number) {
  if (typeof timeoutMs === 'number' && timeoutMs > 0) return timeoutMs;
  if (Number.isFinite(DEFAULT_TIMEOUT_MS) && DEFAULT_TIMEOUT_MS > 0) return DEFAULT_TIMEOUT_MS;
  return 12000;
}

function parseBackendErrorMessage(body: string) {
  if (!body) return '';

  try {
    const parsed = JSON.parse(body) as unknown;

    if (typeof parsed === 'string') return parsed;

    if (parsed && typeof parsed === 'object') {
      const maybeMessage = (parsed as { message?: unknown }).message;

      if (typeof maybeMessage === 'string') return maybeMessage;
      if (Array.isArray(maybeMessage)) {
        return maybeMessage.filter((item) => typeof item === 'string').join(', ');
      }

      const maybeError = (parsed as { error?: unknown }).error;
      if (typeof maybeError === 'string') return maybeError;
    }
  } catch {
    // Body is not JSON; return plain text below.
  }

  return body.trim();
}

function friendlyServerErrorMessage(status: number) {
  if (status === 502 || status === 503 || status === 504) {
    return 'No pudimos conectar con el servidor. Intenta nuevamente más tarde.';
  }
  if (status >= 500) {
    return 'El servidor tuvo un problema. Intenta nuevamente más tarde.';
  }
  return '';
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

export async function clientApiRequest(
  path: string,
  init?: ClientApiRequestInit,
): Promise<Response> {
  if (!API) {
    throw new ClientApiError('Configuración incompleta de la API. Intenta nuevamente más tarde.', {
      code: 'CONFIG',
      retryable: false,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), resolveTimeout(init?.timeoutMs));

  try {
    const res = await fetch(`${API}${normalizePath(path)}`, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      const parsedMessage = parseBackendErrorMessage(bodyText);

      throw new ClientApiError(
        friendlyServerErrorMessage(res.status) || parsedMessage || `La solicitud falló: ${res.status}`,
        {
          status: res.status,
          code: 'HTTP',
          details: bodyText,
          retryable: res.status >= 500 || res.status === 429,
        },
      );
    }

    return res;
  } catch (error) {
    if (error instanceof ClientApiError) throw error;

    if (isAbortError(error)) {
      throw new ClientApiError(
        'La solicitud tardó demasiado. Intenta nuevamente en unos minutos.',
        {
          status: 504,
          code: 'TIMEOUT',
          retryable: true,
        },
      );
    }

    if (error instanceof TypeError) {
      throw new ClientApiError(
        'No pudimos conectar con el servidor. Intenta nuevamente más tarde.',
        {
          status: 503,
          code: 'UNAVAILABLE',
          retryable: true,
        },
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function clientApiFetch<T>(path: string, init?: ClientApiRequestInit): Promise<T> {
  const res = await clientApiRequest(path, init);

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  return (await res.text()) as T;
}
