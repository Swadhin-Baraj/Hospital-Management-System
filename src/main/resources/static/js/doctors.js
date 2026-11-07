
const DOCTOR_API = "/api/doctors";
const DEPARTMENT_API = "/api/departments";

const doctorForm = document.getElementById("doctorForm");
const doctorTableBody = document.getElementById("doctorTableBody");
const departmentSelect = document.getElementById("departmentId");
const searchDoctor = document.getElementById("searchDoctor");

let doctors = [];
let departments = [];

// Load departments into dropdown
async function loadDepartments() {
    try {
        const response = await fetch(DEPARTMENT_API);

        if (!response.ok) {
            throw new Error("Unable to load departments");
        }

        departments = await response.json();

        departmentSelect.innerHTML =
            '<option value="">Select Department</option>';

        departments.forEach(department => {
            const option = document.createElement("option");

            option.value = department.departmentId;
            option.textContent = department.departmentName;

            departmentSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Department Error:", error);
        alert("Unable to load departments. Check your Department API.");
    }
}

// Load all doctors
async function loadDoctors() {
    try {
        const response = await fetch(DOCTOR_API);

        if (!response.ok) {
            throw new Error("Unable to load doctors");
        }

        doctors = await response.json();

        displayDoctors(doctors);

    } catch (error) {
        console.error("Doctor Error:", error);

        doctorTableBody.innerHTML =
            `<tr><td colspan="8">Unable to load doctors. Check your backend API.</td></tr>`;
    }
}

// Display doctors
function displayDoctors(doctorList) {
    doctorTableBody.innerHTML = "";

    if (doctorList.length === 0) {
        doctorTableBody.innerHTML =
            `<tr><td colspan="8">No doctors found.</td></tr>`;
        return;
    }

    doctorList.forEach(doctor => {
        const departmentName =
            doctor.department?.departmentName ??
            doctor.departmentName ??
            "Not assigned";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${doctor.doctorId}</td>
            <td>${escapeHTML(doctor.name)}</td>
            <td>${escapeHTML(doctor.specialization)}</td>
            <td>${escapeHTML(doctor.qualification)}</td>
            <td>${doctor.experienceYears} years</td>
            <td>${escapeHTML(departmentName)}</td>
            <td>₹${doctor.consultationFee}</td>
            <td>
                <button class="action-btn edit-btn"
                    data-action="edit"
                    data-id="${doctor.doctorId}">
                    Edit
                </button>

                <button class="action-btn delete-btn"
                    data-action="delete"
                    data-id="${doctor.doctorId}">
                    Delete
                </button>
            </td>
        `;

        doctorTableBody.appendChild(row);
    });
}

// Protect displayed text
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Add or update doctor
doctorForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const doctorId = document.getElementById("doctorId").value;

    const departmentId = Number(departmentSelect.value);

    const doctor = {
        name: document.getElementById("doctorName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        qualification: document.getElementById("qualification").value.trim(),
        specialization: document.getElementById("specialization").value.trim(),
        experienceYears: Number(
            document.getElementById("experienceYears").value
        ),
        consultationFee: Number(
            document.getElementById("consultationFee").value
        ),
        department: {
            departmentId: departmentId
        }
    };

    const isEditing = doctorId !== "";

    const url = isEditing
        ? `${DOCTOR_API}/${doctorId}`
        : DOCTOR_API;

    try {
        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doctor)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Unable to save doctor");
        }

        alert(isEditing
            ? "Doctor updated successfully!"
            : "Doctor added successfully!");

        resetDoctorForm();
        await loadDoctors();

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
});

// Edit or delete
doctorTableBody.addEventListener("click", async function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {
        editDoctor(id);
    }

    if (button.dataset.action === "delete") {
        await deleteDoctor(id);
    }
});

// Edit doctor
function editDoctor(id) {
    const doctor = doctors.find(
        item => String(item.doctorId) === String(id)
    );

    if (!doctor) return;

    document.getElementById("doctorId").value = doctor.doctorId;
    document.getElementById("doctorName").value = doctor.name ?? "";
    document.getElementById("email").value = doctor.email ?? "";
    document.getElementById("phone").value = doctor.phone ?? "";
    document.getElementById("qualification").value =
        doctor.qualification ?? "";
    document.getElementById("specialization").value =
        doctor.specialization ?? "";
    document.getElementById("experienceYears").value =
        doctor.experienceYears ?? "";
    document.getElementById("consultationFee").value =
        doctor.consultationFee ?? "";

    const currentDepartmentId =
        doctor.department?.departmentId ??
        doctor.departmentId ??
        "";

    departmentSelect.value = currentDepartmentId;

    document.getElementById("doctorFormTitle").textContent =
        "Update Doctor";

    document.getElementById("doctorSubmitBtn").textContent =
        "Update Doctor";

    document.getElementById("doctorCancelBtn").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete doctor
async function deleteDoctor(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) {
        return;
    }

    try {
        const response = await fetch(`${DOCTOR_API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(
                "Unable to delete doctor. Check whether appointments reference this doctor."
            );
        }

        alert("Doctor deleted successfully!");

        await loadDoctors();

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}

// Reset form
function resetDoctorForm() {
    doctorForm.reset();

    document.getElementById("doctorId").value = "";

    document.getElementById("doctorFormTitle").textContent =
        "Add New Doctor";

    document.getElementById("doctorSubmitBtn").textContent =
        "Add Doctor";

    document.getElementById("doctorCancelBtn").hidden = true;
}

// Cancel editing
document.getElementById("doctorCancelBtn")
    .addEventListener("click", resetDoctorForm);

// Search by name or specialization
searchDoctor.addEventListener("input", function() {
    const searchText = this.value.toLowerCase();

    const filteredDoctors = doctors.filter(doctor =>
        String(doctor.name ?? "").toLowerCase().includes(searchText) ||
        String(doctor.specialization ?? "").toLowerCase().includes(searchText)
    );

    displayDoctors(filteredDoctors);
});

// Initial loading
async function initializeDoctorPage() {
    await loadDepartments();
    await loadDoctors();
}

initializeDoctorPage();
