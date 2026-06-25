import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header';

export const ProtectedLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};