import {
  containerVariants,
  itemVariants,
  pricingPlans,
} from '@/utils/constants';
import { MotionDiv, MotionSection } from '../common/motion-wrapper';
import PricingCardBasic from '../pricing/pricing-card-basic';
import PricingCardPro from '../pricing/pricing-card-pro';

export default function PricingSection() {
  const mockEmail = 'test@example.com';
  const mockUserId = 'demo-user';
  const mockPriceId = 'basic_free'; // or 'pro_plan' if you want to simulate upgrade

  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-12 lg:pt-12">
        <MotionDiv
          viewport={{ once: true }}
          variants={itemVariants}
          className="flex w-full items-center justify-center pb-12"
        >
          <h2 className="mb-8 text-xl font-bold text-rose-500 uppercase">
            Pricing
          </h2>
        </MotionDiv>

        <div className="relative flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
          <PricingCardPro
            key="pro"
            {...{
              ...pricingPlans[1],
              price: String(pricingPlans[1].price),
              email: mockEmail,
              userId: mockUserId,
              priceId: mockPriceId,
            }}
          />
          <PricingCardBasic
            key="basic"
            {...{
              ...pricingPlans[0],
              price: String(pricingPlans[0].price),
              paymentLink: pricingPlans[0].paymentLink ?? '',
            }}
          />
        </div>
      </div>
    </MotionSection>
  );
}
