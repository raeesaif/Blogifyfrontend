import { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom"
import { LoginSchema } from "@/Schema/AuthSchema";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useAuthapi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authstore";
import { Loader2 } from "lucide-react";


const DEFAULT_VALUES = {
    email: "",
    password: ""
}

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const { mutate: login, isPending } = useLogin()
    const navigate = useNavigate()
    const { setAuth } = useAuthStore()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: DEFAULT_VALUES,
        resolver: zodResolver(LoginSchema)
    })

    const OnSubmit = (data) => {
        login(data, {
            onSuccess: (response) => {
                // Store auth data
                setAuth({
                    user: response.user,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                })

                toast.success('Login successful!')
                reset()

                // Role-based navigation
                const role = response.user?.role?.toLowerCase()
                switch (role) {
                    case 'admin':
                        navigate('/admin/dashboard')
                        break
                    case 'reader':
                        navigate('/reader-dashboard')
                        break
                    case 'writer':
                        navigate('/creater-dashboard')
                        break
                    default:
                        navigate('/')
                }
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || 'Login failed. Please try again.')
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-105">

                {/* Forest-green accent bar — matches SignupPage */}
                <div className="h-1.5 w-16 rounded-full bg-primary mb-6 mx-auto" />

                <Card className="bg-card border-border shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Log in to continue your journey.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(OnSubmit)} className="space-y-4">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-foreground font-medium">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="you@email.com"
                                    {...register("email")}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password with show/hide toggle */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-foreground font-medium">
                                        Password
                                    </Label>
                                    {/* <Link
                                        to="#"
                                        className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                                    >
                                        Forgot password?
                                    </Link> */}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1" >{errors.password.message}</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2 cursor-pointer"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Log In
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center pt-0 pb-5">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2 transition-colors"
                            >
                                Sign up free
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    🌿 Your stories deserve a beautiful home.
                </p>
            </div>
        </div>
    );
}