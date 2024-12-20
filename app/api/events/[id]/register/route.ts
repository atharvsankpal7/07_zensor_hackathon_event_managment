import { NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';
import { EventRegistrationService } from '@/lib/services/event-registration.service';

export const POST = requireAuth(
  asyncHandler(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    try {
      const registration = await EventRegistrationService.registerForEvent(
        params.id,
        req.user!.id
      );

      return NextResponse.json({
        success: true,
        message: 'Successfully registered for event',
        data: registration,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Registration failed',
        },
        { status: 400 }
      );
    }
  })
);

export const DELETE = requireAuth(
  asyncHandler(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    try {
      await EventRegistrationService.unregisterFromEvent(params.id, req.user!.id);

      return NextResponse.json({
        success: true,
        message: 'Successfully unregistered from event',
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Unregistration failed',
        },
        { status: 400 }
      );
    }
  })
);