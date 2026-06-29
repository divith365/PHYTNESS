export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const { patient_id, override_role, override_phone, override_pin } = payload;

    if (!patient_id || !override_role || !override_phone || !override_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields. Provide patient_id and override credentials." }), { status: 400 });
    }

    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    // Verify the override credentials
    let authTable = '';
    if (override_role === 'Admin') authTable = 'admins';
    else if (override_role === 'Doctor') authTable = 'doctors';
    else return new Response(JSON.stringify({ error: "Invalid override role. Must be Admin or Doctor." }), { status: 400 });

    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/${authTable}?phone=eq.${encodeURIComponent(override_phone)}&pin=eq.${encodeURIComponent(override_pin)}&select=id`, { headers });
    const authData = await authRes.json();

    if (!authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid authorization credentials." }), { status: 401 });
    }

    // Attempt Delete
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${encodeURIComponent(patient_id)}`, {
      method: 'DELETE',
      headers: headers
    });

    if (!delRes.ok) {
      const errData = await delRes.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to delete patient" }), { status: delRes.status });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
