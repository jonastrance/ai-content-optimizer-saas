import { analyzeSEO } from './lib/seo-analyzer';

const text = "This is a simple text. It has multiple sentences! How many words? A lot of words, indeed. ".repeat(1000);

const start = performance.now();
for (let i = 0; i < 1000; i++) {
  analyzeSEO(text, "words");
}
const end = performance.now();
console.log(`Baseline time: ${end - start}ms`);
