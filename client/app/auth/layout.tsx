import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Khozai',
  description: 'Sign in, register, or reset your password with Khozai',
  keywords: ['authentication', 'login', 'register', 'password reset', 'Khozai'],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
