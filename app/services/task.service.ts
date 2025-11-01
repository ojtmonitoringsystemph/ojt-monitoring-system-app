import { api } from "../configuration/api.client.config";

export const taskService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/task", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/task/${id}`, params ?? {}, { withAuth: true }),
  patch: (data: any) => api.patch(`/task`, data, { withAuth: true }),
  delete: (id: string) => api.delete(`/task/${id}`, { withAuth: true }),
  create: (data: any) => api.post("/task", data, { withAuth: true }),
};
