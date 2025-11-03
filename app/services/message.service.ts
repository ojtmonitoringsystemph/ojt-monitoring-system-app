import { api } from "../configuration/api.client.config";

export const messageService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/message", params ?? {}, { withAuth: true }),
  search: (params?: Record<string, any>) =>
    api.getAll("/message", params ?? {}, { withAuth: true }),
  student: (id: string, params?: Record<string, any>) =>
    api.get(`/message/student/${id}`, params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/message/${id}`, params ?? {}, { withAuth: true }),
  patch: (data: any) => api.patch(`/message`, data, { withAuth: true }),
  delete: (id: string) => api.delete(`/message/${id}`, { withAuth: true }),
  create: (data: any) => api.post("/message", data, { withAuth: true }),
  markAsRead: (id: string) =>
    api.post(`/message/${id}/read`, {}, { withAuth: true }),
};
