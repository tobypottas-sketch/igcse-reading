import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function extractFunction(name){
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} should exist`);
  let i = html.indexOf('{', start);
  let depth = 0;
  for(; i < html.length; i++){
    if(html[i] === '{') depth++;
    else if(html[i] === '}'){
      depth--;
      if(depth === 0) return html.slice(start, i + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

const code = [
  extractFunction('normalizeAnswerText'),
  extractFunction('countMatchesFlexible'),
  extractFunction('isCorrect')
].join('\n');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code, ctx);

test('Reading free-text scoring rejects trivial substring fragments', () => {
  assert.equal(ctx.isCorrect({kind:'single', answers:['a classroom']}, 'a'), false);
  assert.equal(ctx.isCorrect({kind:'single', answers:['performers']}, 'per'), false);
});

test('Reading multi-answer scoring cannot count alternative phrasings as separate concepts', () => {
  const q = {kind:'triple', answers:['seeds','gloves','tools','basic tools']};
  assert.equal(ctx.isCorrect(q, ['seeds','tools','basic tools']), false);
  assert.equal(ctx.isCorrect(q, ['seeds','gloves','basic tools']), true);
});
