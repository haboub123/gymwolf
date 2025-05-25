import axios from "axios";

const API_URL = "http://localhost:5000";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Helper function for error handling
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || defaultMessage);
};

// ✅ Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserClient`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Registration failed.");
  }
};

// ✅ Login
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, loginData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Login failed.");
  }
};

// ✅ Get All Coaches (using the correct endpoint)
export const getAllCoaches = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/coachs`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch coaches.");
  }
};

// ✅ Get All Users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/getAllUsers`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch users.");
  }
};

// ✅ Delete Coach by ID
export const deleteCoachById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/deleteUserById/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete coach.");
  }
};

// ✅ Delete User by ID
export const deleteUserById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/deleteUserById/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete user.");
  }
};

// ✅ Update User by ID
export const updateUserById = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/users/updateUserById/${id}`, updatedData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update user.");
  }
};

// ✅ Add Coach
export const addUserCoach = async (coachData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserCoach`, coachData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add coach.");
  }
};

// ✅ Add Coach with Image
export const addCoachWithImage = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addCoachWithImg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add coach with image.");
  }
};

// ✅ Add Client
export const addUserClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserClient`, clientData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add client.");
  }
};

// ✅ Helper function for coach image URL
export const getCoachImageUrl = (imagePath, defaultImage = "https://via.placeholder.com/150") => {
  return imagePath ? `${API_URL}/files/${imagePath}` : defaultImage;
};