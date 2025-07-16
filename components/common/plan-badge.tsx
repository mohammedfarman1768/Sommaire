import { getPriceId } from '@/lib/user';
import { cn } from '@/lib/utils';
import { pricingPlans } from '@/utils/constants';
import { currentUser } from '@clerk/nextjs/server';
import { Badge } from '../ui/badge';
import { Crown } from 'lucide-react';

export default async function PlanBadge() {
  const user = await currentUser();
  if (!user?.id) return null;

  const priceId = await getPriceId(user.id);
  const planName = pricingPlans.find((plan) => plan.priceId === priceId)?.name ?? 'Free';

  return (
    <div>
      <Badge
        variant="outline"
        className={cn(
          'ml-2 hidden flex-row items-center border-amber-300 bg-linear-to-r from-amber-100 to-amber-200 lg:flex',
          !priceId && 'border-red-300 from-red-100 to-red-200'
        )}
      >
        <Crown
          className={cn(
            'mr-1 h-2 w-3 text-amber-600',
            !priceId && 'text-red-600'
          )}
        />
        {planName}
      </Badge>
    </div>
  );
}
