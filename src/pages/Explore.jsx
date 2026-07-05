import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/layout/Navbar";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/pagination";
import { useGetAllBlogs, useGetFavoriteBlogs } from "@/hooks/useBlogapi";
import { useAuthStore } from "@/store/authstore";

const CATEGORIES = [
    { label: "All", value: "" },
    { label: "Technology", value: "technology" },
    { label: "Lifestyle", value: "lifestyle" },
    { label: "Travel", value: "travel" },
    { label: "Health", value: "health" },
    { label: "Business", value: "business" },
    { label: "Education", value: "education" },
];

const SORT_OPTIONS = ["Newest", "Most Liked", "Shortest Read"];

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Newest");
    const [page, setPage] = useState(1);
    const limit = 6;

    const sortMap = { "Newest": "newest", "Most Liked": "most_liked", "Shortest Read": "shortest_read" };

    const { data: blogsData, isLoading } = useGetAllBlogs({
        page,
        limit,
        category: activeCategory.value,
        sort: sortMap[sortBy],
    });

    const user = useAuthStore((state) => state.user);
    const userId = user?._id || user?.id;
    const { data: favoriteData } = useGetFavoriteBlogs(userId);
    const favRawItems = favoriteData?.data || [];
    const favBlogs = favRawItems.map((item) => item.blogId || item).filter(Boolean);
    const favoriteIds = new Set(favBlogs.map((b) => b._id || b.id));

    const blogs = blogsData?.blogs || [];
    const totalCount = blogsData?.totalCount || 0;
    const totalPages = blogsData?.totalPages || 1;

    const sortedBlogs = blogs;

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleSortChange = (opt) => {
        setSortBy(opt);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6">

                {/* ── Page header ── */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Explore</h1>
                    <p className="text-muted-foreground mt-2">Browse stories across every category.</p>
                </div>

                {/* ── Search + Sort bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search stories..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                        />
                    </div>

                    {/* Sort dropdown */}
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex gap-1">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleSortChange(opt)}
                                    className={[
                                        "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                        sortBy === opt
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                                    ].join(" ")}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Category filter pills ── */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => handleCategoryChange(c)}
                            className={[
                                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                                activeCategory.value === c.value
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                            ].join(" ")}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* ── Results count ── */}
                <p className="text-sm text-muted-foreground mb-6">
                    {isLoading ? "Loading..." : `Showing ${sortedBlogs.length} of ${totalCount} stories`}
                    {searchQuery && (
                        <span> for <span className="font-medium text-foreground">"{searchQuery}"</span></span>
                    )}
                </p>

                {/* ── Blog grid / empty state ── */}
                {isLoading ? (
                    <Card className="bg-card border-border">
                        <CardContent className="p-16 text-center flex flex-col items-center gap-4">
                            <p className="text-muted-foreground">Loading stories...</p>
                        </CardContent>
                    </Card>
                ) : blogs.length === 0 ? (
                    <Card className="bg-card border-border">
                        <CardContent className="p-16 text-center flex flex-col items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <Search className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? `No stories matched "${searchQuery}". Try a different keyword.`
                                    : "No stories in this category yet."}
                            </p>
                            <Button
                                variant="outline"
                                className="border-border text-foreground hover:bg-accent"
                                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                            >
                                Clear filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedBlogs.map((b) => (
                                <BlogCard key={b._id || b.id} blog={b} favoriteIds={favoriteIds} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={page}
                            hasNext={page < totalPages}
                            hasPrevious={page > 1}
                            totalCount={totalCount}
                            currentCount={blogs.length}
                            onPageChange={setPage}
                            pageSize={limit}
                            isLoading={isLoading}
                        />
                    </>
                )}
            </div>
        </div>
    );
}