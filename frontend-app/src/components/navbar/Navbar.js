import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <img src={logo} alt="Gym Wolf Logo" className="h-12 w-auto" />

        <ul className="hidden md:flex gap-8 font-medium">
          <li className="hover:text-yellow-400 transition">
            <a href="/">Accueil</a>
          </li>
          <li className="hover:text-yellow-400 transition">
            <a href="/activites">Nos Activités</a>
          </li>
          <li className="hover:text-yellow-400 transition">
            <a href="/coachs">Nos entraineurs</a>
          </li>
          <li className="hover:text-yellow-400 transition">
            <a href={user?.role === "client" ? "/mes-abonnements" : "/abonnement"}>
              {user?.role === "client" ? "Mes abonnements" : "Nos abonnements"}
            </a>
          </li>
          {user?.role === "client" && (
            <li className="hover:text-yellow-400 transition">
              <a href="/mes-reservations">Mes Réservations</a>
            </li>
          )}
          {!user ? (
            <li className="hover:text-yellow-400 transition">
              <a href="/auth/login">Connexion</a>
            </li>
          ) : (
            <li
              className="hover:text-yellow-400 transition cursor-pointer"
              onClick={handleLogout}
            >
              Déconnexion
            </li>
          )}
        </ul>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 px-4">
          <a href="/" className="block hover:text-yellow-400">Accueil</a>
          <a href="/activites" className="block hover:text-yellow-400">Nos Activités</a>
          <a href="/coachs" className="block hover:text-yellow-400">Nos entraineurs</a>
          <a
            href={user?.role === "client" ? "/mes-abonnements" : "/abonnement"}
            className="block hover:text-yellow-400"
          >
            {user?.role === "client" ? "Mes abonnements" : "Nos abonnements"}
          </a>
          {user?.role === "client" && (
            <a href="/mes-reservations" className="block hover:text-yellow-400">
              Mes Réservations
            </a>
          )}
          {!user ? (
            <a href="/auth/login" className="block hover:text-yellow-400">Connexion</a>
          ) : (
            <button onClick={handleLogout} className="block hover:text-yellow-400">
              Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
}