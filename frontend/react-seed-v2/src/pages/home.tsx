import * as React from 'react';
import { useAuthStore } from '@/utils/store';

const Home: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  // Derive display name — prefer stored name, else email prefix, else 'there'
  const rawName = (user?.name && user.name.trim()) || user?.email?.split('@')[0] || 'there';
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4 animate-in fade-in zoom-in duration-1000">
      <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#5606ff] to-[#fe8989] flex items-center justify-center text-white font-black text-5xl shadow-2xl mb-2 animate-bounce-subtle">
        I
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter text-white">
          Hello {name} <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-xl text-white/60 font-medium">
          Welcome to <span className="text-brand-gradient font-black">Indexnine Task Flow</span>
        </p>
      </div>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <p className="max-w-md text-white/40 text-sm leading-relaxed">
        Elevate your productivity with our state-of-the-art task management experience.
        Designed for those who value art and efficiency.
      </p>
    </div>
  );
};

export default Home;
