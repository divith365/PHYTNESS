import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { target_type, target_id, is_active, admin_phone, admin_pin } = data;

    if (!target_type || !target_id || typeof is_active !== 'boolean' || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // Determine Table
    let table = '';
    if (target_type === 'Hospital') table = 'hospitals';
    else if (target_type === 'Staff') table = 'staff';
    else if (target_type === 'Doctor') table = 'doctors';
    else if (target_type === 'Patient') table = 'patients';
    else return new Response(JSON.stringify({ error: "Invalid target_type" }), { status: 400 });

    // 2. Update Status
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${target_id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ is_active })
    });
    
    if (!updateRes.ok) {
        const err = await updateRes.json();
        return new Response(JSON.stringify({ error: err.message }), { status: updateRes.status });
    }

    // 3. Log Audit
    await logAudit(env, {
        hospital_id: null,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: is_active ? 'ACTIVATE_ACCOUNT' : 'PAUSE_ACCOUNT',
        target_type: target_type,
        target_id: target_id,
        details: `Set ${target_type} (${target_id}) to ${is_active ? 'Active' : 'Paused'}`
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
