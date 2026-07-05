import { useState, useRef } from "react";
import { Save, Send, UploadCloud, X, Link as LinkIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCreateBlog } from "@/hooks/useBlogapi";
import { useMe } from "@/hooks/useAuthapi";



const CATEGORIES = [
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "travel", label: "Travel" },
    { value: "health", label: "Health" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
];

const STATUS = {
    draft: "draft",
    published: "published",
};

const DEFAULT_VALUES = {
    title: "",
    content: "",
    coverImageUrl: "",
    category: "",
};

function resolveAuthorId(meResponse) {
    const candidates = [
        meResponse?.data?._id,
        meResponse?.data?.id,
        meResponse?.data?.user?._id,
        meResponse?.data?.user?.id,
        meResponse?._id,
        meResponse?.id,
        meResponse?.user?._id,
        meResponse?.user?.id,
    ];
    return candidates.find((v) => v != null && v !== "") || null;
}

export default function CreateBlogPage() {
    const navigate = useNavigate();
    const { data: meResponse, isLoading: isUserLoading } = useMe();
    const authorId = resolveAuthorId(meResponse);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: DEFAULT_VALUES,
    });

    const contentValue = watch("content") ?? "";

    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageTab, setCoverImageTab] = useState("url");
    const [previewSrc, setPreviewSrc] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const { mutateAsync: createBlog, isLoading: isSaving } = useCreateBlog();
    const [pendingStatus, setPendingStatus] = useState(null);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Only JPG, JPEG, and PNG images are allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5 MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewSrc(e.target.result);
            setCoverImageFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInput = (e) => handleFile(e.target.files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const clearImage = () => {
        setPreviewSrc("");
        setCoverImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const submitBlog = async (formValues, status) => {
        if (!formValues.title?.trim()) {
            toast.error("Title is required");
            return;
        }
        if (status === "published") {
            if (!formValues.category) {
                toast.error("Please select a category");
                return;
            }
            if (!formValues.content?.trim()) {
                toast.error("Content cannot be empty");
                return;
            }
        }

        if (!coverImageFile && !formValues.coverImageUrl?.trim()) {
            toast.error("Please provide a cover image");
            return;
        }

        if (isUserLoading) {
            toast.error("Still loading your account — please wait.");
            return;
        }
        if (!authorId) {
            toast.error("Could not determine the logged-in author. Please re-login.");
            return;
        }

        const fd = new FormData();
        fd.append("title", formValues.title.trim());
        fd.append("content", formValues.content ?? "");
        fd.append("category", formValues.category ?? "");
        fd.append("author", authorId);
        fd.append("status", status === "draft" ? STATUS.draft : STATUS.published);

        if (coverImageFile) {
            fd.append("coverImage", coverImageFile);
        } else {
            const trimmedUrl = formValues.coverImageUrl.trim();
            fd.append("coverImage", trimmedUrl);
        }

        setPendingStatus(status);
        try {
            await createBlog(fd);
            toast.success(status === "draft" ? "Saved as draft!" : "Blog published!");
            reset(DEFAULT_VALUES);
            clearImage();
            navigate("/creater-dashboard");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Could not save the blog. Please try again."
            );
        } finally {
            setPendingStatus(null);
        }
    };

    const onSaveDraft = handleSubmit(
        (values) => submitBlog(values, "draft"),
        () => toast.error("Title is required to save a draft.")
    );

    const onPublish = handleSubmit(
        (values) => submitBlog(values, "published"),
        () => toast.error("Please fill in all required fields before publishing.")
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Write a new story
                        </h1>
                        <p className="text-muted-foreground mt-1">Craft something worth reading.</p>
                    </div>

                    <Card className="bg-card border-border shadow-md">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-foreground font-medium">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="A captivating title..."
                                    {...register("title")}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                />
                                {errors.title && (
                                    <p className="text-xs text-destructive">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-foreground font-medium">Cover Image</Label>
                                <Tabs
                                    value={coverImageTab}
                                    onValueChange={(v) => { setCoverImageTab(v); clearImage(); }}
                                >
                                    <TabsList className="bg-muted border border-border w-full grid grid-cols-2 mb-3">
                                        <TabsTrigger
                                            value="url"
                                            className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                        >
                                            <LinkIcon className="w-3.5 h-3.5" /> Image URL
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="upload"
                                            className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                        >
                                            <UploadCloud className="w-3.5 h-3.5" /> Upload Image
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="url" className="mt-0">
                                        <Input
                                            placeholder="https://..."
                                            {...register("coverImageUrl")}
                                            className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                        />
                                    </TabsContent>

                                    <TabsContent value="upload" className="mt-0">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-10 px-6 text-center ${isDragging
                                                ? "border-primary bg-primary/5 scale-[1.01]"
                                                : "border-border hover:border-primary/50 hover:bg-accent/50"
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UploadCloud className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {isDragging ? "Drop your image here!" : "Click to upload or drag & drop"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    JPG, PNG, WEBP, GIF — max 5 MB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 pointer-events-none"
                                            >
                                                <UploadCloud className="w-3.5 h-3.5" /> Choose File
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileInput}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {previewSrc && (
                                    <div className="relative mt-3 rounded-xl overflow-hidden border border-border aspect-video group">
                                        <img
                                            src={previewSrc}
                                            alt="Cover preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setPreviewSrc("")}
                                        />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                            aria-label="Remove image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {coverImageFile && (
                                            <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-1 text-xs text-foreground font-medium">
                                                {coverImageFile.name}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-foreground font-medium">Category</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="bg-background border-input text-foreground focus:ring-ring w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border text-foreground">
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem
                                                        key={cat.value}
                                                        value={cat.value}
                                                        className="focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category && (
                                    <p className="text-xs text-destructive">{errors.category.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="content" className="text-foreground font-medium">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Tell your story..."
                                    {...register("content")}
                                    rows={10}
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring resize-y min-h-50"
                                />
                                {errors.content && (
                                    <p className="text-xs text-destructive">{errors.content.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground text-right">
                                    {contentValue.length} characters
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-accent gap-2 font-medium cursor-pointer"
                                    onClick={onSaveDraft}
                                    disabled={isSaving || isUserLoading}
                                >
                                    {pendingStatus === "draft" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save as Draft
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 cursor-pointer"
                                    onClick={onPublish}
                                    disabled={isSaving || isUserLoading}
                                >
                                    {pendingStatus === "published" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Publish
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
