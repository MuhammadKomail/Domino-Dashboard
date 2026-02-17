
import axiosInstance from '@/utils/axios/axios';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const incomingPayload = await request.json(); // Parse the incoming JSON payload
    // Use incomingPayload directly as the payload
    const response = await axiosInstance.put(process.env.NEXT_PUBLIC_AUTH_API_REFRESH_TOKEN!, incomingPayload); // Removed registeredNewProducts

    if (response.status === 201 || response.status === 200) { // Updated to check for status 201
      // console.log('Product uploaded successfully:', response.data);
      return NextResponse.json({
        isApiHandled: true,
        isRequestSuccess: true,
        statusCode: response.status,
        message: 'Success',
        data: response.data.data, // Assuming response.data.data is an array of strings
        exception: [],
      });
    } else {
      // console.error('Failed to upload product:', response.status, response.data.message);
      return NextResponse.json({
        isApiHandled: true,
        isRequestSuccess: false,
        statusCode: response.status,
        message: response.data.message || 'Failed to upload product',
        data: null,
        exception: [],
      });
    }
  } catch (error: any) {
    // console.error('Error uploading product:', error);
    return NextResponse.json({
      isApiHandled: false,
      isRequestSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message,
      data: null,
      exception: [error.message || 'Unknown error'],
    });
  }
}
