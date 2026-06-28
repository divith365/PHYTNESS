export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const { target_role, target_phone, new_pin, old_pin, is_admin_override, admin_phone, admin_pin } = payload;

    if (!target_role || !target_phone || !new_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    let targetTable = '';
    if (target_role === 'Admin') targetTable = 'admins';
    else if (target_role === 'Doctor') targetTable = 'doctors';
    else if (target_role === 'Patient') targetTable = 'patients';
    else return new Response(JSON.stringify({ error: "Invalid target role" }), { status: 400 });

    if (is_admin_override) {
      // Authenticate Admin
      if (!admin_phone || !admin_pin) return new Response(JSON.stringify({ error: "Admin credentials required for override" }), { status: 401 });
      const adminRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
      const adminData = await adminRes.json();
      if (!adminData || adminData.length === 0) return new Response(JSON.stringify({ error: "Invalid Admin Credentials" }), { status: 401 });
    } else {
      // Verify Old PIN
      if (!old_pin) return new Response(JSON.stringify({ error: "Old PIN is required for self change" }), { status: 401 });
      const userRes = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?phone=eq.${encodeURIComponent(target_phone)}&pin=eq.${encodeURIComponent(old_pin)}&select=id`, { headers });
      const userData = await userRes.json();
      if (!userData || userData.length === 0) return new Response(JSON.stringify({ error: "Incorrect Old PIN or Phone Number" }), { status: 401 });
    }

    // Perform the Update
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?phone=eq.${encodeURIComponent(target_phone)}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ pin: new_pin })
    });

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to update PIN" }), { status: updateRes.status });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
