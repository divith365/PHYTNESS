import re

with open('dashboard-doctor.html', 'r') as f:
    content = f.read()

# 1. My Patients Table
content = content.replace(
    '''        <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; gap: 10px;">
          <button class="btn-logout" style="border: none; padding: 5px; font-size: 1.2rem;" onclick="downloadTableAsPDF('myPatientsTable', 'My Patients')" title="Download PDF">⬇️</button>
          <button id="btnDeleteSelectedMy" class="btn-primary" style="background: #ef4444; display: none;" onclick="deleteSelectedPatients('.my-patient-checkbox')">Delete Selected</button>
        </div>
        <table id="myPatientsTable">
          <thead>
            <tr>
              <th class="no-pdf" style="width: 40px;"><input type="checkbox" id="selectAllMyPat" onclick="toggleAllCheckboxes(this, '.my-patient-checkbox')"></th>
              <th>Patient Info</th>
              <th>Status</th>
              <th class="no-pdf">Actions</th>''',
    '''        <table id="myPatientsTable">
          <thead>
            <tr>
              <th class="no-pdf" style="width: 40px;"><input type="checkbox" id="selectAllMyPat" onclick="toggleAllCheckboxes(this, '.my-patient-checkbox')"></th>
              <th>Patient Info</th>
              <th>Status</th>
              <th class="no-pdf">Actions <button id="btnDeleteSelectedMy" class="btn-primary" style="background: #ef4444; display: none; padding: 2px 8px; font-size: 0.75rem; margin-right: 10px;" onclick="deleteSelectedPatients('.my-patient-checkbox')">Delete</button><button class="btn-logout" style="border: none; padding: 0 5px; font-size: 0.85rem;" onclick="downloadTableAsPDF('myPatientsTable', 'My Patients')" title="Download PDF">⬇️</button></th>'''
)

# 2. All Centre Patients Table
content = content.replace(
    '''        <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; gap: 10px;">
          <button class="btn-logout" style="border: none; padding: 5px; font-size: 1.2rem;" onclick="downloadTableAsPDF('allPatientsTable', 'All Centre Patients')" title="Download PDF">⬇️</button>
          <button id="btnDeleteSelectedAll" class="btn-primary" style="background: #ef4444; display: none;" onclick="deleteSelectedPatients('.all-patient-checkbox')">Delete Selected</button>
        </div>
        <table id="allPatientsTable">
          <thead>
            <tr>
              <th class="no-pdf" style="width: 40px;"><input type="checkbox" id="selectAllAllPat" onclick="toggleAllCheckboxes(this, '.all-patient-checkbox')"></th>
              <th>Patient Info</th>
              <th>Assigned Doctor</th>
              <th>Status</th>
              <th class="no-pdf">Actions</th>''',
    '''        <table id="allPatientsTable">
          <thead>
            <tr>
              <th class="no-pdf" style="width: 40px;"><input type="checkbox" id="selectAllAllPat" onclick="toggleAllCheckboxes(this, '.all-patient-checkbox')"></th>
              <th>Patient Info</th>
              <th>Assigned Doctor</th>
              <th>Status</th>
              <th class="no-pdf">Actions <button id="btnDeleteSelectedAll" class="btn-primary" style="background: #ef4444; display: none; padding: 2px 8px; font-size: 0.75rem; margin-right: 10px;" onclick="deleteSelectedPatients('.all-patient-checkbox')">Delete</button><button class="btn-logout" style="border: none; padding: 0 5px; font-size: 0.85rem;" onclick="downloadTableAsPDF('allPatientsTable', 'All Centre Patients')" title="Download PDF">⬇️</button></th>'''
)

# 3. Staff Directory Table
content = content.replace(
    '''        <div style="display: flex; justify-content: flex-end; margin-bottom: 5px;">
          <button class="btn-logout" style="border: none; padding: 5px; font-size: 1.2rem;" onclick="downloadTableAsPDF('staffDirTable', 'Staff Directory')" title="Download PDF">⬇️</button>
        </div>
        <table id="staffDirTable">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Phone</th>''',
    '''        <table id="staffDirTable">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Phone <button class="btn-logout" style="border: none; padding: 0 5px; font-size: 0.85rem;" onclick="downloadTableAsPDF('staffDirTable', 'Staff Directory')" title="Download PDF">⬇️</button></th>'''
)

# 4. Doctors Directory Table
content = content.replace(
    '''        <div style="display: flex; justify-content: flex-end; margin-bottom: 5px;">
          <button class="btn-logout" style="border: none; padding: 5px; font-size: 1.2rem;" onclick="downloadTableAsPDF('doctorDirTable', 'Doctors Directory')" title="Download PDF">⬇️</button>
        </div>
        <table id="doctorDirTable">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Qualification</th>''',
    '''        <table id="doctorDirTable">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Qualification <button class="btn-logout" style="border: none; padding: 0 5px; font-size: 0.85rem;" onclick="downloadTableAsPDF('doctorDirTable', 'Doctors Directory')" title="Download PDF">⬇️</button></th>'''
)

with open('dashboard-doctor.html', 'w') as f:
    f.write(content)

print("Moved download and delete buttons into table headers for Doctor dashboard.")
