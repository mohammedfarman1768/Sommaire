import BgGradient from '@/components/common/bg-gradient';
import EmptySummaryState from '@/components/summaries/empty-summary-state';
import DashboardWrapper from '@/components/summaries/dashboard-wrapper'; // ✅ updated
import { Button } from '@/components/ui/button';
import { getSummaries } from '@/lib/summaries';
import { currentUser } from '@clerk/nextjs/server';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { hasReachedUploadLimit } from '@/lib/user';
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from '@/components/common/motion-wrapper';
import { itemVariants } from '@/utils/constants';
import { Summary } from '@/types/summary';

export default async function Page(): Promise<React.JSX.Element> {
  const user = await currentUser();

  if (!user?.id) {
    return redirect('/sign-in');
  }

  const summaries: Summary[] = await getSummaries(user.id);
  const hasReachedLimit: boolean = await hasReachedUploadLimit(user.id);

  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="container mx-auto flex flex-col gap-4"
      >
        <div className="px-2 py-12 sm:py-24">
          <div className="mb-8 flex justify-between gap-4">
            <div className="flex flex-col gap-2">
              <MotionH1
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent"
              >
                Your Summaries
              </MotionH1>
              <MotionP
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true }}
                className="text-gray-600"
              >
                Transform your PDFs into concise, actionable insights
              </MotionP>
            </div>
            {!hasReachedLimit && (
              <MotionDiv
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="self-start"
              >
                <Button
                  variant="link"
                  className="group bg-linear-to-r from-rose-500 to-rose-700 transition-all duration-200 hover:scale-105 hover:from-rose-600 hover:to-rose-800 hover:no-underline"
                >
                  <Link href="/upload" className="flex items-center text-white">
                    <Plus className="mr-2 h-5 w-5" /> New Summary
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>

          {hasReachedLimit && (
            <MotionDiv
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800">
                <p className="flex gap-1 text-sm">
                  You've reached the limit of 5 uploads on the Basic plan. Please delete some summaries to make room for new ones or{' '}
                  <Link className="flex items-center justify-between" href="/#pricing">
                    <span className="font-bold underline">upgrade to Pro</span>
                    <ArrowRight size={18} />
                  </Link>
                </p>
              </div>
            </MotionDiv>
          )}

          {summaries.length === 0 ? (
            <EmptySummaryState />
          ) : (
            <DashboardWrapper summaries={summaries} /> // ✅ this ensures delete updates UI
          )}
        </div>
      </MotionDiv>
    </main>
  );
}
