import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html','utf8');

test('Reading local state is scoped by Hub user namespace',()=>{
  assert.match(html,/hubStorageNamespace/);
  assert.match(html,/storageKey\(/);
  assert.doesNotMatch(html,/localStorage\.getItem\(STORAGE_KEY\)/);
  assert.doesNotMatch(html,/localStorage\.setItem\(STORAGE_KEY/);
});

test('embedded Reading waits for authenticated Hub context before loading state',()=>{
  assert.match(html,/self-study-hub-context/);
  assert.match(html,/window\.parent\s*===\s*window/);
  assert.match(html,/event\.origin\s*!==\s*window\.location\.origin/);
  assert.match(html,/initialiseReadingApp/);
});

test('public Reading has no hard-coded teacher password path',()=>{
  assert.doesNotMatch(html,/TEACHER_PWD/);
  assert.doesNotMatch(html,/NKCS1234/);
  assert.match(html,/hasHubStaffAccess/);
});
