import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBarLayout from "./SidebarLayout";
import { Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMe } from "@/hooks/useAuthapi";


export function MainLayout() {
    const { data } = useMe()

    const fullname = data ? `${data.firstname} ${data.lastname}` : "User"


    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <SideBarLayout />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6">
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                        <div className="ml-auto flex items-center gap-2">
                            {/* <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                                <Bell className="h-4 w-4" />
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-white">
                                    3
                                </span>
                            </Button> */}
                            <div className="flex items-center gap-2 rounded-lg bg-orange/50 px-3 py-1.5">
                                <div >
                                    <Avatar>
                                        <AvatarImage src={data?.profileImage || data?.avatar} alt={fullname} />
                                        <AvatarFallback className="bg-stone-500 text-white">{data?.firstname?.[0]?.toUpperCase()}{data?.lastname?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-medium text-foreground">{fullname}</p>
                                    <p className="text-[10px] text-muted-foreground">{data?.email}</p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-4 sm:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}



