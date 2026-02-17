import axiosInstance from "@/utils/axios/axios";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString(); // Preserve all query parameters dynamically

    const userId = searchParams.get("userId");
    // console.log('user id:',userId)
    // console.log("query string otp", queryString);

    const endPoint = `${process.env.NEXT_PUBLIC_AUTH_GET_OTP_HISTORY_LOGS_BY_USER_ID}/${userId}`;

    // console.log("End point", endPoint);
    const response = await axiosInstance.get(endPoint);

    // console.log("Response in server", response);
    if (response.status === 200 || response.status === 201) {
      // console.log("History logs fetched successfully:", response.data);
      return NextResponse.json({
        isApiHandled: true,
        isRequestSuccess: true,
        statusCode: response.status,
        message: "Success",
        data: response.data.data,
        exception: [],
      });
    } else {
      console.error(
        "Failed to fetch history logs:",
        response.status,
        response.data.message
      );
      return NextResponse.json({
        isApiHandled: true,
        isRequestSuccess: false,
        statusCode: response.status,
        message: response.data.message || "Failed to fetch history logs",
        data: null,
        exception: [],
      });
    }
  } catch (error: any) {
    // console.error("Error fetching history logs:", error);
    return NextResponse.json({
      isApiHandled: false,
      isRequestSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message,
      data: null,
      exception: [error.message || "Unknown error"],
    });
  }
}
