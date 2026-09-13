import { useNavigate, useParams } from "react-router";
import { useGetAllQuery } from "@/services/apiCompanyCategory.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
    useAddAffiliateCategoryMutation,
    useAddEmployeeMutation,
    useAddManagerMutation,
    useDeleteEmployeeMutation,
    useDeleteManagerMutation,
    useGetAffiliateCategoriesQuery,
    useGetByIdQuery,
    useGetEmployeeQuery,
    useGetManagerQuery,
    useRemoveAffiliateCategoryMutation,
} from "@/services/apiAffiliate.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
    ArrowLeft,
    BriefcaseBusiness,
    Trash2,
    UtensilsCrossed,
} from "lucide-react";
import { useGetCompanyQuery } from "@/services/apiCompany.ts";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { useForm } from "react-hook-form";

type ParticipantForm = {
    partnerEmail: string;
};

type AffiliateTab = "categories" | "employees";

const getBackendErrorMessage = (error: any) => {
    const fallback = "Невідома помилка";

    if (!error || typeof error !== "object" || !("data" in error)) {
        return fallback;
    }

    const data = error.data.errors;

    if (Array.isArray(data)) {
        const message = data.find(
            (item): item is { message: string } =>
                typeof item === "object" &&
                item !== null &&
                "message" in item &&
                typeof item.message === "string"
        )?.message;

        return message ?? fallback;
    }

    return typeof data === "string" ? data : fallback;
};

