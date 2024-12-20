import jwt from 'jsonwebtoken';
import {cookies} from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
    id: string;
    role: 'admin' | 'user';
    iat: number;
    exp: number;
}

export async function verifyAuth(token: string): Promise<JWTPayload> {
    try {
        const decodedToken = await jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decodedToken;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export async function isAdmin(token: string): Promise<boolean> {
    try {
        const decodedToken = await verifyAuth(token);
        if (!decodedToken) {
            return false;
        }
        return decodedToken.role === 'admin';

    }catch (error) {
        return false;
    }
}

export async function getServerSession() {
    const token = cookies().get('token')?.value;

    if (!token) {
        return null;
    }

    try {
        return await verifyAuth(token);
    } catch {
        return null;
    }
}