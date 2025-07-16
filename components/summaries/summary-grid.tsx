'use client';

import { useState } from 'react';
import SummaryCard from './summary-card';
import { Summary } from '@/types/summary';

interface SummaryGridProps {
  initialSummaries: Summary[];
}

export default function SummaryGrid({ initialSummaries }: SummaryGridProps) {
  const [summaries, setSummaries] = useState(initialSummaries);

  const handleDelete = (id: string) => {
    setSummaries(prev => prev.filter(s => s.id !== id));
  };

  if (summaries.length === 0) {
    return (
      <div className="mt-8 text-center text-sm text-gray-500">
        All summaries deleted.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
      {summaries.map((summary) => (
        <SummaryCard key={summary.id} summary={summary} onDelete={handleDelete} />
      ))}
    </div>
  );
}
