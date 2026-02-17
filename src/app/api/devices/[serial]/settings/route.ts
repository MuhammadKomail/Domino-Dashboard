import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:301';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ serial: string }> }
) {
  try {
    const token = req.cookies.get('AuthToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolved = await params;
    const serial = resolved?.serial;
    if (!serial) return NextResponse.json({ error: 'Missing device serial' }, { status: 400 });

    const url = new URL(req.url);
    const range = url.searchParams.get('range') ?? '7d';
    const page = url.searchParams.get('page') ?? '1';
    const pageSize = url.searchParams.get('pageSize') ?? '10';

    const upstream = `${baseURL}/admin/api/devices/${encodeURIComponent(serial)}/settings`;
    const res = await axios.get(upstream, {
      params: { range, page, pageSize },
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });

    const status = res.status || 500;
    const data = res.data ?? {};
    const response = NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
    if (status === 401 || data?.reason === 'invalid_token' || data?.error === 'unauthorized') {
      try {
        response.cookies.set('AuthToken', '', { expires: new Date(0), path: '/' });
        response.cookies.set('RefreshToken', '', { expires: new Date(0), path: '/' });
        response.cookies.set('user_object', '', { expires: new Date(0), path: '/' });
        response.cookies.set('UserAuthenticated', '', { expires: new Date(0), path: '/' });
      } catch {}
    }
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch device settings', exception: e?.message }, { status: 500 });
  }
}
