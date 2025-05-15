import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

// Consistent token handling
const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("jwt_token_9antra="))
    ?.split("=")[1];
};

export default function SeancesByActivite() {
  const { id } = useParams();
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load activity and sessions
  useEffect(() => {
    axios
      .get(`http://localhost:5000/Activite/getActiviteById/${id}`)
      .then((res) => {
        if (res.data && res.data.Activite) {
          setActivite(res.data.Activite);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Erreur lors du chargement de l'activité");
        setLoading(false);
      });
  }, [id]);

  // Handle reservation
  const handleReservation = (seanceId, nomSeance, date, heure) => {
    const token = getAuthToken();

    if (!token) {
      // User not logged in - save reservation details and redirect
      sessionStorage.setItem(
        "pendingReservation",
        JSON.stringify({ 
          seance: seanceId, 
          nomSeance, 
          date, 
          heure 
        })
      );
      navigate("/login");
    } else {
      // User logged in - process reservation immediately
      processReservation(seanceId, nomSeance, date, heure);
    }
  };

  // Process the reservation (for logged-in users)
  const processReservation = async (seanceId, nomSeance, date, heure) => {
    try {
      setLoading(true);
      
      // Create reservation
      const reservationResponse = await axios.post(
        "http://localhost:5000/Reservation/addReservation",
        { 
          seance: seanceId, 
          nomSeance, 
          date, 
          heure 
        },
        { withCredentials: true }
      );

      if (!reservationResponse.data.reservation) {
        throw new Error("Échec de la création de la réservation");
      }

      const reservationId = reservationResponse.data.reservation._id;

      // Assign reservation to user
      await axios.put(
        "http://localhost:5000/Reservation/affect",
        { reservationId },
        { withCredentials: true }
      );

      setNotification("Réservation effectuée avec succès !");
      // Short delay before redirect to show notification
      setTimeout(() => navigate("/mes-reservations"), 1500);
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      setError(
        "Erreur lors de la réservation : " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  if (!activite) return <div className="text-center mt-10">Activité non trouvée.</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/nos-activites" className="text-blue-500 underline mb-6 inline-block">
        ← Retour aux activités
      </Link>

      <h2 className="text-3xl font-bold mb-4">{activite.nom}</h2>
      <p className="mb-6 text-gray-600">{activite.description}</p>

      {notification && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          {notification}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          {error}
          <button 
            onClick={() => setError("")} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-4">Séances associées :</h3>
      {activite.seances && activite.seances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activite.seances.map((seance) => (
            <div key={seance._id} className="bg-white shadow rounded p-4">
              <h4 className="text-xl font-bold mb-2">{seance.titre}</h4>
              <p><strong>Description:</strong> {seance.description}</p>
              <p><strong>Date:</strong> {new Date(seance.date).toLocaleDateString()}</p>
              <p><strong>Heure:</strong> {seance.heure}</p>
              <p><strong>Durée:</strong> {seance.duree} min</p>

              <button
                onClick={() =>
                  handleReservation(
                    seance._id,
                    seance.titre,
                    seance.date,
                    seance.heure
                  )
                }
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "En cours..." : "Réserver"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune séance associée à cette activité.</p>
      )}
    </div>
  );
}