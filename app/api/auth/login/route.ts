import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/db';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import { loginSchema } from '@/lib/validations/auth';
import User from '@/lib/models/user.model';


export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  const validatedData = loginSchema.parse(body);
  const user = await User.findOne({ email: validatedData.email }).select('+password');
  
  if (!user || !(await user.comparePassword(validatedData.password))) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
      );
    }
    
  const token = user.generateToken();
  const response = NextResponse.json(
    { success: true, data: { user} },
    { status: 200 }
  );

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return response;
});