import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPatch({ request, env }) {
  try {
    const data = await request.json();
    const { staff_id, role_type, hospital_id, full_name, phone, admin_phone, admin_pin } = data;

    if (!staff_id || !role_type || !hospital_id || !full_name || !phone || !admin_phone || !admin_pin) {
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
    const table = role_type === 'Doctor' ? 'doctors' : 'staff';

    // 2. Update Staff/Doctor
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${staff_id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ full_name, phone, hospital_id })
    });
    
    if (!updateRes.ok) {
        const err = await updateRes.json();
        return new Response(JSON.stringify({ error: err.message }), { status: updateRes.status });
    }
    const updatedStaff = await updateRes.json();

    // 3. Log Audit
    await logAudit(env, {
        hospital_id: hospital_id,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'EDIT_STAFF',
        target_type: role_type,
        target_id: staff_id,
        details: `Updated ${role_type} profile: ${full_name} (${phone})`
    });

    return new Response(JSON.stringify({ success: true, data: updatedStaff[0] }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
