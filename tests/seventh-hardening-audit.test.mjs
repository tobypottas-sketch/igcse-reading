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

const ctx = {};
vm.createContext(ctx);
vm.runInContext([
  extractFunction('normalizeAnswerText'),
  extractFunction('countMatchesFlexible'),
  extractFunction('isCorrect')
].join('\n'), ctx);

test('Reading free-text scoring rejects incomplete fragments of a longer accepted answer', () => {
  const location = { kind:'single', answers:['behind westfield library'] };
  const reason = { kind:'single', answers:['students asked for more hands-on science activities'] };
  assert.equal(ctx.isCorrect(location, 'behind'), false);
  assert.equal(ctx.isCorrect(location, 'behind westfield'), false);
  assert.equal(ctx.isCorrect(reason, 'students'), false);
  assert.equal(ctx.isCorrect(reason, 'students asked'), false);
});

test('Reading still accepts explicit short alternatives from the answer bank', () => {
  const who = { kind:'single', answers:['teenagers','younger people'] };
  const item = { kind:'single', answers:['benches','a bench','seating','benches for families'] };
  assert.equal(ctx.isCorrect(who, 'teenagers'), true);
  assert.equal(ctx.isCorrect(item, 'seating'), true);
});
