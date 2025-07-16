'use client';

import { useEffect, useState } from 'react';
import { MotionDiv } from '@/components/common/motion-wrapper';
import { Logo } from '@/components/common/logo';

interface PreloaderProps {
  duration?: number; // optional delay in ms
}

export default function Preloader({ duration = 2000 }: PreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500); // delay for fade-out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!loading) return null;

  return (
    <MotionDiv
      className="bg-background fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <MotionDiv
        className="flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="large" className="mb-6" />
        <div className="relative h-1 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <MotionDiv
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-rose-700"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}
