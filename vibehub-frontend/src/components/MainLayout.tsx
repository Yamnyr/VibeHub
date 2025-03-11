import { ReactNode } from 'react';
import {LogOut} from "lucide-react";
import {useAuth} from "../context/AuthContext.tsx";
interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { logout, token } = useAuth();

    return (
        <>
            {/* Contenu principal */}
            <div>
                <div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full sm:flex-1 px-5 bg-[var(--background-main)] py-2.5 text-center rounded"
                    >
                        <LogOut className="mr-2" size={16}/>
                        Se déconnecter
                    </button>
                    {children}
                </div>
            </div>
        </>
    );
}
