-- Supabase Database Schema - Multi-Tenant Setup

-- Clean up existing (Optional, but safe if starting fresh)
DROP TABLE IF EXISTS login_attempts CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS treatment_logs CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP SEQUENCE IF EXISTS hospital_seq CASCADE;
DROP SEQUENCE IF EXISTS doctor_seq CASCADE;
DROP SEQUENCE IF EXISTS patient_seq CASCADE;
DROP SEQUENCE IF EXISTS staff_seq CASCADE;

-- Sequences for generating sequential IDs
-- hospital_seq removed
CREATE SEQUENCE staff_seq START 1;
CREATE SEQUENCE doctor_seq START 1;
CREATE SEQUENCE patient_seq START 1;

-- 1. Admins Table (Global Super Admin)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Hospitals Table (The Tenant)
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    prefix TEXT UNIQUE, -- e.g., 'PH' for Prime Hospital, specified by Admin manually.
    address TEXT,
    contact TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hospital prefix is now passed directly from frontend, no trigger needed.

-- 3. Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    login_id TEXT UNIQUE, -- e.g., CH1-S01. Auto-generated.
    full_name TEXT NOT NULL,
    phone TEXT,
    pin TEXT NOT NULL DEFAULT '123456', -- Default 6 digit
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function & Trigger for Staff ID
CREATE OR REPLACE FUNCTION set_staff_login_id()
RETURNS TRIGGER AS $$
DECLARE
  h_prefix TEXT;
BEGIN
  IF NEW.login_id IS NULL THEN
    SELECT prefix INTO h_prefix FROM hospitals WHERE id = NEW.hospital_id;
    NEW.login_id := h_prefix || 'S' || LPAD(nextval('staff_seq')::TEXT, 2, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_staff_login_id
BEFORE INSERT ON staff
FOR EACH ROW
EXECUTE FUNCTION set_staff_login_id();

-- 4. Doctors Table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    login_id TEXT UNIQUE, -- e.g., CH1-D01. Auto-generated.
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    qualification TEXT,
    specialization TEXT,
    experience INTEGER,
    pin TEXT NOT NULL DEFAULT '123456', -- Default 6 digit
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function & Trigger for Doctor ID
CREATE OR REPLACE FUNCTION set_doctor_login_id()
RETURNS TRIGGER AS $$
DECLARE
  h_prefix TEXT;
BEGIN
  IF NEW.login_id IS NULL THEN
    SELECT prefix INTO h_prefix FROM hospitals WHERE id = NEW.hospital_id;
    NEW.login_id := h_prefix || 'D' || LPAD(nextval('doctor_seq')::TEXT, 2, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_doctor_login_id
BEFORE INSERT ON doctors
FOR EACH ROW
EXECUTE FUNCTION set_doctor_login_id();

-- 5. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    pt_id TEXT UNIQUE, -- e.g., CH1-P001. Auto-generated.
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    chief_complaint TEXT,
    diagnosis TEXT,
    affected_body_part TEXT,
    duration TEXT,
    medical_history JSONB DEFAULT '[]'::jsonb,
    assigned_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    pin TEXT DEFAULT '0000',
    photo_url TEXT,
    treatment_status TEXT DEFAULT 'ongoing', -- 'ongoing' or 'completed'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (hospital_id, phone)
);

-- Function & Trigger for Patient ID
CREATE OR REPLACE FUNCTION set_patient_id()
RETURNS TRIGGER AS $$
DECLARE
  h_prefix TEXT;
BEGIN
  IF NEW.pt_id IS NULL THEN
    SELECT prefix INTO h_prefix FROM hospitals WHERE id = NEW.hospital_id;
    NEW.pt_id := h_prefix || 'P' || LPAD(nextval('patient_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_patient_id
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION set_patient_id();

-- 6. Treatment Logs
CREATE TABLE treatment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE, -- NULL for admin global actions
    user_type TEXT NOT NULL, -- 'Admin', 'Staff', 'Doctor', 'Patient'
    user_id UUID, 
    action TEXT NOT NULL, 
    target_type TEXT, 
    target_id UUID,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Login Attempts (Rate Limiting)
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_identifier TEXT NOT NULL, -- The login ID or Phone used
    attempt_count INTEGER DEFAULT 1,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 8. AUTO-ROTATION FOR AUDIT LOGS
-- ==========================================
-- Automatically deletes logs older than 90 days to prevent infinite database growth
CREATE OR REPLACE FUNCTION rotate_audit_logs() 
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rotate_audit_logs
AFTER INSERT ON audit_logs
FOR EACH STATEMENT
EXECUTE FUNCTION rotate_audit_logs();

-- Insert a default admin so you can login!
INSERT INTO admins (full_name, phone, pin) VALUES ('Super Admin', '1234567890', '123456') ON CONFLICT (phone) DO NOTHING;
