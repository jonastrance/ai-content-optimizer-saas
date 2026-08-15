import { NextRequest, NextResponse } from 'next/server';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { getAIContentSuggestions } from '@/lib/openai-service';

const MAX_CONTENT_LENGTH = 50000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, targetKeyword } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content exceeds the maximum allowed length of ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Perform basic SEO analysis
    const seoAnalysis = analyzeSEO(content, targetKeyword);

    // Get AI-powered suggestions
    let aiSuggestions;
    try {
      aiSuggestions = await getAIContentSuggestions(content, targetKeyword);
    } catch (error) {
      console.error('AI suggestions failed:', error);
      // Continue without AI suggestions
      aiSuggestions = null;
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...seoAnalysis,
        aiSuggestions,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
