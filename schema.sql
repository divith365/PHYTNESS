-- Supabase Database Schema

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    qualification TEXT,
    specialization TEXT,
    experience INTEGER,
    pin TEXT NOT NULL DEFAULT '1111',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pt_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT UNIQUE NOT NULL,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    chief_complaint TEXT,
    diagnosis TEXT,
    affected_body_part TEXT,
    duration TEXT,
    medical_history JSONB DEFAULT '[]'::jsonb,
    assigned_doctor_id UUID REFERENCES doctors(id),
    pin TEXT DEFAULT '0000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Sequences for IDs
CREATE SEQUENCE IF NOT EXISTS doctor_seq START 1;
CREATE SEQUENCE IF NOT EXISTS patient_seq START 1;

-- 5. Function & Trigger for Doctor ID
CREATE OR REPLACE FUNCTION set_doctor_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.doc_id IS NULL THEN
    NEW.doc_id := 'DR-' || LPAD(nextval('doctor_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_doctor_id ON doctors;
CREATE TRIGGER trigger_set_doctor_id
BEFORE INSERT ON doctors
FOR EACH ROW
EXECUTE FUNCTION set_doctor_id();

-- 6. Function & Trigger for Patient ID
CREATE OR REPLACE FUNCTION set_patient_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pt_id IS NULL THEN
    NEW.pt_id := 'PT-' || LPAD(nextval('patient_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_patient_id ON patients;
CREATE TRIGGER trigger_set_patient_id
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION set_patient_id();

-- 7. Insert a default admin so you can login!
INSERT INTO admins (full_name, phone, pin) VALUES ('Super Admin', '1234567890', '1234') ON CONFLICT DO NOTHING;
