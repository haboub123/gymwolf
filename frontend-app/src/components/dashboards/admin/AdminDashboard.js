import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Vérifier l'authentification et le rôle de l'utilisateur
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate("/auth/login");
          return;
        }
        
        if (user.role !== "admin") {
          console.log("User is not admin, redirecting");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/auth/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Welcome, Admin! Manage users, programs, and more. Today's date: {new Date().toLocaleDateString()}
          </p>
          
          {/* Grid of Management Options */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/manage-activite"
              className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              Gérer les Activités
            </Link>
            <Link
              to="/admin/manage-seance"
              className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              Gérer les Séances
            </Link>
            <Link
              to="/admin/manage-salle"
              className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              Gérer les Salles
            </Link>
            <Link
              to="/admin/manage-coach"
              className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              Gérer les Coachs
            </Link>
            <Link
              to="/admin/manage-client"
              className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              Gérer les Clients
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}