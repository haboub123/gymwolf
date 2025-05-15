import React from "react";
import { Link } from "react-router-dom";

// Components
import Footer from "./Footer";
import ActiviteSection from "./ActiviteSection";

export default function LandingFitness() {
  return (
    <>
      <main>
        {/* Hero Section */}
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
                Unleash Your Potential
              </h1>
              <p className="mt-6 text-xl text-blueGray-200 max-w-2xl mx-auto">
                Join <strong>Gym Wolf</strong> and experience elite coaching, smart programs, and an inspiring community. Your transformation starts today.
              </p>
              <Link
                to="/auth/login"
                className="mt-8 inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="pb-20 bg-gradient-to-t from-blueGray-200 to-white -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap text-center">
              {[
                {
                  icon: "fas fa-dumbbell",
                  title: "High-Tech Equipment",
                  text: "Train smarter with the most modern and efficient gym machines.",
                  color: "bg-gradient-to-r from-red-400 to-red-600",
                },
                {
                  icon: "fas fa-user-check",
                  title: "Elite Coaches",
                  text: "Our certified professionals guide you with passion and precision.",
                  color: "bg-gradient-to-r from-blue-400 to-blue-600",
                },
                {
                  icon: "fas fa-clipboard-list",
                  title: "Tailored Programs",
                  text: "Workouts adapted to your goals, level and lifestyle.",
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

        {/* About Section */}
        <section className="relative py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-5/12 ml-auto px-4">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Gym Wolf?</h3>
                <p className="mt-4 text-lg leading-relaxed text-blueGray-600">
                  Whether you're aiming for strength, endurance, or flexibility, Gym Wolf is more than just a gym — it's your fitness family.
                </p>
                <ul className="mt-6 space-y-3 text-blueGray-500">
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Flexible membership plans</li>
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Complete nutrition coaching</li>
                  <li><i className="fas fa-check text-green-500 mr-2"></i> Motivating group sessions</li>
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

        {/* Activities Section */}
        <ActiviteSection />

        {/* Coaches Section */}
        <section className="pt-20 pb-48 bg-gradient-to-t from-blueGray-100 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-gray-900">Meet Our Coaches</h2>
              <p className="text-blueGray-500 mt-4">Dedicated professionals who are here to push you to your limits.</p>
            </div>
            <div className="flex flex-wrap justify-center">
              {["team-1", "team-2", "team-3"].map((img, i) => (
                <div key={i} className="w-full md:w-4/12 lg:w-3/12 px-4 mb-12">
                  <div className="px-6 text-center">
                    <img
                      alt="coach"
                      src={require(`../assets/img/${img}-800x800.jpg`).default}
                      className="shadow-lg rounded-full mx-auto max-w-120-px transform hover:scale-110 transition-all duration-300"
                    />
                    <div className="pt-6">
                      <h5 className="text-xl font-bold text-gray-900">Coach {i + 1}</h5>
                      <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                        Fitness Specialist
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
