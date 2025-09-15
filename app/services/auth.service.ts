import { api } from "./api.client";

export const authService = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  bulkRegister: (data: any) => api.post("/auth/bulk-register", data),
  upload: (data: any) => api.post("/auth/upload", data),
};
