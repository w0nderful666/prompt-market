const fs = require('fs');
const tsPath = 'D:\\test\\AAA2027\\ewnew\\prompt-market-react\\src\\data\\showcaseData.ts';

let output = '';

function add(id, name, subtitle, tags, category, model, score, dir) {
  const t = JSON.stringify(tags);
  output += `  {\n    id: '${id}',\n    name: '${name}',\n    subtitle: '${subtitle}',\n    tags: ${t},\n    category: '${category}',\n    model: '${model}',\n    score: ${score},\n    director: {\n      model: '${dir.model}',\n      subject: '${dir.subject}',\n      scene: '${dir.scene}',\n      composition: '${dir.composition}',\n      expression: '${dir.expression}',\n      face: '${dir.face}',\n      hair: '${dir.hair}',\n      body: '${dir.body}',\n      clothing: '${dir.clothing}',\n      lighting: '${dir.lighting}',\n      camera: '${dir.camera}',\n      depthOfField: '${dir.depthOfField}',\n      background: '${dir.background}',\n      atmosphere: '${dir.atmosphere}',\n      caption: '${dir.caption}',\n      mustKeep: '${dir.mustKeep}',\n      avoid: '${dir.avoid}',\n      ratio: '${dir.ratio}'\n    }\n  },\n`;
}

function writeOutput() {
  let existing = fs.readFileSync(tsPath, 'utf8');
  // Remove everything from "export const SHOWCASE_ENTRIES" onwards
  const marker = 'export const SHOWCASE_ENTRIES';
  const idx = existing.indexOf(marker);
  if (idx >= 0) {
    existing = existing.substring(0, idx);
  }
  existing += `export const SHOWCASE_ENTRIES: ShowcaseEntry[] = [\n`;
  existing += output;
  existing += `];\n`;
  fs.writeFileSync(tsPath, existing, 'utf8');
  console.log(`Generated file with entries. Output length: ${output.length}`);
}

module.exports = { add, writeOutput };
