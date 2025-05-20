import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import ActiviteSection from "./ActiviteSection";
import CoachSection from "./CoachSection";

export default function LandingFitness() {
  return (
    <>
      <main>
        {/* Section Hero */}
        <div
          className="relative pt-24 pb-32 flex items-center justify-center min-h-screen bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1470&q=80')",
          }}
        >
          <span className="absolute w-full h-full bg-black opacity-70"></span>
          <div className="relative container mx-auto text-center">
            <div className="text-white px-4">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                Libérez Votre Puissance Intérieure
              </h1>
              <p className="mt-6 text-xl text-blueGray-200 max-w-2xl mx-auto">
                Rejoignez <strong>Gym Wolf</strong> et découvrez un coaching d’élite, des programmes intelligents et une communauté inspirante. Votre transformation commence maintenant.
              </p>
              <Link
                to="/auth/login"
                className="mt-8 inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
              >
                Lancez-Vous Dès Aujourd'hui
              </Link>
            </div>
          </div>
        </div>

        {/* Section Services */}
        <section className="pb-20 bg-gradient-to-t from-blueGray-200 to-white -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap text-center">
              {[
                {
                  icon: "fas fa-dumbbell",
                  title: "Équipements de Pointe",
                  text: "Entraînez-vous avec des machines modernes et performantes pour des résultats optimaux.",
                  color: "bg-gradient-to-r from-red-400 to-red-600",
                },
                {
                  icon: "fas fa-user-check",
                  title: "Coachs d'Exception",
                  text: "Nos experts certifiés vous accompagnent avec passion et expertise.",
                  color: "bg-gradient-to-r from-blue-400 to-blue-600",
                },
                {
                  icon: "fas fa-clipboard-list",
                  title: "Programmes Sur-Mesure",
                  text: "Des entraînements conçus pour vos objectifs, votre niveau et votre rythme de vie.",
                  color: "bg-gradient-to-r from-emerald-400 to-emerald-600",
                },
              ].map((item, i) => (
                <div key={i} className="w-full md:w-4/12 px-4 mb-10">
                  <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition-all duration-300">
                    <div
                      className={`text-white w-14 h-14 mb-4 mx-auto rounded-full flex items-center justify-center ${item.color}`}
                    >
                      <i className={`${item.icon} text-xl`}></i>
                    </div>
                    <h6 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h6>
                    <p className="text-blueGray-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section À Propos */}
        <section className="relative py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-5/12 ml-auto px-4">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Pourquoi Rejoindre Gym Wolf ?</h3>
                <p className="mt-4 text-lg leading-relaxed text-blueGray-600">
                  Que vous visiez la puissance, l’endurance ou la souplesse, Gym Wolf est bien plus qu’une salle de sport — c’est votre partenaire de transformation.
                </p>
                <ul className="mt-6 space-y-3 text-blueGray-500">
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Abonnements flexibles et adaptés</li>
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Accompagnement nutritionnel complet</li>
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Séances collectives motivantes</li>
                </ul>
              </div>
              <div className="w-full md:w-5/12 px-4 mr-auto">
                <img
                  className="rounded-lg shadow-2xl transform hover:scale-105 transition duration-300"
                  src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1350&q=80"
                  alt="fitness"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section Activités */}
        <ActiviteSection />

        {/* Section Coachs */}
        <CoachSection />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}