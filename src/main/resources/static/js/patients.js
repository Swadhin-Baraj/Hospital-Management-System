
const API_URL = "/api/patients";

const patientForm = document.getElementById("patientForm");
const patientTableBody = document.getElementById("patientTableBody");
const searchPatient = document.getElementById("searchPatient");

let patients = [];

// Load all patients
async function loadPatients() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load patients");
        }

        patients = await response.json();

        displayPatients(patients);

    } catch (error) {

        console.error(error);

        patientTableBody.innerHTML =
            `<tr><td colspan="7">Error loading patients. Check your backend API.</td></tr>`;
    }
}

// Display patients in table
function displayPatients(patientList) {

    patientTableBody.innerHTML = "";

    if (patientList.length === 0) {

        patientTableBody.innerHTML =
            `<tr><td colspan="7">No patients found.</td></tr>`;

        return;
    }

    patientList.forEach(patient => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${patient.patientId}</td>
            <td>${escapeHTML(patient.name)}</td>
            <td>${patient.age}</td>
            <td>${escapeHTML(patient.gender)}</td>
            <td>${escapeHTML(patient.phone)}</td>
            <td>${escapeHTML(patient.address)}</td>
            <td>
                <button class="action-btn edit-btn"
                        data-action="edit"
                        data-id="${patient.patientId}">
                    Edit
                </button>

                <button class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${patient.patientId}">
                    Delete
                </button>
            </td>
        `;

        patientTableBody.appendChild(row);
    });
}

// Protect table from HTML injection
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Add or update patient
patientForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const patientId = document.getElementById("patientId").value;

    const patient = {
        name: document.getElementById("name").value.trim(),
        age: Number(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim()
    };

    const isEditing = patientId !== "";

    const url = isEditing
        ? `${API_URL}/${patientId}`
        : API_URL;

    try {

        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(patient)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Unable to save patient");
        }

        alert(isEditing
            ? "Patient updated successfully!"
            : "Patient added successfully!");

        resetForm();
        await loadPatients();

    } catch (error) {

        alert("Error: " + error.message);
        console.error(error);
    }
});

// Edit or delete using table buttons
patientTableBody.addEventListener("click", async function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const patientId = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
        editPatient(patientId);
    }

    if (action === "delete") {
        await deletePatient(patientId);
    }
});

// Fill form for editing
function editPatient(id) {

    const patient = patients.find(
        item => String(item.patientId) === String(id)
    );

    if (!patient) return;

    document.getElementById("patientId").value = patient.patientId;
    document.getElementById("name").value = patient.name;
    document.getElementById("age").value = patient.age;
    document.getElementById("gender").value = patient.gender;
    document.getElementById("phone").value = patient.phone;
    document.getElementById("address").value = patient.address;

    document.getElementById("formTitle").textContent =
        "Update Patient";

    document.getElementById("submitBtn").textContent =
        "Update Patient";

    document.getElementById("cancelBtn").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete patient
async function deletePatient(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete patient");
        }

        alert("Patient deleted successfully!");

        await loadPatients();

    } catch (error) {

        alert("Error: " + error.message);
        console.error(error);
    }
}

// Reset form
function resetForm() {

    patientForm.reset();

    document.getElementById("patientId").value = "";

    document.getElementById("formTitle").textContent =
        "Add New Patient";

    document.getElementById("submitBtn").textContent =
        "Add Patient";

    document.getElementById("cancelBtn").hidden = true;
}

// Cancel editing
document.getElementById("cancelBtn").addEventListener(
    "click",
    resetForm
);

// Search patients by name
searchPatient.addEventListener("input", function() {

    const searchText = this.value.toLowerCase();

    const filteredPatients = patients.filter(patient =>
        String(patient.name ?? "")
            .toLowerCase()
            .includes(searchText)
    );

    displayPatients(filteredPatients);
});

// Initial load
loadPatients();
