const fs = require('fs');
const https = require('https');
const path = require('path');

const products = [{"id":"mdny-001","name":"Nhẫn Kim Cương"},{"id":"mdny-002","name":"Dây Chuyền Ngọc Trai"},{"id":"mdny-003","name":"Khăn Lụa Midnight Wine"},{"id":"mdny-004","name":"Ví Cầm Tay Da Marquess"},{"id":"mdny-005","name":"Vòng Tay Di sản (Heritage Bracelet)"},{"id":"mdny-006","name":"Loafer Nhung Velvet Noir"},{"id":"mdny-007","name":"Túi Đeo Vai Celeste Mini"},{"id":"mdny-008","name":"Dây Chuyền Thạch Anh Opaline"},{"id":"mdny-009","name":"Găng Tay Cashmere Winter Veil"},{"id":"mdny-010","name":"Giày Cao Gót Velvet Aura"},{"id":"mdny-011","name":"Nhẫn Pha Lê Aurora"},{"id":"mdny-012","name":"Khăn Choàng Lụa Rose Noir"},{"id":"mdny-013","name":"Túi Xách Softline Tote"},{"id":"mdny-014","name":"Vòng Cổ Heritage Pearl"},{"id":"mdny-015","name":"Giày Cao Gót Velvet Aura"},{"id":"mdny-016","name":"Khuyên Tai Celestine Hoop"},{"id":"mdny-017","name":"Balo Da City Line"},{"id":"mdny-018","name":"Vòng Tay Lụa Lumi"},{"id":"mdny-019","name":"Nhẫn Celeste Orbit"},{"id":"mdny-020","name":"Nhẫn Vàng Gilded Veil"},{"id":"mdny-021","name":"Dây Chuyền Luna Pendant"},{"id":"mdny-022","name":"Dây Chuyền Noir Choker"},{"id":"mdny-023","name":"Khuyên Tai Halo Studs"},{"id":"mdny-024","name":"Khuyên Tai Silk Drop"},{"id":"mdny-025","name":"Vòng Tay Lattice"},{"id":"mdny-026","name":"Vòng Tay Leather Wrap"},{"id":"mdny-027","name":"Túi Xách Atelier Top-Handle"},{"id":"mdny-028","name":"Túi Xách Dusk Hobo"},{"id":"mdny-029","name":"Ví Cầm Tay Svelte"},{"id":"mdny-030","name":"Ví Gập Mini Crest"},{"id":"mdny-031","name":"Balo Urban Slate"},{"id":"mdny-032","name":"Balo Canvas Weekender"},{"id":"mdny-033","name":"Giày Lười Suede Drift"},{"id":"mdny-034","name":"Giày Lười Patent Noir"},{"id":"mdny-035","name":"Giày Cao Gót Satin Linea"},{"id":"mdny-036","name":"Giày Cao Gót Sculpted Heel"},{"id":"mdny-037","name":"Giày Bệt Leather Loop"},{"id":"mdny-038","name":"Giày Bệt Bow Charm"},{"id":"mdny-039","name":"Sandal Strappy Muse"},{"id":"mdny-040","name":"Sandal Minimal Slide"},{"id":"mdny-041","name":"Khăn Lụa Mist Bloom"},{"id":"mdny-042","name":"Khăn Lụa Ivory Lines"},{"id":"mdny-043","name":"Thắt Lưng Classic Buckle"},{"id":"mdny-044","name":"Thắt Lưng Slim Edge"},{"id":"mdny-045","name":"Găng Tay Leather Touch"},{"id":"mdny-046","name":"Găng Tay Cashmere Frost"},{"id":"mdny-047","name":"Kính Mát Noir Frame"},{"id":"mdny-048","name":"Kính Mát Gold Rim"},{"id":"mdny-049","name":"Đồng Hồ Minimal Slate"},{"id":"mdny-050","name":"Đồng Hồ Rose Tone"},{"id":"mdny-051","name":"Mũ Beret Soft"},{"id":"mdny-052","name":"Mũ Fedora Dusk"},{"id":"mdny-053","name":"Cài Áo Pearl Pin"},{"id":"mdny-054","name":"Cài Áo Crystal Leaf"}];

const getEngName = (name) => {
  const n = name.toLowerCase();
  if(n.includes('nhẫn')) return 'luxury ring';
  if(n.includes('dây chuyền') || n.includes('vòng cổ')) return 'luxury necklace';
  if(n.includes('vòng tay')) return 'luxury bracelet';
  if(n.includes('khuyên tai')) return 'luxury earrings';
  if(n.includes('khăn')) return 'luxury silk scarf';
  if(n.includes('ví')) return 'luxury leather wallet';
  if(n.includes('túi')) return 'luxury leather handbag';
  if(n.includes('balo')) return 'luxury leather backpack';
  if(n.includes('giày') || n.includes('sandal') || n.includes('loafer') || n.includes('bệt')) return 'luxury fashion shoes';
  if(n.includes('găng tay')) return 'luxury winter gloves';
  if(n.includes('thắt lưng')) return 'luxury leather belt';
  if(n.includes('kính')) return 'luxury sunglasses';
  if(n.includes('đồng hồ')) return 'luxury wrist watch';
  if(n.includes('mũ')) return 'luxury fashion hat';
  if(n.includes('cài áo')) return 'luxury jewelry brooch';
  return 'luxury fashion accessory';
};

const dir = path.join(process.cwd(), 'public', 'images', 'products');

async function downloadImage(p) {
  const englishCategory = getEngName(p.name);
  const prompt = `A professional luxury product photography of a ${englishCategory}, elegant soft background, studio lighting, 8k resolution, photorealistic, high-end fashion, seed ${p.id}`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=600&nologo=true`;
  const dest = path.join(dir, p.id + '.jpg');
  
  // check if we already have a valid image (size > 2KB)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return true; // Already downloaded
  }

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => resolve(false));
      } else {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      }
    }).on('error', () => resolve(false));
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function start() {
  console.log('Downloading 54 AI generated images from Pollinations.ai sequentially...');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    let success = false;
    let retries = 0;
    while (!success && retries < 3) {
      console.log(`Downloading [${i+1}/54]: ${p.name} (try ${retries+1})`);
      await downloadImage(p);
      
      const dest = path.join(dir, p.id + '.jpg');
      if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
        success = true;
      } else {
        retries++;
        console.log(`Rate limited or failed. Waiting 5 seconds before retry...`);
        await sleep(5000);
      }
    }
    // Give Pollinations a small break between successful downloads to avoid IP ban
    await sleep(2000);
  }
  console.log('Done!');
}

start();
