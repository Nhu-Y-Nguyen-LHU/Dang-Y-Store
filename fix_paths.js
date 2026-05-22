const fs = require('fs');

let code = fs.readFileSync('src/data/products.ts', 'utf8');

// The file currently has images: ['/images/products/mdny-_v2.jpg'] everywhere.
// We can fix it by using the id field which is correct.
code = code.replace(/id:\s*'([^']+)',([\s\S]*?)images:\s*\[([^\]]+)\]/g, (match, id, middle, oldImage) => {
  return `id: '${id}',${middle}images: ['/images/products/${id}_v2.jpg']`;
});

fs.writeFileSync('src/data/products.ts', code);
console.log('Fixed paths!');
