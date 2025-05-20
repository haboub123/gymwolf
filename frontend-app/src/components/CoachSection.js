import React, { useEffect, useState } from "react";
import axios from "axios";

// Import des images
import team1 from "../assets/img/team-1-800x800.jpg";
import team2 from "../assets/img/team-2-800x800.jpg";
import team3 from "../assets/img/team-3-800x800.jpg";
import placeholder from "../assets/img/team-4-470x470.png"; // Utilisé comme fallback

export default function CoachSection() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const images = [team2, team3, team1]; // Associe 3 images

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/users/coachs")
      .then((res) => {
        if (res.data && res.data.coachs) {
          setCoaches(res.data.coachs.slice(0, 3)); // max 3 coachs affichés
        } else {
          setCoaches([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des coachs :", err);
        setError("Impossible de charger les coachs. Veuillez réessayer plus tard.");
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder; // Fallback si image cassée
  };

  return (
    <section className="pt-20 pb-48 bg-gradient-to-t from-blueGray-100 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-900">Découvrez Nos Coachs d’Excellence</h2>
          <p className="text-blueGray-500 mt-4">
            Des experts passionnés prêts à vous propulser vers vos objectifs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center">
          {loading ? (
            <p className="text-blueGray-500">Chargement des coachs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : coaches.length > 0 ? (
            coaches.map((coach, i) => (
              <div key={i} className="w-full md:w-4/12 lg:w-3/12 px-4 mb-12">
                <div className="px-6 text-center">
                  <img
                    alt={`coach-${i + 1}`}
                    src={images[i] || placeholder}
                    className="shadow-lg rounded-full mx-auto max-w-120-px h-120-px object-cover transform hover:scale-110 transition-all duration-300"
                    onError={handleImageError}
                  />
                  <div className="pt-6">
                    <h5 className="text-xl font-bold text-gray-900">
                      {coach.username || `Coach ${i + 1}`}
                    </h5>
                    <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                      {coach.specialite || "Spécialité inconnue"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-blueGray-500">Aucun coach disponible pour le moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
