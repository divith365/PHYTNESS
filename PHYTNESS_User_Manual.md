# PHYTNESS Healthcare - User Manual

Welcome to **PHYTNESS**, the premier digital management platform for physiotherapy centres and healthcare facilities! 

This guide is designed to help everyone—from hospital owners to receptionists and doctors—understand how to seamlessly use the PHYTNESS portal to manage daily operations, track patient progress, and maintain secure records.

---

## 1. Getting Started: The Main Portal

When you open the PHYTNESS application, you will be greeted by the **Main Portal**. This is the central hub for everyone. 

Depending on your role at the clinic, you will click on one of the specific portals:
* **Therapist Portal**: For doctors and physical therapists.
* **Staff Portal**: For receptionists and hospital administrators.
* **Patient Portal**: For end-users receiving treatment.
* **Admin Access**: Found at the very bottom, reserved exclusively for the global Super Admins who manage the software.

To log in, simply select your portal, enter your unique **Login ID** or **Phone Number**, and type in your 4-digit or 6-digit **PIN password**.

*(Note: For your security, if you enter the wrong password 3 times in a row, your account will be temporarily locked for 5 minutes.)*

---

## 2. Super Admin Guide (Global Management)

If you are a Super Admin, you are in charge of overseeing the entire platform and onboarding new clinics.

### Adding a New Hospital
1. Log into the Admin Dashboard.
2. Click the **+ Add Hospital** button.
3. Enter the Hospital's name and contact information.
4. **Success!** The system will automatically generate a unique prefix for this hospital (for example, "CH" for City Hospital).

### Adding Staff & Therapists
1. Click the **+ Add Staff / Therapist** button.
2. Select which Hospital they belong to from the dropdown menu.
3. Choose their role (Staff or Doctor).
4. Enter their name and phone number.
5. **Success!** The system will generate a secure Login ID for them (like `CH-S01` for staff, or `CH-D01` for doctors). Give this ID and the default password to your employee so they can log in!

### Generating Reports
Need to see all the data for a specific clinic? In your Hospitals list, click **⬇ Export Excel**. The system will instantly download a complete, multi-tab Excel spreadsheet containing all the hospital details, staff lists, and patient records.

---

## 3. Staff Guide (Hospital Reception & Admin)

If you are Hospital Staff, your main job is greeting patients, adding them to the system, and making sure they are assigned to the right therapist.

### Registering a New Patient
1. Log into the **Staff Portal**.
2. Click **+ Register Patient**.
3. Fill out the patient's name, age, phone number, and their chief complaint (e.g., "Lower back pain").
4. **Assign a Doctor**: Use the dropdown menu to select which therapist will be treating this patient. If you aren't sure yet, you can leave it as "Unassigned" and update it later!
5. **Success!** The patient is now registered. Their Login ID is simply their phone number, and their default password is `0000`. 

---

## 4. Therapist Guide (Doctors & Physiotherapists)

If you are a Therapist, your portal is completely focused on your patients and their medical progress.

### Viewing Your Patients
When you log in to the **Therapist Portal**, you will immediately see a clean, organized dashboard.
* **My Patients**: Shows only the patients that have been assigned specifically to you.
* **All Centre Patients**: Allows you to view other patients in the hospital (in case you are covering for a colleague), but you cannot edit their records.

### Logging Treatment Notes
We designed the treatment tracking to feel just like a real medical clipboard!
1. Click on any patient card in your "My Patients" list.
2. This opens the **Treatment Sheet**. You will see a history of all past sessions, complete with timestamps.
3. To add a new note, simply type in the text box at the bottom and click **Save Notes**.
4. The system will automatically attach today's date and securely append your notes to the patient's permanent record.

*(Note: Once notes are saved, they cannot be altered, ensuring a highly secure and compliant medical audit trail!)*

---

## 5. Security & Privacy

Your patient data is highly secure. PHYTNESS utilizes a strict multi-tenant architecture. This means:
* A doctor at "Clinic A" cannot see the patients, staff, or data of "Clinic B".
* Every single action (logging in, adding a patient, updating a treatment note) is silently recorded in an **Audit Trail** that only the Super Admin can review.
* If an employee leaves the clinic, the Super Admin can instantly "Pause" their account, immediately revoking their access to the system.

---
**Thank you for choosing PHYTNESS to power your healthcare operations!**
