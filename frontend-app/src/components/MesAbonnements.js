import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MesAbonnements() {
  const [abonnements, setAbonnements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Récupérer l'ID de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchAbonnements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/abonnement/getAllAbonnement");
        const allAbos = response.data.abonnementListe || [];
        
        // Vérifier si clients est un tableau avant d'utiliser includes
        const filtered = allAbos.filter(abo => 
          Array.isArray(abo.clients) && abo.clients.includes(userId)
        );
        
        console.log("Tous les abonnements:", allAbos);
        console.log("Abonnements filtrés:", filtered);
        console.log("ID utilisateur actuel:", userId);
        
        setAbonnements(filtered);
      } catch (err) {
        console.error("Erreur lors du chargement des abonnements:", err);
        setError("Impossible de charger vos abonnements. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAbonnements();
  }, [userId]);
  
  if (isLoading) {
    return <div className="p-8 text-center">Chargement de vos abonnements...</div>;
  }
  
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Mes Abonnements
      </h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {abonnements.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Vous n'avez encore aucun abonnement actif.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {abonnements.map((abo) => (
            <div
              key={abo._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {abo.type}
              </h2>
              <p className="text-gray-600 mt-2">Durée : {abo.duree} jours</p>
              <p className="text-gray-600">
                Prix :{" "}
                <span className="text-blue-600 font-semibold">
                  {abo.prix} DT
                </span>
              </p>
              
              {abo.dateDebut && (
                <p className="text-sm text-gray-500 mt-2">
                  Début : {new Date(abo.dateDebut).toLocaleDateString()}
                </p>
              )}
              {abo.dateFin && (
                <p className="text-sm text-gray-500">
                  Fin : {new Date(abo.dateFin).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}