import React from 'react';

function TrendingSection() {
    return (
        <div className="bg-[var(--background-secondary)] rounded-lg p-4 shadow-lg animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Trending</h2>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors">
                        <div className="text-sm text-[var(--text-secondary)]">Trending in Technology</div>
                        <div className="font-bold text-[var(--text-primary)]">#React{i}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{i}0K tweets</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrendingSection;