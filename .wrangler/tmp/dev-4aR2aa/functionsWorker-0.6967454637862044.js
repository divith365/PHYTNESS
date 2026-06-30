var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-HOD6xI/functionsWorker-0.6967454637862044.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var getSupabaseConfig = /* @__PURE__ */ __name2((env) => {
  const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
  return {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    }
  };
}, "getSupabaseConfig");
async function logAudit(env, payload) {
  const { SUPABASE_URL, headers } = getSupabaseConfig(env);
  await fetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
}
__name(logAudit, "logAudit");
__name2(logAudit, "logAudit");
async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, full_name, phone, email, qualification, specialization, experience, admin_phone, admin_pin } = data;
    if (!hospital_id || !full_name || !phone || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({
        hospital_id,
        full_name,
        phone,
        email: email || null,
        qualification: qualification || null,
        specialization: specialization || null,
        experience: experience || 0
      })
    });
    if (!insertRes.ok) {
      const err = await insertRes.json();
      return new Response(JSON.stringify({ error: err.message || "Failed to insert doctor" }), { status: insertRes.status });
    }
    const inserted = await insertRes.json();
    const newDoc = inserted[0];
    await logAudit(env, {
      hospital_id,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "ADD_DOCTOR",
      target_type: "Doctor",
      target_id: newDoc.id,
      details: `Created new doctor: ${full_name} (${newDoc.login_id})`
    });
    return new Response(JSON.stringify({ success: true, doctor: newDoc }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function onRequestPost2({ request, env }) {
  try {
    const data = await request.json();
    const { name, prefix, address, contact, admin_phone, admin_pin } = data;
    if (!name || !prefix || !contact || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ name, prefix: prefix.toUpperCase(), address, contact })
    });
    if (!insertRes.ok) {
      const err = await insertRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: insertRes.status });
    }
    const inserted = await insertRes.json();
    const newHospital = inserted[0];
    await logAudit(env, {
      hospital_id: newHospital.id,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "ADD_HOSPITAL",
      target_type: "Hospital",
      target_id: newHospital.id,
      details: `Created new hospital: ${name}`
    });
    return new Response(JSON.stringify({ success: true, hospital: newHospital }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestPost3({ request, env }) {
  try {
    const payload = await request.json();
    if (!payload.pin) payload.pin = "0000";
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const response = await fetch(`${SUPABASE_URL}/rest/v1/patients`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errData = await response.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to add patient" }), { status: response.status });
    }
    const data = await response.json();
    return new Response(JSON.stringify({ success: true, patient: data[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost3, "onRequestPost3");
__name2(onRequestPost3, "onRequestPost");
async function onRequestPost4({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, full_name, phone, admin_phone, admin_pin } = data;
    if (!hospital_id || !full_name || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/staff`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ hospital_id, full_name, phone })
    });
    if (!insertRes.ok) {
      const err = await insertRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: insertRes.status });
    }
    const inserted = await insertRes.json();
    const newStaff = inserted[0];
    await logAudit(env, {
      hospital_id,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "ADD_STAFF",
      target_type: "Staff",
      target_id: newStaff.id,
      details: `Created new staff: ${full_name} (${newStaff.login_id})`
    });
    return new Response(JSON.stringify({ success: true, staff: newStaff }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost4, "onRequestPost4");
__name2(onRequestPost4, "onRequestPost");
async function onRequestPost5({ request, env }) {
  try {
    const data = await request.json();
    const { patient_id, doctor_id, notes, doctor_login_id, doctor_pin } = data;
    if (!patient_id || !doctor_id || !notes || !doctor_login_id || !doctor_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?login_id=eq.${encodeURIComponent(doctor_login_id)}&pin=eq.${encodeURIComponent(doctor_pin)}&select=id,hospital_id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0 || authData[0].id !== doctor_id) {
      return new Response(JSON.stringify({ error: "Unauthorized Doctor" }), { status: 401 });
    }
    const hospital_id = authData[0].hospital_id;
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/treatment_logs`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ patient_id, doctor_id, notes })
    });
    if (!insertRes.ok) {
      const err = await insertRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: insertRes.status });
    }
    const inserted = await insertRes.json();
    const newLog = inserted[0];
    await logAudit(env, {
      hospital_id,
      user_type: "Doctor",
      user_id: doctor_id,
      action: "UPDATE_TREATMENT",
      target_type: "Patient",
      target_id: patient_id,
      details: `Doctor updated treatment details for patient.`
    });
    return new Response(JSON.stringify({ success: true, treatment_log: newLog }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost5, "onRequestPost5");
__name2(onRequestPost5, "onRequestPost");
async function onRequestPost6({ request, env }) {
  try {
    const { admin_phone, admin_pin } = await request.json();
    if (!admin_phone || !admin_pin) return new Response(JSON.stringify({ error: "Missing Admin Auth" }), { status: 400 });
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const adminRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${admin_phone}&pin=eq.${admin_pin}&select=id`, { headers });
    const adminData = await adminRes.json();
    if (!adminRes.ok || !adminData || adminData.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid Admin credentials" }), { status: 401 });
    }
    const hospitalsRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?select=id,name,prefix,contact,is_active&order=created_at.desc`, { headers });
    const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff?select=id,login_id,full_name,is_active,hospital_id&order=created_at.desc`, { headers });
    const docRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?select=id,login_id,full_name,is_active,hospital_id&order=created_at.desc`, { headers });
    const patientsRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?select=id,hospital_id`, { headers });
    const auditRes = await fetch(`${SUPABASE_URL}/rest/v1/audit_logs?select=*&order=created_at.desc&limit=50`, { headers });
    const hospitals = await hospitalsRes.json();
    const staff = await staffRes.json();
    const docs = await docRes.json();
    const patients = await patientsRes.json();
    const logs = await auditRes.json();
    const staffWithRole = (staff || []).map((s) => ({ ...s, role_type: "Staff" }));
    const docsWithRole = (docs || []).map((d) => ({ ...d, role_type: "Doctor" }));
    const allStaff = [...staffWithRole, ...docsWithRole];
    return new Response(JSON.stringify({ hospitals, staff: allStaff, patients, logs }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost6, "onRequestPost6");
__name2(onRequestPost6, "onRequestPost");
async function onRequestPost7({ request, env }) {
  try {
    const payload = await request.json();
    const { target_role, target_phone, new_pin, old_pin, is_admin_override, override_role, override_phone, override_pin, admin_phone, admin_pin } = payload;
    if (!target_role || !target_phone || !new_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    };
    let targetTable = "";
    let targetIdField = "phone";
    if (target_role === "Admin") targetTable = "admins";
    else if (target_role === "Doctor") {
      targetTable = "doctors";
      targetIdField = "login_id";
    } else if (target_role === "Staff") {
      targetTable = "staff";
      targetIdField = "login_id";
    } else if (target_role === "Patient") targetTable = "patients";
    else return new Response(JSON.stringify({ error: "Invalid target role" }), { status: 400 });
    if (is_admin_override) {
      const authRole = override_role || "Admin";
      const authPhone = override_phone || admin_phone;
      const authPin = override_pin || admin_pin;
      if (!authPhone || !authPin) return new Response(JSON.stringify({ error: "Authorization credentials required for override" }), { status: 401 });
      let authTable = "";
      if (authRole === "Admin") authTable = "admins";
      else if (authRole === "Doctor") {
        if (target_role !== "Patient") return new Response(JSON.stringify({ error: "Staff/Therapists can only reset Patient PINs." }), { status: 403 });
        authTable = "doctors";
      } else return new Response(JSON.stringify({ error: "Invalid override role." }), { status: 400 });
      const authRes = await fetch(`${SUPABASE_URL}/rest/v1/${authTable}?phone=eq.${encodeURIComponent(authPhone)}&pin=eq.${encodeURIComponent(authPin)}&select=id`, { headers });
      const authData = await authRes.json();
      if (!authData || authData.length === 0) return new Response(JSON.stringify({ error: "Invalid Authorization Credentials" }), { status: 401 });
    } else {
      if (!old_pin) return new Response(JSON.stringify({ error: "Old PIN is required for self change" }), { status: 401 });
      const userRes = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?${targetIdField}=eq.${encodeURIComponent(target_phone)}&pin=eq.${encodeURIComponent(old_pin)}&select=id`, { headers });
      const userData = await userRes.json();
      if (!userData || userData.length === 0) return new Response(JSON.stringify({ error: "Incorrect Old PIN" }), { status: 401 });
    }
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?${targetIdField}=eq.${encodeURIComponent(target_phone)}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ pin: new_pin })
    });
    if (!updateRes.ok) {
      const errData = await updateRes.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to update PIN" }), { status: updateRes.status });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost7, "onRequestPost7");
__name2(onRequestPost7, "onRequestPost");
async function onRequestPost8({ request, env }) {
  try {
    const data = await request.json();
    const { admin_phone, admin_pin, test_identifier } = data;
    if (!admin_phone || !admin_pin || !test_identifier) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const deleteHospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?name=eq.${encodeURIComponent(test_identifier)}`, {
      method: "DELETE",
      headers
    });
    if (!deleteHospRes.ok) {
      const err = await deleteHospRes.json();
      return new Response(JSON.stringify({ error: err.message || "Failed to delete test hospital" }), { status: deleteHospRes.status });
    }
    const prefix = test_identifier.split("-")[0];
    const deleteAttemptsRes = await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?user_identifier=like.*TEST*`, {
      method: "DELETE",
      headers
    });
    await logAudit(env, {
      hospital_id: null,
      // Global
      user_type: "Admin",
      user_id: authData[0].id,
      action: "TEST_CLEANUP",
      target_type: "System",
      target_id: null,
      details: `Automated test suite finished and cleanup script executed successfully for ${test_identifier}.`
    });
    return new Response(JSON.stringify({ success: true, message: "Test environment wiped clean." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost8, "onRequestPost8");
__name2(onRequestPost8, "onRequestPost");
async function onRequestPost9({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, admin_phone, admin_pin } = data;
    if (!hospital_id || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const hospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}&select=name`, { headers });
    const hospData = await hospRes.json();
    const hospName = hospData && hospData.length > 0 ? hospData[0].name : "Unknown Hospital";
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}`, {
      method: "DELETE",
      headers
    });
    if (!deleteRes.ok) {
      const err = await deleteRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: deleteRes.status });
    }
    await logAudit(env, {
      hospital_id,
      // Keeping ID even though it's deleted for historical trace
      user_type: "Admin",
      user_id: authData[0].id,
      action: "DELETE_HOSPITAL",
      target_type: "Hospital",
      target_id: hospital_id,
      details: `Deleted hospital: ${hospName}`
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost9, "onRequestPost9");
__name2(onRequestPost9, "onRequestPost");
async function onRequestPost10({ request, env }) {
  try {
    const payload = await request.json();
    const { patient_id, override_role, override_phone, override_pin } = payload;
    if (!patient_id || !override_role || !override_phone || !override_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields. Provide patient_id and override credentials." }), { status: 400 });
    }
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    };
    let authTable = "";
    if (override_role === "Admin") authTable = "admins";
    else if (override_role === "Doctor") authTable = "doctors";
    else return new Response(JSON.stringify({ error: "Invalid override role. Must be Admin or Doctor." }), { status: 400 });
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/${authTable}?phone=eq.${encodeURIComponent(override_phone)}&pin=eq.${encodeURIComponent(override_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid authorization credentials." }), { status: 401 });
    }
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${encodeURIComponent(patient_id)}`, {
      method: "DELETE",
      headers
    });
    if (!delRes.ok) {
      const errData = await delRes.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to delete patient" }), { status: delRes.status });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost10, "onRequestPost10");
__name2(onRequestPost10, "onRequestPost");
async function onRequestPost11({ request, env }) {
  try {
    const payload = await request.json();
    const { patient_ids } = payload;
    if (!patient_ids || !Array.isArray(patient_ids) || patient_ids.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid patient_ids array" }), { status: 400 });
    }
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    };
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=in.(${patient_ids.map((id) => encodeURIComponent(id)).join(",")})`, {
      method: "DELETE",
      headers
    });
    if (!delRes.ok) {
      const errData = await delRes.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to delete patients" }), { status: delRes.status });
    }
    return new Response(JSON.stringify({ success: true, count: patient_ids.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost11, "onRequestPost11");
__name2(onRequestPost11, "onRequestPost");
async function onRequestPost12({ request, env }) {
  try {
    const data = await request.json();
    const { staff_ids = [], doctor_ids = [], admin_phone, admin_pin } = data;
    if (!admin_phone || !admin_pin || staff_ids.length === 0 && doctor_ids.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields or no users selected" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    if (staff_ids.length > 0) {
      const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff?id=in.(${staff_ids.join(",")})`, {
        method: "DELETE",
        headers
      });
      if (!staffRes.ok) {
        const err = await staffRes.json();
        return new Response(JSON.stringify({ error: `Staff Delete Error: ${err.message}` }), { status: staffRes.status });
      }
    }
    if (doctor_ids.length > 0) {
      const docRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?id=in.(${doctor_ids.join(",")})`, {
        method: "DELETE",
        headers
      });
      if (!docRes.ok) {
        const err = await docRes.json();
        return new Response(JSON.stringify({ error: `Doctor Delete Error: ${err.message}` }), { status: docRes.status });
      }
    }
    const totalDeleted = staff_ids.length + doctor_ids.length;
    await logAudit(env, {
      hospital_id: null,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "DELETE_STAFF_BATCH",
      target_type: "Multiple",
      target_id: null,
      details: `Deleted ${totalDeleted} users (${staff_ids.length} Staff, ${doctor_ids.length} Doctors)`
    });
    return new Response(JSON.stringify({ success: true, deleted: totalDeleted }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost12, "onRequestPost12");
__name2(onRequestPost12, "onRequestPost");
async function onRequestPatch({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, name, prefix, contact, admin_phone, admin_pin } = data;
    if (!hospital_id || !name || !prefix || !contact || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ name, prefix: prefix.toUpperCase(), contact })
    });
    if (!updateRes.ok) {
      const err = await updateRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: updateRes.status });
    }
    const updatedHosp = await updateRes.json();
    await logAudit(env, {
      hospital_id,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "EDIT_HOSPITAL",
      target_type: "Hospital",
      target_id: hospital_id,
      details: `Updated hospital details to: ${name} (${prefix.toUpperCase()})`
    });
    return new Response(JSON.stringify({ success: true, hospital: updatedHosp[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPatch, "onRequestPatch");
__name2(onRequestPatch, "onRequestPatch");
async function onRequestPost13({ request, env }) {
  try {
    const payload = await request.json();
    const { patient_id, full_name, age, gender, phone, chief_complaint, assigned_doctor_id } = payload;
    if (!patient_id) {
      return new Response(JSON.stringify({ error: "Patient ID is required" }), { status: 400 });
    }
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
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
      method: "PATCH",
      headers,
      body: JSON.stringify(updatePayload)
    });
    if (!response.ok) {
      const errData = await response.json();
      return new Response(JSON.stringify({ error: errData.message || "Failed to edit patient" }), { status: response.status });
    }
    const data = await response.json();
    return new Response(JSON.stringify({ success: true, patient: data[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost13, "onRequestPost13");
__name2(onRequestPost13, "onRequestPost");
async function onRequestPatch2({ request, env }) {
  try {
    const data = await request.json();
    const { staff_id, role_type, hospital_id, full_name, phone, admin_phone, admin_pin } = data;
    if (!staff_id || !role_type || !hospital_id || !full_name || !phone || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const table = role_type === "Doctor" ? "doctors" : "staff";
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${staff_id}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ full_name, phone, hospital_id })
    });
    if (!updateRes.ok) {
      const err = await updateRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: updateRes.status });
    }
    const updatedStaff = await updateRes.json();
    await logAudit(env, {
      hospital_id,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "EDIT_STAFF",
      target_type: role_type,
      target_id: staff_id,
      details: `Updated ${role_type} profile: ${full_name} (${phone})`
    });
    return new Response(JSON.stringify({ success: true, data: updatedStaff[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPatch2, "onRequestPatch2");
__name2(onRequestPatch2, "onRequestPatch");
async function onRequestPost14({ request, env }) {
  try {
    const data = await request.json();
    const { hospital_id, admin_phone, admin_pin } = data;
    if (!hospital_id || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const hospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${hospital_id}&select=*`, { headers });
    const hospitalData = await hospRes.json();
    const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff?hospital_id=eq.${hospital_id}&select=login_id,full_name,phone,is_active,created_at`, { headers });
    const staffData = await staffRes.json();
    const docRes = await fetch(`${SUPABASE_URL}/rest/v1/doctors?hospital_id=eq.${hospital_id}&select=login_id,full_name,phone,email,specialization,is_active,created_at`, { headers });
    const docData = await docRes.json();
    const patRes = await fetch(`${SUPABASE_URL}/rest/v1/patients?hospital_id=eq.${hospital_id}&select=pt_id,full_name,age,gender,phone,chief_complaint,treatment_status,is_active,created_at`, { headers });
    const patData = await patRes.json();
    await logAudit(env, {
      hospital_id,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "EXPORT_DATA",
      target_type: "Hospital",
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
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost14, "onRequestPost14");
__name2(onRequestPost14, "onRequestPost");
async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const hospId = url.searchParams.get("hospital_id");
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    };
    let fetchUrl = `${SUPABASE_URL}/rest/v1/doctors?select=id,login_id,full_name,specialization,qualification,phone`;
    if (hospId) fetchUrl += `&hospital_id=eq.${encodeURIComponent(hospId)}`;
    const res = await fetch(fetchUrl, { headers });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || "Failed to fetch doctors" }), { status: res.status });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestGet, "onRequestGet");
__name2(onRequestGet, "onRequestGet");
async function onRequestGet2({ request, env }) {
  try {
    const url = new URL(request.url);
    const hospId = url.searchParams.get("hospital_id");
    const docId = url.searchParams.get("doctor_id");
    if (!hospId) {
      return new Response(JSON.stringify({ error: "Missing hospital_id" }), { status: 400 });
    }
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    };
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestGet2, "onRequestGet2");
__name2(onRequestGet2, "onRequestGet");
async function onRequestGet3({ request, env }) {
  try {
    const url = new URL(request.url);
    const hospId = url.searchParams.get("hospital_id");
    const SUPABASE_URL = env.SUPABASE_URL || "https://iwxdrhuzybkccxryekey.supabase.co";
    const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGRyaHV6eWJrY2N4cnlla2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgyODgsImV4cCI6MjA5ODE0NDI4OH0.RrPVtsvbBVtdFsEmwPxBsqDx4laM91W7A9PUgOBlFTo";
    const headers = {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    };
    let fetchUrl = `${SUPABASE_URL}/rest/v1/staff?select=id,full_name,phone,login_id`;
    if (hospId) fetchUrl += `&hospital_id=eq.${encodeURIComponent(hospId)}`;
    const res = await fetch(fetchUrl, { headers });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || "Failed to fetch staff" }), { status: res.status });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestGet3, "onRequestGet3");
__name2(onRequestGet3, "onRequestGet");
async function onRequestPost15({ request, env }) {
  try {
    const { role, identifier, pin } = await request.json();
    if (!role || !identifier || !pin) {
      return new Response(JSON.stringify({ error: "Missing role, login identifier, or PIN" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const attemptRes = await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?user_identifier=eq.${encodeURIComponent(identifier)}&select=*`, { headers });
    let attempts = await attemptRes.json();
    let currentAttempt = attempts && attempts.length > 0 ? attempts[0] : null;
    if (currentAttempt) {
      if (currentAttempt.locked_until && new Date(currentAttempt.locked_until) > /* @__PURE__ */ new Date()) {
        return new Response(JSON.stringify({ error: "Account locked due to too many failed attempts. Try again in 5 minutes." }), { status: 429 });
      }
      if (currentAttempt.locked_until && new Date(currentAttempt.locked_until) <= /* @__PURE__ */ new Date()) {
        currentAttempt.attempt_count = 0;
        currentAttempt.locked_until = null;
      }
    }
    let tableName = "";
    let idField = "";
    let activeFilter = "&is_active=eq.true";
    if (role === "Admin") {
      tableName = "admins";
      idField = "phone";
      activeFilter = "";
    } else if (role === "Staff") {
      tableName = "staff";
      idField = "login_id";
    } else if (role === "Doctor") {
      tableName = "doctors";
      idField = "login_id";
    } else if (role === "Patient") {
      tableName = "patients";
      idField = "phone";
    } else return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
    const userRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?${idField}=eq.${encodeURIComponent(identifier)}&pin=eq.${encodeURIComponent(pin)}${activeFilter}&select=*`, {
      headers
    });
    const userData = await userRes.json();
    if (userRes.ok && userData && userData.length > 0) {
      const user = userData[0];
      if (role !== "Admin" && user.hospital_id) {
        const hospRes = await fetch(`${SUPABASE_URL}/rest/v1/hospitals?id=eq.${user.hospital_id}&select=is_active,name`, { headers });
        const hospData = await hospRes.json();
        if (hospData && hospData.length > 0) {
          if (!hospData[0].is_active) {
            return new Response(JSON.stringify({ error: "This Hospital/Centre is currently paused." }), { status: 403 });
          }
          user.hospital_name = hospData[0].name;
        }
      }
      if (currentAttempt && currentAttempt.id) {
        await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?id=eq.${currentAttempt.id}`, {
          method: "DELETE",
          headers
        });
      }
      await logAudit(env, {
        hospital_id: user.hospital_id || null,
        user_type: role,
        user_id: user.id,
        action: "LOGIN",
        details: `${role} logged in successfully.`
      });
      return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      let newCount = currentAttempt ? currentAttempt.attempt_count + 1 : 1;
      let lockedUntil = null;
      if (newCount >= 3) {
        lockedUntil = new Date(Date.now() + 5 * 6e4).toISOString();
      }
      if (currentAttempt) {
        await fetch(`${SUPABASE_URL}/rest/v1/login_attempts?id=eq.${currentAttempt.id}`, {
          method: "PATCH",
          headers: { ...headers, "Prefer": "return=minimal" },
          body: JSON.stringify({ attempt_count: newCount, locked_until: lockedUntil, last_attempt_at: (/* @__PURE__ */ new Date()).toISOString() })
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/login_attempts`, {
          method: "POST",
          headers: { ...headers, "Prefer": "return=minimal" },
          body: JSON.stringify({ user_identifier: identifier, attempt_count: newCount, locked_until: lockedUntil, last_attempt_at: (/* @__PURE__ */ new Date()).toISOString() })
        });
      }
      await logAudit(env, {
        hospital_id: null,
        user_type: role,
        user_id: null,
        action: "FAILED_LOGIN",
        details: `Failed login attempt for ${identifier}`
      });
      return new Response(JSON.stringify({ error: "Invalid Credentials" }), { status: 401 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost15, "onRequestPost15");
__name2(onRequestPost15, "onRequestPost");
async function onRequestPost16({ request, env }) {
  try {
    const data = await request.json();
    const { admin_phone, admin_pin } = data;
    if (!admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/audit_logs?id=not.is.null`, {
      method: "DELETE",
      headers
    });
    if (!deleteRes.ok) {
      const err = await deleteRes.json();
      return new Response(JSON.stringify({ error: err.message || "Failed to purge audit logs" }), { status: deleteRes.status });
    }
    await logAudit(env, {
      hospital_id: null,
      user_type: "Admin",
      user_id: authData[0].id,
      action: "PURGE_AUDIT",
      target_type: "System",
      target_id: null,
      details: `Admin purged all previous audit logs.`
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost16, "onRequestPost16");
__name2(onRequestPost16, "onRequestPost");
async function onRequestPost17({ request, env }) {
  try {
    const data = await request.json();
    const { target_type, target_id, is_active, admin_phone, admin_pin } = data;
    if (!target_type || !target_id || typeof is_active !== "boolean" || !admin_phone || !admin_pin) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const { SUPABASE_URL, headers } = getSupabaseConfig(env);
    const authRes = await fetch(`${SUPABASE_URL}/rest/v1/admins?phone=eq.${encodeURIComponent(admin_phone)}&pin=eq.${encodeURIComponent(admin_pin)}&select=id`, { headers });
    const authData = await authRes.json();
    if (!authRes.ok || !authData || authData.length === 0) {
      return new Response(JSON.stringify({ error: "Unauthorized Admin" }), { status: 401 });
    }
    let table = "";
    if (target_type === "Hospital") table = "hospitals";
    else if (target_type === "Staff") table = "staff";
    else if (target_type === "Doctor") table = "doctors";
    else if (target_type === "Patient") table = "patients";
    else return new Response(JSON.stringify({ error: "Invalid target_type" }), { status: 400 });
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${target_id}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ is_active })
    });
    if (!updateRes.ok) {
      const err = await updateRes.json();
      return new Response(JSON.stringify({ error: err.message }), { status: updateRes.status });
    }
    await logAudit(env, {
      hospital_id: null,
      user_type: "Admin",
      user_id: authData[0].id,
      action: is_active ? "ACTIVATE_ACCOUNT" : "PAUSE_ACCOUNT",
      target_type,
      target_id,
      details: `Set ${target_type} (${target_id}) to ${is_active ? "Active" : "Paused"}`
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost17, "onRequestPost17");
__name2(onRequestPost17, "onRequestPost");
var routes = [
  {
    routePath: "/api/add_doctor",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/add_hospital",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/add_patient",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/add_staff",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/add_treatment",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/admin_data",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/change_pin",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/cleanup_test",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/api/delete_hospital",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost9]
  },
  {
    routePath: "/api/delete_patient",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost10]
  },
  {
    routePath: "/api/delete_patients",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost11]
  },
  {
    routePath: "/api/delete_staff",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost12]
  },
  {
    routePath: "/api/edit_hospital",
    mountPath: "/api",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/edit_patient",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost13]
  },
  {
    routePath: "/api/edit_staff",
    mountPath: "/api",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch2]
  },
  {
    routePath: "/api/export_hospital",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost14]
  },
  {
    routePath: "/api/list_doctors",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/list_patients",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/list_staff",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/login",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost15]
  },
  {
    routePath: "/api/purge_audit",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost16]
  },
  {
    routePath: "/api/toggle_status",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost17]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-z8GgtR/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-z8GgtR/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.6967454637862044.js.map
