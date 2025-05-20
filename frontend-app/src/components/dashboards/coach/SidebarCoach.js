import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarCoach() {
  const [userName, setUserName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserName(user.username || user.name || "Coach");
  }, []);

  const isActive = (path) => location.pathname === path;

  const links = [
    { path: "/dashboard/coach", name: "Tableau de bord", icon: "tachometer-alt" },
    // On supprime les autres liens
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen fixed top-0 left-0 z-40">
      <div className="p-4 bg-gray-900">
        <h2 className="text-2xl font-bold">Coach Gym Wolf</h2>
      </div>
      <div className="p-4 border-b border-gray-700 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-gray-400">Coach</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-4 py-2 mb-1 rounded-lg transition-colors ${
              isActive(link.path)
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <i className={`fas fa-${link.icon} mr-3`}></i>
            {link.name}
          </Link>
        ))}

        {/* Bouton pour aller à la page d'accueil */}
        <Link
          to="/"
          className="flex items-center px-4 py-2 mt-4 rounded-lg text-gray-300 hover:bg-gray-700"
        >
          <i className="fas fa-home mr-3"></i> Accueil
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/auth/login"
          onClick={() => localStorage.removeItem("user")}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
        >
          <i className="fas fa-sign-out-alt mr-3"></i> Déconnexion
        </Link>
      </div>
    </aside>
  );
}
