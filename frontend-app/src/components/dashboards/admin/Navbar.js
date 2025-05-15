import React, { useState, useEffect } from "react";
import UserDropdown from "../../Dropdowns/UserDropdown";

export default function Navbar() {
  const [userName, setUserName] = useState("User");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    // Fonction sécurisée pour récupérer l'utilisateur
    const getUserInfo = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
          setUserName(user.username);
        } else if (user && user.name) {
          setUserName(user.name);
        } else {
          setUserName("User");
        }
      } catch (error) {
        console.error("Error getting user info:", error);
        setUserName("User");
      }
    };

    // Fonction pour mettre à jour la date et l'heure
    const updateDateTime = () => {
      try {
        const now = new Date();
        setCurrentDateTime(
          now.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) +
          " " +
          now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }) +
          " CET"
        );
      } catch (error) {
        console.error("Error updating date/time:", error);
        setCurrentDateTime(new Date().toLocaleString());
      }
    };

    getUserInfo();
    updateDateTime();

    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          {/* Brand */}
          <div className="text-xl font-bold text-gray-800">Gym Wolf</div>

          {/* Search form - Hidden on small screens */}
          <form className="hidden md:block flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                placeholder="Search..."
              />
            </div>
          </form>

          {/* User info and dropdown */}
          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-500">
              {currentDateTime || "Loading..."}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">{`Hello, ${userName}`}</span>
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>
      {/* End Navbar */}
      <div className="h-16"></div> {/* Spacer to prevent content from being hidden under navbar */}
    </>
  );
}