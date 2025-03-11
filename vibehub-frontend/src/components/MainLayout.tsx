import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar.tsx';

interface MainLayoutProps {
    children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--background-primary)]">
            <div className="container mx-auto">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                        <Sidebar />
                    </div>
                    <main className="col-span-6">
                        {children}
                    </main>
                    <div className="col-span-3">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;