import { useEffect, useRef, useState } from "react";
import {
    Calendar,
    BookOpen,
    Pencil,
    Camera,
    KeyRound,
    User,
    Save,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useMe, useUpdateProfile } from "@/hooks/useAuthapi";
import { useGetFavoriteBlogs } from "@/hooks/useBlogapi";
import { toast } from "sonner";
import { BlogCard } from "@/components/BlogCard";

function getInitials(firstname = "", lastname = "") {
    const a = firstname?.[0] ?? "";
    const b = lastname?.[0] ?? "";
    return (a + b).toUpperCase() || "?";
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    const {
        data: meResponse,
        isLoading: isLoadingUser,
        isError,
        refetch,
    } = useMe();

    const user = meResponse?.data ?? meResponse ?? null;

    const userId = user?._id || user?.id;

    const { data: favoriteData, isLoading: isLoadingFavorites } = useGetFavoriteBlogs(userId);
    const rawItems = favoriteData?.data || [];
    const favoriteBlogs = rawItems.map((item) => item.blogId || item).filter(Boolean);
    const favoriteIds = new Set(favoriteBlogs.map((b) => b._id || b.id));

    const { mutateAsync: updateProfile, isLoading: isUpdatingProfile } =
        useUpdateProfile();

    const [editOpen, setEditOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const avatarInputRef = useRef(null);

    const [pwOpen, setPwOpen] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (isLoadingUser) return;

        if (isError && !hasRedirected.current) {
            hasRedirected.current = true;
            toast.error("Please log in first");
            navigate("/login", { replace: true });
        }
    }, [isLoadingUser, isError, navigate]);

    const openEdit = () => {
        setFirstName(user?.firstname ?? "");
        setLastName(user?.lastname ?? "");
        setAvatarPreview(user?.avatar ?? "");
        setAvatarFile(null);
        setEditOpen(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setAvatarFile(file);

        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        if (!firstName.trim()) {
            toast.error("First name is required");
            return;
        }

        const payload = {
            firstname: firstName.trim(),
            lastname: lastName.trim(),
        };

        if (avatarPreview) {
            payload.avatar = avatarPreview;
        }

        try {
            await updateProfile(payload);
            await refetch();
            toast.success("Profile updated!");
            setEditOpen(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Could not update profile. Please try again."
            );
        }
    };

    const handleSavePassword = () => {
        if (!currentPw || !newPw || !confirmPw) {
            toast.error("Please fill in all fields");
            return;
        }
        if (newPw.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPw !== confirmPw) {
            toast.error("Passwords do not match");
            return;
        }

        toast.success("Password updated!");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setPwOpen(false);
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (isError) return null;
    if (!user) return null;

    const fullName = [user.firstname, user.lastname].filter(Boolean).join(" ");

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-6 space-y-10">
                <Card className="bg-card border-border shadow-md">
                    <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <Avatar className="h-24 w-24 shrink-0 ring-4 ring-primary/20">
                            <AvatarImage src={user.avatar} alt={fullName} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                {getInitials(user.firstname, user.lastname)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {fullName}
                            </h1>
                            <p className="text-muted-foreground mt-1">{user.email}</p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                                <Badge className="bg-primary/10 text-primary border-primary/20 capitalize font-medium">
                                    {user.role}
                                </Badge>

                                {user.isActive !== undefined && (
                                    <Badge
                                        className={
                                            user.isActive
                                                ? "bg-primary/10 text-primary border-primary/20 font-medium"
                                                : "bg-destructive/10 text-destructive border-destructive/20 font-medium"
                                        }
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                )}

                                {user.joinedAt && (
                                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Joined {user.joinedAt}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-foreground hover:bg-accent gap-2 cursor-pointer"
                                onClick={openEdit}
                            >
                                <Pencil className="w-3.5 h-3.5" /> Edit Profile
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-foreground hover:bg-accent gap-2 cursor-pointer "
                                onClick={() => setPwOpen(true)}
                            >
                                <KeyRound className="w-3.5 h-3.5" /> Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <section>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">
                        My Favourites
                    </h2>

                    {isLoadingFavorites ? (
                        <Card className="bg-card border-border shadow-sm">
                            <CardContent className="p-12 text-center text-muted-foreground">
                                Loading favourites...
                            </CardContent>
                        </Card>
                    ) : favoriteBlogs.length === 0 ? (
                        <Card className="bg-card border-border shadow-sm">
                            <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-muted-foreground">
                                    No favourites yet. Start exploring!
                                </p>
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer"
                                    onClick={() => navigate("/")}
                                >
                                    Browse blogs
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteBlogs.map((blog) => (
                                <BlogCard
                                    key={blog._id || blog.id}
                                    blog={blog}
                                    favoriteIds={favoriteIds}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-card border-border text-foreground max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-foreground flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Edit Profile
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-2">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                                    <AvatarImage src={avatarPreview} alt="Preview" />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                        {getInitials(firstName, lastName)}
                                    </AvatarFallback>
                                </Avatar>

                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors"
                                    aria-label="Upload profile picture"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>

                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Click the camera icon to upload a photo
                            </p>
                        </div>

                        <Separator className="bg-border" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="firstName"
                                    className="text-foreground font-medium"
                                >
                                    First name
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="Jane"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="lastName"
                                    className="text-foreground font-medium"
                                >
                                    Last name
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-foreground font-medium">Email</Label>
                            <Input
                                value={user.email}
                                disabled
                                className="bg-muted border-input text-muted-foreground cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
                            onClick={handleSaveProfile}
                            disabled={isUpdatingProfile}
                        >
                            <Save className="w-4 h-4" />{" "}
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={pwOpen} onOpenChange={setPwOpen}>
                <DialogContent className="bg-card border-border text-foreground max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-foreground flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-primary" /> Change Password
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="currentPw"
                                className="text-foreground font-medium"
                            >
                                Current password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPw"
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={currentPw}
                                    onChange={(e) => setCurrentPw(e.target.value)}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showCurrent ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="space-y-1.5">
                            <Label htmlFor="newPw" className="text-foreground font-medium">
                                New password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPw"
                                    type={showNew ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={newPw}
                                    onChange={(e) => setNewPw(e.target.value)}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showNew ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Minimum 8 characters.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPw" className="text-foreground font-medium">
                                Confirm new password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPw"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirm ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => {
                                setPwOpen(false);
                                setCurrentPw("");
                                setNewPw("");
                                setConfirmPw("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
                            onClick={handleSavePassword}
                        >
                            <Save className="w-4 h-4" /> Update Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}