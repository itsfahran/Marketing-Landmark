/**
 * Supabase client configuration
 *
 * On the server:
 * - Uses SUPABASE_SERVICE_ROLE_KEY for full access (data fetching, etc.)
 * - Never exposed to browser
 *
 * On the client:
 * - Uses SUPABASE_ANON_KEY (public, safe to expose)
 * - Relies on Row Level Security (RLS) policies for access control
 */

import { createClient } from '@supabase/supabase-js';

let _supabaseClient = null;

// Get env vars - works in both browser and Node.js
function getEnv(key) {
  // Browser (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${key}`];
  }
  // Node.js
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}

// Client-side: use anon key (safe, public) — lazily created
export function getSupabaseClient() {
  if (!_supabaseClient) {
    const url = getEnv('SUPABASE_URL');
    const key = getEnv('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    }

    _supabaseClient = createClient(url, key);
  }
  return _supabaseClient;
}

// Default export for backward compatibility
export const supabaseClient = { _isLazy: true };

// Server-side: use service role key (full access, server-only)
export function getServerSupabaseClient() {
  // Server-side only - use process.env directly
  if (typeof process === 'undefined' || !process.env) {
    throw new Error('getServerSupabaseClient() can only be called server-side');
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  return createClient(url, key);
}

export default supabaseClient;
