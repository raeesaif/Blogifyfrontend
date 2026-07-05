import { authApi } from "@/apis/authapi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegisterApi = () => {
    return useMutation({
        mutationKey: ["register"],
        mutationFn: (data) => authApi.register(data),
    });
};

export const useLogin = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: (data) => authApi.login(data),
    });
};

export const useMe = (options = {}) => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: authApi.me,
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useUpdateProfile = () => {
    return useMutation({
        mutationKey: ["auth", "updateProfile"],
        mutationFn: (data) => authApi.updateProfile(data),
    });
}; 