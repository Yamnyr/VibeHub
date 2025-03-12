import React from 'react';
import { Home, User, Bell, Mail, BookMarked, Settings, LogOut } from 'lucide-react';
import UserProfile from './UserProfile';
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../context/AuthContext";


function Sidebar() {
    const { logout, token } = useAuth();
    return (
        <div className="fixed h-screen w-64 border-r border-gray-700 p-4">
            <div className="flex flex-col space-y-6">
                <div className="text-2xl font-bold text-[var(--accent)]">VibeHub</div>
                <nav className="space-y-4">
                    <UserProfile />
                    <a href="/" className="flex items-center space-x-3 text-lg text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                        <Home /> <span>Home</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-lg text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                        <div className="flex items-center space-x-3">
                            <NotificationDropdown />
                        </div>
                    </a>
                    {/*<a href="#" className="flex items-center space-x-3 text-lg text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">*/}
                    {/*    <BookMarked /> <span>Bookmarks</span>*/}
                    {/*</a>*/}
                    <a href="/profile" className="flex items-center space-x-3 text-lg text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                        <User /> <span>Profile</span>
                    </a>
                    {/*<a href="#" className="flex items-center space-x-3 text-lg text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">*/}
                    {/*    <Settings /> <span>Settings</span>*/}
                    {/*</a>*/}
                </nav>
                {/*<button className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg py-3 font-medium transition-colors">*/}
                {/*    Tweet*/}
                {/*</button>*/}
                <div className="mt-auto">
                    <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"onClick={logout}>

                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;