export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  stripePriceId?: string;
  features: string[];
  analysisLimit: number; // -1 for unlimited
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 50,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    analysisLimit: 50,
    features: [
      '50 content analyses/month',
      'Real-time SEO scoring',
      'Basic competitor insights',
      'AI-powered suggestions',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 150,
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    analysisLimit: 200,
    popular: true,
    features: [
      '200 content analyses/month',
      'Real-time SEO scoring',
      'Advanced competitor insights',
      'AI-powered suggestions',
      'Content templates',
      'Priority email support',
      'Performance analytics',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 500,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    analysisLimit: -1, // unlimited
    features: [
      'Unlimited analyses',
      'Real-time SEO scoring',
      'Premium competitor insights',
      'AI-powered suggestions',
      'Custom templates',
      '24/7 priority support',
      'Advanced analytics',
      'API access',
    ],
  },
];

export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === planId);
}
