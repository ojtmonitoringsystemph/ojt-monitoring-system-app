import { api } from "../configuration/api.client.config";

export const authService = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) =>
    api.post("/auth/register", data, { headers: {}, withAuth: true }),
  bulkRegister: (data: any) => api.post("/auth/bulk-register", data),
  upload: (data: any) => api.post("/auth/upload", data),
  profile: (id: string, params?: Record<string, any>) =>
    api.get(`/auth/profile/${id}`, params ?? {}, { withAuth: true }),
  changePassword: (data: any) =>
    api.patch("/auth/change-password", data, { withAuth: true }),
};
