export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const { patient_id, full_name, age, gender, phone, chief_complaint, assigned_doctor_id } = payload;

    if (!patient_id) {
      return new Response(JSON.stringify({ error: "Patient ID is required" }), { status: 400 });
    }

    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const updatePayload = {
      full_name,
      age,
      gender,
      phone,
      chief_complaint,
      assigned_doctor_id: assigned_doctor_id || null
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${encodeURIComponent(patient_id)}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      const errData = await response.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to edit patient" }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, patient: data[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
