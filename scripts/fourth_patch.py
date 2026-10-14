from pathlib import Path
import re

p = Path('index.html')
s = p.read_text()

new = '''function countMatchesFlexible(givenList, answerList){
  const given = givenList.map(normalizeAnswerText).filter(Boolean);
  const accepted = answerList.map(normalizeAnswerText).filter(Boolean);
  const phraseMatch = (left, right) => {
    if(!left || !right) return false;
    if(left === right) return true;
    const shorter = left.length <= right.length ? left : right;
    const longer = left.length <= right.length ? right : left;
    if(!shorter.includes(' ') && shorter.length < 4) return false;
    return (` ${longer} `).includes(` ${shorter} `);
  };
  const concepts=[];
  accepted.forEach(a=>{
    const existing=concepts.find(group=>group.some(v=>phraseMatch(a,v)));
    if(existing) existing.push(a); else concepts.push([a]);
  });
  const usedGiven=new Set();
  let matches=0;
  concepts.forEach(group=>{
    for(let i=0;i<given.length;i++){
      if(usedGiven.has(i)) continue;
      if(group.some(a=>phraseMatch(given[i],a))){
        usedGiven.add(i);
        matches++;
        break;
      }
    }
  });
  return matches;
}'''

s2, n = re.subn(r'function countMatchesFlexible\(givenList, answerList\)\{.*?\n\}', new, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit(f'countMatchesFlexible replacements: {n}')

old = "return (q.answers || []).map(normalizeAnswerText).some(ans=>clean.includes(ans) || ans.includes(clean));"
repl = "return countMatchesFlexible([clean], q.answers || []) >= 1;"
if old in s2:
    s2 = s2.replace(old, repl, 1)
elif repl not in s2:
    raise SystemExit('single-answer matcher not found')

p.write_text(s2)
