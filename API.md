# API Documentation

This document describes the API endpoints available in the AI Content Optimizer platform.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

Currently, the API uses session-based authentication via NextAuth.js. Future versions will include API key authentication for programmatic access.

## Endpoints

### Content Analysis

Analyze content and get SEO recommendations.

#### `POST /api/analyze`

**Description**: Analyzes content and returns SEO metrics, readability scores, and AI-powered suggestions.

**Request Body**:
```json
{
  "content": "Your content text here...",
  "targetKeyword": "optional keyword" // Optional
}
```

**Request Headers**:
```
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "success": true,
  "analysis": {
    "seoScore": 75,
    "readabilityScore": 68.5,
    "keywordDensity": 2.1,
    "wordCount": 450,
    "suggestions": [
      "Consider expanding content to 600+ words for better rankings.",
      "Good keyword density for \"SEO\": 2.10%"
    ],
    "issues": [
      "Content readability is difficult. Simplify sentences and use shorter words."
    ],
    "strengths": [
      "Good content length.",
      "Content uses headings for better structure."
    ],
    "aiSuggestions": {
      "improvements": [
        "Add more specific examples to support your main points",
        "Include relevant statistics or data to strengthen claims",
        "Break up long paragraphs for better readability"
      ],
      "keywordSuggestions": [
        "search engine optimization",
        "content marketing",
        "digital marketing",
        "SEO strategy"
      ],
      "structureRecommendations": [
        "Add an introduction paragraph to set context",
        "Use bullet points for lists of items",
        "Include a conclusion to summarize key points"
      ],
      "competitorInsights": [
        "Top-ranking content typically exceeds 1,500 words",
        "Successful articles include multiple H2 and H3 headings",
        "High-performing content often includes visual elements"
      ]
    }
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Content is required and must be a string"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to analyze content"
}
```

**Example Request (cURL)**:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "SEO optimization is crucial for modern digital marketing...",
    "targetKeyword": "SEO optimization"
  }'
```

**Example Request (JavaScript)**:
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'Your content here...',
    targetKeyword: 'SEO',
  }),
});

const data = await response.json();
console.log(data.analysis);
```

**Example Request (Python)**:
```python
import requests

url = "http://localhost:3000/api/analyze"
payload = {
    "content": "Your content here...",
    "targetKeyword": "SEO"
}

response = requests.post(url, json=payload)
data = response.json()
print(data["analysis"])
```

## Response Fields

### Analysis Object

| Field | Type | Description |
|-------|------|-------------|
| `seoScore` | number | Overall SEO score (0-100) |
| `readabilityScore` | number | Flesch Reading Ease score (0-100) |
| `keywordDensity` | number | Keyword density percentage |
| `wordCount` | number | Total word count |
| `suggestions` | array | List of improvement suggestions |
| `issues` | array | List of problems found |
| `strengths` | array | List of content strengths |
| `aiSuggestions` | object | AI-powered recommendations (optional) |

### AI Suggestions Object

| Field | Type | Description |
|-------|------|-------------|
| `improvements` | array | General content improvements |
| `keywordSuggestions` | array | Related keyword suggestions |
| `structureRecommendations` | array | Content structure tips |
| `competitorInsights` | array | Competitive analysis insights |

## Score Interpretation

### SEO Score (0-100)
- **80-100**: Excellent - Content is well-optimized
- **60-79**: Good - Minor improvements needed
- **40-59**: Fair - Moderate improvements needed
- **0-39**: Poor - Significant improvements needed

### Readability Score (0-100)
- **90-100**: Very Easy - 5th grade level
- **80-89**: Easy - 6th grade level
- **70-79**: Fairly Easy - 7th grade level
- **60-69**: Standard - 8th & 9th grade
- **50-59**: Fairly Difficult - 10th to 12th grade
- **30-49**: Difficult - College level
- **0-29**: Very Difficult - College graduate level

### Keyword Density
- **0.5-3%**: Optimal range
- **< 0.5%**: Too low, increase keyword usage
- **> 3%**: Too high, risk of keyword stuffing

## Rate Limits

Current rate limits (will be enforced in future versions):

| Plan | Requests/Hour | Daily Limit |
|------|---------------|-------------|
| Starter | 100 | 50/month |
| Professional | 500 | 200/month |
| Enterprise | Unlimited | Unlimited |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server issue |

## Future Endpoints

The following endpoints are planned for future releases:

### `GET /api/analyses`
Retrieve analysis history for the authenticated user.

### `GET /api/analyses/:id`
Retrieve a specific analysis by ID.

### `DELETE /api/analyses/:id`
Delete an analysis.

### `POST /api/compare`
Compare content with competitors.

### `GET /api/keywords/suggestions`
Get keyword suggestions for a topic.

### `POST /api/content/generate`
Generate AI content based on requirements.

## Webhooks

### Stripe Webhooks

The platform receives webhooks from Stripe for subscription events.

#### `POST /api/webhooks/stripe`

Handles the following events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## SDK (Coming Soon)

We're working on official SDKs:
- JavaScript/TypeScript
- Python
- Ruby
- PHP

## Support

For API support:
- Documentation: [GitHub Wiki](https://github.com/jonastrance/ai-content-optimizer-saas/wiki)
- Issues: [GitHub Issues](https://github.com/jonastrance/ai-content-optimizer-saas/issues)
- Email: api@seooptimizerpro.com

## Changelog

### v1.0.0 (Current)
- Initial API release
- Content analysis endpoint
- Basic SEO metrics
- AI-powered suggestions
- Readability scoring

---

For more information, visit our [developer portal](https://developers.seooptimizerpro.com) (coming soon).
