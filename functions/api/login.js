export async function onRequestPost({ request, env }) {
  try {
    const { role, phone, pin } = await request.json();

    if (!role || !phone || !pin) {
      return new Response(JSON.stringify({ error: "Missing role, phone, or PIN" }), { status: 400 });
    }

    const SUPABASE_URL = env.SUPABASE_URL || 'https://iwxdrhuzybkccxryekey.supabase.co';
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo';

    let tableName = '';
    if (role === 'Admin') tableName = 'admins';
    else if (role === 'Doctor') tableName = 'doctors';
    else if (role === 'Patient') tableName = 'patients';
    else return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });

    // Query Supabase via REST API to find user with matching phone and pin
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?phone=eq.${encodeURIComponent(phone)}&pin=eq.${encodeURIComponent(pin)}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errData = await response.json();
      return new Response(JSON.stringify({ error: errData.message || "Database error" }), { status: response.status });
    }

    const data = await response.json();

    if (data && data.length > 0) {
      // Login successful!
      // In a real app we'd generate a JWT token here.
      // For this simple implementation, we just return success.
      return new Response(JSON.stringify({ success: true, user: data[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // No match found
      return new Response(JSON.stringify({ error: "Invalid Phone Number or PIN" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
