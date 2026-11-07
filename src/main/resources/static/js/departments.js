async function loadDepartments() {

    try {

        const response = await fetch(DEPARTMENT_API);

        if (!response.ok) {
            throw new Error("Unable to fetch departments");
        }

        const departments = await response.json();

        const departmentSelect =
            document.getElementById("departmentId");

        departmentSelect.innerHTML =
            '<option value="">Select Department</option>';

        departments.forEach(department => {

            const option = document.createElement("option");

            option.value = department.departmentId;

            option.textContent = department.departmentName;

            departmentSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Department loading failed!");

    }
}