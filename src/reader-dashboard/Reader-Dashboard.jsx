import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { useGetAllBlogs, useGetFavoriteBlogs } from "@/hooks/useBlogapi";
import { useAuthStore } from "@/store/authstore";
import { BlogCard } from "@/components/BlogCard";
import Loader from "@/components/Loader";

export default function ReaderDashboard() {
    const navigate = useNavigate();
    const { data: blogsData = { blogs: [] }, isLoading } = useGetAllBlogs();
    const blogs = blogsData.blogs || [];
    const user = useAuthStore((state) => state.user);

    const userId = user?._id || user?.id;
    const { data: favoriteData } = useGetFavoriteBlogs(userId);
    const favRawItems = favoriteData?.data || [];
    const favBlogs = favRawItems.map((item) => item.blogId || item).filter(Boolean);
    const favoriteIds = new Set(favBlogs.map((b) => b._id || b.id));

    const publishedBlogs = blogs.filter(
        (b) => b.status === "published" || b.status === "publish"
    );

    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                    Reader Dashboard
                </h1>
                <p className="text-muted-foreground mb-8">
                    Discover and explore amazing stories from our creators.
                </p>

                {isLoading ? (
                    <>
                        <Loader />
                    </>
                ) : publishedBlogs.length === 0 ? (
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">
                                No published blogs yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publishedBlogs.map((blog) => (
                            <BlogCard
                                key={blog._id || blog.id}
                                blog={blog}
                                favoriteIds={favoriteIds}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
