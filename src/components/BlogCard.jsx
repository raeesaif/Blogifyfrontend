import { Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAddFavorite, useRemoveFavorite } from "@/hooks/useBlogapi";
import { useAuthStore } from "@/store/authstore";
import { toast } from "sonner";

export function BlogCard({ blog, showAuthor = true, showExcerpt = true, favoriteIds }) {
    const blogId = blog._id || blog.id;
    const isFav = favoriteIds ? favoriteIds.has(blogId) : (blog.isFavorite || false);
    const navigate = useNavigate();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();
    const user = useAuthStore((state) => state.user);

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("You are not Login please first login");
            return;
        }

        if (isFav) {
            removeFavorite.mutate({ userId: user._id || user.id, blogId });
        } else {
            addFavorite.mutate({ userId: user._id || user.id, blogId });
        }
    };

    const handleCardClick = () => {
        navigate(`/blog/${blogId}`);
    };

    const getAuthorName = () => {
        const author = blog.author;
        if (!author) return "Unknown";
        if (typeof author === "string") return author;
        if (typeof author === "object") {
            return `${author.firstname || ""} ${author.lastname || ""}`.trim() || "Unknown";
        }
        return "Unknown";
    };

    const getAuthorInitials = () => {
        const name = getAuthorName();
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div onClick={handleCardClick} className="cursor-pointer">
            <Card className="bg-card border-border shadow-sm overflow-hidden flex flex-col group hover:scale-[1.02] hover:shadow-md hover:border-primary/30 transition-all duration-300 h-full pt-0">
                <div className="relative w-full h-48 overflow-hidden">
                    <img
                        src={blog.coverImage || blog.coverImageUrl}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-foreground border-border text-xs">
                        {blog.category?.charAt(0).toUpperCase() + blog.category?.slice(1)}
                    </Badge>
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={toggleLike}
                            className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center transition-all hover:bg-destructive/10 hover:border-destructive/30"
                            aria-label="Favorite"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${
                                    isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
                                }`}
                            />
                        </button>
                    </div>
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {blog.title}
                    </h3>
                    
                    {showExcerpt && blog.excerpt && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
                            {blog.excerpt}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        {showAuthor && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                                    {blog.authorAvatar || getAuthorInitials()}
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {getAuthorName()}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {blog.readTime && <span>{blog.readTime}</span>}
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {blog.views || 0}
                            </span>
                            <span>{blog.likes || 0} likes</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
