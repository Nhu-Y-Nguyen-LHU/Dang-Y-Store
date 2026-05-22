const fs = require('fs');
const path = require('path');

const products = [{"id":"mdny-001","name":"Diamond Ring"},{"id":"mdny-002","name":"Pearl Necklace"},{"id":"mdny-003","name":"Midnight Wine Silk Scarf"},{"id":"mdny-004","name":"Marquess Leather Handbag"},{"id":"mdny-005","name":"Heritage Gold Bracelet"},{"id":"mdny-006","name":"Velvet Noir Loafers"},{"id":"mdny-007","name":"Celeste Mini Shoulder Bag"},{"id":"mdny-008","name":"Opaline Quartz Necklace"},{"id":"mdny-009","name":"Winter Veil Cashmere Gloves"},{"id":"mdny-010","name":"Velvet Aura High Heels"},{"id":"mdny-011","name":"Aurora Crystal Ring"},{"id":"mdny-012","name":"Rose Noir Silk Scarf"},{"id":"mdny-013","name":"Softline Leather Tote Bag"},{"id":"mdny-014","name":"Heritage Pearl Necklace"},{"id":"mdny-015","name":"Velvet Aura High Heels"},{"id":"mdny-016","name":"Celestine Hoop Earrings"},{"id":"mdny-017","name":"City Line Leather Backpack"},{"id":"mdny-018","name":"Lumi Silk Bracelet"},{"id":"mdny-019","name":"Celeste Orbit Ring"},{"id":"mdny-020","name":"Gilded Veil Gold Ring"},{"id":"mdny-021","name":"Luna Pendant Necklace"},{"id":"mdny-022","name":"Noir Choker Necklace"},{"id":"mdny-023","name":"Halo Stud Earrings"},{"id":"mdny-024","name":"Silk Drop Earrings"},{"id":"mdny-025","name":"Lattice Gold Bracelet"},{"id":"mdny-026","name":"Leather Wrap Bracelet"},{"id":"mdny-027","name":"Atelier Top-Handle Bag"},{"id":"mdny-028","name":"Dusk Hobo Bag"},{"id":"mdny-029","name":"Svelte Clutch Wallet"},{"id":"mdny-030","name":"Mini Crest Folding Wallet"},{"id":"mdny-031","name":"Urban Slate Leather Backpack"},{"id":"mdny-032","name":"Canvas Weekender Backpack"},{"id":"mdny-033","name":"Suede Drift Loafers"},{"id":"mdny-034","name":"Patent Noir Loafers"},{"id":"mdny-035","name":"Satin Linea High Heels"},{"id":"mdny-036","name":"Sculpted Heel High Heels"},{"id":"mdny-037","name":"Leather Loop Flat Shoes"},{"id":"mdny-038","name":"Bow Charm Flat Shoes"},{"id":"mdny-039","name":"Strappy Muse Sandals"},{"id":"mdny-040","name":"Minimal Slide Sandals"},{"id":"mdny-041","name":"Mist Bloom Silk Scarf"},{"id":"mdny-042","name":"Ivory Lines Silk Scarf"},{"id":"mdny-043","name":"Classic Buckle Leather Belt"},{"id":"mdny-044","name":"Slim Edge Leather Belt"},{"id":"mdny-045","name":"Leather Touch Winter Gloves"},{"id":"mdny-046","name":"Cashmere Frost Winter Gloves"},{"id":"mdny-047","name":"Noir Frame Sunglasses"},{"id":"mdny-048","name":"Gold Rim Sunglasses"},{"id":"mdny-049","name":"Minimal Slate Wrist Watch"},{"id":"mdny-050","name":"Rose Tone Wrist Watch"},{"id":"mdny-051","name":"Soft Beret Hat"},{"id":"mdny-052","name":"Dusk Fedora Hat"},{"id":"mdny-053","name":"Pearl Pin Brooch"},{"id":"mdny-054","name":"Crystal Leaf Brooch"}];

const dir = path.join(process.cwd(), 'public', 'images', 'products');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function downloadImage(p) {
  const prompt = `A professional luxury product photography of ${p.name}, elegant soft background, studio lighting, 8k resolution, photorealistic, high-end fashion`;
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=600&nologo=true&seed=${seed}`;
  
  const dest = path.join(dir, p.id + '_v2.jpg');
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return false;
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 2000) return false; // Error JSON or empty
    
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (err) {
    clearTimeout(timeout);
    return false;
  }
}

async function start() {
  console.log('Downloading 54 highly-specific AI images with timeouts...');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    let success = false;
    let retries = 0;
    while (!success && retries < 3) {
      console.log(`Downloading [${i+1}/54]: ${p.name}`);
      success = await downloadImage(p);
      if (!success) {
        retries++;
        console.log(`Retrying ${p.name}...`);
        await sleep(1000);
      }
    }
    
    // Duplicate for variants
    const matches = fs.readdirSync(dir).filter(f => f.startsWith('var-' + p.id.split('-')[1]));
    for (const match of matches) {
      if (fs.existsSync(path.join(dir, p.id + '_v2.jpg'))) {
        fs.copyFileSync(path.join(dir, p.id + '_v2.jpg'), path.join(dir, match));
      }
    }
    await sleep(500); // Small delay to avoid hammering the API
  }
  console.log('Done!');
}

start();
