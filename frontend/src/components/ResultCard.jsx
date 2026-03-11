import React from 'react';
import ClinicMap from './ClinicMap';

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

    const clinicsToDisplay = liveClinics && liveClinics.length > 0 ? liveClinics : result.clinics;
    const isLive = liveClinics && liveClinics.length > 0;

    const getNavUrl = (destLat, destLng) => {
        if (!userPos) return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
        return `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${destLat},${destLng}`;
    };

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
                        <span>📍</span> {isLive ? 'Real Nearby Clinics' : 'Nearby Sample Clinics'}
                    </div>
                    {isFetchingClinics ? (
                        <span className="clinics-count">Finding locations...</span>
                    ) : (
                        clinicsToDisplay?.length > 0 && (
                            <span className="clinics-count">{clinicsToDisplay.length} found</span>
                        )
                    )}
                </div>

                {clinicsToDisplay && clinicsToDisplay.length > 0 ? (
                    <>
                        <div className="clinic-list" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '12px', marginBottom: '1.5rem'
                        }}>
                            {clinicsToDisplay.map((clinic, i) => (
                                <div className="clinic-item" key={i} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div className="clinic-left">
                                            <div className="clinic-name" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{clinic.name}</div>
                                            <div className="clinic-specialist" style={{ opacity: 0.8 }}>{clinic.type || clinic.specialist}</div>
                                        </div>
                                        {clinic.distance && (
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: '#6ee7b7', fontWeight: '800', fontSize: '1.1rem' }}>
                                                    {clinic.distance.toFixed(1)} <span style={{ fontSize: '0.7rem' }}>km</span>
                                                </div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>distance left</div>
                                            </div>
                                        )}
                                    </div>

                                    <a
                                        href={getNavUrl(clinic.lat, clinic.lng)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-search"
                                        style={{
                                            marginTop: 'auto', textAlign: 'center', justifyContent: 'center',
                                            padding: '10px', fontSize: '0.85rem', background: 'rgba(79, 156, 249, 0.15)',
                                            border: '1px solid var(--color-primary)', color: 'var(--color-primary)'
                                        }}
                                    >
                                        🚀 Navigate Now
                                    </a>
                                </div>
                            ))}
                        </div>

                        <ClinicMap
                            clinics={clinicsToDisplay}
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
