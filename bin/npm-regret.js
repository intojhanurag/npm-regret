#!/usr/bin/env node
import('../src/index.js').then(m => m.run()).catch(err => {
  console.error(err);
  process.exit(1);
});

