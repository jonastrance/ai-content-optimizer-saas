import { describe, it, expect } from 'vitest';
import { analyzeSEO } from './seo-analyzer';

describe('analyzeSEO', () => {
  it('should add an issue when content has no headings', () => {
    const content = 'This is a simple paragraph without any headings. It just contains some text that we want to analyze. We need to make sure that the analyzer correctly identifies that there are no headings in this text. ' +
                    'Let us add some more words so the word count is reasonable. This ensures we are testing the specific edge case without tripping other issues. A few more words to be safe.';
    const result = analyzeSEO(content);

    expect(result.issues).toContain('No headings found. Use H1, H2, H3 tags to structure content.');
  });
});
