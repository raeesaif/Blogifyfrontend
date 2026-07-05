import { ArrowRight, Feather, Users, BookOpen, Sparkles, Heart, PenLine, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/layout/Navbar";

// ─── Mock helpers (replace with your real router) ─────────────────────────────
const mockNavigate = (path) => {
    console.log("Navigate to:", path);
    // window.location.href = path;
};
// ─────────────────────────────────────────────────────────────────────────────

const VALUES = [
    {
        icon: <Feather className="w-5 h-5" />,
        title: "Craft first",
        description: "We believe every word should earn its place. Blogify is built for writing that's intentional, not algorithmic.",
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: "Community driven",
        description: "Real readers, real writers. A space free from bots, clickbait, and content farms.",
    },
    {
        icon: <BookOpen className="w-5 h-5" />,
        title: "Slow publishing",
        description: "No pressure to post daily. We reward depth over frequency — quality over quantity, always.",
    },
    {
        icon: <Globe className="w-5 h-5" />,
        title: "Open to all",
        description: "Whether it's your first essay or your thousandth, Blogify gives you the tools to write with confidence.",
    },
];

const TEAM = [
    { name: "Sarah Chen", role: "Co-founder & CEO", initials: "SC", bio: "Former journalist turned product builder. Believes the internet needs more long-form." },
    { name: "James Okafor", role: "Co-founder & CTO", initials: "JO", bio: "Engineer and occasional poet. Obsessed with beautiful, fast, accessible web experiences." },
    { name: "Mia Torres", role: "Head of Community", initials: "MT", bio: "Connects writers with readers. Previously built communities at Medium and Substack." },
];

const ROLES = [
    { role: "Reader", emoji: "📖", desc: "Discover and favourite stories from creators you love.", path: "/login" },
    { role: "Creator", emoji: "✍️", desc: "Publish your writing and build your audience.", path: "/signup" },
    { role: "Admin", emoji: "⚙️", desc: "Manage the platform, users, and all published content.", path: "/login" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 space-y-16">

                {/* ── Hero ── */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Our story
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                        About <span className="text-primary">Blogify</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto leading-relaxed">
                        A premium home for thoughtful writing — where craft meets community.
                    </p>
                </div>

                {/* ── Mission statement ── */}
                <Card className="bg-card border-border shadow-md">
                    <CardContent className="p-8 sm:p-10 space-y-4 text-foreground leading-relaxed">
                        <p className="text-lg">
                            Blogify is a community for writers and readers who care about craft. We believe in
                            slow, beautiful publishing — words that earn their place on the page and designs that
                            give them room to breathe.
                        </p>
                        <Separator className="bg-border" />
                        <p className="text-muted-foreground">
                            Whether you're publishing your first essay or your thousandth, Blogify gives you the
                            tools to write with confidence and reach an audience that genuinely cares.
                        </p>
                        <p className="text-muted-foreground">
                            This is a demo experience — log in as <strong className="text-foreground">Admin</strong>,{" "}
                            <strong className="text-foreground">Creator</strong>, or{" "}
                            <strong className="text-foreground">Reader</strong> to explore each role and see the
                            platform from every perspective.
                        </p>
                    </CardContent>
                </Card>

                {/* ── Our values ── */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">What we believe</h2>
                        <p className="text-muted-foreground mt-1">The principles that guide everything we build</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {VALUES.map((v) => (
                            <Card key={v.title} className="bg-card border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200">
                                <CardContent className="p-6 flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                        {v.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">{v.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{v.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ── Stats strip ── */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                        { value: "12K+", label: "Stories published" },
                        { value: "48K+", label: "Active readers" },
                        { value: "3.2K+", label: "Writers & creators" },
                    ].map((s) => (
                        <Card key={s.label} className="bg-card border-border shadow-sm">
                            <CardContent className="py-6 px-4">
                                <p className="text-3xl font-extrabold text-primary">{s.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ── Meet the team ── */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Meet the team</h2>
                        <p className="text-muted-foreground mt-1">The people building Blogify</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {TEAM.map((member) => (
                            <Card key={member.name} className="bg-card border-border shadow-sm text-center hover:border-primary/30 hover:shadow-md transition-all duration-200">
                                <CardContent className="p-6 flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-extrabold flex items-center justify-center ring-4 ring-primary/20">
                                        {member.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{member.name}</p>
                                        <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ── Explore roles ── */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Explore every role</h2>
                        <p className="text-muted-foreground mt-1">Log in and experience Blogify from any perspective</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {ROLES.map((r) => (
                            <Card
                                key={r.role}
                                className="bg-card border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                onClick={() => mockNavigate(r.path)}
                            >
                                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                    <span className="text-4xl">{r.emoji}</span>
                                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{r.role}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                                    <Button
                                        size="sm"
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 mt-1 w-full"
                                        onClick={(e) => { e.stopPropagation(); mockNavigate(r.path); }}
                                    >
                                        Try as {r.role} <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <Card className="bg-primary border-0 shadow-lg">
                    <CardContent className="p-10 text-center flex flex-col items-center gap-4">
                        <Heart className="w-8 h-8 text-primary-foreground/70" />
                        <h2 className="text-2xl font-extrabold text-primary-foreground tracking-tight">
                            Ready to join the community?
                        </h2>
                        <p className="text-primary-foreground/80 max-w-sm">
                            Start reading for free or share your first story today. No credit card required.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
                            <Button
                                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold gap-2 px-7 py-3 h-auto rounded-xl"
                                onClick={() => mockNavigate("/signup")}
                            >
                                <PenLine className="w-4 h-4" /> Start Writing Free
                            </Button>
                            <Button
                                variant="outline"
                                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-7 py-3 h-auto rounded-xl"
                                onClick={() => mockNavigate("/explore")}
                            >
                                Browse Stories
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}