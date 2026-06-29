import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { admin_phone, admin_pin, test_identifier } = data;

    if (!admin_phone || !admin_pin || !test_identifier) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Authenticate Admin
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }

    // 2. Delete the Test Hospital (this cascades to staff, doctors, patients, treatments, audit logs)
    const deleteHospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?name=eq.${encodeURIComponent(test_identifier)}`, {
      method: 'DELETE',
      headers
    });
    
    if (!deleteHospRes.ok) {
        const err = await deleteHospRes.json();
        return new Response(JSON.stringify({ error: err.message || "Failed to delete test hospital" }), { status: deleteHospRes.status });
    }

    // 3. Delete any brute-force login attempts created by the test
    // We will delete where user_identifier starts with the test prefix
    // E.g. test_identifier might be 'AUTO-TEST-HOSPITAL-999', so we delete anything with 'AUTO-TEST'
    const prefix = test_identifier.split('-')[0]; // Just a simple safety catch, or we can just delete where it contains 'TEST'
    const deleteAttemptsRes = await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?user_identifier=like.*TEST*`, {
      method: 'DELETE',
      headers
    });

    // 4. Log the cleanup action
    await logAudit(env, {
        hospital_id: null, // Global
        user_type: 'Admin',
        user_id: authData[0].id,
        action: 'TEST_CLEANUP',
        target_type: 'System',
        target_id: null,
        details: `Automated test suite finished and cleanup script executed successfully for ${test_identifier}.`
    });

    return new Response(JSON.stringify({ success: true, message: "Test environment wiped clean." }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
