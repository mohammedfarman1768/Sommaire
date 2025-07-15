import React from 'react';
import BgGradient from '@/components/common/bg-gradient';
import { SignIn } from '@clerk/nextjs';

const SignInPage: React.FC = () => {
  return (
    <section className="flex items-center justify-center lg:min-h-[40vh]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24 lg:pt-12">
        <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
        <SignIn />
      </div>
    </section>
  );
};

export default SignInPage;
