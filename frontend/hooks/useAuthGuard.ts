'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

type AuthStatus = 'checking' | 'authorized' | 'unauthorized';

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let active = true;

    async function verifySession() {
      try {
        if (!API) {
          throw new Error('NEXT_PUBLIC_API_BASE_URL no configurada');
        }

        const res = await fetch(`${API}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!active) return;

        if (res.ok) {
          setStatus('authorized');
          return;
        }

        throw new Error('No autenticado');
      } catch {
        if (!active) return;
        setStatus('unauthorized');

        const query = searchParams?.toString();
        const nextPath = `${pathname ?? '/'}${query ? `?${query}` : ''}`;
        router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      }
    }

    void verifySession();

    return () => {
      active = false;
    };
  }, [pathname, router, searchParams]);

  return {
    isChecking: status === 'checking',
    isAuthenticated: status === 'authorized',
  };
}

