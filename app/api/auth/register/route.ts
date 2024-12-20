import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/db';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import { registerSchema } from '@/lib/validations/auth';
import User from '@/lib/models/user.model';

export const dynamic = 'force-dynamic';

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  
  const body = await req.json();
  const validatedData = registerSchema.parse(body);
  
  const existingUser = await User.findOne({ email: validatedData.email });
  
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: 'Email already registered' },
      { status: 400 }
    );
  }

  const user = await User.create(validatedData);
  const token = user.generateToken();

  const response = NextResponse.json(
    { success: true, data: { user: { ...user.toJSON(), password: undefined } } },
    { status: 201 }
  );

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
});