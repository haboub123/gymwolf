import React, { useState } from "react";
import axios from "axios";

const AddAvis = ({ seanceId, reservationId }) => {
  const [note, setNote] = useState(1);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !user._id || !token) {
        throw new Error("Utilisateur non authentifié");
      }

      // 1. Créer l'avis
      const avisResponse = await axios.post(
        "http://localhost:5000/avis/addAvis",
        { note, commentaire, date: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Récupérer l'ID de l'avis créé
      const avisId = avisResponse.data.avis._id;

      // 3. Affecter l'avis à l'utilisateur et à la séance
      await axios.post(
        "http://localhost:5000/avis/affect",
        { userId: user._id, avisId, seanceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Avis ajouté avec succès !");
      setNote(1);
      setCommentaire("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
      setMessage(error.response?.data?.message || "Erreur lors de l'ajout de l'avis");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold">Laisser un avis</h4>
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
      {message && (
        <p className={`mt-2 text-sm ${message.includes("succès") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddAvis;