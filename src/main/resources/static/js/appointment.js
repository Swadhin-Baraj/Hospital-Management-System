
const APPOINTMENT_API = "/api/appointments";
const PATIENT_API = "/api/patients";
const DOCTOR_API = "/api/doctors";

const appointmentForm = document.getElementById("appointmentForm");
const appointmentTableBody =
    document.getElementById("appointmentTableBody");

const patientSelect = document.getElementById("patientId");
const doctorSelect = document.getElementById("doctorId");

let appointments = [];

// Safely display text
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Load patients into dropdown
async function loadPatients() {
    try {
        const response = await fetch(PATIENT_API);

        if (!response.ok) {
            throw new Error("Unable to load patients");
        }

        const patients = await response.json();

        patientSelect.innerHTML =
            '<option value="">Select Patient</option>';

        patients.forEach(patient => {
            const option = document.createElement("option");

            option.value = patient.patientId;
            option.textContent =
                `${patient.patientId} - ${patient.name}`;

            patientSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Patient loading error:", error);

        patientSelect.innerHTML =
            '<option value="">Unable to load patients</option>';
    }
}

// Load doctors into dropdown
async function loadDoctors() {
    try {
        const response = await fetch(DOCTOR_API);

        if (!response.ok) {
            throw new Error("Unable to load doctors");
        }

        const doctors = await response.json();

        doctorSelect.innerHTML =
            '<option value="">Select Doctor</option>';

        doctors.forEach(doctor => {
            const option = document.createElement("option");

            option.value = doctor.doctorId;
            option.textContent =
                `${doctor.doctorId} - ${doctor.name}`;

            doctorSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Doctor loading error:", error);

        doctorSelect.innerHTML =
            '<option value="">Unable to load doctors</option>';
    }
}

// Load appointments
async function loadAppointments() {
    try {
        const response = await fetch(APPOINTMENT_API);

        if (!response.ok) {
            throw new Error("Unable to load appointments");
        }

        appointments = await response.json();

        displayAppointments(appointments);

    } catch (error) {
        console.error("Appointment loading error:", error);

        appointmentTableBody.innerHTML =
            `<tr><td colspan="8">Unable to load appointments. Check your API.</td></tr>`;
    }
}

// Display appointments
function displayAppointments(list) {
    appointmentTableBody.innerHTML = "";

    if (list.length === 0) {
        appointmentTableBody.innerHTML =
            `<tr><td colspan="8">No appointments found.</td></tr>`;
        return;
    }

    list.forEach(appointment => {
        const patientName =
            appointment.patient?.name ??
            appointment.patientName ??
            "Unknown";

        const doctorName =
            appointment.doctor?.name ??
            appointment.doctorName ??
            "Unknown";

        const status = appointment.status ?? "BOOKED";
        const statusClass = "status-" + status.toLowerCase();

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.appointmentId}</td>
            <td>${escapeHTML(patientName)}</td>
            <td>${escapeHTML(doctorName)}</td>
            <td>${escapeHTML(appointment.appointmentDate)}</td>
            <td>${escapeHTML(appointment.appointmentTime)}</td>
            <td>${escapeHTML(appointment.reason)}</td>
            <td class="${statusClass}">
                ${escapeHTML(status)}
            </td>
            <td>
                ${
                    status === "BOOKED"
                    ? `
                        <button class="action-btn edit-btn"
                            data-action="edit"
                            data-id="${appointment.appointmentId}">
                            Reschedule
                        </button>

                        <button class="action-btn delete-btn"
                            data-action="cancel"
                            data-id="${appointment.appointmentId}">
                            Cancel
                        </button>

                        <button class="action-btn"
                            data-action="complete"
                            data-id="${appointment.appointmentId}">
                            Complete
                        </button>
                    `
                    : "-"
                }
            </td>
        `;

        appointmentTableBody.appendChild(row);
    });
}

// Book or reschedule appointment
appointmentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const appointmentId =
        document.getElementById("appointmentId").value;

    const appointment = {
        patientId: Number(patientSelect.value),
        doctorId: Number(doctorSelect.value),
        appointmentDate:
            document.getElementById("appointmentDate").value,
        appointmentTime:
            document.getElementById("appointmentTime").value,
        reason:
            document.getElementById("reason").value.trim()
    };

    if (!appointment.patientId || !appointment.doctorId) {
        alert("Please select both patient and doctor.");
        return;
    }

    const isEditing = appointmentId !== "";

    const url = isEditing
        ? `${APPOINTMENT_API}/${appointmentId}`
        : APPOINTMENT_API;

    try {
        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Unable to save appointment");
        }

        alert(isEditing
            ? "Appointment rescheduled successfully!"
            : "Appointment booked successfully!");

        resetAppointmentForm();
        await loadAppointments();

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
});

// Handle appointment actions
appointmentTableBody.addEventListener("click", async function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
        editAppointment(id);
    }

    if (action === "cancel") {
        await updateAppointmentStatus(id, "cancel");
    }

    if (action === "complete") {
        await updateAppointmentStatus(id, "complete");
    }
});

// Reschedule appointment
function editAppointment(id) {
    const appointment = appointments.find(
        item => String(item.appointmentId) === String(id)
    );

    if (!appointment) return;

    document.getElementById("appointmentId").value =
        appointment.appointmentId;

    patientSelect.value =
        appointment.patient?.patientId ??
        appointment.patientId ??
        "";

    doctorSelect.value =
        appointment.doctor?.doctorId ??
        appointment.doctorId ??
        "";

    document.getElementById("appointmentDate").value =
        appointment.appointmentDate;

    document.getElementById("appointmentTime").value =
        String(appointment.appointmentTime).substring(0, 5);

    document.getElementById("reason").value =
        appointment.reason ?? "";

    document.getElementById("appointmentFormTitle").textContent =
        "Reschedule Appointment";

    document.getElementById("appointmentSubmitBtn").textContent =
        "Update Appointment";

    document.getElementById("appointmentCancelBtn").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel or complete appointment
async function updateAppointmentStatus(id, action) {
    const message = action === "cancel"
        ? "Are you sure you want to cancel this appointment?"
        : "Mark this appointment as completed?";

    if (!confirm(message)) return;

    try {
        const response = await fetch(
            `${APPOINTMENT_API}/${id}/${action}`,
            { method: "PATCH" }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Unable to update appointment");
        }

        alert(action === "cancel"
            ? "Appointment cancelled successfully!"
            : "Appointment marked as completed!");

        await loadAppointments();

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}

// Reset form
function resetAppointmentForm() {
    appointmentForm.reset();

    document.getElementById("appointmentId").value = "";

    document.getElementById("appointmentFormTitle").textContent =
        "Book New Appointment";

    document.getElementById("appointmentSubmitBtn").textContent =
        "Book Appointment";

    document.getElementById("appointmentCancelBtn").hidden = true;
}

// Cancel editing
document.getElementById("appointmentCancelBtn")
    .addEventListener("click", resetAppointmentForm);

// Search appointments
document.getElementById("searchAppointment")
    .addEventListener("input", function() {

        const searchText = this.value.toLowerCase();

        const filtered = appointments.filter(appointment => {
            const patientName =
                appointment.patient?.name ??
                appointment.patientName ?? "";

            const doctorName =
                appointment.doctor?.name ??
                appointment.doctorName ?? "";

            return patientName.toLowerCase().includes(searchText) ||
                   doctorName.toLowerCase().includes(searchText);
        });

        displayAppointments(filtered);
    });

// Set minimum date to today
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

document.getElementById("appointmentDate").min = localToday;

// Initialize page
async function initializeAppointmentPage() {
    await loadPatients();
    await loadDoctors();
    await loadAppointments();
}

initializeAppointmentPage();
