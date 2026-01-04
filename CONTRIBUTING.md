# Contributing to AI Content Optimizer

Thank you for your interest in contributing to the AI Content Optimizer! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature suggestions are welcome! Please include:
- Clear use case
- Expected behavior
- Why this would be valuable
- Any implementation ideas

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/jonastrance/ai-content-optimizer-saas.git
   cd ai-content-optimizer-saas
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   npm run build
   npm run dev
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- OpenAI API key (for testing AI features)

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/jonastrance/ai-content-optimizer-saas.git
   cd ai-content-optimizer-saas
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use descriptive component names

### File Organization
```
app/           # Next.js app router pages
├── api/       # API routes
├── (routes)/  # Page routes
components/    # Reusable components
lib/           # Utility functions
prisma/        # Database schema
```

### Naming Conventions
- Components: `PascalCase` (e.g., `ContentAnalyzer.tsx`)
- Functions: `camelCase` (e.g., `calculateScore`)
- Files: `kebab-case` for pages (e.g., `content-analysis.tsx`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_WORD_COUNT`)

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Max line length: 100 characters

## Testing

Before submitting a PR:

1. **Build Test**
   ```bash
   npm run build
   ```

2. **Manual Testing**
   - Test all affected features
   - Check responsive design
   - Verify error handling

3. **Type Checking**
   - Ensure TypeScript compiles without errors

## Commit Messages

Follow the conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(analyzer): add sentiment analysis
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## Project Structure

```
ai-content-optimizer-saas/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Utilities
│   ├── seo-analyzer.ts    # SEO analysis logic
│   ├── openai-service.ts  # OpenAI integration
│   └── pricing.ts         # Pricing configuration
├── prisma/               # Database
│   └── schema.prisma     # Prisma schema
├── public/               # Static files
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md            # Documentation
```

## Key Features to Know

### SEO Analysis Engine
- Location: `lib/seo-analyzer.ts`
- Calculates SEO score, readability, keyword density
- Pure functions for easy testing

### AI Integration
- Location: `lib/openai-service.ts`
- Uses OpenAI GPT-4 API
- Includes fallback handling

### Content Analysis API
- Location: `app/api/analyze/route.ts`
- POST endpoint for content analysis
- Returns JSON with analysis results

## What to Contribute

### High Priority
- [ ] Additional SEO metrics
- [ ] More AI-powered features
- [ ] Enhanced competitor analysis
- [ ] Performance optimizations
- [ ] Test coverage

### Medium Priority
- [ ] Additional authentication providers
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Content history
- [ ] Export functionality

### Low Priority
- [ ] UI/UX improvements
- [ ] Documentation improvements
- [ ] Code refactoring
- [ ] Additional examples

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review documentation

## License

By contributing, you agree that your contributions will be licensed under the project's ISC License.

---

Thank you for contributing! 🙏
