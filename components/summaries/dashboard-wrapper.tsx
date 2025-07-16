'use client';

import { useState } from 'react';
import SummaryCard from './summary-card';
import { Summary } from '@/types/summary';

type Props = {
  summaries: Summary[];
};

export default function DashboardWrapper({ summaries }: Props) {
  const [localSummaries, setLocalSummaries] = useState<Summary[]>(summaries);

  const handleDelete = (id: string) => {
    setLocalSummaries(prev => prev.filter(summary => summary.id !== id));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
      {localSummaries.map(summary => (
        <SummaryCard key={summary.id} summary={summary} onDelete={handleDelete} />
      ))}
    </div>
  );
}
