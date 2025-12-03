import { api } from "../configuration/api.client.config";

export const companyService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/company", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/company/${id}`, params ?? {}, { withAuth: true }),
  patch: (data: any) => api.patch(`/company`, data, { withAuth: true }),
  create: (data: any) => api.post("/company", data, { withAuth: true }),
  delete: (id: string) => api.delete(`/company/${id}`, { withAuth: true }),
};
