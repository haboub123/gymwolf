import React, { useState, useEffect } from "react";
import axios from "axios";

const AddAvis = ({ seanceId, reservationId }) => {
  const [note, setNote] = useState(1);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setMessage("Vous devez être connecté pour laisser un avis");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsAuthenticated(false);
        setMessage("Erreur lors de la vérification de l'authentification");
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!isAuthenticated || !user || !user._id) {
      setMessage("Vous devez être connecté pour laisser un avis");
      setIsSubmitting(false);
      return;
    }

    if (user.role !== "client") {
      setMessage("Seuls les clients peuvent laisser un avis");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Données envoyées à /avis/addAvis :", { note, commentaire, date: new Date() });
      const avisResponse = await axios.post(
        "http://localhost:5000/avis/addAvis",
        { note, commentaire, date: new Date().toISOString() },
        { withCredentials: true }
      );
      console.log("Réponse de /avis/addAvis :", avisResponse.data);

      const avisId = avisResponse.data.avis._id;
      console.log("avisId récupéré :", avisId);

      console.log("Données envoyées à /avis/affect :", { userId: user._id, avisId, seanceId });
      const affectResponse = await axios.post(
        "http://localhost:5000/avis/affect",
        { userId: user._id, avisId, seanceId },
        { withCredentials: true }
      );
      console.log("Réponse de /avis/affect :", affectResponse.data);

      const seanceResponse = await axios.get(`http://localhost:5000/Seance/getSeanceById/${seanceId}`);
      const coachIds = seanceResponse.data.seance.coachs;

      await axios.post(
        "http://localhost:5000/notification/addNotification",
        {
          contenu: `Nouvel avis laissé par ${user.username} pour la séance ${seanceResponse.data.seance.titre}`,
          roleCible: "admin",
          clients: [],
        },
        { withCredentials: true }
      );

      await axios.post(
        "http://localhost:5000/notification/addNotification",
        {
          contenu: `Nouvel avis laissé par ${user.username} pour votre séance ${seanceResponse.data.seance.titre}`,
          roleCible: "coach",
          clients: coachIds,
        },
        { withCredentials: true }
      );

      setMessage("Avis ajouté avec succès ! Une notification a été envoyée.");
      setNote(1);
      setCommentaire("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Erreur détaillée :", error.response?.data, error.response?.status);
      setMessage(
        error.response?.data?.message || "Erreur lors de l'ajout de l'avis. Veuillez vous reconnecter et réessayer."
      );
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold">Laisser un avis</h4>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label>Note (1-5) :</label>
            <input
              type="number"
              min="1"
              max="5"
              value={note}
              onChange={(e) => setNote(Number(e.target.value))}
              className="border p-1 ml-2"
              required
            />
          </div>
          <div>
            <label>Commentaire :</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="border p-1 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Soumettre"}
          </button>
        </form>
      ) : (
        <p className="text-red-600">Veuillez vous connecter pour laisser un avis.</p>
      )}
      {message && (
        <p className={`mt-2 text-sm ${message.includes("succès") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddAvis;