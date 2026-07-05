import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useAuthStore = create(
    persist(
        (set,get)=>({
            user:null,
            accessToken:null,
            refreshToken:null,
            isLoading:false,
            setAuth:({user,accessToken,refreshToken})=>{
                set({
                    user,
                    accessToken,
                    refreshToken
                })
            },
            setaccessToken:(accessToken)=>{
                set({accessToken})
            },
            setLoading:(isLoading)=>{
                set({isLoading})
            },
            logout: () => {
                localStorage.removeItem("auth-storage");
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                });
            },
             isAuthenticated: () => {
                return !!get().accessToken
            }
        }),
        {
            name:"auth-storage",
            storage:createJSONStorage(()=>localStorage),
            partialize:(state)=>({
                user:state.user,
                accessToken:state.accessToken,
                refreshToken:state.refreshToken
            })
        }
    )
)