const AffiliateDashboard = () => {
    const { companyId, affiliateId } = useParams<{
        companyId: string;
        affiliateId: string;
    }>();

    const navigate = useNavigate();

    const {
        data: company,
        isLoading: isCompanyLoading,
    } = useGetCompanyQuery(
        companyId ?? "",
        {
            skip: !companyId,
        }
    );

    const {
        data: affiliate,
        isLoading: isAffiliateLoading,
    } = useGetByIdQuery(
        affiliateId ?? "",
        {
            skip: !affiliateId,
        }
    );

    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
        refetch: refetchCategories,
    } = useGetAllQuery(
        companyId ?? "",
        {
            skip: !companyId,
        }
    );

    const {
        data: affiliateCategories,
        isLoading: isAffiliateCategoriesLoading,
        refetch: refetchAffiliateCategories,
    } = useGetAffiliateCategoriesQuery(
        affiliateId ?? "",
        {
            skip: !affiliateId,
        }
    );

    const [orderedCategories, setOrderedCategories] = useState<
        typeof categoriesData
    >([]);

    const [enabledCategories, setEnabledCategories] = useState<Set<number>>(
        new Set()
    );

    const [updatingCategoryId, setUpdatingCategoryId] = useState<number | null>(
        null
    );

    const [activeTab, setActiveTab] = useState<AffiliateTab>("categories");
    const [participantError, setParticipantError] = useState<string | null>(null);

    const {
        data: manager,
        isLoading: isManagerLoading,
        isError: isManagerError,
        refetch: refetchManager,
    } = useGetManagerQuery(affiliateId ?? "", { skip: !affiliateId });
    const {
        data: employees = [],
        isLoading: isEmployeesLoading,
        isError: isEmployeesError,
        refetch: refetchEmployees,
    } = useGetEmployeeQuery(affiliateId ?? "", { skip: !affiliateId });

    const [addCategory] = useAddAffiliateCategoryMutation();

    const [removeCategory] = useRemoveAffiliateCategoryMutation();
    const [addManager, { isLoading: isAddingManager }] = useAddManagerMutation();
    const [deleteManager, { isLoading: isDeletingManager }] = useDeleteManagerMutation();
    const [addEmployee, { isLoading: isAddingEmployee }] = useAddEmployeeMutation();
    const [deleteEmployee, { isLoading: isDeletingEmployee }] = useDeleteEmployeeMutation();

    const {
        register: registerManager,
        handleSubmit: handleManagerSubmit,
        reset: resetManager,
        formState: { errors: managerErrors },
    } = useForm<ParticipantForm>();
    const {
        register: registerEmployee,
        handleSubmit: handleEmployeeSubmit,
        reset: resetEmployee,
        formState: { errors: employeeErrors },
    } = useForm<ParticipantForm>();

    useEffect(() => {
        setOrderedCategories(
            [...(categoriesData ?? [])].sort(
                (first, second) => first.order - second.order
            )
        );
    }, [categoriesData]);

    useEffect(() => {
        if (!affiliateCategories) {
            return;
        }

        setEnabledCategories(
            new Set(
                affiliateCategories.map(
                    (category) => category.id
                )
            )
        );
    }, [affiliateCategories]);

    if (
        isCategoriesLoading ||
        isAffiliateLoading ||
        isCompanyLoading
    ) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner className="size-5" />
                    Завантаження філії...
                </div>
            </main>
        );
    }

    const handleCategoryChange = async (
        categoryId: number,
        checked: boolean
    ) => {
        if (!affiliateId) {
            return;
        }

        const previousState = enabledCategories.has(categoryId);

        setEnabledCategories((prev) => {
            const next = new Set(prev);

            if (checked) {
                next.add(categoryId);
            } else {
                next.delete(categoryId);
            }

            return next;
        });

        setUpdatingCategoryId(categoryId);

        try {
            if (checked) {
                await addCategory({
                    affiliateId,
                    categoryId,
                }).unwrap();
            } else {
                await removeCategory({
                    affiliateId,
                    categoryId,
                }).unwrap();
            }

            await refetchAffiliateCategories();
        } catch (error) {
            console.error(
                "Не вдалося змінити категорію:",
                error
            );

            setEnabledCategories((prev) => {
                const next = new Set(prev);

                if (previousState) {
                    next.add(categoryId);
                } else {
                    next.delete(categoryId);
                }

                return next;
            });
        } finally {
            setUpdatingCategoryId(null);
        }
    };

    const addManagerToAffiliate = async ({ partnerEmail }: ParticipantForm) => {
        if (!affiliateId || manager?.length > 0) {
            return;
        }

        setParticipantError(null);

        try {
            await addManager({ affiliateId, partnerEmail: partnerEmail.trim() }).unwrap();
            await refetchManager();
            resetManager();
        } catch (error: unknown) {
            setParticipantError(getBackendErrorMessage(error));
        }
    };

    const removeManagerFromAffiliate = async () => {
        if (!affiliateId || !manager) {
            return;
        }

        setParticipantError(null);

        try {
            await deleteManager({ affiliateId, partnerEmail: manager?.[0]?.email }).unwrap();
            await refetchManager();
        } catch (error: unknown) {
            setParticipantError(getBackendErrorMessage(error));
        }
    };

    const addEmployeeToAffiliate = async ({ partnerEmail }: ParticipantForm) => {
        const normalizedEmail = partnerEmail.trim();

        if (!affiliateId || employees.some((employee) => employee.email === normalizedEmail)) {
            return;
        }

        setParticipantError(null);

        try {
            await addEmployee({ affiliateId, partnerEmail: normalizedEmail }).unwrap();
            await refetchEmployees();
            resetEmployee();
        } catch (error: unknown) {
            setParticipantError(getBackendErrorMessage(error));
        }
    };

    const removeEmployeeFromAffiliate = async (partnerEmail: string) => {
        if (!affiliateId) {
            return;
        }

        setParticipantError(null);

        try {
            await deleteEmployee({ affiliateId, partnerEmail }).unwrap();
            await refetchEmployees();
        } catch (error: unknown) {
            setParticipantError(getBackendErrorMessage(error));
        }
    };

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">

            <Button
                variant="ghost"
                className="mb-8 px-0 p-2.5"
                onClick={() =>
                    navigate(
                        `/dashboard/companies/${companyId}`
                    )
                }
            >
                <ArrowLeft />
                Назад до {company?.name}
            </Button>
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Керування філією
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        #{affiliate?.id}
                    </h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        {affiliate?.location.region},{" "}
                        {affiliate?.location.location},{" "}
                        {affiliate?.location.address},{" "}
                        {affiliate?.location.postalIndex}
                    </p>
                </div>
            </div>
            <div className="mb-6 flex gap-2 border-b border-border" role="tablist" aria-label="Розділи філії">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "categories"}
                    className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${activeTab === "categories" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setActiveTab("categories")}
                >
                    Страви
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "employees"}
                    className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${activeTab === "employees" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setActiveTab("employees")}
                >
                    Працівники
                </button>
            </div>

            {activeTab === "categories" ? <section className="max-w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-start gap-3">

                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
                        <UtensilsCrossed className="size-6" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Страви філії
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Щоб вибрати категорію страв,
                            яка буде доступна у філії,
                            перемкніть перемикач біля категорії.
                        </p>
                    </div>

                </div>
                {isAffiliateCategoriesLoading ? (
                    <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-muted/40 p-6 text-sm text-muted-foreground">
                        <Spinner />
                        Завантаження категорій...
                    </div>

                ) : isCategoriesError ? (
                    <div className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
                        Не вдалося завантажити категорії.

                        <button
                            type="button"
                            className="ml-1 font-medium underline"
                            onClick={() =>
                                refetchCategories()
                            }
                        >
                            Спробувати ще раз
                        </button>
                    </div>

                ) : (orderedCategories?.length ?? 0) > 0 ? (
                    <ul className="mt-6 grid grid-cols-1 gap-3">

                        {orderedCategories?.map((category) => {

                            const isEnabled =
                                enabledCategories.has(
                                    category.id
                                );

                            const isUpdating =
                                updatingCategoryId ===
                                category.id;

                            return (
                                <li
                                    key={category.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3"
                                >
                                    <button
                                        type="button"
                                        className="flex min-w-0 cursor-pointer items-center gap-2 text-left font-medium hover:underline"
                                        onClick={() =>
                                            navigate(
                                                `categories/${category.id}`,
                                            )
                                        }
                                    >
                                        {category.name}
                                    </button>

                                    <Switch
                                        disabled={isUpdating}
                                        checked={isEnabled}
                                        onCheckedChange={(checked) =>
                                            handleCategoryChange(
                                                category.id,
                                                checked
                                            )
                                        }
                                    />

                                </li>
                            );
                        })}

                    </ul>

                ) : (
                    <p className="mt-6 rounded-xl bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                        Категорій ще немає.
                    </p>
                )}

            </section> : (
                <section className="max-w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
                            <BriefcaseBusiness className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Працівники філії</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Додайте менеджера та працівників за email.
                            </p>
                        </div>
                    </div>

                    {participantError && (
                        <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                            {participantError}
                        </p>
                    )}

                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <h3 className="mb-3 font-semibold">Менеджер</h3>
                            {isManagerLoading ? (
                                <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                                    <Spinner />
                                    Завантаження менеджера...
                                </div>
                            ) : isManagerError ? (
                                <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                                    Не вдалося отримати менеджера.
                                    <button type="button" className="ml-1 font-medium underline" onClick={() => refetchManager()}>
                                        Спробувати ще раз
                                    </button>
                                </p>
                            ) : (manager?.length ?? 0) > 0 ? (
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3">
                                    <span className="min-w-0 truncate text-sm">
                                        {manager?.[0]?.firstName} {manager?.[0]?.lastName} ({manager?.[0]?.email})
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Видалити менеджера"
                                        disabled={isDeletingManager}
                                        onClick={removeManagerFromAffiliate}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ) : (
                                <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleManagerSubmit(addManagerToAffiliate)}>
                                    <div className="min-w-0 flex-1">
                                        <Input
                                            type="email"
                                            placeholder="manager@example.com"
                                            aria-invalid={Boolean(managerErrors.partnerEmail)}
                                            {...registerManager("partnerEmail", {
                                                required: "Вкажіть email менеджера",
                                                pattern: { value: /^\S+@\S+\.\S+$/, message: "Введіть коректний email" },
                                            })}
                                        />
                                        {managerErrors.partnerEmail && <p className="mt-1 text-xs text-destructive">{managerErrors.partnerEmail.message}</p>}
                                    </div>
                                    <Button type="submit" disabled={isAddingManager}>Додати</Button>
                                </form>
                            )}
                        </div>

                        <div>
                            <h3 className="mb-3 font-semibold">Працівники</h3>
                            <form className="mb-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleEmployeeSubmit(addEmployeeToAffiliate)}>
                                <div className="min-w-0 flex-1">
                                    <Input
                                        type="email"
                                        placeholder="employee@example.com"
                                        aria-invalid={Boolean(employeeErrors.partnerEmail)}
                                        {...registerEmployee("partnerEmail", {
                                            required: "Вкажіть email працівника",
                                            pattern: { value: /^\S+@\S+\.\S+$/, message: "Введіть коректний email" },
                                        })}
                                    />
                                    {employeeErrors.partnerEmail && <p className="mt-1 text-xs text-destructive">{employeeErrors.partnerEmail.message}</p>}
                                </div>
                                <Button type="submit" disabled={isAddingEmployee}>Додати</Button>
                            </form>
                            {isEmployeesLoading ? (
                                <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                                    <Spinner />
                                    Завантаження працівників...
                                </div>
                            ) : isEmployeesError ? (
                                <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                                    Не вдалося отримати працівників.
                                    <button type="button" className="ml-1 font-medium underline" onClick={() => refetchEmployees()}>
                                        Спробувати ще раз
                                    </button>
                                </p>
                            ) : employees.length > 0 ? (
                                <ul className="grid gap-2">
                                    {employees.map((employee) => (
                                        <li key={employee.email} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3">
                                            <span className="min-w-0 truncate text-sm">
                                                {employee.firstName} {employee.lastName} ({employee.email})
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Видалити працівника ${employee.email}`}
                                                disabled={isDeletingEmployee}
                                                onClick={() => removeEmployeeFromAffiliate(employee.email)}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-xl bg-muted/40 p-4 text-center text-sm text-muted-foreground">Працівників ще немає.</p>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default AffiliateDashboard;