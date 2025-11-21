import { api } from "../configuration/api.client.config";

export const requirementService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/requirements", params ?? {}, { withAuth: true }),
  search: (data: any) =>
    api.post("/requirements/search", data, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/requirements/${id}`, params ?? {}, { withAuth: true }),
  patch: (data: any) => api.patch(`/requirements`, data, { withAuth: true }),
  delete: (id: string) => api.delete(`/requirements/${id}`, { withAuth: true }),
  create: (data: any) => api.post("/requirements", data, { withAuth: true }),
};
