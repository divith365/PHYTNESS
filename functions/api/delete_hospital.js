import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, admin_phone, admin_pin } = data;

    if (!hospital_id || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // Fetch hospital name for logging before deleting
    const hospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}&select=name`, { headers });
    const hospData = await hospRes.json();
    const hospName = (hospData && hospData.length > 0) ? hospData[0].name : 'Unknown Hospital';

    // 2. Delete Hospital (Cascades to staff, doctors, patients, etc.)
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}`, {
      method: 'DELETE',
      headers: headers
    });
    
    if (!deleteRes.ok) {
        const err = await deleteRes.json();
        return new Response(JSON.stringify({ error: err.message }), { status: deleteRes.status });
    }

    // 3. Log Audit
    await logAudit(env, {
        hospital_id: hospital_id, // Keeping ID even though it's deleted for historical trace
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'DELETE_HOSPITAL',
        target_type: 'Hospital',
        target_id: hospital_id,
        details: `Deleted hospital: ${hospName}`
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
