import api from "./api";

export const getUsers = () => api.get("/api/users");

export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? api.get(`/api/users?username=${user.username}`) : Promise.reject();
};

export const updateUser = (data) => api.post("/api/users", data);
