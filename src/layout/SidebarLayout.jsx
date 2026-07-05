// import { useNavigate } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
// import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarContent } from "@/components/ui/sidebar"
// import { Badge } from "@/components/ui/badge"
// import { HeartPlus, LayoutDashboard, LogOut, Rss, Settings } from 'lucide-react';
// import { useAuthStore } from '../store/authstore';


// const SideBarLayout = () => {
//     const navigate = useNavigate()
//     const { user, logout } = useAuthStore()

//     const roleNavigation = {
//         admin: [
//             { icon: <LayoutDashboard />, name: "DashBoard", path: "/admin/dashboard" },
//             { icon: <Settings />, name: "Settings", path: "/profile-setting" }
//         ],
//         writer: [
//             { icon: <LayoutDashboard />, name: "DashBoard", path: "/creater-dashboard" },
//             { icon: <Rss />, name: "Create Blog", path: "/creater-blog" },
//             { icon: <Settings />, name: "Settings", path: "/profile-setting" }
//         ],
//         reader: [
//             { icon: <LayoutDashboard />, name: "DashBoard", path: "/reader-dashboard" },
//             { icon: <HeartPlus />, name: "Favorite", path: "/favorite-blogs" },
//             { icon: <Settings />, name: "Settings", path: "/profile-setting" }
//         ],
//     }

//     const role = user?.role?.toLowerCase() || 'admin'
//     const navigation = roleNavigation[role] || roleNavigation.admin

//     const handleLogout = () => {
//         logout()
//         navigate('/login')
//     }
//     return (
//         <>
//             <Sidebar collapsible="icon" >
//                 <SidebarHeader>
//                     <div className="flex items-center gap-2 px-2 py-2">
//                         <Badge className="bg-primary text-white font-bold text-lg rounded-md px-2 py-1">Blogify</Badge>
//                     </div>
//                 </SidebarHeader>
//                 <SidebarContent >
//                     <SidebarMenu className="px-2 py-8 ">
//                         {navigation?.map((project) => (
//                             <SidebarMenuItem key={project.name} className="py-2">
//                                 <NavLink to={project.path}>
//                                     {({ isActive }) => (
//                                         <SidebarMenuButton isActive={isActive} asChild>
//                                             <span>
//                                                 {project.icon}
//                                                 <span>{project.name}</span>
//                                             </span>
//                                         </SidebarMenuButton>
//                                     )}
//                                 </NavLink>
//                             </SidebarMenuItem>
//                         ))}
//                     </SidebarMenu>
//                 </SidebarContent>
//                 <SidebarFooter>
//                     <SidebarMenu>
//                         <SidebarMenuItem>
//                             <SidebarMenuButton
//                                 type="button"
//                                 onClick={handleLogout}
//                                 className="text-black"
//                             >
//                                 <LogOut />
//                                 <span>Log out</span>
//                             </SidebarMenuButton>
//                         </SidebarMenuItem>
//                     </SidebarMenu>
//                 </SidebarFooter>
//             </Sidebar>
//         </>
//     )
// }

// export default SideBarLayout

import { useNavigate, NavLink } from 'react-router-dom';
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HeartPlus, LayoutDashboard, LogOut, Rss, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authstore';


const SideBarLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const roleNavigation = {
        admin: [
            { icon: <LayoutDashboard className="w-4 h-4" />, name: "Dashboard", path: "/admin/dashboard" },
            { icon: <Settings className="w-4 h-4" />, name: "Settings", path: "/profile-setting" },
        ],
        writer: [
            { icon: <LayoutDashboard className="w-4 h-4" />, name: "Dashboard", path: "/creater-dashboard" },
            { icon: <Rss className="w-4 h-4" />, name: "Create Blog", path: "/creater-blog" },
            { icon: <Settings className="w-4 h-4" />, name: "Settings", path: "/profile-setting" },
        ],
        reader: [
            { icon: <LayoutDashboard className="w-4 h-4" />, name: "Dashboard", path: "/reader-dashboard" },
            { icon: <HeartPlus className="w-4 h-4" />, name: "Favourites", path: "/favorite-blogs" },
            { icon: <Settings className="w-4 h-4" />, name: "Settings", path: "/profile-setting" },
        ],
    };

    const rawRole = user?.role?.toLowerCase() || "reader";
    const role = ["admin", "writer", "reader"].includes(rawRole)
        ? rawRole
        : rawRole === "creator" || rawRole === "creater"
            ? "writer"
            : "reader";
    const navigation = roleNavigation[role] || roleNavigation.reader;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Sidebar collapsible="icon" className="bg-card border-r border-border">

            {/* ── Header: Logo + User block ── */}
            <SidebarHeader className="bg-card border-b border-border">

                {/* Logo */}
                <div className="flex items-center gap-2 px-4 py-3">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-extrabold text-sm leading-none">B</span>
                    </div>
                    <span onClick={() => navigate("/")} className="font-extrabold text-lg tracking-tight text-foreground cursor-pointer ">
                        Blogify
                    </span>
                </div>
            </SidebarHeader>

            {/* ── Nav links ── */}
            <SidebarContent className="bg-card py-4">
                <SidebarMenu className="px-3 gap-1">
                    {navigation.map((item) => (
                        <SidebarMenuItem key={item.name}>
                            <NavLink to={item.path}>
                                {({ isActive }) => (
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        asChild
                                        className="
                                               data-[active=true]:bg-primary
                                              data-[active=true]:text-primary-foreground
                                                                                                                          "
                                    >
                                        <span className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200">
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </span>
                                    </SidebarMenuButton>
                                )}
                            </NavLink>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            {/* ── Logout — same as old sidebar ── */}
            <SidebarFooter className="bg-card border-t border-border">
                <div className="px-3 py-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive px-4 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </SidebarFooter>

        </Sidebar>
    );
};

export default SideBarLayout;