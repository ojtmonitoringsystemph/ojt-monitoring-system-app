import { api } from "../configuration/api.client.config";

export const documentService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/document", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/document/${id}`, params ?? {}, { withAuth: true }),
  patch: (id: string, data: any) =>
    api.patch(`/document/${id}`, data, { withAuth: true }),
  create: (data: any) => api.post("/document", data, { withAuth: true }),
  assignedToCompany: (data: any) =>
    api.post("/document/assign-company", data, { withAuth: true }),
  search: (data: any) => api.post("/document/search", data, { withAuth: true }),
};
