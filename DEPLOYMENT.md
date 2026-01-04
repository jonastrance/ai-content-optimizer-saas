# Deployment Guide

This guide covers deploying the AI Content Optimizer SaaS platform to various hosting providers.

## Prerequisites

Before deploying, ensure you have:

1. **Database**: PostgreSQL database (e.g., Neon, Supabase, Railway)
2. **OpenAI API Key**: From [OpenAI Platform](https://platform.openai.com/)
3. **Stripe Account**: For payment processing
4. **Environment Variables**: All required variables configured

## Environment Variables

Ensure all environment variables are set in your deployment platform:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Vercel Deployment (Recommended)

Vercel provides the best Next.js hosting experience.

### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables
   - Make sure to set them for Production, Preview, and Development

5. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Post-Deployment

1. **Set up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Configure Stripe Webhooks**
   - Add webhook URL: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `customer.subscription.*`, `invoice.*`

## Railway Deployment

Railway is excellent for full-stack applications with databases.

### Steps:

1. **Create Railway Project**
   - Visit [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Note the connection string

3. **Configure Environment Variables**
   - Add all environment variables
   - Use Railway's PostgreSQL URL for `DATABASE_URL`

4. **Deploy**
   - Railway auto-deploys on push

## Render Deployment

### Steps:

1. **Create Web Service**
   - Visit [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository

2. **Configure Service**
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

3. **Add PostgreSQL Database**
   - Create PostgreSQL database
   - Add connection string to environment variables

4. **Deploy**

## Docker Deployment

### Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t seo-optimizer .
docker run -p 3000:3000 --env-file .env seo-optimizer
```

## Database Setup

After deployment, initialize the database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test authentication flow
- [ ] Test content analysis feature
- [ ] Configure Stripe webhooks
- [ ] Set up custom domain
- [ ] Enable HTTPS
- [ ] Configure CDN (if needed)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backup strategy
- [ ] Test email delivery
- [ ] Run security audit

## Monitoring

### Recommended Services

1. **Error Tracking**: Sentry
2. **Analytics**: Vercel Analytics, Google Analytics
3. **Performance**: Vercel Speed Insights
4. **Uptime**: UptimeRobot
5. **Logs**: Vercel Logs, Datadog

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer)
- Consider read replicas for high traffic
- Regular backups

### API Rate Limiting
- Implement Redis for rate limiting
- Use API Gateway (AWS API Gateway, Kong)

### Caching
- Use Redis for session storage
- Implement CDN for static assets
- Cache API responses

### OpenAI API
- Implement request queuing
- Add retry logic with exponential backoff
- Monitor API usage and costs

## Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
**Solution**: Run `npm run build` locally first to catch errors

**Issue**: Prisma client not generated
**Solution**: Add `npx prisma generate` to build command

### Runtime Issues

**Issue**: Database connection fails
**Solution**: Check `DATABASE_URL` format and permissions

**Issue**: OpenAI API fails
**Solution**: Verify API key and check rate limits

**Issue**: 500 errors on API routes
**Solution**: Check server logs and environment variables

## Security Checklist

- [ ] All environment variables are secured
- [ ] HTTPS is enabled
- [ ] Database has strong password
- [ ] API rate limiting is configured
- [ ] CORS is properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this)
- [ ] CSRF tokens for forms

## Backup Strategy

1. **Database Backups**
   - Daily automated backups
   - Test restore process monthly

2. **Code Backups**
   - Git repository (already handled)
   - Tagged releases

3. **Environment Variables**
   - Securely store in password manager
   - Document all variables

## Support

For deployment issues:
- Check [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Review platform-specific documentation
- Open an issue on GitHub

---

Happy Deploying! 🚀
