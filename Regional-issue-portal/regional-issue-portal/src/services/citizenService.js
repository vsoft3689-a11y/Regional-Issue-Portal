import api from "./api";


export const getMyIssues = async () => {
  try {
    const response = await api.get("/citizen/issues");
    if (Array.isArray(response.data)) {
      console.log("✅ Issues fetched successfully:", response.data.length);
      return response.data;
    }
    console.warn("⚠️ Unexpected data format:", response.data);
    return [];
  } catch (error) {
    console.error("❌ Error fetching issues:", error.response?.data || error.message);
    return []; 
  }
};


export const createIssue = async (data) => {
  try {
    const response = await api.post("/citizen/issues", data, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data?.id) {
      console.log(" Issue created with ID:", response.data.id);
    } else {
      console.log(" Issue created successfully");
    }

    return response.data;
  } catch (error) {
    console.error(" Error creating issue:", error.response?.data || error.message);
    throw error;
  }
};


export const uploadIssueImage = async (issueId, file) => {
  try {
    if (!file) throw new Error("File not selected.");

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/citizen/issues/upload/${issueId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(`📸 Image uploaded successfully for issue ID ${issueId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading image:", error.response?.data || error.message);
    throw error;
  }
};


export const reopenIssue = async (issueId) => {
  try {
    const response = await api.put(`/citizen/issues/reopen/${issueId}`);
    console.log(`🔁 Issue ${issueId} reopened successfully.`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error reopening issue ${issueId}:`, error.response?.data || error.message);
    throw error;
  }
};
