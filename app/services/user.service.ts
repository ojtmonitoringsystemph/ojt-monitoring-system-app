import { api } from "../configuration/api.client.config";

export const userService = {
  dashboard: (params?: Record<string, any>) =>
    api.get("/user/dashboard", params ?? {}, { withAuth: true }),
  getAll: (params?: Record<string, any>) =>
    api.getAll("/user", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/user/${id}`, params ?? {}, { withAuth: true }),
  patch: (data: any) => api.patch(`/user`, data, { withAuth: true }),
  create: (data: any) => api.post("/user", data, { withAuth: true }),
  assignedToCompany: (data: any) =>
    api.post("/user/assign-company", data, { withAuth: true }),
  search: (data: any) => api.post("/user/search", data, { withAuth: true }),
};
