import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { patient_id, doctor_id, notes, doctor_login_id, doctor_pin } = data;

    if (!patient_id || !doctor_id || !notes || !doctor_login_id || !doctor_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Doctor
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?login_id=eq.${encodeURIComponent(doctor_login_id)}&pin=eq.${encodeURIComponent(doctor_pin)}&select=id,hospital_id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0 || authData[0].id !== doctor_id) {
      return new Response(JSON.stringify({ error: "Unauthorized Doctor" }), { status: 401 });
    }

    const hospital_id = authData[0].hospital_id;

    // 2. Insert Treatment Log
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/treatment_logs`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({ patient_id, doctor_id, notes })
    });
    
    if (!insertRes.ok) {
        const err = await insertRes.json();
        return new Response(JSON.stringify({ error: err.message }), { status: insertRes.status });
    }
    const inserted = await insertRes.json();
    const newLog = inserted[0];

    // 3. Log Audit
    await logAudit(env, {
        hospital_id: hospital_id,
        user_type: 'Doctor',
        user_id: doctor_id,
        action: 'UPDATE_TREATMENT',
        target_type: 'Patient',
        target_id: patient_id,
        details: `Doctor updated treatment details for patient.`
    });

    return new Response(JSON.stringify({ success: true, treatment_log: newLog }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
