import React from 'react';
import ClinicMap from './ClinicMap';
import NearbyClinics from './NearbyClinics';

const SPECIALIST_ICONS = {
    neurologist: '🧠',
    cardiologist: '❤️',
    dermatologist: '🧴',
    gastroenterologist: '🫁',
    'general physician': '👨‍⚕️',
    dentist: '🦷',
    ophthalmologist: '👁️',
    orthopedist: '🦴',
    physiotherapist: '💪',
    psychiatrist: '🧘',
    pulmonologist: '🫁',
    ent: '👂',
    gynecologist: '🌸',
};

const ResultCard = ({ result, liveClinics, userPos, isFetchingClinics }) => {
    if (!result) return null;

    const icon = SPECIALIST_ICONS[result.specialist?.toLowerCase()] || '🏥';

    return (
        <div className="result-card" id="result-section">
            <div className="result-header">
                <div className="specialist-icon-wrap" role="img" aria-label={result.specialist}>
                    {icon}
                </div>
                <div>
                    <div className="result-label">Recommended Specialist</div>
                    <div className="specialist-name">{result.specialist}</div>
                    <div className="confidence-badge">High Match Confidence</div>
                </div>
            </div>

            <div className="clinics-section">
                <div className="clinics-header">
                    <div className="clinics-title">
                        <span>📍</span> Nearby Clinics
                    </div>
                    {isFetchingClinics ? (
                        <span className="clinics-count">Finding locations...</span>
                    ) : (
                        liveClinics?.length > 0 && (
                            <span className="clinics-count">{liveClinics.length} found</span>
                        )
                    )}
                </div>

                {liveClinics && liveClinics.length > 0 ? (
                    <>
                        <NearbyClinics clinics={liveClinics} userPos={userPos} />

                        <ClinicMap
                            clinics={liveClinics}
                            specialist={result.specialist}
                            userPos={userPos}
                        />
                    </>
                ) : (
                    <div className="no-clinics">
                        <div className="no-clinics-icon">🏥</div>
                        <div>
                            {isFetchingClinics
                                ? "Locating health centers near you..."
                                : "No clinics found near your current location."}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultCard;
