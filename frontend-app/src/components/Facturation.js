import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Facturation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [abonnement, setAbonnement] = useState(null);
  const [success, setSuccess] = useState("");
  
  // Récupérer l'ID de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  
  // Méthodes de paiement disponibles
  const methodesPaiement = ["Carte bancaire", "Espèces", "Virement bancaire"];
  const [methodePaiement, setMethodePaiement] = useState("Carte bancaire");
  
  useEffect(() => {
    // Récupérer les données d'abonnement depuis localStorage
    const abonnementData = JSON.parse(localStorage.getItem("abonnementEnCours"));
    
    if (!abonnementData) {
      navigate("/abonnement");
      return;
    }
    
    setAbonnement(abonnementData);
    
    // Vérifier si l'utilisateur est connecté
    if (!userId) {
      setError("Vous devez être connecté pour finaliser votre achat");
    }
  }, [navigate, userId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      if (!userId) {
        throw new Error("Vous devez être connecté pour finaliser votre achat");
      }
      
      if (!abonnement) {
        throw new Error("Aucun abonnement sélectionné");
      }
      
      // 1. Créer une facture
      const factureResponse = await axios.post("http://localhost:5000/facture/addFacture", {
        montant: abonnement.prix,
        date: new Date(),
        methode: methodePaiement,
        statut: "Payée"
      });
      
      if (!factureResponse.data || !factureResponse.data.facture) {
        throw new Error("Erreur lors de la création de la facture");
      }
      
      const factureId = factureResponse.data.facture._id;
      
      // 2. Affecter la facture et l'abonnement à l'utilisateur
      await axios.put("http://localhost:5000/facture/affect", {
        userId: userId,
        factureId: factureId,
        abonnementId: abonnement._id
      });
      
      // 3. Afficher un message de succès avant la redirection
      setSuccess("Votre achat a été effectué avec succès. Vous allez être redirigé vers vos factures.");
      
      // 4. Supprimer l'abonnement temporaire du localStorage
      localStorage.removeItem("abonnementEnCours");
      
      // 5. Rediriger vers la page des factures après un court délai
      setTimeout(() => {
        navigate("/mes-factures");
      }, 2000);
      
    } catch (error) {
      console.error("Erreur lors de la facturation:", error);
      setError(error.response?.data?.message || error.message || "Une erreur s'est produite lors de la facturation");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!abonnement) {
    return <div className="p-8 text-center">Chargement...</div>;
  }
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Finaliser votre achat</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Détails de l'abonnement</h2>
        <div className="border-b pb-4 mb-4">
          <p className="flex justify-between">
            <span>Type d'abonnement:</span>
            <span className="font-medium">{abonnement.type}</span>
          </p>
          <p className="flex justify-between">
            <span>Durée:</span>
            <span className="font-medium">{abonnement.duree} mois</span>
          </p>
          <p className="flex justify-between">
            <span>Montant:</span>
            <span className="font-bold text-blue-600">{abonnement.prix} DT</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Méthode de paiement</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={methodePaiement}
              onChange={(e) => setMethodePaiement(e.target.value)}
              disabled={isLoading}
            >
              {methodesPaiement.map((methode) => (
                <option key={methode} value={methode}>{methode}</option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Traitement en cours..." : "Confirmer et payer"}
          </button>
        </form>
      </div>
    </div>
  );
}