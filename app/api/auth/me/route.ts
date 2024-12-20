import {NextRequest, NextResponse} from 'next/server';
import {connectDB} from '@/lib/utils/db';
import User from '@/lib/models/user.model';
import {verifyAuth} from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const decodedToken = token && await verifyAuth(token);

        const userId = decodedToken && decodedToken?.id
        if (!userId) {
            return NextResponse.json(
                {success: false, message: 'Not authenticated'},
                {status: 401}
            );
        }

        await connectDB();
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return NextResponse.json(
                {success: false, message: 'User not found'},
                {status: 404}
            );
        }

        return NextResponse.json({success: true, data: user});
    } catch (error) {
        return NextResponse.json(
            {success: false, message: 'Internal server error'},
            {status: 500}
        );
    }
}