import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/db';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import Event from '@/lib/models/event.model';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '@/lib/auth';

export const GET = requireAuth(
  asyncHandler(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    await connectDB();
    const event = await Event.findById(params.id).populate('createdBy', 'name');
    
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  })
);

export const PUT = requireAdmin(
  asyncHandler(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    await connectDB();
    const body = await req.json();
    
    const event = await Event.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  })
);

export const DELETE = requireAdmin(
  asyncHandler(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    await connectDB();
    
    const event = await Event.findByIdAndDelete(params.id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  })
);