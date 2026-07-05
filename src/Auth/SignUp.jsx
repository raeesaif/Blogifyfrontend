import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SignUpSchema } from "@/Schema/AuthSchema";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRegisterApi } from "@/hooks/useAuthapi";
import { Loader2 } from "lucide-react";


const DEFAULT_VALUES = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmePassword: "",
    role: "",
}


export default function SignupPage() {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmePassword, setConfirmePasswrd] = useState(false)
    const { mutate: registerData, isPending } = useRegisterApi()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: DEFAULT_VALUES,
        resolver: zodResolver(SignUpSchema),
    })

    const OnSubmit = (data) => {
        registerData(data, {
            onSuccess: () => {

                toast.success("Account created successfully!");
                reset();
                navigate("/login");
            },

            onError: (error) => {
                console.log("ERROR", error);

                toast.error(
                    error?.response?.data?.message ||
                    "Registration failed. Please try again."
                );
            }
        });
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-[420px]">

                {/* Forest-green accent bar */}
                <div className="h-1.5 w-16 rounded-full bg-primary mb-6 mx-auto" />

                <Card className="bg-card border-border shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Start your writing journey today.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(OnSubmit)} className="space-y-4">

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="name" className="text-foreground font-medium mb-2">First name</Label>
                                    <Input
                                        id="firstname"
                                        placeholder="Enter your Firstname"
                                        {...register("firstname")}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                    />
                                    {errors.firstname && (
                                        <p className='text-red-500 text-xs mt-1'>{errors.firstname.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="name" className="text-foreground font-medium mb-2">Last name</Label>
                                    <Input
                                        id="lastname"
                                        placeholder="Enter your Firstname"
                                        {...register("lastname")}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                    />
                                    {errors.lastname && (
                                        <p className="text-red-500 text-xs mt-1" >{errors.lastname.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@email.com"
                                    {...register("email")}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1" >{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1" >{errors.password.message}</p>
                                    )}
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirm" className="text-foreground font-medium">Confirm password</Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmePassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                                    />
                                    {errors.confirmePassword && (
                                        <p className="text-red-500 text-xs mt-1" >{errors.confirmePassword.message}</p>
                                    )}
                                    <button
                                        type='button'
                                        onClick={() => setConfirmePasswrd(!showConfirmePassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                        aria-label={showConfirmePassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Role</Label>

                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="reader">
                                                    Reader
                                                </SelectItem>

                                                <SelectItem value="writer">
                                                    Writer
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.role && (
                                    <p className="text-red-500 text-xs">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2 cursor-pointer"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center pt-0 pb-5">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary/80 font-semibold underline underline-offset-2 transition-colors"
                            >
                                Log in
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