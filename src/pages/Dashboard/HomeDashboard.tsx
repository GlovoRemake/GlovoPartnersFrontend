import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetProfileQuery } from "@/services/apiPartner.ts";
import { ArrowUpRight, CheckCircle2, Clock3, Phone, RefreshCw, UserRound } from "lucide-react";
import { useNavigate } from "react-router";

const HomeDashboard = () => {
    const { data: profile, isLoading, isFetching, isError, refetch } = useGetProfileQuery();
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
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <RefreshCw className="size-5" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight">Не вдалося завантажити профіль</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Перевірте з’єднання та спробуйте ще раз.</p>
                    <Button className="mt-6" onClick={() => refetch()} disabled={isFetching}>
                        {isFetching ? <Spinner /> : <RefreshCw />}
                        Спробувати ще раз
                    </Button>
                </section>
            </main>
        );
    }

    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Панель партнера</p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Вітаємо, {profile.firstName}</h1>
                    <p className="mt-2 max-w-xl text-muted-foreground">Керуйте своїм профілем і стежте за підготовкою до роботи з Glovo.</p>
                </div>
                <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                    {isFetching ? <Spinner /> : <RefreshCw />}
                    Оновити дані
                </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                <section className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-sm sm:p-8">
                    <div className="relative z-10 max-w-lg">
                        <div className="mb-10 flex size-14 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
                            {initials}
                        </div>
                        <p className="mb-2 text-sm text-background/60">Ваш партнерський профіль</p>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{fullName}</h2>
                        <div className="mt-5 flex items-center gap-2 text-sm text-background/70">
                            <Phone className="size-4" />
                            {profile.phone}
                        </div>
                    </div>
                    <div className="absolute -right-16 -top-20 size-64 rounded-full border-36 border-primary/80" />
                    <div className="absolute -bottom-24 right-16 size-48 rounded-full border-24 border-background/10" />
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Статус акаунта</p>
                            <h2 className="mt-2 text-2xl font-semibold">Активний</h2>
                        </div>
                        <CheckCircle2 className="size-7 text-emerald-600" />
                    </div>
                    <div className="mt-8 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-full rounded-full bg-emerald-500" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Профіль готовий до наступного кроку.</p>
                </section>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary-foreground">
                        <UserRound className="size-5 text-foreground" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">Особисті дані</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Ім’я та контактний номер збережені у вашому партнерському профілі.</p>
                    <Button variant="ghost" className="mt-4 p-2.5 px-0" onClick={() => navigate("/dashboard/profile")}>
                        Переглянути профіль <ArrowUpRight />
                    </Button>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <Clock3 className="size-5" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">Наступний крок</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Надішліть запит або перегляньте статус уже доданих компаній.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => navigate("/dashboard/company-request")}>
                            Перейти до підключення <ArrowUpRight />
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/dashboard/companies")}>
                            Мої компанії <ArrowUpRight />
                        </Button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default HomeDashboard;