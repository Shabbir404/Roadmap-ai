import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse .env file
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://psvhchowinzflxxisere.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!SUPABASE_ANON_KEY);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('Fetching roadmaps...');
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching roadmaps:', error);
  } else {
    console.log('Fetched roadmaps count:', data.length);
    console.log('Fetched roadmaps:', data);
  }

  if (data && data.length > 0) {
    console.log('Columns in roadmaps table:', Object.keys(data[0]));
  } else {
    console.log('No roadmaps found in the table.');
  }

  // Let's check progress table columns too
  const { data: progData, error: progErr } = await supabase.from('progress').select('*').limit(1);
  console.log('Progress check:', { data: progData, error: progErr });
  if (progData && progData.length > 0) {
      console.log('Columns in progress table:', Object.keys(progData[0]));
  }
}

run();
