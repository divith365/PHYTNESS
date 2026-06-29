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

    // 2. Fetch Hospital Data
    const hospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}&select=*`, { headers });
    const hospitalData = await hospRes.json();

    // 3. Fetch Staff
    const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff?hospital_id=eq.${hospital_id}&select=login_id,full_name,phone,is_active,created_at`, { headers });
    const staffData = await staffRes.json();

    // 4. Fetch Doctors
    const docRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?hospital_id=eq.${hospital_id}&select=login_id,full_name,phone,email,specialization,is_active,created_at`, { headers });
    const docData = await docRes.json();

    // 5. Fetch Patients
    const patRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?hospital_id=eq.${hospital_id}&select=pt_id,full_name,age,gender,phone,chief_complaint,treatment_status,is_active,created_at`, { headers });
    const patData = await patRes.json();

    // 6. Log Export Action
    await logAudit(env, {
        hospital_id: hospital_id,
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'EXPORT_DATA',
        target_type: 'Hospital',
        target_id: hospital_id,
        details: `Admin exported hospital data to Excel.`
    });

    return new Response(JSON.stringify({ 
      success: true, 
      hospital: hospitalData[0] || {}, 
      staff: staffData || [], 
      doctors: docData || [], 
      patients: patData || [] 
    }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
