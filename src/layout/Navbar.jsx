import { ChevronDown, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authstore";
const usePathname = () => window.location.pathname;

const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/about", label: "About" },
];

function getInitials(name = "") {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const pathname = usePathname();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const rawRole = (user?.role || "reader").toLowerCase();
    const role = ["admin", "writer", "reader"].includes(rawRole) ? rawRole : "reader";

    const dashboardPath =
        role === "admin"
            ? "/admin/dashboard"
            : role === "writer"
                ? "/creater-dashboard"
                : "/reader-dashboard";

    return (
        <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

                {/* ── Logo ── */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold tracking-tight text-primary hover:text-primary/80 transition-colors"
                >
                    Blogify
                </Link>

                {/* ── Center Nav Links ── */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => {
                        const active = pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={[
                                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                                    active
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                                ].join(" ")}
                            >
                                {link.label}
                                {active && (
                                    <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* ── Right Side ── */}
                <div className="flex items-center gap-3">
                    {!user ? (
                        /* Guest: Login + Sign Up */
                        <>
                            <Button
                                variant="ghost"
                                className="hidden sm:inline-flex text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer "
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer "
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        /* Logged-in: Avatar Dropdown */
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                            {getInitials(user.firstname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm font-medium text-foreground">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 bg-card border-border text-foreground shadow-lg"
                            >
                                {/* User info header */}
                                <DropdownMenuLabel className="pb-1">
                                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-border" />

                                {/* Dashboard */}
                                <DropdownMenuItem
                                    className="gap-2 text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                    onClick={() => navigate(dashboardPath)}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </DropdownMenuItem>

                                {/* Profile */}
                                <DropdownMenuItem
                                    className="gap-2 text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                    onClick={() => navigate("/profile-setting")}
                                >
                                    <UserIcon className="w-4 h-4" />
                                    Profile
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-border" />

                                {/* Logout */}
                                <DropdownMenuItem
                                    className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav>
    );
}