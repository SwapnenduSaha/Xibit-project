import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Vite/Webpack broken default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Blue "You" marker with a person icon feel
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Custom Red "Clinic" marker with a bigger profile
const clinicIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [30, 48], // Slightly larger
    iconAnchor: [15, 48],
    popupAnchor: [1, -40],
});

// Helper — auto-recenter map when center changes
function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 13);
        }
    }, [lat, lng, map]);
    return null;
}

const ClinicMap = ({ clinics, userPos }) => {
    const center = userPos
        ? [userPos.lat, userPos.lng]
        : clinics?.length > 0
            ? [clinics[0].lat, clinics[0].lng]
            : [22.57, 88.36];

    const getNavUrl = (destLat, destLng) => {
        if (!userPos) return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
        return `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${destLat},${destLng}`;
    };

    return (
        <div className="map-container-wrapper" style={{ marginTop: '1.5rem', position: 'relative' }}>
            {/* Legend inside map */}
            <div style={{
                position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
                background: 'rgba(15, 21, 33, 0.85)', padding: '10px 14px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4f9cf9', border: '2px solid white' }}></span>
                    <span>Your Location</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f87171', border: '2px solid white' }}></span>
                    <span>Clinic / Doctor</span>
                </div>
            </div>

            <div style={{
                borderRadius: '20px', overflow: 'hidden',
                border: '1px solid rgba(99,179,237,0.15)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}>
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '400px', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap lat={center[0]} lng={center[1]} />

                    {userPos && (
                        <>
                            <Circle
                                center={[userPos.lat, userPos.lng]}
                                radius={800}
                                pathOptions={{ color: '#4f9cf9', fillColor: '#4f9cf9', fillOpacity: 0.05, weight: 1, dashArray: '5, 10' }}
                            />
                            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                                <Popup className="custom-popup">
                                    <div style={{ textAlign: 'center', padding: '5px' }}>
                                        <strong>📍 You are here</strong>
                                        <p style={{ margin: '5px 0 0', fontSize: '0.8em', color: '#666' }}>Finding nearby specialists...</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </>
                    )}

                    {clinics?.map((clinic, i) => (
                        <Marker key={i} position={[clinic.lat, clinic.lng]} icon={clinicIcon}>
                            <Popup className="custom-popup">
                                <div style={{ minWidth: '150px' }}>
                                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '4px' }}>{clinic.name}</strong>
                                    <span style={{ display: 'block', color: '#666', fontSize: '0.85em', textTransform: 'capitalize', marginBottom: '10px' }}>
                                        ✨ {clinic.type || 'Medical Center'}
                                    </span>
                                    {clinic.distance && (
                                        <div style={{ color: '#059669', fontWeight: 'bold', fontSize: '0.85em', marginBottom: '12px' }}>
                                            🚗 {clinic.distance.toFixed(1)} km away
                                        </div>
                                    )}
                                    <a
                                        href={getNavUrl(clinic.lat, clinic.lng)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'block', textAlign: 'center', background: '#4f9cf9', color: 'white',
                                            padding: '8px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem'
                                        }}
                                    >
                                        Open Navigation
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default ClinicMap;
