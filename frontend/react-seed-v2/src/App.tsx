import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { router } from '@/routes';
import { useAuthStore } from '@/utils/store';

import { ShaderBackground } from '@/components/common/ShaderBackground';

const App: React.FC = () => {
  const checkExpiry = useAuthStore((s) => s.checkExpiry);

  // On every app load: clear sessions that expired while the browser was closed
  React.useEffect(() => {
    checkExpiry();
  }, [checkExpiry]);

  return (
    <>
      <ShaderBackground />
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export default App;
