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

const scoringCode = [
  extractFunction('normalizeAnswerText'),
  extractFunction('countMatchesFlexible'),
  extractFunction('isCorrect')
].join('\n');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(scoringCode, ctx);

test('Reading free-text scoring rejects answers that negate the accepted idea', () => {
  const q = { kind:'single', answers:['behind westfield library'] };
  assert.equal(ctx.isCorrect(q, 'not behind westfield library'), false);
  assert.equal(ctx.isCorrect(q, 'never behind westfield library'), false);
});

test('Reading Teacher comment buttons do not interpolate comment text into inline JavaScript', () => {
  const src = extractFunction('renderTeacher');
  assert.doesNotMatch(src, /onclick=.*JSON\.stringify\(c\)/);
  assert.match(src, /createElement\(['"]button['"]\)/);
  assert.match(src, /textContent\s*=\s*c/);
  assert.match(src, /addEventListener\(['"]click['"]/);
});
