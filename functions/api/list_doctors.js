export async function onRequestGet({ env }) {
  try {
    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/doctors?select=id,full_name,specialization,phone`, { headers });
    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || "Failed to fetch doctors" }), { status: res.status });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
