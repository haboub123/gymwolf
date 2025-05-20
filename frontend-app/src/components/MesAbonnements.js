import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importation de la Navbar
import Navbar from "../components/navbar/Navbar"; // Adapte ce chemin selon ton projet

const user = JSON.parse(localStorage.getItem("user"));

export default function AbonnementListe() {
  const [abonnements, setAbonnements] = useState([]);
  const [userAbonnements, setUserAbonnements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allAbosResponse = await axios.get("http://localhost:5000/Abonnement/getAllAbonnement");
        const allAbos = allAbosResponse.data.abonnementListe || [];
        setAbonnements(allAbos);

        if (isLoggedIn && user._id) {
          try {
            const userAbosResponse = await axios.get(`http://localhost:5000/users/getUserAbonnements/${user._id}`);
            const userAbos = userAbosResponse.data.abonnements || [];
            setUserAbonnements(userAbos);
          } catch (userAbosError) {
            console.error("Erreur lors du chargement des abonnements de l'utilisateur:", userAbosError);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des abonnements:", err);
        setError("Impossible de charger les abonnements. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, user]);

  const handleAchat = (abonnement) => {
    if (!isLoggedIn) {
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/auth/login");
    } else {
      localStorage.setItem("abonnementEnCours", JSON.stringify(abonnement));
      navigate("/facturation");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isAbonnementActif = (dateDebut, duree) => {
    const debut = new Date(dateDebut);
    const fin = new Date(debut);
    fin.setDate(fin.getDate() + duree);
    return fin > new Date();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-lg">Chargement des abonnements...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Nos Abonnements</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos formules d'abonnement adaptées à vos besoins et objectifs sportifs
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 max-w-3xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {abonnements.map((abonnement) => (
              <div key={abonnement._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{abonnement.type}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {abonnement.duree} jours
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Accès à toutes nos installations avec un abonnement {abonnement.type.toLowerCase()}.
                  </p>
                  <div className="mb-8">
                    <span className="text-3xl font-bold text-gray-900">{abonnement.prix} DT</span>
                  </div>
                  <button
                    onClick={() => handleAchat(abonnement)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-300"
                  >
                    Acheter cet abonnement
                  </button>
                </div>
              </div>
            ))}
          </div>

          {abonnements.length === 0 && !error && (
            <p className="text-center text-gray-500 text-lg">
              Aucun abonnement disponible pour le moment.
            </p>
          )}

          {isLoggedIn && (
            <div className="mt-16">
              <div className="text-center mb-8 border-t border-gray-200 pt-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Mes Abonnements</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Voici la liste de vos abonnements actuels et passés
                </p>
              </div>

              {userAbonnements.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de début</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fin</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userAbonnements.map((abonnement) => {
                          const dateDebut = new Date(abonnement.dateDebut);
                          const dateFin = new Date(dateDebut);
                          dateFin.setDate(dateFin.getDate() + abonnement.duree);
                          const actif = isAbonnementActif(abonnement.dateDebut, abonnement.duree);
                          return (
                            <tr key={abonnement._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{abonnement.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(abonnement.dateDebut)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(dateFin)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{abonnement.prix} DT</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {actif ? 'Actif' : 'Expiré'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-white p-8 rounded-xl shadow-md">
                  <p className="text-gray-500 text-lg">Vous n'avez pas encore d'abonnements.</p>
                  <p className="text-gray-600 mt-2">Choisissez un abonnement ci-dessus pour commencer votre expérience fitness.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
