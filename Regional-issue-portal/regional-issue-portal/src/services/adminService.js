


import api from "./api";



export const getAllIssues = async () => {
  try {
    const res = await api.get("/admin/issues"); 
    return res.data; 
  } catch (error) {
    console.error("❌ Error fetching all issues:", error);
    throw error;
  }
};


export const getAllOfficers = async () => {
  try {
    const res = await api.get("/admin/officers");
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching officers:", error);
    throw error;
  }
};


export const assignIssue = async (issueId, officerUsername) => {
  try {
    const res = await api.put(
      `/admin/assign/${issueId}?officerUsername=${officerUsername}`
    );
    return res.data;
  } catch (error) {
    console.error(" Error assigning issue:", error);
    throw error;
  }
};


export const updateIssueStatus = async (id, status) => {
  try {
    const res = await api.put(`/admin/status/${id}?status=${status}`);
    return res.data;
  } catch (error) {
    console.error(" Error updating status:", error);
    throw error;
  }
};


export const deleteIssue = async (id) => {
  try {
    const res = await api.delete(`/admin/issues/${id}`);
    return res.data;
  } catch (error) {
    console.error(" Error deleting issue:", error);
    throw error;
  }
};


export const getIssueStatusCounts = async () => {
  try {
    const res = await api.get("/admin/issues/status/count");
    return res.data;
  } catch (error) {
    console.error(" Error fetching counts:", error);
    throw error;
  }
};


export const getDashboardStats = async () => {
  try {
    const res = await api.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    console.error(" Error fetching dashboard stats:", error);
    throw error;
  }
};

