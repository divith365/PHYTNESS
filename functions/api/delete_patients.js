export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const { patient_ids } = payload;

    if (!patient_ids || !Array.isArray(patient_ids) || patient_ids.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid patient_ids array" }), { status: 400 });
    }

    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    // Use Supabase 'in' operator to delete multiple IDs at once
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=in.(${patient_ids.map(id => encodeURIComponent(id)).join(',')})`, {
      method: 'DELETE',
      headers: headers
    });

    if (!delRes.ok) {
      const errData = await delRes.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to delete patients" }), { status: delRes.status });
    }

    return new Response(JSON.stringify({ success: true, count: patient_ids.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
