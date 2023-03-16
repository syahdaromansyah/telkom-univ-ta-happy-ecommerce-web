import type { ReactNode } from 'react';

interface LayoutPageProps {
  children: ReactNode;
}

export default function LayoutPage({ children }: LayoutPageProps) {
  return <div>{children}</div>;
}
