import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.waudxkllolpvmeiwlbaz',
  password: 'jCJ!R&*HwZ%8UAm',
  ssl: { rejectUnauthorized: false }
});

async function setupStorage() {
  await client.connect();
  console.log('Connected to Postgres for storage setup...');

  await client.query(`
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('hotel-media', 'hotel-media', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
    CREATE POLICY "Public Storage Access" ON storage.objects
      FOR ALL USING (bucket_id = 'hotel-media')
      WITH CHECK (bucket_id = 'hotel-media');
  `);

  console.log('Storage bucket hotel-media verified with public access!');
  await client.end();
}

setupStorage().catch(err => {
  console.error('Storage setup error:', err);
  process.exit(1);
});
