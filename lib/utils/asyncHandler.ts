import { NextRequest, NextResponse } from 'next/server';

type AsyncFunction = (
  req: NextRequest,
  res: NextResponse,
  ...args: any[]
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return async (req: NextRequest, res: NextResponse, ...args: any[]) => {
    try {
      return await fn(req, res, ...args);
    } catch (error: any) {
      console.error('Error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Internal Server Error',
        },
        { status: error.status || 500 }
      );
    }
  };
};