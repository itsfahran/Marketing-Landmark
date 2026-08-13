import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

// Load env vars
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET = 'portfolio-images';
const IMAGES_DIR = path.join(__dirname, 'src/assets');

const platformLogos = [
  { file: 'upwork-logo.png', name: 'Upwork' },
  { file: 'fiverr-logo.png', name: 'Fiverr' },
  { file: 'linkedin-logo.png', name: 'LinkedIn' },
];

async function uploadLogos() {
  console.log('🚀 Starting platform logo upload to Supabase Storage...\n');

  const urls = {};

  for (const logo of platformLogos) {
    const filePath = path.join(IMAGES_DIR, logo.file);
    const fileName = `logos/${logo.file}`;

    try {
      // Read file
      const fileData = fs.readFileSync(filePath);
      console.log(`📤 Uploading ${logo.file}...`);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, fileData, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      urls[logo.file] = publicUrlData.publicUrl;
      console.log(`✅ ${logo.name}: ${publicUrlData.publicUrl}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${logo.file}:`, error.message);
    }
  }

  // Generate code snippets
  generateCodeSnippets(urls);
}

function generateCodeSnippets(urls) {
  console.log('\n' + '='.repeat(80));
  console.log('📝 CODE SNIPPETS - Update Testimonials.jsx (About & Home)');
  console.log('='.repeat(80) + '\n');

  const upworkUrl = urls['upwork-logo.png'];
  const fiverrrUrl = urls['fiverr-logo.png'];

  const snippet = `// Update the platform logo img src in Testimonials.jsx:

// Row 1 - Logo Left (Upwork)
<img
  src="${upworkUrl}"
  alt="Upwork"
  title="Upwork"
/>

// Row 2 - Logo Right (Fiverr)
<img
  src="${fiverrrUrl}"
  alt="Fiverr"
  title="Fiverr"
/>`;

  console.log(snippet);

  console.log('\n' + '='.repeat(80));
  console.log('🔗 DIRECT URLs:');
  console.log('='.repeat(80) + '\n');
  console.log(`Upwork: ${upworkUrl}`);
  console.log(`Fiverr: ${fiverrrUrl}`);
  console.log(`LinkedIn: ${urls['linkedin-logo.png']}\n`);

  // Save to file
  fs.writeFileSync(
    path.join(__dirname, 'PLATFORM_LOGOS_URLS.txt'),
    `UPWORK_LOGO=${upworkUrl}\nFIVERR_LOGO=${fiverrrUrl}\nLINKEDIN_LOGO=${urls['linkedin-logo.png']}`,
    'utf-8'
  );
  console.log('💾 Saved to: PLATFORM_LOGOS_URLS.txt\n');
}

uploadLogos().catch(console.error);
