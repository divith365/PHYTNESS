import { getSupabaseConfig } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const { admin_phone, admin_pin } = await request.json();
    if (!admin_phone || !admin_pin) return new Response(JSON.stringify({ error: "Missing Admin Auth" }), { status: 400 });

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // Verify Admin
    const adminRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${admin_phone}&pin=eq.${admin_pin}&select=id`, { headers });
    const adminData = await adminRes.json();
    if (!adminRes.ok || !adminData || adminData.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid Admin credentials" }), { status: 401 });
    }

    // Fetch Data
    const hospitalsRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?select=id,name,prefix,contact,is_active&order=created_at.desc`, { headers });
    const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff?select=id,login_id,full_name,is_active,hospital_id&order=created_at.desc`, { headers });
    const docRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?select=id,login_id,full_name,is_active,hospital_id&order=created_at.desc`, { headers });
    const patientsRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?select=*,doctors(full_name)&order=created_at.desc`, { headers });
    const auditRes = await fetch(`${SUPABASE_URL}/rest/v1/audit_logs?select=*&order=created_at.desc&limit=50`, { headers });

    const hospitals = await hospitalsRes.json();
    const staff = await staffRes.json();
    const docs = await docRes.json();
    const patients = await patientsRes.json();
    const logs = await auditRes.json();

    const staffWithRole = (staff || []).map(s => ({ ...s, role_type: 'Staff' }));
    const docsWithRole = (docs || []).map(d => ({ ...d, role_type: 'Doctor' }));
    const allStaff = [...staffWithRole, ...docsWithRole];

    return new Response(JSON.stringify({ hospitals, staff: allStaff, patients, logs }), { headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
