import { getSupabaseConfig, logAudit } from './shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const { role, identifier, pin } = await request.json(); // identifier is phone for admin/patient, login_id for staff/doctor

    if (!role || !identifier || !pin) {
      return new Response(JSON.stringify({ error: "Missing role, login identifier, or PIN" }), { status: 400 });
    }

    const { SUPABASE_URL, headers } = getSupabaseConfig(env);

    // 1. Check Rate Limiting
    const attemptRes = await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?user_identifier=eq.${encodeURIComponent(identifier)}&select=*`, { headers });
    let attempts = await attemptRes.json();
    let currentAttempt = attempts && attempts.length > 0 ? attempts[0] : null;

    if (currentAttempt) {
      if (currentAttempt.locked_until && new Date(currentAttempt.locked_until) > new Date()) {
        return new Response(JSON.stringify({ error: "Account locked due to too many failed attempts. Try again in 5 minutes." }), { status: 429 });
      }
      if (currentAttempt.locked_until && new Date(currentAttempt.locked_until) <= new Date()) {
        // Unlock expired
        currentAttempt.attempt_count = 0;
        currentAttempt.locked_until = null;
      }
    }

    // 2. Validate User
    let tableName = '';
    let idField = '';
    let activeFilter = '&is_active=eq.true'; // Default for staff/doctors/patients
    
    if (role === 'Admin') { 
        tableName = 'admins'; 
        idField = 'phone'; 
        activeFilter = ''; // Admins do not have an is_active column
    }
    else if (role === 'Staff') { tableName = 'staff'; idField = 'login_id'; }
    else if (role === 'Doctor') { tableName = 'doctors'; idField = 'login_id'; }
    else if (role === 'Patient') { tableName = 'patients'; idField = 'phone'; }
    else return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });

    const userRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?${idField}=eq.${encodeURIComponent(identifier)}&pin=eq.${encodeURIComponent(pin)}${activeFilter}&select=*`, {
      headers
    });
    const userData = await userRes.json();

    if (userRes.ok && userData && userData.length > 0) {
      const user = userData[0];

      // If Staff or Doctor or Patient, check if Hospital is active
      if (role !== 'Admin' && user.hospital_id) {
        const hospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${user.hospital_id}&select=is_active,name`, { headers });
        const hospData = await hospRes.json();
        if (hospData && hospData.length > 0) {
          if (!hospData[0].is_active) {
            return new Response(JSON.stringify({ error: "This Hospital/Centre is currently paused." }), { status: 403 });
          }
          user.hospital_name = hospData[0].name;
        }
      }

      // Reset attempts on success
      if (currentAttempt && currentAttempt.id) {
        await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?id=eq.${currentAttempt.id}`, {
          method: 'DELETE', headers
        });
      }

      // Log success
      await logAudit(env, {
        hospital_id: user.hospital_id || null,
        user_type: role,
        user_id: user.id,
        action: 'LOGIN',
        details: `${role} logged in successfully.`
      });

      return new Response(JSON.stringify({ success: true, user }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Failed login logic
      let newCount = currentAttempt ? currentAttempt.attempt_count + 1 : 1;
      let lockedUntil = null;
      if (newCount >= 3) {
        lockedUntil = new Date(Date.now() + 5 * 60000).toISOString(); // Lock for 5 mins
      }

      if (currentAttempt) {
        await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?id=eq.${currentAttempt.id}`, {
          method: 'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ attempt_count: newCount, locked_until: lockedUntil, last_attempt_at: new Date().toISOString() })
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/login_attempts`, {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ user_identifier: identifier, attempt_count: newCount, locked_until: lockedUntil, last_attempt_at: new Date().toISOString() })
        });
      }

      // Log failure
      await logAudit(env, {
        hospital_id: null,
        user_type: role,
        user_id: null,
        action: 'FAILED_LOGIN',
        details: `Failed login attempt for ${identifier}`
      });

      return new Response(JSON.stringify({ error: "Invalid Credentials" }), { status: 401 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
