import { api } from "../configuration/api.client.config";

export const taskService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/task", params ?? {}, { withAuth: true }),
  student: (id: string, params?: Record<string, any>) =>
    api.get(`/task/student/${id}`, params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/task/${id}`, params ?? {}, { withAuth: true }),
  patch: (data: any) => api.patch(`/task`, data, { withAuth: true }),
  delete: (id: string) => api.delete(`/task/${id}`, { withAuth: true }),
  create: (data: any) => api.post("/task", data, { withAuth: true }),
  addFilesToSubmissionProof: (id: string, data: any) =>
    api.post(`/task/add-files/${id}`, data, { withAuth: true }),
  removeFilesToSubmissionProof: (id: string, data: any) =>
    api.post(`/task/remove-files/${id}`, data, { withAuth: true }),
};
