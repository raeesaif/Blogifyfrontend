import apiClient from "@/lib/apiClient";

export const blogApi = {
    getAllBlogs: async ({ page = 1, limit = 10, category = "", sort = "", search = "" } = {}) => {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (category) params.category = category;
        if (sort) params.sort = sort;
        if (search) params.search = search;
        const response = await apiClient.get("/blogs", { params });
        return response.data;
    },
    getBlogById: async (id) => {
        const response = await apiClient.get(`/blog/${id}`);
        return response.data.data;
    },
    getMyBlogs: async ({ page, limit, status, search }) => {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (status) params.status = status;
        if (search) params.search = search;
        const response = await apiClient.get("/my-blogs", { params });
        return response.data;
    },
    createBlog: async (data) => {
        const response = await apiClient.post("/create-blogs", data);
        return response.data;
    },
    updateBlog: async (id, data) => {
        const response = await apiClient.patch(`/update-blog/${id}`, data);
        return response.data.data;
    },
    deleteBlog: async (id) => {
        const response = await apiClient.delete(`/delete-blog/${id}`);
        return response.data;
    },
    addFavorite: async ({ userId, blogId }) => {
        const response = await apiClient.post("/add-favrite", { userId, blogId });
        return response.data;
    },
    getFavoriteBlogs: async (userId) => {
        const response = await apiClient.get(`/favrite-blogs/${userId}`);
        return response.data;
    },
    removeFavorite: async (userId, blogId) => {
        const response = await apiClient.delete(`/remove-favrite/${userId}/${blogId}`);
        return response.data;
    },
    toggleLike: async (blogId) => {
        const response = await apiClient.post(`/toggle-like/${blogId}`);
        return response.data;
    },
    checkLike: async (blogId) => {
        const response = await apiClient.get(`/check-like/${blogId}`);
        return response.data;
    },
    getLikes: async (blogId) => {
        const response = await apiClient.get(`/get-likes/${blogId}`);
        return response.data;
    },
    getActivity: async ({ page = 1, limit = 10 } = {}) => {
        const response = await apiClient.get("/activities", { params: { page, limit } });
        return response.data;
    },
    postActivity: async (data) => {
        const response = await apiClient.post("/activity", data);
        return response.data;
    },
};