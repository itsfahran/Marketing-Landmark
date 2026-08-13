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

const teamImages = [
  { file: 'hero.png', name: 'Farhan Ali' },
  { file: 'osman.png', name: 'Osman' },
  { file: 'fareed.png', name: 'Fareed Ahmed' },
  { file: 'maria.png', name: 'Neha Naz / Maria' },
  { file: 'ayesha.png', name: 'Ayesha Zulfiqar' },
];

async function uploadImages() {
  console.log('🚀 Starting image upload to Supabase Storage...\n');

  const urls = {};

  for (const img of teamImages) {
    const filePath = path.join(IMAGES_DIR, img.file);
    const fileName = `team/${img.file}`;

    try {
      // Read file
      const fileData = fs.readFileSync(filePath);
      console.log(`📤 Uploading ${img.file}...`);

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

      urls[img.file] = publicUrlData.publicUrl;
      console.log(`✅ ${img.name}: ${publicUrlData.publicUrl}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${img.file}:`, error.message);
    }
  }

  // Generate updated SQL
  generateSQL(urls);
}

function generateSQL(urls) {
  console.log('\n' + '='.repeat(80));
  console.log('📋 UPDATE SEED SQL - Copy and run in Supabase SQL Editor');
  console.log('='.repeat(80) + '\n');

  const sql = `-- Update Team Members with Supabase CDN URLs
DELETE FROM about_page_team;

INSERT INTO about_page_team (name, role, image_url, sort_order) VALUES
('Farhan Ali', 'Professional SEO Expert', '${urls['hero.png']}', 0),
('Osman', 'Saas App Developer', '${urls['osman.png']}', 1),
('Fareed Ahmed', 'Off-Page SEO Specialist', '${urls['fareed.png']}', 2),
('Neha Naz', 'Support Assistant', '${urls['maria.png']}', 3),
('Ayesha Zulfiqar', 'Web Developer', '${urls['ayesha.png']}', 4),
('Maria', 'Content Writer', '${urls['maria.png']}', 5);`;

  console.log(sql);
  console.log('\n' + '='.repeat(80) + '\n');

  // Save to file
  fs.writeFileSync(
    path.join(__dirname, 'TEAM_IMAGES_UPDATE.sql'),
    sql,
    'utf-8'
  );
  console.log('💾 Saved to: TEAM_IMAGES_UPDATE.sql\n');
}

uploadImages().catch(console.error);
