import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "API_BASE_URL no esta configurada en .env.local" },
      { status: 500 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${baseUrl}/products/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          message: "Error desde backend Nest",
          statusFromBackend: res.status,
          body: text,
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const isAbort = err?.name === "AbortError";
    return NextResponse.json(
      {
        message: isAbort
          ? "Timeout: Nest tardo demasiado en responder"
          : "Error conectando con el backend",
        detail: String(err?.message ?? err),
      },
      { status: 504 }
    );
  }
}
