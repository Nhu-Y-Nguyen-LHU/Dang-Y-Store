const fs = require('fs');
const lines = fs.readFileSync('src/data/products.ts', 'utf8').split('\n');
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/id:\s*'(mdny-\d+)'/);
  if (idMatch) {
    currentId = idMatch[1];
  }
  
  if (currentId && lines[i].includes('images: [')) {
    lines[i] = lines[i].replace(/images:\s*\[.*?\]/, `images: ['/images/products/${currentId}_v2.jpg']`);
    currentId = null;
  }
}
fs.writeFileSync('src/data/products.ts', lines.join('\n'));
console.log('Successfully updated images without breaking variants!');
