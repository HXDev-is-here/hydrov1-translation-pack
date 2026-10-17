import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const en = JSON.parse(readFileSync('languages/en.json', 'utf8')).strings;
const KEY = /^[a-z0-9._-]{1,80}$/;
const errors = [];
const index = [];

for (const file of readdirSync('languages').filter((f) => f.endsWith('.json')).sort()) {
  const code = file.replace('.json', '');
  let data;
  try {
    data = JSON.parse(readFileSync(`languages/${file}`, 'utf8'));
  } catch {
    errors.push(`${file}: invalid JSON`);
    continue;
  }
  if (!/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(code)) errors.push(`${file}: bad language code`);
  if (data._meta?.code !== code) errors.push(`${file}: _meta.code must be "${code}"`);
  if (!data._meta?.name) errors.push(`${file}: _meta.name is required`);
  const strings = data.strings ?? {};
  for (const [k, v] of Object.entries(strings)) {
    if (!KEY.test(k)) errors.push(`${file}: bad key ${k}`);
    else if (!(k in en)) errors.push(`${file}: unknown key ${k}`);
    if (typeof v !== 'string' || v.length > 500) errors.push(`${file}: ${k} must be text up to 500 characters`);
    if (/<[a-z\/!]/i.test(String(v))) errors.push(`${file}: ${k} must not contain HTML`);
    const need = (en[k]?.match(/\{[a-z]+\}/g) ?? []).sort().join();
    const have = (String(v).match(/\{[a-z]+\}/g) ?? []).sort().join();
    if (need !== have) errors.push(`${file}: ${k} must keep the placeholders ${need || '(none)'}`);
  }
  index.push({ code, name: data._meta?.name, native: data._meta?.native ?? data._meta?.name, strings: Object.keys(strings).length, total: Object.keys(en).length });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
writeFileSync('index.json', JSON.stringify({ updated: new Date().toISOString(), languages: index }, null, 2) + '\n');
console.log(`ok: ${index.length} languages`);
