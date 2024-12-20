import {NextRequest, NextResponse} from 'next/server';
import {connectDB} from '@/lib/utils/db';
import {asyncHandler} from '@/lib/utils/asyncHandler';
import Event from '@/lib/models/event.model';
import {isAdmin} from "@/lib/auth";

export const GET = asyncHandler(async (req: NextRequest) => {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if(!token){
        throw Error("unauthorized")
    }
    const events = await Event.find({});
    return NextResponse.json({success: true, data: events});
});

export const POST = asyncHandler(async (req: NextRequest) => {
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
    console.log(body)
    const event = await Event.create({
        ...body,
    });
    return NextResponse.json({success: true, data: event}, {status: 201});
});