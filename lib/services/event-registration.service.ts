import { connectDB } from '@/lib/utils/db';
import Event from '@/lib/models/event.model';
import RegisteredEvent from '@/lib/models/registeredEvent.model';
import { EventRegistration } from '@/lib/types/event';

export class EventRegistrationService {
  static async registerForEvent(eventId: string, userId: string): Promise<EventRegistration> {
    await connectDB();

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if already registered
    const existingRegistration = await RegisteredEvent.findOne({
      event: eventId,
      registeredBy: userId,
    });

    if (existingRegistration) {
      throw new Error('Already registered for this event');
    }

    // Create registration
    const registration = await RegisteredEvent.create({
      event: eventId,
      registeredBy: userId,
    });

    return registration;
  }

  static async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    await connectDB();

    const registration = await RegisteredEvent.findOne({
      event: eventId,
      registeredBy: userId,
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    await registration.deleteOne();
  }

  static async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    await connectDB();
    return RegisteredEvent.find({ event: eventId }).populate('registeredBy', 'name email');
  }

  static async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    await connectDB();
    return RegisteredEvent.find({ registeredBy: userId }).populate('event');
  }

  static async isUserRegistered(eventId: string, userId: string): Promise<boolean> {
    await connectDB();
    const registration = await RegisteredEvent.findOne({
      event: eventId,
      registeredBy: userId,
    });
    return !!registration;
  }
}