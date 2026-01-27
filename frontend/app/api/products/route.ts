import { NextResponse } from "next/server";

export const runtime = "nodejs"; // evita edge si tu entorno no lo soporta bien
export const dynamic = "force-dynamic"; // en dev / simple: siempre pide data fresca (sin cache raro)

export async function GET() {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "API_BASE_URL no está configurada en .env.local" },
      { status: 500 }
    );
  }

  try {
    // Timeout simple (evita quedarte colgado si Nest no responde)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${baseUrl}/products`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store", // no cachear en este nivel (simple y claro)
    });

    clearTimeout(timeout);

    // Si Nest responde error, lo propagamos con info útil
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          message: "Error desde backend Nest",
          statusFromBackend: res.status,
          body: text,
        },
        { status: 502 } // 502 = bad gateway (proxy)
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const isAbort = err?.name === "AbortError";
    return NextResponse.json(
      {
        message: isAbort
          ? "Timeout: Nest tardó demasiado en responder"
          : "Error conectando con el backend",
        detail: String(err?.message ?? err),
      },
      { status: 504 } // 504 = gateway timeout / error de conexión
    );
  }
}
