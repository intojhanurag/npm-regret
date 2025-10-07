import chalk from 'chalk';
import { aiEnabled } from './ai-helper.js';

export function printReport(cwd, results, feedback) {
  const { unused, missing, outdated } = results;
  const hasIssues = (unused.length + missing.length + outdated.length) > 0;

  console.log(chalk.bold.cyan('npm-regret – AI-powered dependency analyzer'));
  console.log(chalk.gray(`Scanning: ${cwd}`));
  console.log('');

  if (unused.length) {
    console.log(chalk.yellow.bold('Unused dependencies:'));
    for (const name of unused) console.log('  •', chalk.yellow(name));
    console.log('');
  }
  if (missing.length) {
    console.log(chalk.red.bold('Missing dependencies:'));
    for (const name of missing) console.log('  •', chalk.red(name));
    console.log('');
  }
  if (outdated.length) {
    console.log(chalk.magenta.bold('Outdated dependencies:'));
    for (const row of outdated) console.log('  •', chalk.magenta(`${row.name} ${row.current} → ${row.latest}`));
    console.log('');
  }

  if (!hasIssues) {
    console.log(chalk.green('No regrets detected. Your deps look good!'));
  }

  if (feedback) {
    console.log('');
    console.log(chalk.bold('AI feedback:'));
    console.log(feedback);
  }
  if (!feedback) {
    console.log('');
    console.log(chalk.bold('AI feedback:'));
    if (aiEnabled()) {
      console.log(chalk.gray('No AI quip available right now. Try again later.'));
    } else {
      console.log(chalk.gray('Set GROQ_API_KEY to enable AI feedback.'));
    }
  }
}
