import { useMemo } from "react";
import { blogApi } from "@/apis/blogApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateBlog = ()=>{
    return useMutation({
        mutationFn: (data) => blogApi.createBlog(data)
    })
}

export const useGetAllBlogs = ({ page = 1, limit = 10, category = "", sort = "" } = {}) => {
    const params = useMemo(() => ({ page, limit, category, sort }), [page, limit, category, sort]);
    return useQuery({
        queryKey: ["blogs", params],
        queryFn: () => blogApi.getAllBlogs(params),
        select: (data) => ({
            blogs: data.data || [],
            totalCount: data.count || data.total || 0,
            totalPages: data.totalpages || 1,
        }),
    });
};

export const useGetMyBlogs = ({ page = 1, limit = 6, status = "all", search = "" } = {}) => {
    const params = useMemo(() => {
        const p = { page, limit };
        if (status && status !== "all") p.status = status;
        if (search) p.search = search;
        return p;
    }, [page, limit, status, search]);

    return useQuery({
        queryKey: ["my-blogs", params],
        queryFn: () => blogApi.getMyBlogs(params),
    });
};

export const useGetSingleBlog = (id) => {
    return useQuery({
        queryKey: ["blog", id],
        queryFn: () => blogApi.getBlogById(id),
        enabled: !!id,
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => blogApi.updateBlog(id, data),
        onSuccess: (data, variables) => {
            toast.success("Blog updated successfully");
            queryClient.invalidateQueries(["blog", variables.id]);
            queryClient.invalidateQueries(["my-blogs"]);
            queryClient.invalidateQueries(["blogs"]);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update blog");
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => blogApi.deleteBlog(id),
        onSuccess: () => {
            toast.success("Blog deleted successfully");
            queryClient.invalidateQueries(["my-blogs"]);
            queryClient.invalidateQueries(["blogs"]);
        },
        onError: () => {
            toast.error("Failed to delete blog");
        },
    });
};

export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, blogId }) => blogApi.addFavorite({ userId, blogId }),
        onSuccess: () => {
            toast.success("Added to favourites");
            queryClient.invalidateQueries(["blogs"]);
        },
        onError: (error) => {
            if (error?.response?.status === 401) {
                toast.error("You are not Login please first login");
            } else {
                toast.error(error?.response?.data?.message || "Failed to add favourite");
            }
        },
    });
};

export const useGetFavoriteBlogs = (userId) => {
    return useQuery({
        queryKey: ["favorite-blogs", userId],
        queryFn: () => blogApi.getFavoriteBlogs(userId),
        enabled: !!userId,
    });
};

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, blogId }) => blogApi.removeFavorite(userId, blogId),
        onSuccess: () => {
            toast.success("Removed from favourites");
            queryClient.invalidateQueries(["blogs"]);
            queryClient.invalidateQueries(["favorite-blogs"]);
        },
        onError: (error) => {
            if (error?.response?.status === 401) {
                toast.error("You are not Login please first login");
            } else {
                toast.error(error?.response?.data?.message || "Failed to remove favourite");
            }
        },
    });
};

export const useToggleLike = (blogId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => blogApi.toggleLike(blogId),
        onSuccess: () => {
            queryClient.invalidateQueries(["blog", blogId]);
        },
        onError: (error) => {
            if (error?.response?.status === 401) {
                toast.error("Please login to like this blog");
            } else {
                toast.error(error?.response?.data?.message || "Failed to toggle like");
            }
        },
    });
};