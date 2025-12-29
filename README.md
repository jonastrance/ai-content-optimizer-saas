# AI Content Optimizer - SaaS Platform

An AI-powered SEO content optimization platform designed for agencies and marketing teams. Provides real-time analysis, competitor insights, and actionable recommendations to create content that ranks.

## 🚀 Features

### Core Features
- **Real-Time SEO Analysis**: Instant feedback on content quality with live scoring
- **AI-Powered Suggestions**: Smart recommendations using OpenAI GPT-4
- **Keyword Optimization**: Track density and get placement suggestions
- **Readability Scoring**: Flesch-Kincaid readability analysis
- **Competitor Insights**: AI-driven competitive analysis
- **Performance Analytics**: Track content performance over time

### SaaS Features
- **Multiple Pricing Tiers**: $50/mo Starter, $150/mo Professional, $500/mo Enterprise
- **User Authentication**: Secure authentication with NextAuth.js
- **Usage Tracking**: Monitor analysis limits per plan
- **Subscription Management**: Stripe integration for payments
- **Role-Based Access**: User and admin roles

## 💻 Tech Stack

- **Framework**: Next.js 16.1 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4.0
- **AI Integration**: OpenAI GPT-4 API
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/jonastrance/ai-content-optimizer-saas.git
cd ai-content-optimizer-saas
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/seo_optimizer?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
ai-content-optimizer-saas/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── analyze/          # Content analysis endpoint
│   ├── auth/                 # Authentication pages
│   │   ├── signin/           # Sign in page
│   │   └── signup/           # Sign up page
│   ├── dashboard/            # Dashboard pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/               # Reusable components
├── lib/                      # Utility libraries
│   ├── seo-analyzer.ts       # SEO analysis engine
│   ├── openai-service.ts     # OpenAI integration
│   └── pricing.ts            # Pricing plans config
├── prisma/                   # Database schema
│   └── schema.prisma         # Prisma schema
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🎯 Usage

### Content Analysis

1. Navigate to the Dashboard
2. Enter your target keyword (optional)
3. Paste or type your content
4. Click "Analyze Content"
5. Review the analysis results:
   - SEO Score
   - Readability Score
   - Keyword Density
   - Issues & Suggestions
   - AI-powered improvements
   - Related keywords
   - Competitor insights

### SEO Scoring Algorithm

The platform analyzes multiple factors:
- **Word Count**: 300+ words recommended
- **Readability**: Flesch Reading Ease score
- **Keyword Density**: 0.5-3% optimal range
- **Content Structure**: Headings and formatting
- **Overall Score**: 0-100 based on combined factors

## 💰 Pricing Plans

| Plan | Price | Analyses/Month | Features |
|------|-------|----------------|----------|
| **Starter** | $50 | 50 | Basic insights, Email support |
| **Professional** | $150 | 200 | Advanced insights, Priority support, Templates |
| **Enterprise** | $500 | Unlimited | Premium insights, 24/7 support, API access |

All plans include:
- Real-time SEO scoring
- AI-powered suggestions
- 14-day free trial
- No credit card required

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The application can be deployed to any platform supporting Next.js:
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## 🔐 Security

- Environment variables for sensitive data
- Secure authentication with NextAuth.js
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforcement in production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@seooptimizerpro.com or open an issue on GitHub.

## 🎨 Screenshots

### Landing Page
Professional landing page with clear value proposition and pricing tiers.

### Dashboard
Real-time content analysis with AI-powered suggestions and comprehensive SEO metrics.

### Analysis Results
Detailed breakdown of SEO score, readability, keyword density, and actionable recommendations.

---

Built with ❤️ for agencies and marketing teams

