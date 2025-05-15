import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoachSection() {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Users/getAllUsers")
      .then((res) => {
        if (res.data && res.data.coaches) {
          setCoaches(res.data.coaches.slice(0, 3)); // Limit to 3 coaches
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des activités :", err);
      });
  }, []);

  return (
    <section className="pt-20 pb-48 bg-gradient-to-t from-blueGray-100 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-gray-900">Meet Our Coaches</h2>
          <p className="text-blueGray-500 mt-4">Our professional team is here to support and inspire you.</p>
        </div>
        <div className="flex flex-wrap justify-center">
          {coaches.map((img, i) => (
            <div key={i} className="w-full md:w-4/12 lg:w-3/12 px-4 mb-12">
              <div className="px-6 text-center">
                <img
                  alt="coach"
                  src={require(`assets/img/${img}-800x800.jpg`).default}
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
  );
}
