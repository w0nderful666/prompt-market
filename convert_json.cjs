const fs = require("fs");
const jsonPath = "D:\\test\\AAA2027\\ewnew\\prompt-market-react\\entries_data.json";
const tsPath = "D:\\test\\AAA2027\\ewnew\\prompt-market-react\\src\\data\\showcaseData.ts";

// Read the existing header
let tsContent = fs.readFileSync(tsPath, "utf8");
// Remove the trailing opening bracket and add the JSON entries
tsContent = tsContent.replace(/export const SHOWCASE_ENTRIES: ShowcaseEntry\[\] = \[\s*$/, "");

const entries = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

tsContent += "export const SHOWCASE_ENTRIES: ShowcaseEntry[] = [\n";

for (const e of entries) {
  tsContent += "  {\n";
  for (const [key, val] of Object.entries(e)) {
    if (key === "tags") {
      tsContent += `    tags: ${JSON.stringify(val)},\n`;
    } else if (key === "director") {
      tsContent += "    director: {\n";
      for (const [dk, dv] of Object.entries(val)) {
        tsContent += `      ${dk}: '${dv.replace(/'/g, "\\'")}',\n`;
      }
      tsContent += "    },\n";
    } else {
      tsContent += `    ${key}: '${String(val).replace(/'/g, "\\'")}',\n`;
    }
  }
  tsContent += "  },\n";
}

tsContent += "];\n";

fs.writeFileSync(tsPath, tsContent, "utf8");
console.log(`Generated ${entries.length} entries successfully.`);
