// Supabase Authentication & Real-Time Security Service
// Supports live Supabase Auth with zero-dependency native fetch + fallback local admin authentication

const LOCAL_ADMIN_EMAIL = 'admin@connectmitraa.edu';
const ALT_ADMIN_EMAIL = 'admin@studyloop.com';
const LOCAL_ADMIN_PASSWORD = 'admin123';

/**
 * Retrieve active Supabase credentials from environment or localStorage
 */
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const savedUrl = localStorage.getItem('studyloop_supabase_url') || '';
  const savedKey = localStorage.getItem('studyloop_supabase_anon_key') || '';

  return {
    url: (savedUrl || envUrl).trim().replace(/\/$/, ''),
    anonKey: (savedKey || envKey).trim()
  };
};

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
};

/**
 * Save user-configured Supabase keys into localStorage
 */
export const saveSupabaseConfig = (url, anonKey) => {
  if (url) localStorage.setItem('studyloop_supabase_url', url.trim());
  else localStorage.removeItem('studyloop_supabase_url');

  if (anonKey) localStorage.setItem('studyloop_supabase_anon_key', anonKey.trim());
  else localStorage.removeItem('studyloop_supabase_anon_key');
};

/**
 * Clear user-configured Supabase keys
 */
export const clearSupabaseConfig = () => {
  localStorage.removeItem('studyloop_supabase_url');
  localStorage.removeItem('studyloop_supabase_anon_key');
};

/**
 * Authenticate Administrator credentials
 * If Supabase is configured, attempts live Supabase auth.
 * Otherwise, falls back to local real-time verification.
 */
export const authenticateAdmin = async (email, password) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const { url, anonKey } = getSupabaseConfig();

  // 1. If Supabase is connected, attempt Supabase Auth REST sign-in
  if (url && anonKey) {
    try {
      const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPass
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // If Supabase returned an error, return error detail
        return {
          success: false,
          error: data.error_description || data.msg || data.message || 'Supabase authentication failed',
          mode: 'supabase'
        };
      }

      // Check user role from metadata or email
      const sbUser = data.user;
      const isAdminRole =
        sbUser?.user_metadata?.role === 'admin' ||
        sbUser?.app_metadata?.role === 'admin' ||
        cleanEmail === LOCAL_ADMIN_EMAIL ||
        cleanEmail === ALT_ADMIN_EMAIL ||
        cleanEmail.startsWith('admin@');

      if (!isAdminRole) {
        return {
          success: false,
          error: 'Access denied: This Supabase account does not have administrator privileges.',
          mode: 'supabase'
        };
      }

      return {
        success: true,
        mode: 'supabase',
        token: data.access_token,
        user: {
          id: sbUser.id,
          email: sbUser.email,
          full_name: sbUser.user_metadata?.full_name || 'Supabase Administrator',
          role: 'admin'
        }
      };
    } catch (err) {
      console.warn('Supabase network connection failed, falling back to local credentials check:', err);
    }
  }

  // 2. Local Fallback Verification (Zero setup required)
  const isMatch =
    (cleanEmail === LOCAL_ADMIN_EMAIL ||
     cleanEmail === ALT_ADMIN_EMAIL ||
     cleanEmail === 'admin') &&
    cleanPass === LOCAL_ADMIN_PASSWORD;

  if (isMatch) {
    return {
      success: true,
      mode: 'local',
      token: 'admin-local-token-' + Date.now(),
      user: {
        id: 'usr_admin',
        email: LOCAL_ADMIN_EMAIL,
        full_name: 'Admin Moderator',
        role: 'admin'
      }
    };
  }

  return {
    success: false,
    error: 'Invalid administrator credentials. Please check the email and password.',
    mode: 'local'
  };
};

export const getAdminSecretSlug = () => {
  const envSlug = import.meta.env.VITE_ADMIN_SECRET_PATH;
  if (envSlug && typeof envSlug === 'string' && envSlug.trim().length > 0) {
    const trimmed = envSlug.trim();
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
  return '/connectmitraa-admin';
};

export const DEMO_ADMIN_CREDENTIALS = {
  email: LOCAL_ADMIN_EMAIL,
  altEmail: ALT_ADMIN_EMAIL,
  password: LOCAL_ADMIN_PASSWORD,
  get secretSlug() {
    return getAdminSecretSlug();
  }
};

