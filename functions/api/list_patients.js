export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const hospId = url.searchParams.get('hospital_id');
    const docId = url.searchParams.get('doctor_id');

    if (!hospId) {
      return new Response(JSON.stringify({ error: "Missing hospital_id" }), { status: 400 });
    }

    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };

    // We select doctor info alongside patient
    let fetchUrl = `${SUPABASE_URL}/rest/v1/patients?select=*,doctors(full_name)&hospital_id=eq.${encodeURIComponent(hospId)}`;
    
    if (docId) {
      fetchUrl += `&assigned_doctor_id=eq.${encodeURIComponent(docId)}`;
    }

    const res = await fetch(fetchUrl, { headers });
    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || "Failed to fetch patients" }), { status: res.status });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
