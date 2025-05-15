import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllCoaches,
  deleteCoachById,
  addUserCoach,
  updateUserById,
} from "../../../services/apiUser";

export default function ManageCoach({ color }) {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    specialite: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const specialities = [
    "Musculation",
    "Cardio",
    "Fitness",
    "Yoga",
    "CrossFit",
    "Zumba",
    "Boxe",
    "Pilates",
    "kong fou",
  ];

  const fetchCoaches = async () => {
    try {
      const res = await getAllCoaches();
      const coachList = res?.userListe || [];
      const coachesData = coachList.filter((user) => user.role === "coach");
      setCoaches(coachesData);
      setFilteredCoaches(coachesData);
      setError(null);
    } catch (error) {
      setError("Error fetching coaches.");
      setCoaches([]);
      setFilteredCoaches([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoachById(id);
      const updatedList = coaches.filter((coach) => coach._id !== id);
      setCoaches(updatedList);
      setFilteredCoaches(updatedList);
    } catch (error) {
      setError("Error deleting coach.");
    }
  };

  const handleUpdate = (id) => {
    const coach = coaches.find((c) => c._id === id);
    setSelectedCoach(coach);
    setFormData({
      username: coach.username,
      email: coach.email,
      password: "",
      specialite: coach.specialite || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddCoach = () => {
    setFormData({ username: "", email: "", password: "", specialite: "" });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await addUserCoach(formData);
        setMessage({ text: "Coach added successfully!", type: "success" });
      } else if (isUpdateModalOpen && selectedCoach) {
        await updateUserById(selectedCoach._id, {
          username: formData.username,
          email: formData.email,
          specialite: formData.specialite,
        });
        setMessage({ text: "Coach updated successfully!", type: "success" });
      }
      fetchCoaches();
      closeModal();
    } catch (error) {
      setMessage({
        text: error.message || "An error occurred.",
        type: "error",
      });
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = coaches.filter((coach) =>
      coach.username.toLowerCase().includes(query)
    );
    setFilteredCoaches(filtered);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedCoach(null);
    setFormData({ username: "", email: "", password: "", specialite: "" });
    setMessage({ text: "", type: "" });
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg " +
        (color === "light" ? "bg-white" : "bg-gray-800 text-white")
      }
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3
            className={
              "text-2xl font-semibold " +
              (color === "light" ? "text-gray-800" : "text-white")
            }
          >
            List of Coaches
          </h3>
          <button
            onClick={handleAddCoach}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Coach
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="px-6 py-3 text-red-600">{error}</div>}
      {message.text && (
        <div
          className={`px-6 py-3 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={handleSearch}
          className="border px-4 py-2 rounded-lg w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Speciality</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoaches.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No coaches found.
                </td>
              </tr>
            ) : (
              filteredCoaches.map((coach) => (
                <tr
                  key={coach._id}
                  className="hover:bg-gray-50 border-b text-sm"
                >
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      className="h-10 w-10 rounded-full border"
                      alt="Coach"
                    />
                    <span className="ml-3">{coach.username}</span>
                  </td>
                  <td className="px-6 py-4">{coach.email}</td>
                  <td className="px-6 py-4">
                    {coach.specialite || "Not specified"}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleUpdate(coach._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(coach._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(isAddModalOpen || isUpdateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isAddModalOpen ? "Add New Coach" : "Update Coach"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              {isAddModalOpen && (
                <div className="mb-4">
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium">Speciality</label>
                <select
                  value={formData.specialite}
                  onChange={(e) =>
                    setFormData({ ...formData, specialite: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select a specialty</option>
                  {specialities.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {isAddModalOpen ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ManageCoach.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};

ManageCoach.defaultProps = {
  color: "light",
};
