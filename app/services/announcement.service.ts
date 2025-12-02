import { api } from "../configuration/api.client.config";

export const announcementService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/announcement", params ?? {}, { withAuth: true }),

  get: (id: string, params?: Record<string, any>) =>
    api.get(`/announcement/${id}`, params ?? {}, { withAuth: true }),

  patch: (id: string, data: any) =>
    api.patch(`/announcement/${id}`, data, { withAuth: true }),

  create: (data: any) => api.post("/announcement", data, { withAuth: true }),

  delete: (id: string) => api.delete(`/announcement/${id}`, { withAuth: true }),

  search: (data: any) =>
    api.post("/announcement/search", data, { withAuth: true }),
};
