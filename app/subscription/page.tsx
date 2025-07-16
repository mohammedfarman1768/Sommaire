import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSubscriptionDetails, getLastPayment } from '@/lib/subscription';
import { currentUser } from '@clerk/nextjs/server';
import { CheckIcon } from 'lucide-react';
import { pricingPlans } from '@/utils/constants';
import CancelButton from '@/components/subscription/cancel-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SubscriptionPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect('/sign-in');
  }

  const subscriptionDetails = await getSubscriptionDetails(user.id);
  const lastPayment = await getLastPayment(user.id);
  const status = subscriptionDetails?.status;

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-6 text-3xl font-bold">Subscription Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {status === 'subscribed' ? 'Pro' : 'Basic'} Plan
              </CardTitle>
              <CardDescription>
                {status === 'subscribed' ? 'Billed monthly' : 'Free Plan'}
              </CardDescription>
            </div>
            <Badge className={status === 'subscribed' ? 'bg-green-600' : 'bg-gray-400'}>
              {status === 'subscribed' ? 'Subscribed' : 'Free'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <InfoRow
              label="Billing cycle"
              value={status === 'subscribed' ? 'Monthly' : 'N/A'}
            />
            <InfoRow
              label="Next billing date"
              value={
                status === 'subscribed' && subscriptionDetails?.nextBillingDate
                  ? formatDate(subscriptionDetails.nextBillingDate)
                  : 'N/A'
              }
            />
            <InfoRow
              label="Last payment"
              value={
                lastPayment
                  ? formatDate(new Date(lastPayment.updated_at))
                  : 'N/A'
              }
            />
            <InfoRow label="Amount" value="₹ 200/month" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-6">
          {status === 'subscribed' ? (
            <CancelButton userId={user.id} />
          ) : (
            <Link href="/#pricing">
              <Button variant="destructive">Subscribe</Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Benefits</CardTitle>
          <CardDescription>What's included in your Premium Plan</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 pt-2">
            {pricingPlans[1].items.map((item, idx) => (
              <li className="flex items-center gap-2" key={idx}>
                <CheckIcon size={18} className="text-green-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Reusable billing info row
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
