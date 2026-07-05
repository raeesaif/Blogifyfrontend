import { useState } from "react";
import { ArrowRight, Sparkles, BookOpen, PenLine, Users, Star, ChevronRight, TrendingUp, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/layout/Navbar";
import { BlogCard } from "@/components/BlogCard";
import { useNavigate } from "react-router-dom";
import { useGetAllBlogs, useGetFavoriteBlogs } from "@/hooks/useBlogapi";
import { useAuthStore } from "@/store/authstore";


const mockToast = { success: (msg) => alert("✅ " + msg) };

const CATEGORIES = [
    { label: "All", value: "" },
    { label: "Technology", value: "technology" },
    { label: "Lifestyle", value: "lifestyle" },
    { label: "Travel", value: "travel" },
    { label: "Health", value: "health" },
    { label: "Business", value: "business" },
    { label: "Education", value: "education" },
];

const STATS = [
    { icon: <BookOpen className="w-5 h-5" />, value: "12K+", label: "Stories published" },
    { icon: <Users className="w-5 h-5" />, value: "48K+", label: "Active readers" },
    { icon: <PenLine className="w-5 h-5" />, value: "3.2K+", label: "Writers & creators" },
    { icon: <Star className="w-5 h-5" />, value: "4.9★", label: "Average rating" },
];

const FEATURED_TOPICS = [
    { label: "Technology", value: "technology", emoji: "💻" },
    { label: "Lifestyle", value: "lifestyle", emoji: "🌿" },
    { label: "Travel", value: "travel", emoji: "✈️" },
    { label: "Health", value: "health", emoji: "🧘" },
    { label: "Business", value: "business", emoji: "💼" },
    { label: "Education", value: "education", emoji: "📚" },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const userId = user?._id || user?.id;

    const { data: blogsData, isLoading } = useGetAllBlogs({
        page: 1,
        limit: 6,
        category: activeCategory.value,
    });

    const { data: favoriteData } = useGetFavoriteBlogs(userId);
    const rawItems = favoriteData?.data || [];
    const favBlogs = rawItems.map((item) => item.blogId || item).filter(Boolean);
    const favoriteIds = new Set(favBlogs.map((b) => b._id || b.id));

    const blogs = blogsData?.blogs || [];
    const totalBlogs = blogsData?.totalCount || 0;

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        mockToast.success("You're subscribed! Welcome to Blogify.");
        setEmail("");
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 left-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-10 right-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8">
                        <Sparkles className="w-3.5 h-3.5" />
                        A new home for thoughtful writing
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                        Discover Stories That{" "}
                        <span className="text-primary relative">
                            Inspire
                            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/30 rounded-full" />
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Join our community of writers and readers exploring ideas across technology,
                        design, travel, and the everyday craft of living well.
                    </p>

                    <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-7 py-3 h-auto gap-2 text-base rounded-xl cursor-pointer "
                            onClick={() => navigate("/explore")}
                        >
                            Start Reading <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-accent font-semibold px-7 py-3 h-auto text-base rounded-xl cursor-pointer "
                            onClick={() => navigate("/signup")}
                        >
                            Join Blogify
                        </Button>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground">
                        Free to read · No ads · 48,000+ readers
                    </p>
                </div>
            </section>

            <section className="border-y border-border bg-card">
                <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center text-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                                {stat.icon}
                            </div>
                            <span className="text-2xl font-extrabold text-foreground">{stat.value}</span>
                            <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
                                <TrendingUp className="w-4 h-4" /> Trending now
                            </div>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">Latest Stories</h2>
                            <p className="text-muted-foreground mt-1">Fresh perspectives from the community</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-primary hover:bg-primary/10 gap-1 font-medium cursor-pointer "
                            onClick={() => navigate("/explore")}
                        >
                            View all <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat)}
                                className={[
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer",
                                    activeCategory.value === cat.value
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                                ].join(" ")}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20 text-muted-foreground">Loading stories...</div>
                    ) : blogs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id || blog.id} blog={blog} favoriteIds={favoriteIds} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            No stories in this category yet.
                        </div>
                    )}

                    {totalBlogs > 6 && (
                        <div className="text-center mt-12">
                            <Button
                                variant="outline"
                                className="border-border text-foreground hover:bg-accent px-8 font-medium"
                                onClick={() => navigate("/explore")}
                            >
                                Load more stories
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 px-6 bg-card border-y border-border">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Explore by Topic</h2>
                    <p className="text-muted-foreground mb-8">Find the stories that speak to you</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {FEATURED_TOPICS.map((topic) => (
                            <button
                                key={topic.value}
                                onClick={() => navigate(`/explore?category=${topic.value}`)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium text-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                            >
                                <span>{topic.emoji}</span> {topic.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-primary border-0 shadow-lg overflow-hidden pt-0">
                        <CardContent className="p-10 sm:p-14 flex flex-col sm:flex-row items-center gap-8">
                            <div className="flex-1 text-center sm:text-left">
                                <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                                    <Feather className="w-3 h-3" /> For writers
                                </div>
                                <h2 className="text-3xl font-extrabold text-primary-foreground tracking-tight">
                                    Share your story with the world
                                </h2>
                                <p className="mt-3 text-primary-foreground/80 text-base max-w-md">
                                    Start writing today — reach thousands of readers who care about ideas, craft, and curiosity.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 shrink-0">
                                <Button
                                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold px-8 py-3 h-auto gap-2 rounded-xl text-base"
                                    onClick={() => navigate("/signup")}
                                >
                                    <PenLine className="w-4 h-4" /> Start Writing Free
                                </Button>
                                <p className="text-center text-xs text-primary-foreground/60">
                                    No credit card required
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="py-16 px-6 bg-card border-t border-border">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Stay in the loop</h2>
                    <p className="text-muted-foreground mt-2 mb-6">
                        Get the best stories delivered to your inbox every week. No spam, ever.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto">
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex-1"
                        />
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0"
                        >
                            Subscribe
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-3">
                        Join 48,000+ readers · Unsubscribe anytime
                    </p>
                </div>
            </section>

            <footer className="border-t border-border py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-primary tracking-tight">Blogify</span>
                        <span className="text-muted-foreground text-sm">— where stories live</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        {["About", "Explore", "Write", "Privacy", "Terms"].map((link) => (
                            <a key={link} href={`/${link.toLowerCase()}`} className="hover:text-primary transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">© 2024 Blogify. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
