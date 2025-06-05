import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllUsers,
  deleteUserById,
  addUserClient,
  updateUserById,
} from "../../../services/apiUser";

export default function ManageClient({ color }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchClients = async () => {
    try {
      const res = await getAllUsers();
      const userList = res?.userListe || [];
      const clientData = userList.filter((user) => user.role === "client");
      setClients(clientData);
      setFilteredClients(clientData);
      setError(null);
    } catch (error) {
      setError("Error fetching clients.");
      setClients([]);
      setFilteredClients([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserById(id);
      const updatedList = clients.filter((client) => client._id !== id);
      setClients(updatedList);
      setFilteredClients(updatedList);
    } catch (error) {
      setError("Error deleting client.");
    }
  };

  const handleUpdate = (id) => {
    const client = clients.find((c) => c._id === id);
    setSelectedClient(client);
    setFormData({
      username: client.username,
      email: client.email,
      password: "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddClient = () => {
    setFormData({ username: "", email: "", password: "" });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await addUserClient(formData);
        setMessage({ text: "Client added successfully!", type: "success" });
      } else if (isUpdateModalOpen && selectedClient) {
        await updateUserById(selectedClient._id, {
          username: formData.username,
          email: formData.email,
        });
        setMessage({ text: "Client updated successfully!", type: "success" });
      }
      fetchClients();
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
    const filtered = clients.filter((client) =>
      client.username.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedClient(null);
    setFormData({ username: "", email: "", password: "" });
    setMessage({ text: "", type: "" });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg " +
        (color === "light" ? "bg-white" : "bg-gray-800 text-white")
      }
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className={"text-2xl font-semibold " + (color === "light" ? "text-gray-800" : "text-white")}>
            Liste des clients
          </h3>
          <button
            onClick={handleAddClient}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
           Ajouter client
          </button>
        </div>
      </div>

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

      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={handleSearch}
          className="border px-4 py-2 rounded-lg w-full md:w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                 Aucun client trouvé.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50 border-b text-sm">
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      className="h-10 w-10 rounded-full border"
                      alt="Client"
                    />
                    <span className="ml-3">{client.username}</span>
                  </td>
                  <td className="px-6 py-4">{client.email}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleUpdate(client._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(isAddModalOpen || isUpdateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isAddModalOpen ? "Ajouter un nouveau" : "Update Client"}
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isAddModalOpen ? "Ajouter" : "Modifier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ManageClient.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};

ManageClient.defaultProps = {
  color: "light",
};
