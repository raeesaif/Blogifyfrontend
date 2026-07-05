import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/pagination";
import { useNavigate } from "react-router-dom";
import { useGetMyBlogs, useDeleteBlog } from "@/hooks/useBlogapi";
import Loader from "@/components/Loader";

function StatusBadge({ status }) {
    const isDraft = status === "draft" || status === "Draft";
    return (
        <Badge
            className={
                isDraft
                    ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                    : "bg-primary/10 text-primary border-primary/20"
            }
        >
            {status ?? "published"}
        </Badge>
    );
}

export default function CreatorDashboard() {
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading } = useGetMyBlogs({
        page: currentPage,
        limit: 6,
        status: statusFilter,
        search: searchQuery,
    });

    const blogs = data?.data || [];
    const totalPages = data?.totalpages || 1;
    const totalCount = data?.total || 0;
    const backendPage = data?.page || currentPage;

    const deleteMutation = useDeleteBlog();

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteMutation.mutate(deleteTarget.id);
        setDeleteTarget(null);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchQuery]);

    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Blogs</h1>
                            <p className="text-muted-foreground mt-1">Manage your stories and drafts.</p>
                        </div>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 cursor-pointer "
                            onClick={() => navigate("/creater-blog")}
                        >
                            <Plus className="w-4 h-4" /> Create New
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 bg-background border-border"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-45 bg-background border-border">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center" >
                            <Loader />
                        </div>
                    ) : blogs.length === 0 ? (
                        <Card className="bg-card border-border shadow-sm">
                            <CardContent className="p-12 flex flex-col items-center gap-4 text-center">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-muted-foreground">
                                    {searchQuery || statusFilter !== "all"
                                        ? "No blogs match your search or filter."
                                        : "No blogs yet. Time to write your first one!"}
                                </p>
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
                                    onClick={() => navigate("/creater-blog")}
                                >
                                    <Plus className="w-4 h-4" /> Create your first blog
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {blogs.map((blog) => (
                                    <Card
                                        key={blog._id}
                                        className="bg-card border-border shadow-sm overflow-hidden flex flex-col group hover:scale-[1.01] hover:shadow-md hover:border-primary/30 transition-all duration-300 pt-0"
                                    >
                                        <div className="relative w-full h-48 overflow-hidden">
                                            <img
                                                src={blog.coverImage || blog.coverImageUrl}
                                                alt={blog.title}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-accent/90 text-accent-foreground border-border text-xs backdrop-blur-sm capitalize">
                                                    {blog.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-5 flex flex-col flex-1">
                                            <div className="mb-2">
                                                <StatusBadge status={blog.status} />
                                            </div>
                                            <h3 className="font-bold text-foreground line-clamp-2 leading-snug">
                                                {blog.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-border text-foreground hover:bg-accent gap-2 cursor-pointer"
                                                    onClick={() => navigate(`/creator/edit/${blog._id}`)}
                                                >
                                                    <Pencil className="w-4 h-4" /> Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 px-3 cursor-pointer"
                                                    onClick={() => setDeleteTarget({ id: blog._id, title: blog.title })}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Pagination
                                currentPage={backendPage}
                                totalCount={totalCount}
                                currentCount={blogs.length}
                                pageSize={6}
                                hasPrevious={backendPage > 1}
                                hasNext={backendPage < totalPages}
                                onPageChange={setCurrentPage}
                                isLoading={isLoading || deleteMutation.isPending}
                                className="border-border"
                            />
                        </>
                    )}
                </div>
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-card border-border text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-destructive" /> Delete Blog
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">"{deleteTarget?.title}"</span>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border text-foreground hover:bg-accent cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90 font-semibold cursor-pointer"
                            onClick={handleDelete}
                        >
                            Yes, delete it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
