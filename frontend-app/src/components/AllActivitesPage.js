import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar"; // ✅ Vérifie bien le chemin d'import

export default function AllActivitesPage() {
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Activite/getAllActivites")
      .then((res) => {
        if (res.data && res.data.Activites) {
          setActivites(res.data.Activites);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des activités :", err);
      });
  }, []);

  return (
    <>
      <Navbar /> {/* ✅ Ajout du Navbar */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900">Nos Activités</h2>
            <p className="mt-4 text-gray-600">
              Voici toutes les activités proposées par <span className="text-yellow-500 font-semibold">Gym Wolf</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activites.map((item) => (
              <div key={item._id} className="bg-white shadow rounded p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">{item.nom}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link
                  to={`/activite/${item._id}`}
                  className="text-yellow-500 font-medium hover:underline"
                >
                  Voir les séances →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
