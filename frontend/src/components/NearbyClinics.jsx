import React from 'react';

const NearbyClinics = ({ clinics, userPos }) => {
    if (!clinics || clinics.length === 0) return null;

    const getNavUrl = (destLat, destLng) => {
        if (!userPos) return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
        return `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${destLat},${destLng}`;
    };

    return (
        <div className="clinic-list" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px', marginBottom: '2rem'
        }}>
            {clinics.map((clinic, i) => (
                <div className="clinic-item" key={i} style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div className="clinic-left" style={{ flex: 1, minWidth: 0 }}>
                            <div className="clinic-name" style={{ 
                                fontSize: '1.05rem', 
                                fontWeight: '700', 
                                whiteSpace: 'normal', 
                                wordBreak: 'break-word', 
                                lineHeight: '1.3' 
                            }}>
                                {clinic.name}
                            </div>
                            <div className="clinic-specialist" style={{ opacity: 0.85, marginTop: '4px' }}>
                                {clinic.type || clinic.specialist || 'Medical Center'}
                            </div>
                        </div>
                        {clinic.distance && (
                            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '65px' }}>
                                <div style={{ color: '#6ee7b7', fontWeight: '800', fontSize: '1.1rem' }}>
                                    {clinic.distance.toFixed(1)} <span style={{ fontSize: '0.75rem' }}>km</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>distance</div>
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
                            padding: '12px', fontSize: '0.9rem', background: 'rgba(79, 156, 249, 0.1)',
                            border: '1px solid rgba(79, 156, 249, 0.7)', color: 'var(--color-primary)',
                            borderRadius: '8px', fontWeight: '600'
                        }}
                    >
                        🚀 Navigate Now
                    </a>
                </div>
            ))}
        </div>
    );
};

export default NearbyClinics;
