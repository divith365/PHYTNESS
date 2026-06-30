import { onRequestPost as __api_add_doctor_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_doctor.js"
import { onRequestPost as __api_add_hospital_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_hospital.js"
import { onRequestPost as __api_add_patient_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_patient.js"
import { onRequestPost as __api_add_staff_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_staff.js"
import { onRequestPost as __api_add_treatment_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_treatment.js"
import { onRequestPost as __api_admin_data_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/admin_data.js"
import { onRequestPost as __api_change_pin_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/change_pin.js"
import { onRequestPost as __api_cleanup_test_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/cleanup_test.js"
import { onRequestPost as __api_delete_hospital_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/delete_hospital.js"
import { onRequestPost as __api_delete_patient_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/delete_patient.js"
import { onRequestPost as __api_delete_patients_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/delete_patients.js"
import { onRequestPost as __api_delete_staff_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/delete_staff.js"
import { onRequestPatch as __api_edit_hospital_js_onRequestPatch } from "/home/arun/PHYTNESS/functions/api/edit_hospital.js"
import { onRequestPost as __api_edit_patient_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/edit_patient.js"
import { onRequestPatch as __api_edit_staff_js_onRequestPatch } from "/home/arun/PHYTNESS/functions/api/edit_staff.js"
import { onRequestPost as __api_export_hospital_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/export_hospital.js"
import { onRequestGet as __api_list_doctors_js_onRequestGet } from "/home/arun/PHYTNESS/functions/api/list_doctors.js"
import { onRequestGet as __api_list_patients_js_onRequestGet } from "/home/arun/PHYTNESS/functions/api/list_patients.js"
import { onRequestGet as __api_list_staff_js_onRequestGet } from "/home/arun/PHYTNESS/functions/api/list_staff.js"
import { onRequestPost as __api_login_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/login.js"
import { onRequestPost as __api_purge_audit_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/purge_audit.js"
import { onRequestPost as __api_toggle_status_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/toggle_status.js"

export const routes = [
    {
      routePath: "/api/add_doctor",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_doctor_js_onRequestPost],
    },
  {
      routePath: "/api/add_hospital",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_hospital_js_onRequestPost],
    },
  {
      routePath: "/api/add_patient",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_patient_js_onRequestPost],
    },
  {
      routePath: "/api/add_staff",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_staff_js_onRequestPost],
    },
  {
      routePath: "/api/add_treatment",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_treatment_js_onRequestPost],
    },
  {
      routePath: "/api/admin_data",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_data_js_onRequestPost],
    },
  {
      routePath: "/api/change_pin",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_change_pin_js_onRequestPost],
    },
  {
      routePath: "/api/cleanup_test",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_cleanup_test_js_onRequestPost],
    },
  {
      routePath: "/api/delete_hospital",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_delete_hospital_js_onRequestPost],
    },
  {
      routePath: "/api/delete_patient",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_delete_patient_js_onRequestPost],
    },
  {
      routePath: "/api/delete_patients",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_delete_patients_js_onRequestPost],
    },
  {
      routePath: "/api/delete_staff",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_delete_staff_js_onRequestPost],
    },
  {
      routePath: "/api/edit_hospital",
      mountPath: "/api",
      method: "PATCH",
      middlewares: [],
      modules: [__api_edit_hospital_js_onRequestPatch],
    },
  {
      routePath: "/api/edit_patient",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_edit_patient_js_onRequestPost],
    },
  {
      routePath: "/api/edit_staff",
      mountPath: "/api",
      method: "PATCH",
      middlewares: [],
      modules: [__api_edit_staff_js_onRequestPatch],
    },
  {
      routePath: "/api/export_hospital",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_export_hospital_js_onRequestPost],
    },
  {
      routePath: "/api/list_doctors",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_list_doctors_js_onRequestGet],
    },
  {
      routePath: "/api/list_patients",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_list_patients_js_onRequestGet],
    },
  {
      routePath: "/api/list_staff",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_list_staff_js_onRequestGet],
    },
  {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_js_onRequestPost],
    },
  {
      routePath: "/api/purge_audit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_purge_audit_js_onRequestPost],
    },
  {
      routePath: "/api/toggle_status",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_toggle_status_js_onRequestPost],
    },
  ]