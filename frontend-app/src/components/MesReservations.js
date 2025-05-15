import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Check for pending reservation (now using sessionStorage)
    const pendingReservation = sessionStorage.getItem("pendingReservation");
    if (pendingReservation) {
      handlePendingReservation(JSON.parse(pendingReservation));
    } else {
      fetchReservations();
    }
  }, []);

  // Handle pending reservation after login
  const handlePendingReservation = async (reservationData) => {
    try {
      setNotification("Finalisation de votre réservation...");
      
      // Create reservation
      const response = await axios.post(
        "http://localhost:5000/Reservation/addReservation",
        reservationData,
        { withCredentials: true }
      );

      if (response.data && response.data.reservation) {
        // Assign reservation to logged-in user
        await axios.put(
          "http://localhost:5000/Reservation/affect",
          {
            reservationId: response.data.reservation._id,
            // userId extracted from token on backend
          },
          { withCredentials: true }
        );

        // Clear pending reservation
        sessionStorage.removeItem("pendingReservation");
        
        // Show success notification
        setNotification("Réservation créée avec succès!");
        
        // Fetch updated reservations list
        fetchReservations();
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      setError(
        "Erreur lors de la réservation: " + 
        (error.response?.data?.message || error.message)
      );
      setLoading(false);
      
      // Clean up pending reservation on error
      sessionStorage.removeItem("pendingReservation");
    }
  };

  // Fetch user's reservations
  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/Reservation/getUserReservations",
        { withCredentials: true }
      );

      if (response.data && response.data.reservations) {
        setReservations(response.data.reservations);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      setError("Erreur lors de la récupération des réservations. Veuillez réessayer.");
      setLoading(false);
    }
  };

  // Cancel a reservation
  const cancelReservation = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation?")) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/Reservation/deleteReservationById/${id}`,
        { withCredentials: true }
      );
      
      // Update reservations list
      setReservations(reservations.filter((reservation) => reservation._id !== id));
      setNotification("Réservation annulée avec succès");
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
      setError("Erreur lors de l'annulation de la réservation. Veuillez réessayer.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Mes Réservations</h2>

      {notification && (
        <div className="bg-green-100 text-green-700 p-4 mb-6 rounded">
          {notification}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded text-center">
          <p className="mb-4">Vous n'avez pas encore de réservations.</p>
          <Link to="/nos-activites" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Découvrir nos activités
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="bg-white shadow rounded p-6">
              <h3 className="text-xl font-bold mb-2">{reservation.nomSeance}</h3>
              <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
              <p><strong>Heure:</strong> {reservation.heure}</p>
              <button
                onClick={() => cancelReservation(reservation._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "En cours..." : "Annuler la réservation"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}