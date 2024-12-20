import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; // for edge runtimes of serverless function 
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  id: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function verifyAuth(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function isAdmin(token: string): Promise<boolean> {
  try {
    const decodedToken = await verifyAuth(token);
    return decodedToken?.role === 'admin';
  } catch (error) {
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

export function requireAuth(handler: Function) {
  return async (req: AuthenticatedRequest, ...args: any[]) => {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      throw new Error('Unauthorized - No token provided');
    }

    try {
      const user = await verifyAuth(token);
      req.user = user;
      return handler(req, ...args);
    } catch (error) {
      throw new Error('Unauthorized - Invalid token');
    }
  };
}

export function requireAdmin(handler: Function) {
  return async (req: AuthenticatedRequest, ...args: any[]) => {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      throw new Error('Unauthorized - No token provided');
    }

    try {
      const user = await verifyAuth(token);
      if (user.role !== 'admin') {
        throw new Error('Forbidden - Admin access required');
      }
      req.user = user;
      return handler(req, ...args);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unauthorized');
    }
  };
}