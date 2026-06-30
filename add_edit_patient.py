import re

# Read admin dashboard
with open('/home/arun/PHYTNESS/dashboard-admin.html', 'r') as f:
    admin_html = f.read()

# Replace "View Only" with Edit link in renderPatientsTable
old_action = '<span style="font-size:0.85rem; color:#888;">View Only</span>'
new_action = """<a href="#" class="action-link" style="margin-right: 12px;" onclick="openEditPatient('${p.id}')">✏️ Edit</a>"""
admin_html = admin_html.replace(old_action, new_action)

# Add checkbox to table
old_td = """<td data-label="Patient Info"><strong>${p.full_name}</strong>"""
new_td = """<td class="no-pdf" data-label="Select">
                        <input type="checkbox" class="admin-patient-checkbox" data-id="${p.id}" style="width: 16px; height: 16px; cursor: pointer;">
                    </td>
                    <td data-label="Patient Info"><strong>${p.full_name}</strong>"""
admin_html = admin_html.replace(old_td, new_td)

# Add the Edit Patient Modal HTML before the confirmModal
modal_html = """
  <div id="editPatientModal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Patient</h2>
        <button class="close-btn" onclick="closeModal('editPatientModal')">×</button>
      </div>
      <form id="editPatientForm">
        <input type="hidden" id="editPatId">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="editPatName" required>
        </div>
        <div class="two-col">
          <div class="form-group">
            <label>Age</label>
            <input type="number" id="editPatAge" min="1" max="120" oninput="if(this.value.length > 3) this.value = this.value.slice(0,3); if(this.value > 120) this.value = 120;" required>
          </div>
          <div class="form-group">
            <label>Gender</label>
            <select id="editPatGender" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div class="two-col">
          <div class="form-group">
            <label>Phone Number (10 digits)</label>
            <input type="tel" id="editPatPhone" pattern="[6-9][0-9]{9}" title="Must be a valid 10-digit mobile number starting with 6, 7, 8, or 9" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)" required>
          </div>
          <div class="form-group">
            <label>Assign to Doctor</label>
            <select id="editPatDoctor">
              <option value="">-- Unassigned --</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Chief Complaint</label>
          <textarea id="editPatComplaint" rows="2"></textarea>
        </div>
        <button type="submit" class="btn-submit">Save Changes</button>
      </form>
    </div>
  </div>
"""

admin_html = admin_html.replace('  <div class="modal-overlay" id="confirmModal">', modal_html + '\n  <div class="modal-overlay" id="confirmModal">')


js_logic = """
    window.openEditPatient = async function(id) {
      const patient = window.globalPatientsList.find(p => p.id === id);
      if(!patient) return;
      
      const docSelect = document.getElementById('editPatDoctor');
      docSelect.innerHTML = '<option value="">-- Unassigned --</option>';
      const docs = window.globalStaffList.filter(s => s.role_type === 'Doctor');
      docs.forEach(d => {
          docSelect.innerHTML += `<option value="${d.id}">${d.full_name} (${window.globalHospMap[d.hospital_id] || ''})</option>`;
      });

      document.getElementById('editPatId').value = patient.id;
      document.getElementById('editPatName').value = patient.full_name;
      document.getElementById('editPatAge').value = patient.age || '';
      document.getElementById('editPatGender').value = patient.gender || 'Male';
      document.getElementById('editPatPhone').value = patient.phone || '';
      document.getElementById('editPatComplaint').value = patient.chief_complaint || '';
      document.getElementById('editPatDoctor').value = patient.assigned_doctor_id || '';
      openModal('editPatientModal');
    };

    document.getElementById('editPatientForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-submit');
      const originalText = btn.innerText;
      btn.innerText = 'Saving...'; btn.disabled = true;

      const id = document.getElementById('editPatId').value;
      const data = {
        full_name: document.getElementById('editPatName').value,
        age: document.getElementById('editPatAge').value,
        gender: document.getElementById('editPatGender').value,
        phone: document.getElementById('editPatPhone').value,
        chief_complaint: document.getElementById('editPatComplaint').value,
        assigned_doctor_id: document.getElementById('editPatDoctor').value || null
      };

      try {
        const res = await fetch('/api/update_patient', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ patient_id: id, ...data })
        });
        const result = await res.json();
        if(!res.ok) throw new Error(result.error);
        
        closeModal('editPatientModal');
        await loadData();
      } catch(err) {
        alert("Failed to update patient: " + err.message);
      } finally {
        btn.innerText = originalText; btn.disabled = false;
      }
    });

    window.deleteSelectedPatients = function() {
        const checkboxes = document.querySelectorAll('.admin-patient-checkbox:checked');
        if (checkboxes.length === 0) return alert("Select at least one patient to delete.");
        
        const ids = Array.from(checkboxes).map(cb => cb.dataset.id);
        showConfirm(`Delete ${ids.length} Patient(s)?`, "Are you sure you want to permanently delete these patients and all their records? This cannot be undone.", () => {
            executeDeletePatient(ids);
        });
    };

    async function executeDeletePatient(ids) {
        try {
            for (const id of ids) {
                const res = await fetch('/api/update_patient', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ patient_id: id })
                });
                if(!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error);
                }
            }
            await loadData();
        } catch (e) {
            alert("Delete failed: " + e.message);
        }
    }
"""

admin_html = admin_html.replace('window.deleteSingleStaff = function', js_logic + '\n    window.deleteSingleStaff = function')


with open('/home/arun/PHYTNESS/dashboard-admin.html', 'w') as f:
    f.write(admin_html)

print("Injected patient edit/delete into dashboard-admin.html")
