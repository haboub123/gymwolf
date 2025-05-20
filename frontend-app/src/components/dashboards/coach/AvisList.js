import React, { useState, useEffect } from "react";
import axios from "axios";

const AvisList = ({ seanceId }) => {
  const [avisListe, setAvisListe] = useState([]);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/avis/getAvisBySeance/${seanceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvisListe(data.avisListe || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis", error);
      }
    };
    fetchAvis();
  }, [seanceId]);

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold">Avis sur cette séance</h4>
      {avisListe.length > 0 ? (
        avisListe.map((avis) => (
          <div key={avis._id} className="bg-gray-50 p-2 mb-2 rounded">
            <p>Note : {avis.note}/5</p>
            <p>Commentaire : {avis.commentaire}</p>
            <p>Client : {avis.client?.nom || "Anonyme"}</p>
            <p>Date : {new Date(avis.date).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>Aucun avis pour cette séance.</p>
      )}
    </div>
  );
};

export default AvisList;