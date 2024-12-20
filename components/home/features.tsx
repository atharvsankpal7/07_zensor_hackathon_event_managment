import { BarChart3, Lock, Shield, Users } from 'lucide-react';

const features = [
  {
    name: 'Role-Based Access',
    description: 'Secure access control with admin and user roles for better data protection.',
    icon: Lock,
  },
  {
    name: 'User Management',
    description: 'Efficiently managed users, permissions, and account settings.',
    icon: Users,
  },
  {
    name: 'UI/UX',
    description: 'clear and easy-to-navigate interface.',
    icon: BarChart3,
  },
  {
    name: 'Security',
    description: 'Advanced security features to protect your business data.',
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="bg-muted/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
           Features implemented :
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">

          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}