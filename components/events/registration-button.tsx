'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RegistrationButtonProps {
  eventId: string;
  isRegistered: boolean;
  onRegistrationChange?: (isRegistered: boolean) => void;
}

export function RegistrationButton({
  eventId,
  isRegistered: initialIsRegistered,
  onRegistrationChange,
}: RegistrationButtonProps) {
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: isRegistered ? 'DELETE' : 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setIsRegistered(!isRegistered);
      onRegistrationChange?.(!isRegistered);

      toast({
        title: 'Success',
        description: data.message,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRegistration}
      disabled={isLoading}
      variant={isRegistered ? 'destructive' : 'default'}
    >
      {isLoading
        ? 'Processing...'
        : isRegistered
        ? 'Unregister'
        : 'Register'}
    </Button>
  );
}