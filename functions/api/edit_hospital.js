import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPatch({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, name, prefix, contact, admin_phone, admin_pin } = data;

    if (!hospital_id || !name || !prefix || !contact || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // 2. Update Hospital
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ name, prefix: prefix.toUpperCase(), contact })
    });
    
    if (!updateRes.ok) {
        const err = await updateRes.json();
        return new Response(JSON.stringify({ error: err.message }), { status: updateRes.status });
    }
    const updatedHosp = await updateRes.json();

    // 3. Log Audit
    await logAudit(env, {
        hospital_id: hospital_id,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'EDIT_HOSPITAL',
        target_type: 'Hospital',
        target_id: hospital_id,
        details: `Updated hospital details to: ${name} (${prefix.toUpperCase()})`
    });

    return new Response(JSON.stringify({ success: true, hospital: updatedHosp[0] }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
