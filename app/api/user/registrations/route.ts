import { NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';
import { EventRegistrationService } from '@/lib/services/event-registration.service';

export const GET = requireAuth(
  asyncHandler(async (req: AuthenticatedRequest) => {
    const registrations = await EventRegistrationService.getUserRegistrations(req.user!.id);
    
    return NextResponse.json({
      success: true,
      data: registrations,
    });
  })
);