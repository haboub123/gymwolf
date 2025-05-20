import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarCoach from "./SidebarCoach";
import NavbarCoach from "./NavbarCoach";
import AvisList from "./AvisList";
import "./CoachDashboard.css";

export default function CoachDashboard() {
  const [seances, setSeances] = useState([]);
  const userString = localStorage.getItem("user");

  useEffect(() => {
    const fetchSeances = async () => {
      if (!userString) return;
      const user = JSON.parse(userString);
      const coachId = user._id;

      try {
        const response = await axios.get("http://localhost:5000/Seance/getAllSeances");
        const allSeances = response.data.seances || [];
        const coachSeances = allSeances.filter(seance => seance.coachs.includes(coachId));
        setSeances(coachSeances);
      } catch (error) {
        console.error("Erreur lors de la récupération des séances:", error);
      }
    };

    fetchSeances();
  }, [userString]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <NavbarCoach />
      <SidebarCoach />
      <div className="ml-64 pt-20 px-6">
        <h2 className="text-2xl font-bold mb-4">
          <i className="fas fa-tachometer-alt mr-2"></i> Tableau de bord Coach
        </h2>
        <p className="mb-6">Bienvenue, Coach ! Voici vos séances planifiées.</p>

        {seances.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {seances.map((seance) => (
              <div key={seance._id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-700">{seance.titre}</h3>
                <p className="text-sm text-gray-600 mb-1"><i className="fas fa-calendar-alt mr-1"></i> {formatDate(seance.date)}</p>
                <p><i className="fas fa-clock mr-1"></i> Heure : {seance.heure}</p>
                <p><i className="fas fa-hourglass-start mr-1"></i> Durée : {seance.duree} min</p>
                <p><i className="fas fa-dumbbell mr-1"></i> Activité : {seance.activite?.nom}</p>
                <p><i className="fas fa-map-marker-alt mr-1"></i> Salle : {seance.salle?.nom}</p>
                <AvisList seanceId={seance._id} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500"><i className="fas fa-exclamation-circle mr-2"></i> Aucune séance assignée.</p>
        )}
      </div>
    </>
  );
}
