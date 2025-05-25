import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaShareAlt } from "react-icons/fa";

// Composant pour gérer les avis (accessible aux admins)
const ManageAvisPage = () => {
  const [avisListe, setAvisListe] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les avis au montage du composant
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/avis/getAllAvis", {
          withCredentials: true,
        });
        console.log("Avis récupérés :", data.avisListe);
        setAvisListe(data.avisListe || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchAvis();
  }, []);

  // Supprimer un avis
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    try {
      await axios.delete(`http://localhost:5000/avis/deleteAvisById/${id}`, {
        withCredentials: true,
      });
      setAvisListe(avisListe.filter((avis) => avis._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error.response?.data || error.message);
    }
  };

  // Basculer l'état de partage d'un avis
  const handleToggleShare = async (id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/avis/toggleShare/${id}`,
        {},
        { withCredentials: true }
      );
      setAvisListe(
        avisListe.map((avis) =>
          avis._id === id ? { ...avis, isShared: data.avis.isShared } : avis
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du partage:", error.response?.data || error.message);
    }
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  // Afficher la liste des avis
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-blue-500 pb-2">
        Gestion des Avis
      </h2>

      {avisListe.length > 0 ? (
        <div className="space-y-6">
          {avisListe.map((avis) => (
            <div
              key={avis._id}
              className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p className="text-gray-800">
                  <span className="font-semibold">Note :</span> {avis.note}/5
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Client :</span>{" "}
                  {avis.client && avis.client.username ? avis.client.username : "Anonyme"}
                </p>
                <p className="text-gray-800 sm:col-span-2">
                  <span className="font-semibold">Commentaire :</span> {avis.commentaire}
                </p>
                <p className="text-gray-800 sm:col-span-2">
                  <span className="font-semibold">Date et heure :</span>{" "}
                  {avis.date
                    ? new Date(avis.date).toLocaleString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </p>
                <p className="text-gray-800 sm:col-span-2">
                  <span className="font-semibold">Partagé :</span>{" "}
                  {avis.isShared ? "Oui" : "Non"}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleToggleShare(avis._id)}
                  className={`flex items-center gap-2 ${
                    avis.isShared ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"
                  } text-white py-2 px-4 rounded-lg transition-all duration-200`}
                >
                  <FaShareAlt /> {avis.isShared ? "Ne plus partager" : "Partager"}
                </button>
                <button
                  onClick={() => handleDelete(avis._id)}
                  className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  <FaTrash /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">Aucun avis disponible.</p>
      )}
    </div>
  );
};

export default ManageAvisPage;