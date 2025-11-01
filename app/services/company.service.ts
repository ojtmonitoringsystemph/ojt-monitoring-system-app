import { api } from "../configuration/api.client.config";

export const companyService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/company", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/company/${id}`, params ?? {}, { withAuth: true }),
  patch: (id: string, data: any) =>
    api.patch(`/company/${id}`, data, { withAuth: true }),
  create: (data: any) => api.post("/company", data, { withAuth: true }),
};
