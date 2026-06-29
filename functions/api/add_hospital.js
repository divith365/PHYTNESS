import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { name, address, contact, admin_phone, admin_pin } = data;

    if (!name || !contact || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // 2. Insert Hospital
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ name, address, contact })
    });
    
    if (!insertRes.ok) {
        const err = await insertRes.json();
        return new Response(JSON.stringify({ error: err.message }), { status: insertRes.status });
    }
    const inserted = await insertRes.json();
    const newHospital = inserted[0];

    // 3. Log Audit
    await logAudit(env, {
        hospital_id: newHospital.id,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'ADD_HOSPITAL',
        target_type: 'Hospital',
        target_id: newHospital.id,
        details: `Created new hospital: ${name}`
    });

    return new Response(JSON.stringify({ success: true, hospital: newHospital }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
