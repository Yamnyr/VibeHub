import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  time: string;
}

const notifications: Notification[] = [
  { id: 1, message: "John Doe a aimé votre tweet.", time: "2m" },
  { id: 2, message: "Alice a commencé à vous suivre.", time: "10m" },
  { id: 3, message: "Nouvelle mise à jour disponible !", time: "1h" },
];

const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Ferme le menu si on clique en dehors
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      // Ajoute l'écouteur d'événement quand le menu est ouvert
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      // Nettoie l'écouteur quand le menu est fermé
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icône Notifications cliquable avec hover sur l'ensemble */}
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
            {(notifications.length > 99 ? "99" : notifications.length)}
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
