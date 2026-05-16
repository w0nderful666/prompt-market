const fs = require("fs");
const path = "D:\\test\\AAA2027\\ewnew\\prompt-market-react\\src\\data\\showcaseData.ts";

let content = fs.readFileSync(path, "utf8");

content += `export const SHOWCASE_CATEGORIES: { key: ShowcaseCategory; label: string }[] = [
  { key: 'daily', label: '\u65E5\u5E38' },
  { key: 'outdoor', label: '\u6237\u5916' },
  { key: 'travel', label: '\u65C5\u884C' },
  { key: 'portrait', label: '\u8096\u50CF' },
  { key: 'street', label: '\u8857\u62CD' },
  { key: 'seasonal', label: '\u5B63\u8282' },
  { key: 'fashion', label: '\u65F6\u5C1A' },
  { key: 'indoor', label: '\u5BA4\u5185' },
  { key: 'product', label: '\u4EA7\u54C1' },
  { key: 'concept', label: '\u6982\u5FF5' }
]

export const SHOWCASE_ENTRIES: ShowcaseEntry[] = [
`;

fs.writeFileSync(path, content, "utf8");
console.log("Categories written successfully");
