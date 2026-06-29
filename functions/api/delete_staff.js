import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { staff_ids = [], doctor_ids = [], admin_phone, admin_pin } = data;

    if (!admin_phone || !admin_pin || (staff_ids.length === 0 && doctor_ids.length === 0)) {
      return new Response(JSON.stringify({ error: "Missing required fields or no users selected" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // 2. Delete Staff
    if (staff_ids.length > 0) {
        const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff?id=in.(${staff_ids.join(',')})`, {
            method: 'DELETE',
            headers: headers
        });
        if (!staffRes.ok) {
            const err = await staffRes.json();
            return new Response(JSON.stringify({ error: `Staff Delete Error: ${err.message}` }), { status: staffRes.status });
        }
    }

    // 3. Delete Doctors
    if (doctor_ids.length > 0) {
        const docRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?id=in.(${doctor_ids.join(',')})`, {
            method: 'DELETE',
            headers: headers
        });
        if (!docRes.ok) {
            const err = await docRes.json();
            return new Response(JSON.stringify({ error: `Doctor Delete Error: ${err.message}` }), { status: docRes.status });
        }
    }

    // 4. Log Audit
    const totalDeleted = staff_ids.length + doctor_ids.length;
    await logAudit(env, {
        hospital_id: null,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'DELETE_STAFF_BATCH',
        target_type: 'Multiple',
        target_id: null,
        details: `Deleted ${totalDeleted} users (${staff_ids.length} Staff, ${doctor_ids.length} Doctors)`
    });

    return new Response(JSON.stringify({ success: true, deleted: totalDeleted }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
