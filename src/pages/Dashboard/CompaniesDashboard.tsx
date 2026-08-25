import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import CompanyRequestRow from "@/components/company/CompanyRequestRow.tsx";
import { useGetAllRequestCompanyQuery } from "@/services/apiCompany.ts";
import { ArrowLeft, Building2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";

const CompaniesDashboard = () => {
    const { data: requests, isLoading, isFetching, isError, refetch } = useGetAllRequestCompanyQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner className="size-5" />
                    Завантаження заявок...
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold tracking-tight">Не вдалося завантажити заявки</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Перевірте з’єднання та спробуйте ще раз.</p>
                    <Button className="mt-6" onClick={() => refetch()} disabled={isFetching}>
                        {isFetching ? <Spinner /> : <RefreshCw />}
                        Спробувати ще раз
                    </Button>
                </section>
            </main>
        );
    }

    const sortedRequests = [...(requests ?? [])].sort((first, second) => first.id - second.id);

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Партнерські заявки</p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Мої компанії</h1>
                    <p className="mt-2 text-muted-foreground">Список компаній і поточний статус розгляду заявок.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft />
                        До дашборда
                    </Button>
                    <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                        {isFetching ? <Spinner /> : <RefreshCw />}
                        Оновити
                    </Button>
                </div>
            </div>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-3 border-b border-border p-6">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                        <Building2 className="size-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Список компаній</h2>
                        <p className="text-sm text-muted-foreground">{sortedRequests.length} {sortedRequests.length === 1 ? "заявка" : "заявок"}</p>
                    </div>
                </div>

                {sortedRequests.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">У вас ще немає заявок на підключення компанії.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">№</TableHead>
                                <TableHead>Назва компанії</TableHead>
                                <TableHead>Статус заяви</TableHead>
                                <TableHead>Повідомлення</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedRequests.map((request, index) => (
                                <CompanyRequestRow key={request.id} request={request} index={index + 1} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>
        </main>
    );
};

export default CompaniesDashboard;