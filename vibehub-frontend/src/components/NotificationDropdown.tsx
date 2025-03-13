import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import io from "socket.io-client";

// Connexion WebSocket
const socket = io("http://localhost:5000");

interface Notification {
  id: number;
  message: string;
  time: string;
}

const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            socket.connect();
            socket.emit("userConnected", JSON.parse(user)._id); // Envoie l'ID utilisateur après la connexion
        }
        console.log("je suis la")
        // Écoute des notifications depuis le backend
        // socket.on("receiveNotification", (notif: Notification) => {
        //     setNotifications((prev) => [notif, ...prev]); // Ajoute au début de la liste
        // });

        socket.on("newComment", (newCommentData: Notification) => {
            console.log("je suis par la")
            console.log("Nouveau commentaire :", newCommentData);
            setNotifications((prev) => [newCommentData, ...prev]);
        });

        // Nettoyage à la déconnexion
        return () => {
            // socket.off("receiveNotification");
            // socket.off("newComment"); // Important de nettoyer les écouteurs
            // socket.disconnect();
        };
    }, []);

    // Fermer le menu quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Icône Notifications */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 text-lg cursor-pointer group"
            >
                <Bell className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors" />
                <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Notifications
                </span>
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-100 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {notifications.length > 99 ? "99+" : notifications.length}
                    </span>
                )}
            </div>

            {/* Dropdown Notifications */}
            {isOpen && (
                <div className="absolute right-[-10] mt-3 w-80 bg-[var(--background-secondary)] shadow-lg rounded-lg border border-gray-700 z-10">
                    <div className="p-4 font-bold text-[var(--text-primary)] border-b border-gray-600">
                        Notifications
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    className="px-4 py-3 hover:bg-[var(--bg-hover)] cursor-pointer border-b border-gray-600"
                                >
                                    <p className="text-sm text-[var(--text-primary)]">
                                        {notif.message}
                                    </p>
                                    <span className="text-xs text-gray-400">{notif.time} ago</span>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-gray-400 text-sm">Aucune notification.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
