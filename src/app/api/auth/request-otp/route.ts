import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:301';
    const url = `${baseURL}/admin/api/auth/request-otp`;

    const res = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });

    const status = res.status || 500;
    const data = res.data ?? {};
    const response = NextResponse.json(data, { status });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Request failed' }, { status: 500 });
  }
}
