import axios from "axios";

const API_URL = "http://localhost:5000";

// ✅ Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserClient`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registration failed.");
  }
};

// ✅ Login
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, loginData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

// ✅ Get All Coaches (same as getAllUsers for now)
export const getAllCoaches = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/getAllUsers`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get Coaches Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch coaches.");
  }
};

// ✅ Get All Users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/getAllUsers`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get Users Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch users.");
  }
};

// ✅ Delete Coach by ID
export const deleteCoachById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/deleteUserById/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete Coach Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete coach.");
  }
};

// ✅ Delete User by ID
export const deleteUserById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/deleteUserById/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user.");
  }
};

// ✅ Update User by ID
export const updateUserById = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/users/updateUserById/${id}`, updatedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Update User Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update user.");
  }
};

// ✅ Add Coach
export const addUserCoach = async (coachData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserCoach`, coachData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Add Coach Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add coach.");
  }
};

// ✅ Add Client
export const addUserClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUserClient`, clientData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Add Client Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add client.");
  }
};
