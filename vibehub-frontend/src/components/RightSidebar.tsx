import React from 'react';
import TrendingSection from './TrendingSection.tsx';

function RightSidebar() {
    return (
        <div className="sticky top-4 p-4">
            <div className="bg-[var(--background-secondary)] rounded-lg mb-4 shadow-lg">
                <input
                    type="search"
                    placeholder="Search"
                    className="w-full bg-transparent p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                />
            </div>
            <TrendingSection />
        </div>
    );
}

export default RightSidebar;