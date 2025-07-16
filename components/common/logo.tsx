'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MotionDiv } from '@/components/common/motion-wrapper';

type LogoProps = {
  size?: 'small' | 'default' | 'large';
  className?: string;
  href?: string | null;
};

export function Logo({ size = 'default', className, href = '/' }: LogoProps) {
  const sizeClasses = {
    small: 'h-6',
    default: 'h-[52px]', // Tailwind has no h-13
    large: 'h-16',
  };

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-xl',
    large: 'text-3xl',
  };

  const LogoGraphic = (
    <MotionDiv
      whileHover={{ scale: 1.05, rotate: [0, -2, 0, 2, 0] }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      className={cn('relative', sizeClasses[size])}
    >
      {/* ... SVG content unchanged ... */}
    </MotionDiv>
  );

  const LogoText = (
    <MotionDiv
      initial={{ opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      className={cn('font-bold', textSizeClasses[size])}
    >
      <span className="bg-linear-to-r from-rose-600 via-rose-500 to-rose-400 bg-clip-text text-transparent dark:from-rose-400 dark:via-rose-500 dark:to-rose-300">
        Sommaire
      </span>
      <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
        AI
      </span>
    </MotionDiv>
  );

  const logo = (
    <div className={cn('flex items-center gap-2', className)}>
      {LogoGraphic}
      {LogoText}
    </div>
  );

  return href ? <Link href={href}>{logo}</Link> : logo;
}
