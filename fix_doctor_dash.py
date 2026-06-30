import re

with open('dashboard-doctor.html', 'r') as f:
    content = f.read()

# 1. Add filter UI to All Patients Tab
filter_html = '''      <div class="card">
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
          <input type="text" id="filterAllPatName" placeholder="Search by name or ID..." style="flex:1; min-width: 200px; padding: 10px; border: 1px solid var(--glass-border); border-radius: 8px; font-family: 'Poppins';" oninput="renderAllPatients()">
          <select id="filterAllPatDoc" style="padding: 10px; border: 1px solid var(--glass-border); border-radius: 8px; font-family: 'Poppins';" onchange="renderAllPatients()">
            <option value="">All Doctors</option>
          </select>
        </div>
        <table id="allPatientsTable">'''

content = content.replace('      <div class="card">\n        <table id="allPatientsTable">', filter_html)

# 2. Refactor loadPatients to populate doc filter and call renderAllPatients
load_patients_find = '''        if (res.ok && Array.isArray(patients)) {
          document.getElementById('statTotalPat').innerText = patients.length;
          let myCount = 0;
          patients.forEach(p => {
            const isMine = (p.assigned_doctor_id === userId);
            if (isMine) myCount++;
            const docName = p.doctors ? (p.doctors.full_name.startsWith('Dr.') ? p.doctors.full_name : 'Dr. ' + p.doctors.full_name) : 'Unassigned';
            const statusTag = p.treatment_status === 'completed' ? '<span class="tag" style="background:#10B981; color:white;">Completed</span>' : '<span class="tag">Ongoing</span>';

            // All Patients Row
            allPatientList.innerHTML += `'''

# We need to replace the entire rendering logic in loadPatients with renderAllPatients and renderMyPatients
# I'll just regex replace the body of loadPatients, or just replace the specific code.

load_patients_logic = '''        const myPatientList = document.getElementById('myPatientList');
        const allPatientList = document.getElementById('allPatientList');
        myPatientList.innerHTML = '';
        allPatientList.innerHTML = '';
        allPatientsData = patients;

        if (res.ok && Array.isArray(patients)) {
          document.getElementById('statTotalPat').innerText = patients.length;
          let myCount = 0;
          patients.forEach(p => {
            const isMine = (p.assigned_doctor_id === userId);
            if (isMine) myCount++;
            const docName = p.doctors ? (p.doctors.full_name.startsWith('Dr.') ? p.doctors.full_name : 'Dr. ' + p.doctors.full_name) : 'Unassigned';
            const statusTag = p.treatment_status === 'completed' ? '<span class="tag" style="background:#10B981; color:white;">Completed</span>' : '<span class="tag">Ongoing</span>';

            // All Patients Row
            allPatientList.innerHTML += `
            <tr style="cursor: pointer;" onclick="if(!['INPUT','A','BUTTON'].includes(event.target.tagName)) openEditPatient('${p.id}')">
              <td class="no-pdf"><input type="checkbox" class="patient-checkbox all-patient-checkbox" value="${p.id}" onclick="updateDeleteBtn('.all-patient-checkbox', 'btnDeleteSelectedAll')"></td>
              <td data-label="Patient Info"><strong>${p.full_name}</strong><br><span style="font-size:0.8rem; color:#888;">${p.pt_id || ''} • +91-${p.phone}</span><br><span style="font-size:0.8rem; color:#666;">Chief Complaint: ${p.chief_complaint || 'None'}</span></td>
              <td data-label="Assigned Doctor">${docName}</td>
              <td data-label="Status">${statusTag}</td>
              <td class="no-pdf" data-label="Actions">
                <a href="#" class="action-link" onclick="event.stopPropagation(); openTreatmentSheet('${p.id}', '${p.full_name.replace(/'/g, "\\\\'")}', '${p.age || '-'}', '${p.gender || '-'}', '${p.phone || '-'}', '${(p.chief_complaint || 'None').replace(/'/g, "\\\\'")}')">⚕️ Rx</a>
                <a href="#" class="action-link" onclick="event.stopPropagation(); openEditPatient('${p.id}')">Edit</a>
              </td>
            </tr>`;

            // My Patients Row
            if (isMine) {
              myPatientList.innerHTML += `
              <tr style="cursor: pointer;" onclick="if(!['INPUT','A','BUTTON'].includes(event.target.tagName)) openEditPatient('${p.id}')">
                <td class="no-pdf"><input type="checkbox" class="patient-checkbox my-patient-checkbox" value="${p.id}" onclick="updateDeleteBtn('.my-patient-checkbox', 'btnDeleteSelectedMy')"></td>
                <td data-label="Patient Info"><strong>${p.full_name}</strong><br><span style="font-size:0.8rem; color:#888;">${p.pt_id || ''} • +91-${p.phone}</span><br><span style="font-size:0.8rem; color:#666;">Chief Complaint: ${p.chief_complaint || 'None'}</span></td>
                <td data-label="Status">${statusTag}</td>
                <td class="no-pdf" data-label="Actions">
                  <a href="#" class="action-link" onclick="event.stopPropagation(); openTreatmentSheet('${p.id}', '${p.full_name.replace(/'/g, "\\\\'")}', '${p.age || '-'}', '${p.gender || '-'}', '${p.phone || '-'}', '${(p.chief_complaint || 'None').replace(/'/g, "\\\\'")}')">⚕️ Rx</a>
                  <a href="#" class="action-link" onclick="event.stopPropagation(); openEditPatient('${p.id}')">Edit</a>
                </td>
              </tr>`;
            }
          });
          document.getElementById('statMyPat').innerText = myCount;
        }'''

