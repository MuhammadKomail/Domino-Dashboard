import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const incomingAuth = request.headers.get("authorization") || "";
    const incomingSessionId = request.headers.get("session-id") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (incomingAuth) {
      headers.Authorization = incomingAuth;
    }

    if (incomingSessionId) {
      headers["Session-ID"] = incomingSessionId;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, message: "NEXT_PUBLIC_API_URL is not configured" },
        { status: 500 }
      );
    }

    const response = await axios.post(`${baseUrl}/admin/api/auth/change-password`, payload, {
      headers,
      validateStatus: () => true,
    });

    const raw = response.data;
    const message = raw?.message || raw?.error || "";
    const success = typeof raw?.success === "boolean" ? raw.success : response.status >= 200 && response.status < 300;

    return NextResponse.json(
      {
        success,
        message: message || (success ? "Password changed successfully" : "Request failed"),
      },
      { status: response.status }
    );
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Internal Server Error";

    return NextResponse.json({ success: false, message }, { status });
  }
}
