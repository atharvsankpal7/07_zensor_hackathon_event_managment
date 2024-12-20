export interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  category: string;
  createdBy: string;
}

export interface EventRegistration {
  _id: string;
  event: string | Event;
  user: string;
  registeredAt: Date;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: EventRegistration;
}