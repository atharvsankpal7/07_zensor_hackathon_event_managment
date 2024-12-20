import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/db';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import Event from '@/lib/models/event.model';
import { isAdmin } from '@/lib/auth';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();
  const event = await Event.findById(params.id).populate('createdBy', 'name');
  
  if (!event) {
    return NextResponse.json(
      { success: false, message: 'Event not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: event });

};
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if(!token){
      throw Error("unauthorized")
  }
  if (!await isAdmin(token)) {
      return NextResponse.json(
          {success: false, message: 'Only admins can create events'},
          {status: 403}
      );
  }
  
  

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
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if(!token){
      throw Error("unauthorized")
  }
  if (!await isAdmin(token)) {
      return NextResponse.json(
          {success: false, message: 'Only admins can create events'},
          {status: 403}
      );
  }
  

  const event = await Event.findByIdAndDelete(params.id);

  if (!event) {
    return NextResponse.json(
      { success: false, message: 'Event not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: null });
};