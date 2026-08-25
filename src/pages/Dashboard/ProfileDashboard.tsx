import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetProfileQuery } from "@/services/apiPartner.ts";
import { ArrowLeft, CheckCircle2, Mail, Phone, UserRound } from "lucide-react";
import { useNavigate } from "react-router";

const ProfileDashboard = () => {
    const { data: profile, isLoading, isError } = useGetProfileQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner className="size-5" />
                    Завантаження профілю...
                </div>
            </main>
        );
    }

    if (isError || !profile) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold tracking-tight">Не вдалося завантажити профіль</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Спробуйте повернутися на головну та повторити запит.</p>
                    <Button className="mt-6" onClick={() => navigate("/dashboard")}>На головну</Button>
                </section>
            </main>
        );
    }

    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">
            <Button variant="ghost" className="mb-8 px-0 p-2.5" onClick={() => navigate("/dashboard")}>
                <ArrowLeft />
                Назад до дашборда
            </Button>

            <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Профіль партнера</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Особисті дані</h1>
                <p className="mt-2 text-muted-foreground">Перегляд даних, збережених у вашому партнерському профілі.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                <section className="rounded-2xl bg-foreground p-6 text-background shadow-sm sm:p-8">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
                        {initials}
                    </div>
                    <h2 className="mt-8 text-2xl font-semibold tracking-tight">{fullName}</h2>
                    <div className="mt-5 flex items-center gap-2 text-sm text-background/70">
                        <Phone className="size-4" />
                        {profile.phone}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-background/70">
                        <Mail className="size-4" />
                        <span className="break-all">{profile.email}</span>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-sm text-emerald-300">
                        <CheckCircle2 className="size-4" />
                        Профіль активний
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex items-center gap-3 border-b border-border pb-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                            <UserRound className="size-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Контактна інформація</h2>
                            <p className="text-sm text-muted-foreground">Основні дані партнера</p>
                        </div>
                    </div>

                    <dl className="divide-y divide-border">
                        <div className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-4">
                            <dt className="text-sm text-muted-foreground">Ім’я та прізвище</dt>
                            <dd className="font-medium">{fullName}</dd>
                        </div>
                        <div className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-4">
                            <dt className="text-sm text-muted-foreground">Номер телефону</dt>
                            <dd className="font-medium">{profile.phone}</dd>
                        </div>
                        <div className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-4">
                            <dt className="text-sm text-muted-foreground">Email</dt>
                            <dd className="flex items-center gap-2 break-all font-medium">
                                {profile.email}
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>
        </main>
    );
};

export default ProfileDashboard;