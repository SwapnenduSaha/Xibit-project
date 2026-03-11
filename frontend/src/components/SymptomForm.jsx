import React, { useState, useRef } from 'react';

const SUGGESTIONS = [
    'headache', 'chest pain', 'back pain', 'skin rash',
    'anxiety', 'cough', 'fever', 'joint pain',
];

const SymptomForm = ({ onSearch, isLoading }) => {
    const [symptom, setSymptom] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (symptom.trim()) onSearch(symptom.trim());
    };

    const handleChipClick = (s) => {
        setSymptom(s);
        inputRef.current?.focus();
        onSearch(s);
    };

    return (
        <div className="search-card">
            <div className="search-label">
                <span>🩺</span> Enter Your Symptom
            </div>

            <form onSubmit={handleSubmit}>
                <div className="search-input-row">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            ref={inputRef}
                            id="symptom-input"
                            type="text"
                            className="search-input"
                            placeholder="e.g. headache, chest pain, skin rash…"
                            value={symptom}
                            onChange={(e) => setSymptom(e.target.value)}
                            disabled={isLoading}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>
                    <button
                        id="search-btn"
                        type="submit"
                        className="btn-search"
                        disabled={!symptom.trim() || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spin-sm" />
                                Searching…
                            </>
                        ) : (
                            <>
                                <span>→</span> Find
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="suggestions">
                <span className="suggestions-label">Try:</span>
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s}
                        className="chip"
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleChipClick(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SymptomForm;
