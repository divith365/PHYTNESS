import re

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

    # Inject HTML if not present
    if 'id="confirmModal"' not in content:
        # insert before the last modal or just before script tag
        content = content.replace('  <!-- JS Files -->', confirm_modal_html + '\n\n  <!-- JS Files -->')
        if 'id="confirmModal"' not in content:
            content = content.replace('  <script>', confirm_modal_html + '\n\n  <script>')

    # Inject JS if not present
    if 'window.showConfirm' not in content:
        content = content.replace('    function openModal(id) { document.getElementById(id).classList.add(\'active\'); }',
                                  confirm_js + '\n    function openModal(id) { document.getElementById(id).classList.add(\'active\'); }')

    # Update downloadTableAsPDF
    pdf_func = re.search(r'(function downloadTableAsPDF\s*\([^)]*\)\s*\{)(.*?)(    \})', content, re.DOTALL)
    if pdf_func:
        inner = pdf_func.group(2)
        if '!confirm' in inner:
            inner_clean = re.sub(r'^\s*if\s*\(!confirm[^)]+\)\)\s*return;\s*', '', inner, flags=re.MULTILINE)
            new_func = f"{pdf_func.group(1)}\n      showConfirm('Download PDF?', 'Do you want to download this table as a PDF?', () => {{\n{inner_clean}      }});\n{pdf_func.group(3)}"
            content = content.replace(pdf_func.group(0), new_func)

    # Update downloadTreatmentPDF
    treat_pdf_func = re.search(r'(function downloadTreatmentPDF\s*\([^)]*\)\s*\{)(.*?)(    \})', content, re.DOTALL)
    if treat_pdf_func:
        inner = treat_pdf_func.group(2)
        if '!confirm' in inner:
            inner_clean = re.sub(r'^\s*if\s*\(!confirm[^)]+\)\)\s*return;\s*', '', inner, flags=re.MULTILINE)
            new_func = f"{treat_pdf_func.group(1)}\n      showConfirm('Download PDF?', 'Do you want to download this treatment log as a PDF?', () => {{\n{inner_clean}      }});\n{treat_pdf_func.group(3)}"
            content = content.replace(treat_pdf_func.group(0), new_func)

    # Update deleteSelectedPatients
    delete_func = re.search(r'(function deleteSelectedPatients\s*\([^)]*\)\s*\{)(.*?)(    \})', content, re.DOTALL)
    if delete_func:
        inner = delete_func.group(2)
        if '!confirm' in inner:
            inner_clean = re.sub(r'^\s*if\s*\(!confirm[^)]+\)\)\s*return;\s*', '', inner, flags=re.MULTILINE)
            new_func = f"{delete_func.group(1)}\n      showConfirm('Delete Patients?', 'Are you sure you want to permanently delete the selected patients?', () => {{\n{inner_clean}      }});\n{delete_func.group(3)}"
            content = content.replace(delete_func.group(0), new_func)
            
    with open(filename, 'w') as f:
        f.write(content)

process_file('dashboard-admin.html')
process_file('dashboard-doctor.html')
process_file('dashboard-staff.html')
print("Beautified confirm modals!")
