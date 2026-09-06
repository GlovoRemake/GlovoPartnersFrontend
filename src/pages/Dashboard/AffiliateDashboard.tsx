import { useNavigate, useParams } from "react-router";
import { useGetAllQuery } from "@/services/apiCompanyCategory.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
    useAddAffiliateCategoryMutation,
    useGetAffiliateCategoriesQuery,
    useGetByIdQuery,
    useRemoveAffiliateCategoryMutation,
} from "@/services/apiAffiliate.ts";
import { Button } from "@/components/ui/button.tsx";
import {
    ArrowLeft,
    UtensilsCrossed,
} from "lucide-react";
import { useGetCompanyQuery } from "@/services/apiCompany.ts";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";

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

    const [addCategory] = useAddAffiliateCategoryMutation();

    const [removeCategory] = useRemoveAffiliateCategoryMutation();

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
            <section className="max-w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
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

            </section>
        </main>
    );
};

export default AffiliateDashboard;