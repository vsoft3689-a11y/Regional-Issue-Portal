import api from "./api";

export const getRegionalIssues = () => api.get("/api/regional-issues");

export const createRegionalIssue = (data) =>
  api.post("/api/regional-issues", data);

export const updateRegionalIssue = (id, data) =>
  api.put(`/api/regional-issues/${id}`, data);

export const deleteRegionalIssue = (id) =>
  api.delete(`/api/regional-issues/${id}`);

export const getIssueStatuses = () => api.get("/api/regional-issues/statuses");