new_load_patients_logic = '''        allPatientsData = patients;

        if (res.ok && Array.isArray(patients)) {
          document.getElementById('statTotalPat').innerText = patients.length;
          let myCount = 0;
          patients.forEach(p => { if (p.assigned_doctor_id === userId) myCount++; });
          document.getElementById('statMyPat').innerText = myCount;
          
          window.renderAllPatients();
          window.renderMyPatients();
        }'''

content = content.replace(load_patients_logic, new_load_patients_logic)


render_functions = '''    window.renderAllPatients = function() {
      const allPatientList = document.getElementById('allPatientList');
      if(!allPatientList) return;
      allPatientList.innerHTML = '';
      
      const nameFilter = document.getElementById('filterAllPatName') ? document.getElementById('filterAllPatName').value.toLowerCase() : '';
      const docFilter = document.getElementById('filterAllPatDoc') ? document.getElementById('filterAllPatDoc').value : '';

      const filtered = allPatientsData.filter(p => {
          if (nameFilter && !p.full_name.toLowerCase().includes(nameFilter) && !(p.pt_id && p.pt_id.toLowerCase().includes(nameFilter))) return false;
          if (docFilter && p.assigned_doctor_id !== docFilter) return false;
          return true;
      });

      filtered.forEach(p => {
        const docName = p.doctors ? (p.doctors.full_name.startsWith('Dr.') ? p.doctors.full_name : 'Dr. ' + p.doctors.full_name) : 'Unassigned';
        const statusTag = p.treatment_status === 'completed' ? '<span class="tag" style="background:#10B981; color:white;">Completed</span>' : '<span class="tag">Ongoing</span>';

        allPatientList.innerHTML += `
        <tr style="cursor: pointer;" onclick="if(!['INPUT','A','BUTTON'].includes(event.target.tagName)) openEditPatient('${p.id}')">
          <td class="no-pdf"><input type="checkbox" class="patient-checkbox all-patient-checkbox" value="${p.id}" onclick="updateDeleteBtn('.all-patient-checkbox', 'btnDeleteSelectedAll')"></td>
          <td data-label="Patient Info"><strong>${p.full_name}</strong><br><span style="font-size:0.8rem; color:#888;">${p.pt_id || ''} • +91-${p.phone}</span><br><span style="font-size:0.8rem; color:#666;">Chief Complaint: ${p.chief_complaint || 'None'}</span></td>
          <td data-label="Assigned Doctor">${docName}</td>
          <td data-label="Status">${statusTag}</td>
          <td class="no-pdf" data-label="Actions">
            <a href="#" class="action-link" onclick="event.stopPropagation(); openTreatmentSheet('${p.id}', '${p.full_name.replace(/'/g, "\\\\'")}', '${p.age || '-'}', '${p.gender || '-'}', '${p.phone || '-'}', '${(p.chief_complaint || 'None').replace(/'/g, "\\\\'")}')">⚕️ Rx</a>
            <a href="#" class="action-link" onclick="event.stopPropagation(); openEditPatient('${p.id}')">Edit</a>
          </td>
        </tr>`;
      });
    };

    window.renderMyPatients = function() {
      const myPatientList = document.getElementById('myPatientList');
      if(!myPatientList) return;
      myPatientList.innerHTML = '';
      const userId = sessionStorage.getItem('userId');

      allPatientsData.filter(p => p.assigned_doctor_id === userId).forEach(p => {
        const statusTag = p.treatment_status === 'completed' ? '<span class="tag" style="background:#10B981; color:white;">Completed</span>' : '<span class="tag">Ongoing</span>';

        myPatientList.innerHTML += `
        <tr style="cursor: pointer;" onclick="if(!['INPUT','A','BUTTON'].includes(event.target.tagName)) openEditPatient('${p.id}')">
          <td class="no-pdf"><input type="checkbox" class="patient-checkbox my-patient-checkbox" value="${p.id}" onclick="updateDeleteBtn('.my-patient-checkbox', 'btnDeleteSelectedMy')"></td>
          <td data-label="Patient Info"><strong>${p.full_name}</strong><br><span style="font-size:0.8rem; color:#888;">${p.pt_id || ''} • +91-${p.phone}</span><br><span style="font-size:0.8rem; color:#666;">Chief Complaint: ${p.chief_complaint || 'None'}</span></td>
          <td data-label="Status">${statusTag}</td>
          <td class="no-pdf" data-label="Actions">
            <a href="#" class="action-link" onclick="event.stopPropagation(); openTreatmentSheet('${p.id}', '${p.full_name.replace(/'/g, "\\\\'")}', '${p.age || '-'}', '${p.gender || '-'}', '${p.phone || '-'}', '${(p.chief_complaint || 'None').replace(/'/g, "\\\\'")}')">⚕️ Rx</a>
            <a href="#" class="action-link" onclick="event.stopPropagation(); openEditPatient('${p.id}')">Edit</a>
          </td>
        </tr>`;
      });
    };
'''

