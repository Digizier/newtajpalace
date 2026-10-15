import { createClient } from '@supabase/supabase-js';

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().replace(/^["']|["']$/g, '');
  return cleaned.startsWith('http://') || cleaned.startsWith('https://');
};

const getValidApiUrl = (envUrl?: string, fallbackUrl: string = 'https://waudxkllolpvmeiwlbaz.supabase.co'): string => {
  if (isValidHttpUrl(envUrl)) {
    return envUrl!.trim().replace(/^["']|["']$/g, '');
  }
  return fallbackUrl;
};

const supabaseUrl = getValidApiUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://waudxkllolpvmeiwlbaz.supabase.co'
);

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdWR4a2xsb2xwdm1laXdsYmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODI1MDYsImV4cCI6MjEwNzY1ODUwNn0.VOdXsbtDQowAxxnQxiq6vjgjBSKE1_32SXvy-zoeiOk').trim().replace(/^["']|["']$/g, '');

// Browser persistent singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'newtajpalace-portal',
    },
  },
});
