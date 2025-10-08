import Groq from 'groq-sdk';

export function aiEnabled() {
  return Boolean(process.env.GROQ_API_KEY);
}

function buildPrompt(summary) {
  const totalIssues = summary.unused.length + summary.missing.length + summary.outdated.length;
  return [
    'You are npm-regret, a witty but helpful CLI reviewer.',
    `Project has ${totalIssues} potential issues.`,
    summary.unused.length ? `Unused: ${summary.unused.join(', ')}` : 'Unused: none',
    summary.missing.length ? `Missing: ${summary.missing.join(', ')}` : 'Missing: none',
    summary.outdated.length ? `Outdated: ${summary.outdated.map(o=>`${o.name} ${o.current}->${o.latest}`).join(', ')}` : 'Outdated: none',
    'Give concise, funny, constructive advice. Include actionable next steps.',
  ].join('\n');
}

export async function getGroqFeedback(summary) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  const groq = new Groq({ apiKey });
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are npm-regret, a snarky but kind code reviewer. Keep output short.' },
        { role: 'user', content: buildPrompt(summary) },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });
    return completion.choices?.[0]?.message?.content?.trim() || null;
  } catch (_) {
    return null;
  }
}

