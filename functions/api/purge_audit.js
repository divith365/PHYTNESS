import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { admin_phone, admin_pin } = data;

    if (!admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // 2. Delete all audit logs (Supabase REST requires a filter to delete multiple)
    // We can filter by id not being null to match all rows
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/audit_logs?id=not.is.null`, {
      method: 'DELETE',
      headers
    });
    
    if (!deleteRes.ok) {
        const err = await deleteRes.json();
        return new Response(JSON.stringify({ error: err.message || "Failed to purge audit logs" }), { status: deleteRes.status });
    }

    // 3. Log that the audit was purged! (This will be the only log remaining)
    await logAudit(env, {
        hospital_id: null,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'PURGE_AUDIT',
        target_type: 'System',
        target_id: null,
        details: `Super Admin purged all previous audit logs.`
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
