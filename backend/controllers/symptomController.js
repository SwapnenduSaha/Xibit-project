const SYMPTOMS_MAP = {
    // Neurological
    "headache": "neurologist", "migraine": "neurologist", "dizziness": "neurologist", "numbness": "neurologist", 
    "seizure": "neurologist", "tremor": "neurologist", "fainting": "neurologist",
    // Cardiac
    "chest pain": "cardiologist", "palpitations": "cardiologist", "high blood pressure": "cardiologist", 
    "shortness of breath": "cardiologist", "irregular heartbeat": "cardiologist",
    // Dermatology
    "skin rash": "dermatologist", "acne": "dermatologist", "hair loss": "dermatologist", "eczema": "dermatologist",
    "mole change": "dermatologist", "itchy skin": "dermatologist",
    // Gastro
    "stomach pain": "gastroenterologist", "acid reflux": "gastroenterologist", "nausea": "gastroenterologist", 
    "bloating": "gastroenterologist", "constipation": "gastroenterologist", "diarrhea": "gastroenterologist",
    // General
    "fever": "general physician", "cough": "general physician", "sore throat": "general physician", "fatigue": "general physician",
    "body ache": "general physician", "weakness": "general physician", "cold": "general physician", "flu": "general physician",
    // Dental
    "toothache": "dentist", "bleeding gums": "dentist", "bad breath": "dentist", "sensitive teeth": "dentist",
    // Eye
    "eye pain": "ophthalmologist", "blurry vision": "ophthalmologist", "red eye": "ophthalmologist", "double vision": "ophthalmologist",
    // Ortho
    "joint pain": "orthopedist", "bone fracture": "orthopedist", "back pain": "orthopedist", "knee pain": "orthopedist",
    "swollen joint": "orthopedist",
    // Physio
    "muscle spasm": "physiotherapist", "stiff neck": "physiotherapist", "sports injury": "physiotherapist",
    // Psychiatry
    "anxiety": "psychiatrist", "depression": "psychiatrist", "stress": "psychiatrist", "panic attack": "psychiatrist",
    "insomnia": "psychiatrist",
    // Pulmono
    "breathing difficulty": "pulmonologist", "asthma": "pulmonologist", "wheezing": "pulmonologist", "chronic cough": "pulmonologist",
    // ENT
    "ear ache": "ent", "sinus": "ent", "hearing loss": "ent", "nosebleed": "ent", "ringing in ears": "ent",
    // Gynae
    "pregnancy": "gynecologist", "irregular periods": "gynecologist", "pelvic pain": "gynecologist", "breast lump": "gynecologist"
};

const getSpecialistInfo = (req, res) => {
    const { symptom } = req.body;

    if (!symptom) {
        return res.status(400).json({ error: 'Symptom is required' });
    }

    const symptomKey = symptom.toLowerCase().trim();

    // 1. Try exact match
    let specialist = SYMPTOMS_MAP[symptomKey];

    // 2. Try pattern matching if no exact match
    if (!specialist) {
        const patterns = [
            { regex: /head|ache|migraine|dizzy|numb|tingl|seiz|memor|faint|tremor|concuss|brain|stroke/i, spec: "neurologist" },
            { regex: /chest|heart|palpit|pressur|beat|puls|breathless|angin|cardiac/i, spec: "cardiologist" },
            { regex: /skin|rash|acne|itch|spot|mole|hair|nail|sweat|burn|wart|pimpl|psoriasis|dermat/i, spec: "dermatologist" },
            { regex: /stomach|belly|abdom|nausea|vomit|diarrh|constipat|reflux|heartburn|ulcer|bloat|bowel|digest|gastric/i, spec: "gastroenterologist" },
            { regex: /tooth|teeth|gum|jaw|bite|mouth|dental|cavit|brace|dentist/i, spec: "dentist" },
            { regex: /eye|vision|blind|sight|blur|glaucom|cataract|ophthalm/i, spec: "ophthalmologist" },
            { regex: /joint|bone|fractur|back|knee|shoulder|hip|spine|arthrit|sprain|strain|tear|ortho|skelet/i, spec: "orthopedist" },
            { regex: /spasm|rehab|mobil|postur|stiff|cramp|physio|workout|exercis/i, spec: "physiotherapist" },
            { regex: /anxi|depress|sad|stress|panic|mood|bipolar|sleep|insom|mental|trauma|adhd|focus|psych/i, spec: "psychiatrist" },
            { regex: /breath|lung|asthma|wheez|bronch|cough|pneumon|pulmon/i, spec: "pulmonologist" },
            { regex: /ear|hear|deaf|sinus|nose|smell|throat|swallow|voice|ent|tinnitus/i, spec: "ent" },
            { regex: /pregnan|period|menstru|fert|vagin|pelvic|meno|ovary|cramp|breast|gyneco|obstetric/i, spec: "gynecologist" },
            { regex: /fever|temp|cold|flu|virus|weak|fatigu|tired|pain|sick|ill|infect|allergy/i, spec: "general physician" },
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(symptomKey)) {
                specialist = pattern.spec;
                break;
            }
        }
    }

    // 3. Ultimate fallback
    if (!specialist) {
        specialist = "general physician";
    }

    return res.status(200).json({ specialist });
};

module.exports = {
    getSpecialistInfo
};
