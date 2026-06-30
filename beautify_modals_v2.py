import os

confirm_modal_html = """  <div class="modal-overlay" id="confirmModal">
    <div class="modal-content" style="max-width: 450px; text-align: center;">
      <div style="font-size: 3.5rem; margin-bottom: 10px;">⚠️</div>
      <h2 style="color: #FF5A5F; font-family: 'Outfit'; margin-bottom: 15px;" id="confirmModalTitle">Are you absolutely sure?</h2>
      <p style="color: var(--text); font-size: 1.05rem; margin-bottom: 25px; line-height: 1.5;" id="confirmModalDesc"></p>
      <div style="display: flex; gap: 15px;">
        <button class="btn-primary" style="flex: 1; background: transparent; border: 2px solid var(--glass-border); color: var(--text);" onclick="closeModal('confirmModal')">Cancel</button>
        <button class="btn-primary" style="flex: 1; background: #FF5A5F; border-color: #FF5A5F;" id="confirmModalYesBtn">Yes, Proceed</button>
      </div>
    </div>
  </div>"""

confirm_js = """    let confirmCallback = null;
    window.showConfirm = function(title, desc, callback) {
        document.getElementById('confirmModalTitle').innerText = title;
        document.getElementById('confirmModalDesc').innerText = desc;
        confirmCallback = callback;
        openModal('confirmModal');
    };
    document.getElementById('confirmModalYesBtn')?.addEventListener('click', () => {
        closeModal('confirmModal');
        if(confirmCallback) confirmCallback();
    });"""

def process_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Add HTML and JS to staff and doctor dashboards
    if 'dashboard-admin.html' not in filename:
        if 'id="confirmModal"' not in content:
            content = content.replace('  <div id="toastContainer"></div>', '  <div id="toastContainer"></div>\n' + confirm_modal_html)
        if 'window.showConfirm' not in content:
            content = content.replace("    function openModal(id) {", confirm_js + "\n    function openModal(id) {")

    # Replace confirm in downloadTableAsPDF
    old_pdf = '''    function downloadTableAsPDF(tableId, title) {
        if(!confirm("Do you want to download this table as a PDF?")) return;'''
    new_pdf = '''    function downloadTableAsPDF(tableId, title) {
        showConfirm("Download PDF?", "Do you want to download this table as a PDF?", () => {'''
    
    old_pdf_end = '''        html2pdf().set(opt).from(wrapper).save();
    }'''
    new_pdf_end = '''        html2pdf().set(opt).from(wrapper).save();
        });
    }'''
    
    if old_pdf in content and old_pdf_end in content:
        content = content.replace(old_pdf, new_pdf).replace(old_pdf_end, new_pdf_end)
        
    # Replace confirm in downloadTreatmentPDF
    old_treat = '''    function downloadTreatmentPDF() {
      if(!confirm("Do you want to download this treatment log as a PDF?")) return;'''
    new_treat = '''    function downloadTreatmentPDF() {
      showConfirm("Download PDF?", "Do you want to download this treatment log as a PDF?", () => {'''
      
    old_treat_end = '''      html2pdf().set(opt).from(wrapper).save();
    }'''
    new_treat_end = '''      html2pdf().set(opt).from(wrapper).save();
      });
    }'''
    
    if old_treat in content and old_treat_end in content:
        content = content.replace(old_treat, new_treat).replace(old_treat_end, new_treat_end)

    # Replace confirm in deleteSelectedPatients
    old_del = '''    async function deleteSelectedPatients(selector) {
      if (!confirm("Are you sure you want to delete the selected patients?")) return;'''
    new_del = '''    async function deleteSelectedPatients(selector) {
      showConfirm("Delete Patients?", "Are you sure you want to permanently delete the selected patients?", async () => {'''
    old_del_staff = '''    async function deleteSelectedPatients() {
      if (!confirm("Are you sure you want to delete the selected patients?")) return;'''
    new_del_staff = '''    async function deleteSelectedPatients() {
      showConfirm("Delete Patients?", "Are you sure you want to permanently delete the selected patients?", async () => {'''
      
    old_del_end = '''      } catch (err) {
        showToast("Error deleting patients: " + err.message, "error");
      }
    }'''
    new_del_end = '''      } catch (err) {
        showToast("Error deleting patients: " + err.message, "error");
      }
      });
    }'''
    
    if old_del in content and old_del_end in content:
        content = content.replace(old_del, new_del).replace(old_del_end, new_del_end)
    elif old_del_staff in content and old_del_end in content:
        content = content.replace(old_del_staff, new_del_staff).replace(old_del_end, new_del_end)


    with open(filename, 'w') as f:
        f.write(content)

process_file('dashboard-admin.html')
process_file('dashboard-doctor.html')
process_file('dashboard-staff.html')
print("Successfully beautified modals.")
