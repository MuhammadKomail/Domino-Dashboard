import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
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

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:301';
    const url = `${baseURL}/admin/api/auth/me`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });

    const status = res.status || 500;
    const data = res.data ?? {};

    const response = NextResponse.json(data, { status });
    response.headers.set('Cache-Control', 'no-store');
    if (status === 401 || (data && (data.reason === 'invalid_token' || data.error === 'unauthorized'))) {
      try {
        response.cookies.set('AuthToken', '', { expires: new Date(0), path: '/' });
        response.cookies.set('RefreshToken', '', { expires: new Date(0), path: '/' });
        response.cookies.set('user_object', '', { expires: new Date(0), path: '/' });
        response.cookies.set('UserAuthenticated', '', { expires: new Date(0), path: '/' });
      } catch {}
    }
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user', exception: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
