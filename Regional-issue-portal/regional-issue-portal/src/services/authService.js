import api from "./api";



export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);



export const storeAuthData = (data) => {
  if (!data) return;

  
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  
  const userData = {
    username: data.username || "",
    role: data.role || "",      
  };

  localStorage.setItem("user", JSON.stringify(userData));
};



export const getAuthData = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user data:", err);
    return null;
  }
};



export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();
};
