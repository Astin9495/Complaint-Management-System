import api from "../axiosConfig";

export const listComplaints = (params = {}) =>
  api.get(`/api/complaints`, { params }).then(r => r.data);

export const getComplaint = (id) =>
  api.get(`/api/complaints/${id}`).then(r => r.data);

export const createComplaint = (payload) =>
  api.post(`/api/complaints`, payload).then(r => r.data);

export const updateComplaint = (id, payload) =>
  api.patch(`/api/complaints/${id}`, payload).then(r => r.data);

export const deleteComplaint = (id) =>
  api.delete(`/api/complaints/${id}`).then(r => r.data);

export const updateComplaintStatus = (id, status, resolution) =>
  api.patch(`/api/complaints/${id}/status`, { status, resolution }).then(r => r.data);
