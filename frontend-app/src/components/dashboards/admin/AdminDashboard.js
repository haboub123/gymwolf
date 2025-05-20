import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/auth/login");
          return;
        }
        if (user.role !== "admin") {
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
        navigate("/auth/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Tableau de bord Admin</h2>
          <p className="mt-2 text-gray-600">
            Bienvenue, Admin ! Gérez les utilisateurs, les programmes et plus encore. Date d'aujourd'hui : {new Date().toLocaleDateString()}
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/manage-activite" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Activités
            </Link>
            <Link to="/admin/manage-seance" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Séances
            </Link>
            <Link to="/admin/manage-salle" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Salles
            </Link>
            <Link to="/admin/manage-coach" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Coaches
            </Link>
            <Link to="/admin/manage-abonnement" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Abonnements
            </Link>
            <Link to="/admin/manage-client" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Clients
            </Link>
            <Link to="/admin/manage-avis" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center">
              Gérer les Avis
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}