import React from 'react';

const Navbar = () => (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
        <a className="navbar-brand" href="/" aria-label="XiBit home">
            <div className="navbar-logo-icon" aria-hidden="true">⚕️</div>
            <div>
                <div className="navbar-brand-name">XiBit</div>
                <div className="navbar-tagline">Symptom-to-Specialist AI</div>
            </div>
        </a>
        <span className="navbar-badge">🏆 Hackathon 2026</span>
    </nav>
);

export default Navbar;
