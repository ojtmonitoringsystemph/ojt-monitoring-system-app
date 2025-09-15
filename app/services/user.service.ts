import { api } from "./api.client";

export const userService = {
  getAll: (params?: Record<string, any>) => api.getAll("/user", params ?? {}),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/user/${id}`, params ?? {}, { withAuth: true }),
  update: (id: string, data: any) => api.put(`/user`, data, { withAuth: true }),
  create: (data: any) => api.post("/user", data, { withAuth: true }),
  exportPKRF: (id: string) => api.get(`/user/${id}/export`, { withAuth: true }),
  import: (data: any) => api.post("/user/import", data, { withAuth: true }),
  imports: (data: any) => api.post("/user/uploads", data, { withAuth: true }),
};
