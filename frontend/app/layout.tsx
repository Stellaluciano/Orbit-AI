import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orbit AI Workspace',
  description: 'Personal AI computer for deterministic DAG execution'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
