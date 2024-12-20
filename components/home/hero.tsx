'use client';

import { ArrowRight, BarChart3, Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Display your events to public
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
           Easily access all of the events in your nearby areas easily
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              size="lg"
              onClick={() => router.push('/register')}
            >
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/login')}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}