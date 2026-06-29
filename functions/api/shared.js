export const getSupabaseConfig = (env) => {
  const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';
  
  return {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  };
};

export async function logAudit(env, payload) {
  const { SUPABASE_URL, headers } = getSupabaseConfig(env);
  
  // payload: { hospital_id, user_type, user_id, action, target_type, target_id, details }
  await fetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
}
