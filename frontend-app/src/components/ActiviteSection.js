import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Import des images
import cardioImage from "../assets/img/cardio.jpg";
import kongfuImage from "../assets/img/kongfu.jpg";
import boxImage from "../assets/img/box.jpg";

export default function ActiviteSection() {
  const [activites, setActivites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/Activite/getAllActivites")
      .then((res) => {
        if (res.data && res.data.Activites) {
          setActivites(res.data.Activites.slice(0, 3));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fonction pour choisir l'image en fonction du nom de l'activité
  const getImageForActivity = (activityName) => {
    if (activityName === "Cardio") {
      return cardioImage;
    } else if (activityName === "Kung Fu") {
      return kongfuImage;
    } else if (activityName === "Boxe") {
      return boxImage;
    } else {
      return cardioImage; // Image par défaut si l'activité ne correspond à rien
    }
  };

  return (
    <section className="pb-20 bg-gradient-to-t from-white to-blueGray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900">Our Activities</h2>
          <p className="mt-4 text-blueGray-500">
            Discover some of the main activities we offer at GymManager.
          </p>
        </div>
        <div className="flex flex-wrap text-center justify-center">
          {activites.map((item) => (
            <div key={item._id} className="w-full md:w-4/12 px-4 mb-8">
              <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                {/* Choix de l'image en fonction du nom de l'activité */}
                <img
                  src={getImageForActivity(item.nom)}  // L'image dynamique selon l'activité
                  alt={item.nom}
                  className="rounded-lg mx-auto w-full h-48 object-cover mb-4 transition-transform duration-500 ease-in-out hover:scale-110"
                  style={{ boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
                />
                <h6 className="text-xl font-semibold mb-2">{item.nom}</h6>
                <p className="text-blueGray-500">{item.description}</p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/activite/${item._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
