import api from "./api";


export const getAssignedIssues = async () => {
  try {
    const res = await api.get("/officer/issues");
    console.log("📋 Assigned issues fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error(" Error fetching assigned issues:", error.response?.data || error.message);
    throw error;
  }
};


export const updateStatus = async (id, status) => {
  try {
    const res = await api.put(`/officer/issues/${id}/status`, { status });
    console.log(`✅ Issue ${id} status updated to:`, status);
    return res.data;
  } catch (error) {
    console.error(" Error updating status:", error.response?.data || error.message);
    throw error;
  }
};


export const addComment = async (id, comment) => {
  try {
    const res = await api.put(`/officer/issues/${id}/comment`, comment, {
      headers: { "Content-Type": "text/plain" },
    });
    console.log(`💬 Comment added to issue ${id}:`, comment);
    return res.data;
  } catch (error) {
    console.error(" Error adding comment:", error.response?.data || error.message);
    throw error;
  }
};


export const uploadResolvedImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/officer/issues/upload/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(`📸 Image uploaded for issue ${id}`);
    return res.data;
  } catch (error) {
    console.error(" Error uploading resolved image:", error.response?.data || error.message);
    throw error;
  }
};


export const getStatusCount = async () => {
  try {
    const res = await api.get("/officer/issues/status/count");
    console.log("📊 Officer issue status count:", res.data);
    return res.data;
  } catch (error) {
    console.error(" Error fetching status count:", error.response?.data || error.message);
    throw error;
  }
};
