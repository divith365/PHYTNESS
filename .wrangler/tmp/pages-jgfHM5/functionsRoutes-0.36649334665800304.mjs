import { onRequestPost as __api_add_doctor_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_doctor.js"
import { onRequestPost as __api_add_patient_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/add_patient.js"
import { onRequestPost as __api_change_pin_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/change_pin.js"
import { onRequestPost as __api_login_js_onRequestPost } from "/home/arun/PHYTNESS/functions/api/login.js"

export const routes = [
    {
      routePath: "/api/add_doctor",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_doctor_js_onRequestPost],
    },
  {
      routePath: "/api/add_patient",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_add_patient_js_onRequestPost],
    },
  {
      routePath: "/api/change_pin",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_change_pin_js_onRequestPost],
    },
  {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_js_onRequestPost],
    },
  ]