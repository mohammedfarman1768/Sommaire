'use client';

import React from 'react';
import { Arvo } from 'next/font/google';
import Link from 'next/link';

const arvo = Arvo({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function NotFound() {
  return (
    <section
      className={`bg-white ${arvo.className} flex min-h-screen flex-col items-center justify-start pt-10 text-gray-800`}
    >
      <h1 className="text-center text-[80px] font-extralight leading-none">
        404
      </h1>

      <div
        className="h-[300px] w-full max-w-xl bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/not_found.gif')" }}
        role="img"
        aria-label="Page not found illustration"
      />

      <div className="mt-[-30px] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-semibold">Looks like you're lost</h2>
        <p className="mt-2 text-base text-gray-600">
          The page you are looking for is not available!
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-rose-500 px-6 py-3 text-white shadow-md transition hover:bg-rose-600"
        >
          Go to Home
        </Link>
      </div>
    </section>
  );
}
