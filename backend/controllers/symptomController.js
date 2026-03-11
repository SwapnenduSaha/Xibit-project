const fs = require('fs');
const path = require('path');

const symptomsFilePath = path.join(__dirname, '../data/symptoms.json');
const clinicsFilePath = path.join(__dirname, '../data/clinics.json');

// Helper function to read from JSON files
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file from ${filePath}:`, error);
        return null;
    }
};

const getSpecialistInfo = (req, res) => {
    const { symptom } = req.body;

    if (!symptom) {
        return res.status(400).json({ error: 'Symptom is required' });
    }

    // Sanitize down to lowercase to support case-insensitive matching
    const symptomKey = symptom.toLowerCase().trim();

    // Load JSON databases
    const symptomsData = readJsonFile(symptomsFilePath);
    const clinicsData = readJsonFile(clinicsFilePath);

    if (!symptomsData || !clinicsData) {
        return res.status(500).json({ error: 'Internal server error while retrieving data' });
    }

    // Look up the specialist mapped for the provided symptom
    const specialist = symptomsData[symptomKey];

    if (!specialist) {
        return res.status(404).json({ error: 'Symptom not recognized' });
    }

    // Filter clinics offering treatments by this specialist
    const matchingClinics = clinicsData.filter(
        (clinic) => clinic.specialist.toLowerCase() === specialist.toLowerCase()
    );

    // Return the mapped data
    return res.status(200).json({
        specialist: specialist,
        clinics: matchingClinics
    });
};

module.exports = {
    getSpecialistInfo
};
