// =====================================================
// CAREPLAN - FRONTEND JAVASCRIPT
// =====================================================


// =====================================================
// GENERAL
// =====================================================

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }
}


// =====================================================
// PATIENT MANAGEMENT
// =====================================================

async function addPatient() {

    const name =
        document.getElementById("patientName").value.trim();

    const age =
        document.getElementById("patientAge").value;

    const phone =
        document.getElementById("patientPhone").value.trim();


    if (!name || !age || !phone) {

        alert("Please fill all patient details.");

        return;
    }


    const patient = {

        name: name,

        age: parseInt(age),

        phone: phone

    };


    try {

        const response =
            await fetch("/api/patients", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(patient)

            });


        if (!response.ok) {

            throw new Error(
                "Failed to add patient"
            );

        }


        await response.json();


        alert(
            "Patient added successfully!"
        );


        document.getElementById(
            "patientName"
        ).value = "";


        document.getElementById(
            "patientAge"
        ).value = "";


        document.getElementById(
            "patientPhone"
        ).value = "";


        await loadPatients();

        await loadMedicinePatients();

        await loadAppointmentPatients();

        await loadDosePatients();

        await loadHistoryPatients();

    }
    catch (error) {

        console.error(
            "Error adding patient:",
            error
        );

        alert(
            "Unable to add patient."
        );

    }
}



