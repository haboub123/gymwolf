import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  
  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserName(user.username || user.name || "User");
        setUserRole(user.role || "guest");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);
  
  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Liste des liens pour le sidebar admin
  const adminLinks = [
    { path: "/dashboard/admin", name: "Dashboard", icon: "home" },
    { path: "/admin/manage-activite", name: "Activités", icon: "activity" },
    { path: "/admin/manage-seance", name: "Séances", icon: "calendar" },
    { path: "/admin/manage-salle", name: "Salles", icon: "archive" },
    { path: "/admin/manage-coach", name: "Coaches", icon: "users" },
    { path: "/admin/manage-client", name: "Clients", icon: "user" },
    { path: "/admin/manage-abonnement", name: "Abonnements", icon: "credit-card" }, // Nouveau lien pour abonnements
    { path: "/admin/manage-affectation", name: "Affectations", icon: "link" }, // Nouveau lien pour affectations
  ];
  
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 bg-gray-900">
        <h2 className="text-2xl font-bold">Gym Wolf</h2>
        <p className="text-gray-400 text-sm">Gestion de Salle de Sport</p>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b border-gray-700 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-gray-400 capitalize">{userRole}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="px-2">
          {adminLinks.map((link) => (
            <li key={link.path} className="mb-1">
              <Link
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">
                  <i className={`fas fa-${link.icon}`}></i>
                </span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer Links */}
      <div className="p-4 border-t border-gray-700">
        <ul>
          <li className="mb-1">
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="mr-3">
                <i className="fas fa-cog"></i>
              </span>
              Settings
            </Link>
          </li>
          <li>
            <Link
              to="/auth/login"
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => localStorage.removeItem("user")}
            >
              <span className="mr-3">
                <i className="fas fa-sign-out-alt"></i>
              </span>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}