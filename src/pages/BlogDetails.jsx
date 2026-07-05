import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Clock, Calendar, ArrowLeft, Share2, Bookmark, ChevronRight, Loader2, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/layout/Navbar";
import { useGetSingleBlog, useGetAllBlogs, useGetFavoriteBlogs, useToggleLike } from "@/hooks/useBlogapi";
import { useAuthStore } from "@/store/authstore";
import { BlogCard } from "@/components/BlogCard";

export default function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookmarked, setBookmarked] = useState(false);

    const { data: blog, isLoading, error } = useGetSingleBlog(id);

    const { mutate: toggleLikeMutate } = useToggleLike(id);

    const likes = blog?.likes ?? 0;
    const liked = blog?.liked ?? false;
    const { data: allBlogsData } = useGetAllBlogs();
    const allBlogs = allBlogsData?.blogs || [];

    const user = useAuthStore((state) => state.user);
    const userId = user?._id || user?.id;
    const { data: favoriteData } = useGetFavoriteBlogs(userId);
    const favRawItems = favoriteData?.data || [];
    const favBlogs = favRawItems.map((item) => item.blogId || item).filter(Boolean);
    const favoriteIds = new Set(favBlogs.map((b) => b._id || b.id));

    const relatedBlogs = allBlogs.filter(
        (b) => (b._id || b.id) !== (blog?._id || blog?.id) && b.category === blog?.category
    ).slice(0, 3);

    const toggleLike = () => toggleLikeMutate();

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.excerpt,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const authorInitials = blog?.author
        ? `${blog.author.firstname?.[0] || ""}${blog.author.lastname?.[0] || ""}`.toUpperCase() || "AU"
        : "AU";

    const authorName = blog?.author
        ? `${blog.author.firstname || ""} ${blog.author.lastname || ""}`.trim() || "Unknown Author"
        : "Unknown Author";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-muted-foreground">Loading blog...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
                    <Card className="bg-card border-border">
                        <CardContent className="p-16 text-center flex flex-col items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-destructive" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    {error?.message || 'Blog Not Found'}
                                </h2>
                                <p className="text-muted-foreground">
                                    The blog post you're looking for doesn't exist or has been removed.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Go Back
                                </Button>
                                <Button
                                    onClick={() => navigate('/')}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Go to Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 pt-24 pb-6">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground gap-2 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            <article className="max-w-4xl mx-auto px-6 pb-16">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                    {blog.category}
                </Badge>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime || "5 min read"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <View className="w-4 h-4" />
                        <span>{blog.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>{likes} likes</span>
                    </div>
                </div>

                <Card className="bg-card border-border mb-8">
                    <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center shrink-0">
                                {blog.author?.avatar || authorInitials}
                            </div>
                            <div>
                                <p className="font-bold text-foreground">{authorName}</p>
                                {blog.author?.bio && (
                                    <p className="text-sm text-muted-foreground">{blog.author.bio}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={`gap-2 cursor-pointer  ${liked ? 'text-red-500 border-red-500' : ''}`}
                                onClick={toggleLike}
                            >
                                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
                                {liked ? 'Liked' : 'Like'}
                            </Button>
                            {/* <Button
                                variant="outline"
                                size="sm"
                                className={bookmarked ? 'text-primary border-primary' : ''}
                                onClick={() => setBookmarked(v => !v)}
                            >
                                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary' : ''}`} />
                            </Button> */}
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                            >
                                <Share2 className="w-4 h-4" />
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
                    <img
                        src={blog.coverImage || blog.coverImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="prose prose-lg max-w-none">
                    <div className="text-foreground leading-relaxed space-y-4">
                        {blog.content?.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-lg leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <Separator className="my-12" />

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant={liked ? "default" : "outline"}
                            className={`gap-2 cursor-pointer ${liked ? 'bg-red-500 hover:bg-red-600' : ''}`}
                            onClick={toggleLike}
                        >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
                            {likes} {likes === 1 ? 'Like' : 'Likes'}
                        </Button>
                        {/* <Button variant="outline" className="gap-2" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button> */}
                    </div>
                    {/* <Button
                        variant="outline"
                        className={`gap-2 ${bookmarked ? 'text-primary border-primary' : ''}`}
                        onClick={() => setBookmarked(v => !v)}
                    >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary' : ''}`} />
                        {bookmarked ? 'Saved' : 'Save for later'}
                    </Button> */}
                </div>
            </article>

            {relatedBlogs.length > 0 && (
                <section className="bg-card border-y border-border py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">More in {blog.category}</h2>
                                <p className="text-muted-foreground mt-1">Related stories you might enjoy</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="text-primary hover:bg-primary/10 gap-1"
                                onClick={() => navigate('/explore')}
                            >
                                View all <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedBlogs.map(relatedBlog => (
                                <BlogCard key={relatedBlog._id || relatedBlog.id} blog={relatedBlog} favoriteIds={favoriteIds} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}