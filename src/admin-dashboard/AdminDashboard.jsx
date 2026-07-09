import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText, Activity as ActivityIcon, Trash2,
    Upload, UserPlus, Pencil, Heart,
    Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetAllBlogs, useDeleteBlog, useGetActivity } from "@/hooks/useBlogapi";
import Loader from "@/components/Loader";
import { Pagination } from "@/components/pagination";

// ── Static activity log removed ──

const iconMap = {
    publish: <Upload className="w-4 h-4 text-emerald-400" />,
    delete: <Trash2 className="w-4 h-4 text-red-400" />,
    user: <UserPlus className="w-4 h-4 text-indigo-400" />,
    edit: <Pencil className="w-4 h-4 text-amber-400" />,
    favourite: <Heart className="w-4 h-4 text-pink-400" />,
};

// ── Main Component ─────────────────────────────────────────────────
export default function AdminDashboard() {

    const navigate = useNavigate();
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [blogsPage, setBlogsPage] = useState(1);
    const [activityPage, setActivityPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useGetAllBlogs({ page: blogsPage, limit });
    const blogs = data?.blogs || [];
    const blogsTotalCount = data?.totalCount || 0;
    const blogsTotalPages = data?.totalPages || 1;

    const { data: activityData, isLoading: isLoadingActivity } = useGetActivity({ page: activityPage, limit });
    const activityLog = activityData?.data || activityData?.activities || [];
    const activityTotalCount = activityData?.total || 0;
    const activityTotalPages = activityData?.totalpages || 1;

    const deleteMutation = useDeleteBlog();

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => toast.success(`Deleted "${deleteTarget.title}"`),
        });
        setDeleteTarget(null);
    };

    const handleViewBlog = (blogId) => {
        navigate(`/blog/${blogId}`);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Oversee blogs and activity across Blogify.</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="blogs">
                <TabsList className="bg-card border border-border">
                    <TabsTrigger value="blogs" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                        <FileText className="w-4 h-4" /> All Blogs
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">
                        <ActivityIcon className="w-4 h-4" /> Activity Log
                    </TabsTrigger>
                </TabsList>

                {/* ── All Blogs Tab ── */}
                <TabsContent value="blogs" className="mt-4">
                    <Card className="bg-card border-border overflow-hidden">
                        {isLoading ? (
                            <CardContent className="flex justify-center py-16">
                                <Loader />
                            </CardContent>
                        ) : blogs.length === 0 ? (
                            <CardContent className="p-12 text-center text-muted-foreground">
                                No blogs to manage.
                            </CardContent>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-muted-foreground border-b border-border">
                                            <th className="px-6 py-4 font-medium">Title</th>
                                            <th className="px-6 py-4 font-medium">Author</th>
                                            <th className="px-6 py-4 font-medium">Category</th>
                                            <th className="px-6 py-4 font-medium">Date</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blogs.map((b) => (
                                            <tr
                                                key={b._id}
                                                className="border-b border-border/50 hover:bg-accent/30 transition duration-200 cursor-pointer "
                                            >
                                                <td className="px-6 py-4 text-foreground font-medium max-w-xs truncate">
                                                    {b.title}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {b.author?.firstname
                                                        ? `${b.author.firstname.charAt(0).toUpperCase()}${b.author.firstname.slice(1)} ${b.author.lastname
                                                            ? `${b.author.lastname.charAt(0).toUpperCase()}${b.author.lastname.slice(1)}`
                                                            : ""
                                                            }`.trim()
                                                        : b.author?.name ?? "—"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <Badge className="bg-primary/10 text-primary border-primary/20 capitalize">
                                                        {b.category}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(b.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: b._id, title: b.title })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition text-xs font-medium cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleViewBlog(b._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition text-xs font-medium cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                    <Pagination
                        currentPage={blogsPage}
                        hasNext={blogsPage < blogsTotalPages}
                        hasPrevious={blogsPage > 1}
                        totalCount={blogsTotalCount}
                        currentCount={blogs.length}
                        pageSize={limit}
                        onPageChange={setBlogsPage}
                        isLoading={isLoading}
                        className="mt-2"
                    />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                    <Card className="bg-card border-border">
                        {isLoadingActivity ? (
                            <CardContent className="flex justify-center py-16">
                                <Loader />
                            </CardContent>
                        ) : activityLog.length === 0 ? (
                            <CardContent className="p-12 text-center text-muted-foreground">
                                <ActivityIcon className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                No activity yet
                            </CardContent>
                        ) : (
                            <ul className="divide-y divide-border">
                                {activityLog.map((a, i) => (
                                    <li
                                        key={a._id || i}
                                        className="flex items-start gap-4 p-4 hover:bg-accent/20 rounded-xl transition cursor-pointer "
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-accent border border-border flex items-center justify-center shrink-0">
                                            {iconMap[a.icons] || iconMap["user"]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-foreground font-medium">{a.action}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5">{a.description}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                    <Pagination
                        currentPage={activityPage}
                        hasNext={activityPage < activityTotalPages}
                        hasPrevious={activityPage > 1}
                        totalCount={activityTotalCount}
                        currentCount={activityLog.length}
                        pageSize={limit}
                        onPageChange={setActivityPage}
                        isLoading={isLoadingActivity}
                        className="mt-2"
                    />
                </TabsContent>
            </Tabs>

            {/* Delete Confirm Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="bg-card border-border text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
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
