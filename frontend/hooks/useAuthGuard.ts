'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ClientApiError, clientApiFetch } from '@/services/client-api';

type AuthStatus = 'checking' | 'authorized' | 'unauthorized' | 'service_error';

const DEFAULT_AUTH_ERROR =
  'No pudimos verificar tu sesión en este momento. Intenta nuevamente más tarde.';

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [authError, setAuthError] = useState<string | null>(null);
  const [retrySeed, setRetrySeed] = useState(0);

  const retryAuthCheck = useCallback(() => {
    setAuthError(null);
    setStatus('checking');
    setRetrySeed((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      try {
        await clientApiFetch<{ sub: string }>('/auth/me', {
          method: 'GET',
          timeoutMs: 9000,
        });

        if (!active) return;

        setAuthError(null);
        setStatus('authorized');
      } catch (error) {
        if (!active) return;

        if (error instanceof ClientApiError && error.status === 401) {
          setAuthError(null);
          setStatus('unauthorized');

          const query = typeof window !== 'undefined' ? window.location.search : '';
          const nextPath = `${pathname ?? '/'}${query}`;
          router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
          return;
        }

        setAuthError(error instanceof Error ? error.message : DEFAULT_AUTH_ERROR);
        setStatus('service_error');
      }
    }

    void verifySession();

    return () => {
      active = false;
    };
  }, [pathname, retrySeed, router]);

  return {
    isChecking: status === 'checking',
    isAuthenticated: status === 'authorized',
    isUnauthorized: status === 'unauthorized',
    authError,
    retryAuthCheck,
  };
}
