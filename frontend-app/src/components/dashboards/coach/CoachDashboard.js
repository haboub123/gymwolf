import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarCoach from "./SidebarCoach";
import NavbarCoach from "./NavbarCoach";
import AvisList from "./AvisList";
import { FaTrash, FaBell } from "react-icons/fa";
import "./CoachDashboard.css";

export default function CoachDashboard() {
  const [seances, setSeances] = useState([]);
  const [notifications, setNotifications] = useState([]);
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

    const fetchNotifications = async () => {
      if (!userString) return;
      const user = JSON.parse(userString);
      try {
        const response = await axios.get("http://localhost:5000/notification/getAllNotifications", {
          params: { userId: user._id, role: user.role },
          withCredentials: true,
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
      }
    };

    fetchSeances();
    fetchNotifications();
  }, [userString]);

  // Fonction pour supprimer une notification
  const deleteNotification = async (notificationId) => {
    try {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/notification/deleteNotificationById/${notificationId}`, {
        withCredentials: true,
      });

      // Mettre à jour la liste des notifications après suppression
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      
      // Afficher un message de succès
      alert("Notification supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      alert("Erreur lors de la suppression de la notification. Veuillez réessayer.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SidebarCoach />
      <NavbarCoach />
      
      {/* Contenu principal avec marges pour navbar et sidebar */}
      <main className="ml-64 pt-16 p-6">
        <h2 className="text-2xl font-bold text-yellow-400">
          <i className="fas fa-tachometer-alt mr-2"></i> Tableau de bord Coach
        </h2>
        <p className="mt-2 text-gray-300">Bienvenue, Coach ! Voici vos séances planifiées.</p>

        {/* Section des Notifications */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <FaBell className="text-lg" /> Notifications
          </h3>
          {notifications.length === 0 ? (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center text-gray-500">
              <i className="fas fa-exclamation-circle mr-2"></i> Aucune notification pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${
                    notification.statut === "non lu"
                      ? "border-yellow-400 bg-opacity-90"
                      : "border-gray-700"
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{notification.contenu}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(notification.dateEnvoi).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200 ml-4"
                      title="Supprimer cette notification"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section des Séances */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Mes Séances</h3>
          {seances.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {seances.map((seance) => (
                <div key={seance._id} className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-yellow-400">{seance.titre}</h3>
                  <p className="text-sm text-gray-300 mb-1"><i className="fas fa-calendar-alt mr-1"></i> {formatDate(seance.date)}</p>
                  <p className="text-gray-300"><i className="fas fa-clock mr-1"></i> Heure : {seance.heure}</p>
                  <p className="text-gray-300"><i className="fas fa-hourglass-start mr-1"></i> Durée : {seance.duree} min</p>
                  <p className="text-gray-300"><i className="fas fa-dumbbell mr-1"></i> Activité : {seance.activite?.nom}</p>
                  <p className="text-gray-300"><i className="fas fa-map-marker-alt mr-1"></i> Salle : {seance.salle?.nom}</p>
                  <div className="mt-3">
                    <AvisList seanceId={seance._id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center text-gray-500">
              <i className="fas fa-exclamation-circle mr-2"></i> Aucune séance assignée.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}