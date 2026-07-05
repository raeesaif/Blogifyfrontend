import { BlogCard } from "@/components/BlogCard";
import { useGetFavoriteBlogs } from "@/hooks/useBlogapi";
import { useAuthStore } from "@/store/authstore";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

const FavriteBlogs = () => {
    const user = useAuthStore((state) => state.user);
    const userId = user?._id || user?.id;
    const navigate = useNavigate()
    const { data: favoriteData, isLoading } = useGetFavoriteBlogs(userId);

    const rawItems = favoriteData?.data || [];
    const favoriteBlogs = rawItems.map((item) => item.blogId || item).filter(Boolean);
    const favoriteIds = new Set(favoriteBlogs.map((b) => b._id || b.id));

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
                    <Card className="bg-card border-border">
                        <CardContent className="p-16 text-center">
                            <p className="text-muted-foreground">Please log in to view your favourites.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">
                    My Favourites
                </h1>

                {isLoading ? (
                    <>
                        <Loader />
                    </>
                ) : favoriteBlogs.length === 0 ? (
                    <Card className="bg-card border-border">
                        <CardContent className="p-16 text-center flex flex-col items-center gap-4">
                            <BookOpen className="w-10 h-10 text-primary" />
                            <p className="text-muted-foreground">No favourites yet. Start exploring!</p>
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
            </div>
        </div>
    );
};

export default FavriteBlogs;