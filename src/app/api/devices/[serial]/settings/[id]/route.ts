import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:301';

function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (header) {
    const m = header.match(/^Bearer\s+(.+)$/i);
    if (m?.[1]) return m[1].trim();
  }
  const cookieToken = req.cookies.get('AuthToken')?.value;
  return cookieToken || null;
}

function shouldClearAuth(status: number, data: any): boolean {
  return status === 401 || data?.reason === 'invalid_token' || data?.error === 'unauthorized';
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ serial: string; id: string }> }
) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolved = await params;
    const serial = resolved?.serial;
    const id = resolved?.id;
    if (!serial) return NextResponse.json({ error: 'Missing device serial' }, { status: 400 });
    if (!id) return NextResponse.json({ error: 'Missing setting id' }, { status: 400 });

    const body = await req.json().catch(() => ({} as any));

    const upstream = `${baseURL}/admin/api/devices/${encodeURIComponent(serial)}/settings/${encodeURIComponent(id)}`;
    const res = await axios.patch(upstream, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    });

    const status = res.status || 500;
    const data = res.data ?? {};
    const response = NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

    if (shouldClearAuth(status, data)) {
      try {
        response.cookies.set('AuthToken', '', { expires: new Date(0), path: '/' });
        response.cookies.set('RefreshToken', '', { expires: new Date(0), path: '/' });
        response.cookies.set('user_object', '', { expires: new Date(0), path: '/' });
        response.cookies.set('UserAuthenticated', '', { expires: new Date(0), path: '/' });
      } catch {}
    }

    return response;
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to update device settings', exception: e?.message },
      { status: 500 }
    );
  }
}
