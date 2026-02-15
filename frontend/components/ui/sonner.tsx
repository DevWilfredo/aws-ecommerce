'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      richColors
      closeButton
      offset="110px"
      mobileOffset="86px"
      duration={2600}
      toastOptions={{
        classNames: {
          toast: 'border border-slate-200 bg-white text-slate-900 shadow-lg',
          description: 'text-slate-600',
          actionButton: 'bg-slate-900 text-white',
          cancelButton: 'bg-slate-100 text-slate-700',
        },
      }}
      {...props}
    />
  );
}
