import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ManageAvis from "./ManageAvis"; // Importez le composant ManageAvis (à créer ou utiliser l'existant)

export default function ManageAvisPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Manage Avis Content */}
        <main className="flex-1 p-6 pt-20 bg-white">
          <ManageAvis /> {/* Utilisation du composant ManageAvis */}
        </main>
      </div>
    </div>
  );
}