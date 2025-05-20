import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar"; // ✅ Assure-toi que le chemin est correct

const CoachsPage = () => {
  const [coachs, setCoachs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/coachs")
      .then((res) => {
        setCoachs(res.data.coachs);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des coachs", err);
      });
  }, []);

  return (
    <>
      <Navbar /> {/* ✅ Navbar en haut */}
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Nos Entraîneurs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coachs.map((coach) => (
            <div key={coach._id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-black">{coach.username}</h2>
              <p className="text-gray-600">Email : {coach.email}</p>
              <p className="text-gray-600">
                Spécialité : {coach.specialite || "Non précisée"}
              </p>
              <Link
                to={`/coach-profile/${coach._id}`}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Voir Profil
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CoachsPage;
