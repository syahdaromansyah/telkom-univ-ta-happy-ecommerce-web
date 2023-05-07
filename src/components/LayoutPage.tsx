import { interFont } from '@/lib/nextFonts';
import useAuth from '@/lib/use-custom-hooks/useAuth';
import { ReactNode } from 'react';

interface LayoutPageProps {
  children: ReactNode;
}

export default function LayoutPage({ children }: LayoutPageProps) {
  useAuth();

  return <div className={`${interFont.variable} font-inter`}>{children}</div>;
}
