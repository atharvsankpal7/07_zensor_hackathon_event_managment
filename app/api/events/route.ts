import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/db';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import Event from '@/lib/models/event.model';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth';

export const GET = requireAuth(
  asyncHandler(async (req: AuthenticatedRequest) => {
    await connectDB();
    const events = await Event.find({});
    return NextResponse.json({ success: true, data: events });
  })
);

export const POST = requireAdmin(
  asyncHandler(async (req: AuthenticatedRequest) => {
    await connectDB();
    const body = await req.json();
    
    const event = await Event.create({
      ...body,
      createdBy: req.user?.id, // We can now safely access the user from the request
    });
    
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  })
);