import apiClient from "@/lib/apiClient";

export const authApi = {
    register: async (data) => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },
    login: async (data) => {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    },
    me: async () => {
        const response = await apiClient.get("/auth/me");
        return response.data.data;
    },
    updateProfile: async (data) => {
        const response = await apiClient.patch("/auth/update-profile", data);
        return response.data;
    },
};