async function loadPatients() {

    try {

        const response =
            await fetch("/api/patients");


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        const patientList =
            document.getElementById(
                "patientList"
            );


        if (!patientList) {
            return;
        }


        patientList.innerHTML = "";


        if (patients.length === 0) {

            patientList.innerHTML =
                "<p>No patients found.</p>";

            return;
        }


        patients.forEach(
            patient => {

                const patientCard =
                    document.createElement("div");


                patientCard.className =
                    "data-card";


                patientCard.innerHTML = `

                    <p>
                        <strong>ID:</strong>
                        ${patient.id}
                    </p>

                    <p>
                        <strong>Name:</strong>
                        ${patient.name}
                    </p>

                    <p>
                        <strong>Age:</strong>
                        ${patient.age}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${patient.phone}
                    </p>

                    <div class="patient-actions">

                        <button
                            onclick="editPatient(
                                ${patient.id},
                                '${escapeQuotes(patient.name)}',
                                ${patient.age},
                                '${escapeQuotes(patient.phone)}'
                            )"
                        >
                            Edit
                        </button>

                        <button
                            onclick="deletePatient(
                                ${patient.id}
                            )"
                        >
                            Delete
                        </button>

                    </div>

                `;


                patientList.appendChild(
                    patientCard
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading patients:",
            error
        );

        alert(
            "Unable to load patients."
        );

    }
}



async function editPatient(
    id,
    oldName,
    oldAge,
    oldPhone
) {

    const name =
        prompt(
            "Enter patient name:",
            oldName
        );


    if (name === null) {
        return;
    }


    const age =
        prompt(
            "Enter patient age:",
            oldAge
        );


    if (age === null) {
        return;
    }


    const phone =
        prompt(
            "Enter patient phone:",
            oldPhone
        );


    if (phone === null) {
        return;
    }


    if (
        !name.trim() ||
        !age.trim() ||
        !phone.trim()
    ) {

        alert(
            "All patient details are required."
        );

        return;
    }


    const updatedPatient = {

        name: name.trim(),

        age: parseInt(age),

        phone: phone.trim()

    };


    try {

        const response =
            await fetch(
                `/api/patients/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedPatient
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update patient"
            );

        }


        alert(
            "Patient updated successfully!"
        );


        await loadPatients();

        await loadMedicinePatients();

        await loadAppointmentPatients();

        await loadDosePatients();

        await loadHistoryPatients();

    }
    catch (error) {

        console.error(
            "Error updating patient:",
            error
        );

        alert(
            "Unable to update patient."
        );

    }
}



async function deletePatient(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this patient?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/patients/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete patient"
            );

        }


        alert(
            "Patient deleted successfully!"
        );


        await loadPatients();

        await loadMedicinePatients();

        await loadAppointmentPatients();

        await loadDosePatients();

        await loadHistoryPatients();

    }
    catch (error) {

        console.error(
            "Error deleting patient:",
            error
        );

        alert(
            "Unable to delete patient."
        );

    }
}


// =====================================================
// MEDICINE - PATIENT DROPDOWN
// =====================================================

async function loadMedicinePatients() {

    try {

        const response =
            await fetch("/api/patients");


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        const select =
            document.getElementById(
                "medicinePatient"
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Select Patient
            </option>
        `;


        patients.forEach(
            patient => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    patient.id;


                option.textContent =
                    `${patient.name} (ID: ${patient.id})`;


                select.appendChild(
                    option
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading medicine patients:",
            error
        );

    }
}


// =====================================================
// MEDICINE MANAGEMENT
// =====================================================

async function addMedicine() {

    const medicineName =
        document.getElementById(
            "medicineName"
        ).value.trim();


    const dosage =
        document.getElementById(
            "medicineDosage"
        ).value.trim();


    const frequency =
        document.getElementById(
            "medicineFrequency"
        ).value.trim();


    const timing =
        document.getElementById(
            "medicineTiming"
        ).value.trim();


    const patientId =
        document.getElementById(
            "medicinePatient"
        ).value;


    if (
        !medicineName ||
        !dosage ||
        !frequency ||
        !timing ||
        !patientId
    ) {

        alert(
            "Please fill all medicine details."
        );

        return;
    }


    const medicine = {

        medicineName: medicineName,

        dosage: dosage,

        frequency: frequency,

        timing: timing,

        patient: {
            id: parseInt(patientId)
        }

    };


    try {

        const response =
            await fetch(
                "/api/medicines",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            medicine
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add medicine"
            );

        }


        await response.json();


        alert(
            "Medicine added successfully!"
        );


        document.getElementById(
            "medicineName"
        ).value = "";


        document.getElementById(
            "medicineDosage"
        ).value = "";


        document.getElementById(
            "medicineFrequency"
        ).value = "";


        document.getElementById(
            "medicineTiming"
        ).value = "";


        document.getElementById(
            "medicinePatient"
        ).value = "";


        await loadMedicines();

    }
    catch (error) {

        console.error(
            "Error adding medicine:",
            error
        );

        alert(
            "Unable to add medicine."
        );

    }
}



async function loadMedicines() {

    try {

        const response =
            await fetch(
                "/api/medicines"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load medicines"
            );

        }


        const medicines =
            await response.json();


        const medicineList =
            document.getElementById(
                "medicineList"
            );


        if (!medicineList) {
            return;
        }


        medicineList.innerHTML = "";


        if (medicines.length === 0) {

            medicineList.innerHTML =
                "<p>No medicines found.</p>";

            return;
        }


        medicines.forEach(
            medicine => {

                const medicineCard =
                    document.createElement(
                        "div"
                    );


                medicineCard.className =
                    "data-card";


                const patientName =
                    medicine.patient
                        ? medicine.patient.name
                        : "Not assigned";


                const patientId =
                    medicine.patient
                        ? medicine.patient.id
                        : "";


                medicineCard.innerHTML = `

                    <p>
                        <strong>
                            Medicine:
                        </strong>
                        ${medicine.medicineName}
                    </p>

                    <p>
                        <strong>
                            Dosage:
                        </strong>
                        ${medicine.dosage}
                    </p>

                    <p>
                        <strong>
                            Frequency:
                        </strong>
                        ${medicine.frequency}
                    </p>

                    <p>
                        <strong>
                            Timing:
                        </strong>
                        ${medicine.timing}
                    </p>

                    <p>
                        <strong>
                            Patient:
                        </strong>
                        ${patientName}
                    </p>

                    <div class="patient-actions">

                        <button
                            onclick="editMedicine(
                                ${medicine.id},
                                '${escapeQuotes(medicine.medicineName)}',
                                '${escapeQuotes(medicine.dosage)}',
                                '${escapeQuotes(medicine.frequency)}',
                                '${escapeQuotes(medicine.timing)}',
                                ${patientId}
                            )"
                        >
                            Edit
                        </button>

                        <button
                            onclick="deleteMedicine(
                                ${medicine.id}
                            )"
                        >
                            Delete
                        </button>

                    </div>

                `;


                medicineList.appendChild(
                    medicineCard
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading medicines:",
            error
        );

        alert(
            "Unable to load medicines."
        );

    }
}



async function editMedicine(
    id,
    oldName,
    oldDosage,
    oldFrequency,
    oldTiming,
    oldPatientId
) {

    const medicineName =
        prompt(
            "Enter medicine name:",
            oldName
        );


    if (medicineName === null) {
        return;
    }


    const dosage =
        prompt(
            "Enter dosage:",
            oldDosage
        );


    if (dosage === null) {
        return;
    }


    const frequency =
        prompt(
            "Enter frequency:",
            oldFrequency
        );


    if (frequency === null) {
        return;
    }


    const timing =
        prompt(
            "Enter timing:",
            oldTiming
        );


    if (timing === null) {
        return;
    }


    const patientId =
        prompt(
            "Enter patient ID:",
            oldPatientId || ""
        );


    if (patientId === null) {
        return;
    }


    if (
        !medicineName.trim() ||
        !dosage.trim() ||
        !frequency.trim() ||
        !timing.trim() ||
        !patientId.trim()
    ) {

        alert(
            "All medicine details are required."
        );

        return;
    }


    const updatedMedicine = {

        medicineName:
            medicineName.trim(),

        dosage:
            dosage.trim(),

        frequency:
            frequency.trim(),

        timing:
            timing.trim(),

        patient: {
            id: parseInt(patientId)
        }

    };


    try {

        const response =
            await fetch(
                `/api/medicines/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedMedicine
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update medicine"
            );

        }


        alert(
            "Medicine updated successfully!"
        );


        await loadMedicines();

    }
    catch (error) {

        console.error(
            "Error updating medicine:",
            error
        );

        alert(
            "Unable to update medicine."
        );

    }
}



async function deleteMedicine(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this medicine?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/medicines/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete medicine"
            );

        }


        alert(
            "Medicine deleted successfully!"
        );


        await loadMedicines();

    }
    catch (error) {

        console.error(
            "Error deleting medicine:",
            error
        );

        alert(
            "Unable to delete medicine."
        );

    }
}


// =====================================================
// APPOINTMENT - PATIENT DROPDOWN
// =====================================================

async function loadAppointmentPatients() {

    try {

        const response =
            await fetch(
                "/api/patients"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        const select =
            document.getElementById(
                "appointmentPatient"
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Select Patient
            </option>
        `;


        patients.forEach(
            patient => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    patient.id;


                option.textContent =
                    `${patient.name} (ID: ${patient.id})`;


                select.appendChild(
                    option
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading appointment patients:",
            error
        );

    }
}


// =====================================================
// APPOINTMENT MANAGEMENT
// =====================================================

async function addAppointment() {

    const doctorName =
        document.getElementById(
            "doctorName"
        ).value.trim();


    const appointmentDate =
        document.getElementById(
            "appointmentDate"
        ).value;


    const appointmentTime =
        document.getElementById(
            "appointmentTime"
        ).value;


    const reason =
        document.getElementById(
            "appointmentReason"
        ).value.trim();


    const patientId =
        document.getElementById(
            "appointmentPatient"
        ).value;


    if (
        !doctorName ||
        !appointmentDate ||
        !appointmentTime ||
        !reason ||
        !patientId
    ) {

        alert(
            "Please fill all appointment details."
        );

        return;
    }


    const appointment = {

        doctorName: doctorName,

        appointmentDate:
        appointmentDate,

        appointmentTime:
        appointmentTime,

        reason: reason,

        patient: {
            id: parseInt(patientId)
        }

    };


    try {

        const response =
            await fetch(
                "/api/appointments",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            appointment
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add appointment"
            );

        }


        await response.json();


        alert(
            "Appointment added successfully!"
        );


        document.getElementById(
            "doctorName"
        ).value = "";


        document.getElementById(
            "appointmentDate"
        ).value = "";


        document.getElementById(
            "appointmentTime"
        ).value = "";


        document.getElementById(
            "appointmentReason"
        ).value = "";


        document.getElementById(
            "appointmentPatient"
        ).value = "";


        await loadAppointments();

    }
    catch (error) {

        console.error(
            "Error adding appointment:",
            error
        );

        alert(
            "Unable to add appointment."
        );

    }
}



async function loadAppointments() {

    try {

        const response =
            await fetch(
                "/api/appointments"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load appointments"
            );

        }


        const appointments =
            await response.json();


        const appointmentList =
            document.getElementById(
                "appointmentList"
            );


        if (!appointmentList) {
            return;
        }


        appointmentList.innerHTML = "";


        if (appointments.length === 0) {

            appointmentList.innerHTML =
                "<p>No appointments found.</p>";

            return;
        }


        appointments.forEach(
            appointment => {

                const appointmentCard =
                    document.createElement(
                        "div"
                    );


                appointmentCard.className =
                    "data-card";


                const patientName =
                    appointment.patient
                        ? appointment.patient.name
                        : "Not assigned";


                const patientId =
                    appointment.patient
                        ? appointment.patient.id
                        : "";


                appointmentCard.innerHTML = `

                    <p>
                        <strong>
                            Appointment ID:
                        </strong>
                        ${appointment.id}
                    </p>

                    <p>
                        <strong>
                            Doctor:
                        </strong>
                        ${appointment.doctorName}
                    </p>

                    <p>
                        <strong>
                            Date:
                        </strong>
                        ${appointment.appointmentDate}
                    </p>

                    <p>
                        <strong>
                            Time:
                        </strong>
                        ${appointment.appointmentTime}
                    </p>

                    <p>
                        <strong>
                            Reason:
                        </strong>
                        ${appointment.reason}
                    </p>

                    <p>
                        <strong>
                            Patient:
                        </strong>
                        ${patientName}
                    </p>

                    <div class="patient-actions">

                        <button
                            onclick="editAppointment(
                                ${appointment.id},
                                '${escapeQuotes(appointment.doctorName)}',
                                '${appointment.appointmentDate}',
                                '${appointment.appointmentTime}',
                                '${escapeQuotes(appointment.reason)}',
                                ${patientId}
                            )"
                        >
                            Edit
                        </button>

                        <button
                            onclick="deleteAppointment(
                                ${appointment.id}
                            )"
                        >
                            Delete
                        </button>

                    </div>

                `;


                appointmentList.appendChild(
                    appointmentCard
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading appointments:",
            error
        );

        alert(
            "Unable to load appointments."
        );

    }
}



async function editAppointment(
    id,
    oldDoctorName,
    oldDate,
    oldTime,
    oldReason,
    oldPatientId
) {

    const doctorName =
        prompt(
            "Enter doctor name:",
            oldDoctorName
        );


    if (doctorName === null) {
        return;
    }


    const appointmentDate =
        prompt(
            "Enter appointment date (YYYY-MM-DD):",
            oldDate
        );


    if (appointmentDate === null) {
        return;
    }


    const appointmentTime =
        prompt(
            "Enter appointment time (HH:MM:SS):",
            oldTime
        );


    if (appointmentTime === null) {
        return;
    }


    const reason =
        prompt(
            "Enter reason:",
            oldReason
        );


    if (reason === null) {
        return;
    }


    const patientId =
        prompt(
            "Enter patient ID:",
            oldPatientId || ""
        );


    if (patientId === null) {
        return;
    }


    if (
        !doctorName.trim() ||
        !appointmentDate.trim() ||
        !appointmentTime.trim() ||
        !reason.trim() ||
        !patientId.trim()
    ) {

        alert(
            "All appointment details are required."
        );

        return;
    }


    const updatedAppointment = {

        doctorName:
            doctorName.trim(),

        appointmentDate:
            appointmentDate.trim(),

        appointmentTime:
            appointmentTime.trim(),

        reason:
            reason.trim(),

        patient: {
            id: parseInt(patientId)
        }

    };


    try {

        const response =
            await fetch(
                `/api/appointments/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedAppointment
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update appointment"
            );

        }


        alert(
            "Appointment updated successfully!"
        );


        await loadAppointments();

    }
    catch (error) {

        console.error(
            "Error updating appointment:",
            error
        );

        alert(
            "Unable to update appointment."
        );

    }
}



async function deleteAppointment(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this appointment?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/appointments/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete appointment"
            );

        }


        alert(
            "Appointment deleted successfully!"
        );


        await loadAppointments();

    }
    catch (error) {

        console.error(
            "Error deleting appointment:",
            error
        );

        alert(
            "Unable to delete appointment."
        );

    }
}


// =====================================================
// FEATURE 2
// TODAY'S EXPECTED DOSES
// =====================================================


// Load patients into Today's Doses dropdown

async function loadDosePatients() {

    const select =
        document.getElementById(
            "dosePatient"
        );


    if (!select) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/patients"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        select.innerHTML = "";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value = "";


        defaultOption.textContent =
            "Select Patient";


        select.appendChild(
            defaultOption
        );


        patients.forEach(
            patient => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    patient.id;


                option.textContent =
                    `${patient.name} (ID: ${patient.id})`;


                select.appendChild(
                    option
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading dose patients:",
            error
        );


        select.innerHTML = `
            <option value="">
                Unable to load patients
            </option>
        `;

    }
}


// =====================================================
// GENERATE TODAY'S DOSES
// =====================================================

async function generateTodayDoses() {

    const patientId =
        document.getElementById(
            "dosePatient"
        ).value;


    if (!patientId) {

        alert(
            "Please select a patient."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/doses/generate/today/${patientId}`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to generate today's doses"
            );

        }


        const doses =
            await response.json();


        alert(
            "Today's doses generated successfully!"
        );


        displayTodayDoses(
            doses
        );

    }
    catch (error) {

        console.error(
            "Error generating today's doses:",
            error
        );


        alert(
            "Unable to generate today's doses."
        );

    }
}


// =====================================================
// LOAD TODAY'S DOSES
// =====================================================

async function loadTodayDoses() {

    const patientId =
        document.getElementById(
            "dosePatient"
        ).value;


    if (!patientId) {

        alert(
            "Please select a patient."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/doses/today/${patientId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load today's doses"
            );

        }


        const doses =
            await response.json();


        displayTodayDoses(
            doses
        );

    }
    catch (error) {

        console.error(
            "Error loading today's doses:",
            error
        );


        alert(
            "Unable to load today's doses."
        );

    }
}


// =====================================================
// FEATURE 3
// DISPLAY TODAY'S DOSES
// =====================================================

function displayTodayDoses(
    doses
) {

    const doseList =
        document.getElementById(
            "doseList"
        );


    if (!doseList) {
        return;
    }


    doseList.innerHTML = "";


    if (
        !doses ||
        doses.length === 0
    ) {

        doseList.innerHTML = `
            <p>
                No doses scheduled for today.
            </p>
        `;

        return;
    }


    doses.sort(
        (a, b) =>
            a.scheduledTime.localeCompare(
                b.scheduledTime
            )
    );


    doses.forEach(
        dose => {

            const doseCard =
                document.createElement(
                    "div"
                );


            doseCard.className =
                "data-card";


            const medicine =
                dose.medicine
                    ? dose.medicine
                    : null;


            const medicineName =
                medicine
                    ? medicine.medicineName
                    : "Unknown Medicine";


            const dosage =
                medicine
                    ? medicine.dosage
                    : "Not specified";


            const patient =
                dose.patient
                    ? dose.patient.name
                    : "Unknown Patient";


            const scheduledTime =
                formatTime(
                    dose.scheduledTime
                );


            const status =
                dose.status
                    ? dose.status
                    : "PENDING";


            doseCard.innerHTML = `

                <p>
                    <strong>
                        Patient:
                    </strong>
                    ${patient}
                </p>

                <p>
                    <strong>
                        Medicine:
                    </strong>
                    ${medicineName}
                </p>

                <p>
                    <strong>
                        Dosage:
                    </strong>
                    ${dosage}
                </p>

                <p>
                    <strong>
                        Scheduled Time:
                    </strong>
                    ${scheduledTime}
                </p>

                <p>
                    <strong>
                        Status:
                    </strong>
                    ${status}
                </p>

                <div class="patient-actions">

                    <button
                        onclick="updateDoseStatus(
                            ${dose.id},
                            'TAKEN'
                        )"
                    >
                        TAKEN
                    </button>

                    <button
                        onclick="updateDoseStatus(
                            ${dose.id},
                            'MISSED'
                        )"
                    >
                        MISSED
                    </button>

                </div>

            `;


            doseList.appendChild(
                doseCard
            );


            // FEATURE 5
            // Check whether dose is overdue

            checkOverdueDose(
                dose
            );

        }
    );
}


// =====================================================
// FEATURE 3
// UPDATE DOSE STATUS
// =====================================================

async function updateDoseStatus(
    doseId,
    status
) {

    try {

        const response =
            await fetch(
                `/api/doses/${doseId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update dose status"
            );

        }


        await response.json();


        alert(
            `Dose marked as ${status}.`
        );


        await loadTodayDoses();

    }
    catch (error) {

        console.error(
            "Error updating dose status:",
            error
        );


        alert(
            "Unable to update dose status."
        );

    }
}


// =====================================================
// FEATURE 4
// MISSED DOSE HISTORY
// =====================================================


// Load patients into Missed History dropdown

async function loadHistoryPatients() {

    const select =
        document.getElementById(
            "historyPatient"
        );


    if (!select) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/patients"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );

        }


        const patients =
            await response.json();


        select.innerHTML = "";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value = "";


        defaultOption.textContent =
            "Select Patient";


        select.appendChild(
            defaultOption
        );


        patients.forEach(
            patient => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    patient.id;


                option.textContent =
                    `${patient.name} (ID: ${patient.id})`;


                select.appendChild(
                    option
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading history patients:",
            error
        );


        select.innerHTML = `
            <option value="">
                Unable to load patients
            </option>
        `;

    }
}


// =====================================================
// LOAD MISSED DOSE HISTORY
// =====================================================

async function loadMissedDoseHistory() {

    const patientId =
        document.getElementById(
            "historyPatient"
        ).value;


    const fromDate =
        document.getElementById(
            "fromDate"
        ).value;


    const toDate =
        document.getElementById(
            "toDate"
        ).value;


    if (!patientId) {

        alert(
            "Please select a patient."
        );

        return;
    }


    if (!fromDate || !toDate) {

        alert(
            "Please select both dates."
        );

        return;
    }


    if (fromDate > toDate) {

        alert(
            "From Date cannot be after To Date."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/doses/missed-history/${patientId}?fromDate=${fromDate}&toDate=${toDate}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load missed-dose history"
            );

        }


        const doses =
            await response.json();


        displayMissedDoseHistory(
            doses
        );

    }
    catch (error) {

        console.error(
            "Error loading missed-dose history:",
            error
        );


        alert(
            "Unable to load missed-dose history."
        );

    }
}


// =====================================================
// DISPLAY MISSED DOSE HISTORY
// =====================================================

function displayMissedDoseHistory(
    doses
) {

    const list =
        document.getElementById(
            "missedDoseList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        !doses ||
        doses.length === 0
    ) {

        list.innerHTML = `

            <div class="data-card">

                <p>
                    <strong>
                        No missed doses found
                    </strong>
                </p>

                <p>
                    No missed doses were recorded
                    for the selected date range.
                </p>

            </div>

        `;

        return;
    }


    doses.forEach(
        dose => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "data-card";


            const patient =
                dose.patient
                    ? dose.patient.name
                    : "Unknown Patient";


            const medicine =
                dose.medicine
                    ? dose.medicine.medicineName
                    : "Unknown Medicine";


            const dosage =
                dose.medicine
                    ? dose.medicine.dosage
                    : "Not specified";


            const date =
                dose.doseDate
                    ? dose.doseDate
                    : "Not specified";


            const scheduledTime =
                formatTime(
                    dose.scheduledTime
                );


            card.innerHTML = `

                <p>
                    <strong>
                        Patient:
                    </strong>
                    ${patient}
                </p>

                <p>
                    <strong>
                        Medicine:
                    </strong>
                    ${medicine}
                </p>

                <p>
                    <strong>
                        Dosage:
                    </strong>
                    ${dosage}
                </p>

                <p>
                    <strong>
                        Date:
                    </strong>
                    ${date}
                </p>

                <p>
                    <strong>
                        Scheduled Time:
                    </strong>
                    ${scheduledTime}
                </p>

                <p>
                    <strong>
                        Status:
                    </strong>
                    MISSED
                </p>

            `;


            list.appendChild(
                card
            );

        }
    );
}


// =====================================================
// FEATURE 5
// OVERDUE DOSE ALERT
// =====================================================


// Stores dose IDs that have already triggered
// an overdue alert during the current page session.

const overdueAlertedDoses =
    new Set();



function checkOverdueDose(
    dose
) {

    // Dose must exist

    if (!dose) {
        return;
    }


    // Only PENDING doses can be overdue

    if (
        !dose.status ||
        dose.status.toUpperCase() !== "PENDING"
    ) {
        return;
    }


    // Scheduled time must exist

    if (!dose.scheduledTime) {
        return;
    }


    // Do not show the same alert repeatedly

    if (
        overdueAlertedDoses.has(
            dose.id
        )
    ) {
        return;
    }


    const now =
        new Date();


    const parts =
        dose.scheduledTime.split(":");


    const scheduledHour =
        parseInt(
            parts[0]
        );


    const scheduledMinute =
        parseInt(
            parts[1]
        );


    const scheduledTime =
        new Date();


    scheduledTime.setHours(
        scheduledHour,
        scheduledMinute,
        0,
        0
    );


    const difference =
        now.getTime() -
        scheduledTime.getTime();


    const differenceInHours =
        difference /
        (1000 * 60 * 60);


    // More than one hour overdue

    if (
        differenceInHours > 1
    ) {

        const medicineName =
            dose.medicine
                ? dose.medicine.medicineName
                : "Medicine";


        const patientName =
            dose.patient
                ? dose.patient.name
                : "Patient";


        // Remember that this dose already
        // triggered an alert

        overdueAlertedDoses.add(
            dose.id
        );


        alert(

            `🚨 OVERDUE ALERT!\n\n` +

            `${medicineName} for ${patientName} ` +

            `is more than 1 hour overdue.\n\n` +

            `Scheduled Time: ` +

            `${formatTime(
                dose.scheduledTime
            )}`

        );

    }
}


// =====================================================
// FEATURE 5
// AUTOMATIC OVERDUE CHECK
// CHECK EVERY MINUTE
// =====================================================

setInterval(
    async function () {

        const patientSelect =
            document.getElementById(
                "dosePatient"
            );


        if (!patientSelect) {
            return;
        }


        const patientId =
            patientSelect.value;


        if (!patientId) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/doses/today/${patientId}`
                );


            if (!response.ok) {
                return;
            }


            const doses =
                await response.json();


            doses.forEach(
                dose => {

                    checkOverdueDose(
                        dose
                    );

                }
            );

        }
        catch (error) {

            console.error(
                "Error checking overdue doses:",
                error
            );

        }

    },

    60000
);


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(
    time
) {

    if (!time) {

        return "Not specified";

    }


    const parts =
        time.split(":");


    let hour =
        parseInt(
            parts[0]
        );


    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${period}`;
}


// =====================================================
// UTILITY
// =====================================================

function escapeQuotes(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "CarePlan page loaded."
        );


        // Medicine patient dropdown

        loadMedicinePatients();


        // Appointment patient dropdown

        loadAppointmentPatients();


        // Today's dose patient dropdown

        loadDosePatients();


        // Missed history patient dropdown

        loadHistoryPatients();

    }
);