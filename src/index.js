import { analyzeProject } from './analyzer.js';
import { getGroqFeedback } from './ai-helper.js';
import { printReport } from './reporter.js';

export async function run() {
  const cwd = process.cwd();
  const results = await analyzeProject(cwd);
  let feedback = null;
  try {
    feedback = await getGroqFeedback(results);
  } catch (_) {}
  printReport(cwd, results, feedback);
}


