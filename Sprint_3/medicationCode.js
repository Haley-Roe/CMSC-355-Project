// medicationCode.js
const medicationList = [
    { name: "Aspirin", code: "ASP123" },
    { name: "Ibuprofen", code: "IBU456" },
    { name: "Metformin", code: "MET789" },
    { name: "Lisinopril", code: "LIS321" },
    { name: "Atorvastatin", code: "ATO654" }
];

function addMedication(name, code) {
    medicationList.push({ name, code });
    updateMedicationButtons();
}
