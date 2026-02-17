'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Mail, MessageSquareText, SendHorizontal, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const reasonOptions = [
  { value: 'consulta-general', label: 'Consulta general' },
  { value: 'pedido', label: 'Estado de pedido' },
  { value: 'soporte', label: 'Soporte técnico' },
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'otro', label: 'Otro motivo' },
] as const;

type ContactFormState = {
  reason: (typeof reasonOptions)[number]['value'];
  email: string;
  message: string;
};

const initialFormState: ContactFormState = {
  reason: reasonOptions[0].value,
  email: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [sending, setSending] = useState(false);

  const remainingChars = 700 - form.message.length;
  const canSubmit = useMemo(
    () =>
      form.reason.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.message.trim().length > 0 &&
      form.message.length <= 700,
    [form.email, form.message, form.reason],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      toast.error('Completa todos los campos antes de enviar el mensaje.');
      return;
    }

    setSending(true);

    window.setTimeout(() => {
      setSending(false);
      setForm(initialFormState);
      toast.success('Correo enviado. Te contactaremos pronto.');
    }, 550);
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 animate-fade-in">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gradient-to-br from-sky-200/60 to-cyan-100/30 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Contacto
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            ¿En qué te podemos ayudar?
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            Cuéntanos tu motivo y te responderemos lo antes posible. Este formulario es una simulación para la interfaz.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Mail className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Respuesta por correo</p>
                <p className="text-xs text-slate-600">Usaremos tu correo para darte seguimiento.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <MessageSquareText className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Mensaje claro y directo</p>
                <p className="text-xs text-slate-600">Incluye el contexto para ayudarte más rápido.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Simulación activa</p>
                <p className="text-xs text-slate-600">Mostraremos un toast de confirmación al enviar.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Formulario
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Escríbenos</h2>
          <p className="mt-2 text-sm text-slate-600">
            Completa los campos y envía tu mensaje.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Motivo</span>
              <select
                value={form.reason}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    reason: event.target.value as ContactFormState['reason'],
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {reasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Correo electrónico</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                placeholder="tu-correo@ejemplo.com"
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Mensaje</span>
              <textarea
                value={form.message}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    message: event.target.value,
                  }))
                }
                placeholder="Escribe aquí el detalle de tu solicitud..."
                required
                maxLength={700}
                rows={7}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
              <p className="mt-1 text-right text-xs text-slate-500">
                {remainingChars} caracteres restantes
              </p>
            </label>

            <button
              type="submit"
              disabled={!canSubmit || sending}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-5 text-base font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizontal className="h-4 w-4" />
              {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
