'use client';

import { useState } from 'react';
import Script from 'next/script';
import { ArrowRight } from 'lucide-react';
// import { useAuth } from '@clerk/nextjs'; // Clerk removed

type RazorpayOptions = {
  key: string;
  subscription_id: string;
  name: string;
  handler: (response: any) => void;
  prefill: {
    email: string;
  };
};

type PaymentButtonProps = {
  email: string;
  userId: string; // Now must be passed manually
  razorpayKey: string;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function PaymentButton({
  email,
  userId,
  razorpayKey,
}: PaymentButtonProps) {
  // const { userId, isLoaded } = useAuth(); // Clerk removed
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScriptLoad = () => setIsScriptLoaded(true);

  const handlePayment = async () => {
    // if (!isScriptLoaded || !isLoaded || !userId) { // Clerk check removed
    if (!isScriptLoaded || !userId) {
      console.error('Script not loaded or user not provided');
      return;
    }

    try {
      setIsProcessing(true);

      const res = await fetch('/api/payment/createSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId }),
      });

      const resData = await res.json();

      if (!resData.success) {
        throw new Error(resData.error || 'Failed to create subscription');
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        subscription_id: resData.subscription.id,
        name: 'Sommaire AI Pro',
        handler: async (response) => {
          const verifyRes = await fetch('/api/payment/verifySubscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              email,
              userId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setIsProcessing(false);
            window.location.href = '/dashboard';
          } else {
            throw new Error('Verification failed');
          }
        },
        prefill: { email },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Subscription error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleScriptLoad}
        strategy="lazyOnload"
      />
      <button
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 bg-gradient-to-r from-rose-800 to-rose-500 py-2 text-white transition-colors duration-1000 hover:from-rose-500 hover:to-rose-800 disabled:opacity-50"
        onClick={handlePayment}
        disabled={!isScriptLoaded || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Try Now'}
        {!isProcessing && <ArrowRight size={18} />}
      </button>
    </>
  );
}
