import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar/Navbar"; // ✅ Vérifie le bon chemin selon ton projet

export default function AbonnementListe() {
  const [abonnements, setAbonnements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Vérifier si l'utilisateur est connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  
  useEffect(() => {
    const fetchAbonnements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/abonnement/getAllAbonnement");
        const allAbos = response.data.abonnementListe || [];
        setAbonnements(allAbos);
      } catch (err) {
        console.error("Erreur lors du chargement des abonnements:", err);
        setError("Impossible de charger les abonnements. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAbonnements();
  }, []);
  
  const handleAchat = (abonnement) => {
    if (!isLoggedIn) {
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/auth/login");
    } else {
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/facturation");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-lg">Chargement des abonnements...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar /> {/* ✅ Navbar ajouté */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Nos Abonnements
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez la formule d'abonnement qui vous convient le mieux chez{" "}
              <span className="text-yellow-500 font-semibold">Gym Wolf</span>.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 max-w-3xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {abonnements.map((abonnement) => (
              <div
                key={abonnement._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{abonnement.type}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {abonnement.duree} jours
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Accès à toutes nos installations avec un abonnement {abonnement.type.toLowerCase()}.
                  </p>

                  <div className="mb-8">
                    <span className="text-3xl font-bold text-gray-900">{abonnement.prix} DT</span>
                  </div>

                  <button
                    onClick={() => handleAchat(abonnement)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-300"
                  >
                    Acheter cet abonnement
                  </button>
                </div>
              </div>
            ))}
          </div>

          {abonnements.length === 0 && !error && (
            <p className="text-center text-gray-500 text-lg">
              Aucun abonnement disponible pour le moment.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
