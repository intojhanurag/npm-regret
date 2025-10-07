import { describe, it, expect } from 'vitest';
import { analyzeProject } from '../src/analyzer.js';
import fs from 'fs';
import path from 'path';

describe('analyzeProject', () => {
  it('handles empty project gracefully', async () => {
    const tmp = fs.mkdtempSync(path.join(process.cwd(), 'tmp-empty-'));
    fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'x' }));
    const res = await analyzeProject(tmp);
    expect(res).toHaveProperty('unused');
    expect(res).toHaveProperty('missing');
    expect(res).toHaveProperty('outdated');
  });
});


