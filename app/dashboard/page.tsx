'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Target,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface AnalysisResult {
  seoScore: number;
  readabilityScore: number;
  keywordDensity: number;
  wordCount: number;
  suggestions: string[];
  issues: string[];
  strengths: string[];
  aiSuggestions?: {
    improvements: string[];
    keywordSuggestions: string[];
    structureRecommendations: string[];
    competitorInsights: string[];
  };
}

export default function DashboardPage() {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert('Please enter some content to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetKeyword: targetKeyword.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SEO Optimizer Pro</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/history" className="text-gray-600 hover:text-gray-900">
                History
              </Link>
              <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
              <div className="pl-6 border-l">
                <Link 
                  href="/" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link href="/dashboard" className="text-blue-600 font-medium px-4 py-2">
                  Dashboard
                </Link>
                <Link href="/dashboard/history" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  History
                </Link>
                <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900 px-4 py-2">
                  Settings
                </Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-4 py-2 border-t pt-4">
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Optimizer</h1>
          <p className="text-gray-600">
            Analyze your content in real-time and get AI-powered suggestions to improve SEO performance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Keyword Input */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Keyword (Optional)
              </label>
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g., SEO optimization"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Your Content
                </label>
                <span className="text-sm text-gray-500">
                  {content.trim().split(/\s+/).filter(w => w.length > 0).length} words
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or type your content here..."
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !content.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Analyze Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-1 space-y-6">
            {analysis ? (
              <>
                {/* Score Cards */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Performance Scores
                  </h3>
                  
                  <div className="space-y-4">
                    {/* SEO Score */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">SEO Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.seoScore)}`}>
                          {analysis.seoScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            analysis.seoScore >= 80 ? 'bg-green-500' :
                            analysis.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.seoScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Readability Score */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Readability</span>
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                          {Math.round(analysis.readabilityScore)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            analysis.readabilityScore >= 80 ? 'bg-green-500' :
                            analysis.readabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, analysis.readabilityScore)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Keyword Density */}
                    {targetKeyword && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Keyword Density</span>
                          <span className="text-lg font-bold text-gray-900">
                            {analysis.keywordDensity.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Optimal range: 0.5% - 3%
                        </p>
                      </div>
                    )}

                    {/* Word Count */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Word Count</span>
                        <span className="text-lg font-bold text-gray-900">
                          {analysis.wordCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-800 flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Issues
                    </h3>
                    <ul className="space-y-2">
                      {analysis.issues.map((issue, index) => (
                        <li key={index} className="text-sm text-red-800 flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-yellow-800 flex items-start">
                          <Lightbulb className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Suggestions */}
                {analysis.aiSuggestions && (
                  <>
                    {analysis.aiSuggestions.improvements.length > 0 && (
                      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                          <Sparkles className="h-5 w-5 mr-2" />
                          AI Improvements
                        </h3>
                        <ul className="space-y-2">
                          {analysis.aiSuggestions.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-blue-800 flex items-start">
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.aiSuggestions.keywordSuggestions.length > 0 && (
                      <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                        <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Related Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.aiSuggestions.keywordSuggestions.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.aiSuggestions.competitorInsights.length > 0 && (
                      <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Competitor Insights
                        </h3>
                        <ul className="space-y-2">
                          {analysis.aiSuggestions.competitorInsights.map((insight, index) => (
                            <li key={index} className="text-sm text-indigo-800 flex items-start">
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Enter your content and click "Analyze Content" to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
