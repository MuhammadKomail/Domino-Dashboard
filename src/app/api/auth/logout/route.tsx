import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('AuthToken')?.value;
    if (!token) {
      const resp = NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      try {
        resp.cookies.set('AuthToken', '', { expires: new Date(0), path: '/' });
        resp.cookies.set('RefreshToken', '', { expires: new Date(0), path: '/' });
        resp.cookies.set('user_object', '', { expires: new Date(0), path: '/' });
        resp.cookies.set('UserAuthenticated', '', { expires: new Date(0), path: '/' });
      } catch {}
      return resp;
    }

    const body = await req.json().catch(() => ({} as any));
    const sessionId = body?.sessionId;
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:301';
    const url = `${baseURL}/admin/api/auth/logout`;

    const res = await axios.post(url, { sessionId }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true,
    });

    const status = res.status || 500;
    const data = res.data ?? {};
    const response = NextResponse.json(data, { status });
    response.headers.set('Cache-Control', 'no-store');
    // Always clear cookies after calling backend logout, regardless of status
    try {
      response.cookies.set('AuthToken', '', { expires: new Date(0), path: '/' });
      response.cookies.set('RefreshToken', '', { expires: new Date(0), path: '/' });
      response.cookies.set('user_object', '', { expires: new Date(0), path: '/' });
      response.cookies.set('UserAuthenticated', '', { expires: new Date(0), path: '/' });
    } catch {}
    return response;
  } catch (err: any) {
    const resp = NextResponse.json(
      { success: false, message: 'Failed to logout', exception: err?.message || 'Unknown error' },
      { status: 500 }
    );
    try {
      resp.cookies.set('AuthToken', '', { expires: new Date(0), path: '/' });
      resp.cookies.set('RefreshToken', '', { expires: new Date(0), path: '/' });
      resp.cookies.set('user_object', '', { expires: new Date(0), path: '/' });
      resp.cookies.set('UserAuthenticated', '', { expires: new Date(0), path: '/' });
    } catch {}
    return resp;
  }
}
