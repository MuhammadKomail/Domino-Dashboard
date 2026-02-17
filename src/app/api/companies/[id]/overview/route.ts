import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:301';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('AuthToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) return NextResponse.json({ error: 'Missing company id' }, { status: 400 });

    const url = new URL(req.url);
    const days = url.searchParams.get('days') ?? '1';
    // const levelField = url.searchParams.get('levelField') ?? 'low_adc';
    // const pressureField = url.searchParams.get('pressureField') ?? 'high_adc';
    // const temperatureField = url.searchParams.get('temperatureField') ?? 'cur_adc';

    const upstream = `${baseURL}/admin/api/companies/${encodeURIComponent(id)}/overview`;
    const res = await axios.get(upstream, {
      params: { days },
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
    return NextResponse.json({ error: 'Failed to fetch company overview', exception: e?.message }, { status: 500 });
  }
}