content = content.replace('    async function loadDoctors() {', render_functions + '\n    async function loadDoctors() {')

# 3. Populate doctor filter in loadDoctors
load_docs_find = '''        if (res.ok && Array.isArray(doctors)) {
          doctors.forEach(d => {
            docSelect.innerHTML += `<option value="${d.id}">${d.full_name}</option>`;
          });
        }'''
load_docs_repl = '''        if (res.ok && Array.isArray(doctors)) {
          const filterDocSelect = document.getElementById('filterAllPatDoc');
          if(filterDocSelect) filterDocSelect.innerHTML = '<option value="">All Doctors</option>';
          doctors.forEach(d => {
            docSelect.innerHTML += `<option value="${d.id}">${d.full_name}</option>`;
            if(filterDocSelect) filterDocSelect.innerHTML += `<option value="${d.id}">${d.full_name}</option>`;
          });
        }'''
content = content.replace(load_docs_find, load_docs_repl)

# 4. Fix openTreatmentSheet and markCompleted
open_treat_find = '''    function openTreatmentSheet(patientId, name, age, gender, phone, complaint) {
      document.getElementById('treatmentPatientName').innerText = name + ' - Treatment Log';'''
open_treat_repl = '''    function openTreatmentSheet(patientId, name, age, gender, phone, complaint) {
      window.currentTreatmentPatientId = patientId;
      document.getElementById('treatmentPatientName').innerText = name + ' - Treatment Log';'''
content = content.replace(open_treat_find, open_treat_repl)

mark_comp_find = '''    function markCompleted() {
      showToast("Patient treatment marked as completed! They can return later if needed.", "success");
      // API call to update patient treatment_status to 'completed'
    }'''
mark_comp_repl = '''    async function markCompleted() {
      if(!window.currentTreatmentPatientId) return;
      try {
        const res = await fetch('/api/update_patient', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ patient_id: window.currentTreatmentPatientId, treatment_status: 'completed' })
        });
        if(!res.ok) throw new Error("Failed to update status");
        
        showToast("Patient treatment marked as completed!", "success");
        closeModal('treatmentModal');
        await loadPatients();
      } catch(e) {
        showToast(e.message, "error");
      }
    }'''
content = content.replace(mark_comp_find, mark_comp_repl)

with open('dashboard-doctor.html', 'w') as f:
    f.write(content)

print("Applied Doctor Dashboard filters and markCompleted fix.")
