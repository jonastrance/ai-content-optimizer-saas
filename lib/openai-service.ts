import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface AIContentSuggestion {
  improvements: string[];
  keywordSuggestions: string[];
  structureRecommendations: string[];
  competitorInsights: string[];
}

export async function getAIContentSuggestions(
  content: string,
  targetKeyword?: string
): Promise<AIContentSuggestion> {
  try {
    const prompt = `You are an expert SEO content optimizer. Analyze the following content and provide specific, actionable recommendations.

Content to analyze:
${content.substring(0, 3000)}

${targetKeyword ? `Target Keyword: ${targetKeyword}` : ''}

Provide your analysis in the following JSON format:
{
  "improvements": ["specific improvement 1", "specific improvement 2", ...],
  "keywordSuggestions": ["related keyword 1", "related keyword 2", ...],
  "structureRecommendations": ["structure tip 1", "structure tip 2", ...],
  "competitorInsights": ["what top-ranking content does 1", "what top-ranking content does 2", ...]
}

Focus on:
1. Content quality and depth
2. Keyword usage and placement
3. Content structure and formatting
4. Readability improvements
5. What makes content rank well in search engines`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO content strategist. Provide detailed, actionable advice in JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const suggestions: AIContentSuggestion = JSON.parse(result);
    return suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Return fallback suggestions if API fails
    return {
      improvements: [
        'Expand content with more detailed explanations',
        'Add relevant examples and case studies',
        'Include data and statistics to support claims',
      ],
      keywordSuggestions: targetKeyword ? [targetKeyword] : ['Focus on your target keywords'],
      structureRecommendations: [
        'Use clear headings (H1, H2, H3) to organize content',
        'Break long paragraphs into shorter, scannable sections',
        'Add bullet points for better readability',
      ],
      competitorInsights: [
        'Top-ranking content typically exceeds 1,500 words',
        'Use multimedia elements like images and videos',
        'Focus on answering user questions comprehensively',
      ],
    };
  }
}

