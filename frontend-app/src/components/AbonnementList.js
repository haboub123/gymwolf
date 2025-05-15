import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AbonnementList() {
  const [abonnements, setAbonnements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  
  // Récupérer l'utilisateur s'il est connecté
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    const fetchAbonnements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/abonnement/getAllAbonnement");
        setAbonnements(response.data.abonnementListe || []);
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
    // Si l'utilisateur n'est pas connecté, rediriger vers la page d'inscription
    if (!user) {
      // Sauvegarder l'abonnement sélectionné dans le localStorage
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/auth/register");
      return;
    }
    
    // Si l'utilisateur est connecté, sauvegarder l'abonnement et rediriger vers la page de facturation
    localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
    navigate("/facturation");
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Chargement des abonnements...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Nos Abonnements</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {abonnements.length === 0 ? (
        <p className="text-center text-gray-500">Aucun abonnement disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {abonnements.map((abo) => (
            <div key={abo._id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{abo.type}</h2>
                <p className="text-gray-600">Durée : {abo.duree} mois</p>
                <p className="text-blue-600 font-bold text-2xl mt-2">{abo.prix} DT</p>
              </div>
              
              <button
                onClick={() => handleAchat(abo)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Acheter maintenant
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}