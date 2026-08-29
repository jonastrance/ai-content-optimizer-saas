import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { getAIContentSuggestions } from '@/lib/openai-service';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, targetKeyword } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
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
