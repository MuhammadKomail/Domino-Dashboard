import axiosInstance from '@/utils/axios/axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // console.log('Start Login Action');

    // console.log('Received request:', request);

    const { username, password } = await request.json();
    // console.log('Parsed request body:', { username, password });

    // console.log('NEXT_PUBLIC_AUTH_API_LOGIN:', process.env.NEXT_PUBLIC_AUTH_API_LOGIN);

    const response = await axiosInstance.post(
      process.env.NEXT_PUBLIC_AUTH_API_LOGIN!,
      { username, password },
      { validateStatus: () => true }
    );

    console.log('API response:', response);

    const successFlag = response.data?.success;
    const backendMsg = response.data?.message || response.data?.error;

    // Priority 1: If backend explicitly says success:false, treat as failure regardless of HTTP status
    if (successFlag == false) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: false,
          statusCode: response.status,
          message: backendMsg || 'Invalid credentials',
          data: null,
          exception: []
        },
        { status: response.status }
      );
    }

    // Priority 2: If backend explicitly says success:true, treat as success
    if (successFlag == true) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: true,
          statusCode: response.status,
          message: backendMsg || 'Success',
          data: response.data,
          exception: []
        },
        { status: 200 }
      );
    }

    // Priority 3: Fall back to HTTP status-based handling if success flag is absent
    if (response.status == 200 || response.status == 201) {
      return NextResponse.json(
        {
          isApiHandled: true,
          isRequestSuccess: true,
          statusCode: response.status,
          message: backendMsg || 'Success',
          data: response.data,
          exception: []
        },
        { status: 200 }
      );
    }

    const status = response.status;
    const friendly = (status == 401 || status == 404) ? 'Invalid username or password' : 'Login failed';
    return NextResponse.json(
      {
        isApiHandled: true,
        isRequestSuccess: false,
        statusCode: status,
        message: backendMsg || friendly,
        data: null,
        exception: []
      },
      { status }
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const exceptionData = error.response?.data?.exception || [];
    const successFlag = error.response?.data?.success;
    const backendMsg = error.response?.data?.message || error.response?.data?.error;
    console.log('backendMsg', backendMsg);

    // If backend provides success:false in error path, prioritize that message
    if (successFlag === false) {
      return NextResponse.json(
        {
          isApiHandled: false,
          isRequestSuccess: false,
          statusCode: status,
          message: backendMsg || 'Invalid credentials',
          data: null,
          exception: exceptionData,
        },
        { status }
      );
    }

    const errorMessage = (status === 401 || status === 404)
      ? (backendMsg || 'Invalid username or password')
      : (Array.isArray(exceptionData) && exceptionData.length > 0 ? exceptionData : backendMsg || 'Login failed');

    console.error('CATCH', error.response?.data);
    return NextResponse.json(
      {
        isApiHandled: false,
        isRequestSuccess: false,
        statusCode: status,
        message: errorMessage,
        data: null,
        exception: exceptionData,
      },
      { status }
    );
  }
}
