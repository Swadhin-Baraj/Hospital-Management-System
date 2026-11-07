
const API = "/api";

async function loadDashboard() {

    try {

        const endpoints = [
            "/patients",
            "/doctors",
            "/appointments",
            "/departments"
        ];

        const responses = await Promise.all(
            endpoints.map(url => fetch(API + url))
        );

        if (responses.some(response => !response.ok)) {
            throw new Error("Unable to fetch dashboard data");
        }

        const data = await Promise.all(
            responses.map(response => response.json())
        );

        document.getElementById("patientCount").textContent =
            data[0].length;

        document.getElementById("doctorCount").textContent =
            data[1].length;

        document.getElementById("appointmentCount").textContent =
            data[2].length;

        document.getElementById("departmentCount").textContent =
            data[3].length;

    } catch (error) {

        console.error("Dashboard Error:", error);

    }
}

loadDashboard();
