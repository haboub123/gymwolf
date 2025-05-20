// MesReservations.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddAvis from "../components/AddAvis";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const pendingReservation = sessionStorage.getItem("pendingReservation");
    if (pendingReservation) {
      handlePendingReservation(JSON.parse(pendingReservation));
    } else {
      fetchReservations();
    }
  }, []);

  const handlePendingReservation = async (reservationData) => {
    try {
      setNotification("Finalisation de votre réservation...");
      const response = await axios.post(
        "http://localhost:5000/Reservation/addReservation",
        reservationData,
        { withCredentials: true }
      );
      if (response.data && response.data.reservation) {
        await axios.put(
          "http://localhost:5000/Reservation/affect",
          { reservationId: response.data.reservation._id },
          { withCredentials: true }
        );
        sessionStorage.removeItem("pendingReservation");
        setNotification("Réservation créée avec succès!");
        fetchReservations();
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      setError("Erreur lors de la réservation: " + (error.response?.data?.message || error.message));
      setLoading(false);
      sessionStorage.removeItem("pendingReservation");
    }
  };

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

  const cancelReservation = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/Reservation/deleteReservationById/${id}`, { withCredentials: true });
      setReservations(reservations.filter((r) => r._id !== id));
      setNotification("Réservation annulée avec succès");
      setTimeout(() => setNotification(null), 3000);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      setError("Erreur lors de l'annulation. Veuillez réessayer.");
      setLoading(false);
    }
  };

  // Vérifier si la séance est terminée
  const isSeanceTerminee = (reservation) => {
    try {
      const seanceDateTime = new Date(`${new Date(reservation.date).toISOString().split('T')[0]}T${reservation.heure}`);
      const now = new Date();
      return seanceDateTime < now;
    } catch (error) {
      console.error("Erreur lors de la vérification de la date de la séance:", error);
      return false;
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Mes Réservations</h2>
      {notification && <div className="bg-green-100 text-green-700 p-4 mb-6 rounded">{notification}</div>}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
          {error} <button onClick={() => setError(null)} className="float-right font-bold">×</button>
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
              {isSeanceTerminee(reservation) ? (
                <AddAvis seanceId={reservation.seance} reservationId={reservation._id} />
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Vous pourrez laisser un avis après la séance ({new Date(reservation.date).toLocaleDateString()} à {reservation.heure}).
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}