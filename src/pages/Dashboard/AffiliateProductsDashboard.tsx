import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
    useGetQuery,
} from "@/services/apiCompanyProduct.ts";
import {
    useAddAffiliateProductsMutation,
    useGetAffiliateProductsQuery,
    useRemoveAffiliateProductsMutation,
} from "@/services/apiAffiliate.ts";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AffiliateProductCard from "@/components/product/AffiliateProductCard.tsx";

const CategoryProductsDashboard = () => {
    const {
        companyId,
        categoryId,
        affiliateId,
    } = useParams<{
        companyId: string;
        categoryId: string;
        affiliateId: string;
    }>();

    const navigate = useNavigate();

    const parsedCategoryId = Number(categoryId);

    const {
        data: products = [],
        isLoading,
        isError,
        refetch,
    } = useGetQuery(
        {
            companyId: companyId ?? "",
            categoryId: parsedCategoryId,
        },
        {
            skip:
                !companyId ||
                !categoryId ||
                Number.isNaN(parsedCategoryId),
        },
    );

    const {
        data: affiliateProducts,
        isLoading: isAffiliateProductsLoading,
        refetch: refetchAffiliateProducts,
    } = useGetAffiliateProductsQuery(
        affiliateId ?? "",
        {
            skip: !affiliateId,
        },
    );

    const [addAffiliateProduct] =
        useAddAffiliateProductsMutation();

    const [removeAffiliateProduct] =
        useRemoveAffiliateProductsMutation();

    const [enabledProducts, setEnabledProducts] =
        useState<Set<number>>(new Set());

    const [updatingProductId, setUpdatingProductId] =
        useState<number | null>(null);

    useEffect(() => {
        if (!affiliateProducts) {
            return;
        }

        setEnabledProducts(
            new Set(
                affiliateProducts.map(
                    (product) => product.id
                )
            )
        );
    }, [affiliateProducts]);

    const handleProductChange = async (
        productId: number,
        checked: boolean,
    ) => {
        if (!affiliateId) {
            return;
        }

        // Запам'ятовуємо попередній стан
        const previousState =
            enabledProducts.has(productId);

        setEnabledProducts((prev) => {
            const next = new Set(prev);

            if (checked) {
                next.add(productId);
            } else {
                next.delete(productId);
            }

            return next;
        });

        setUpdatingProductId(productId);

        try {
            if (checked) {
                await addAffiliateProduct({
                    affiliateId,
                    productId,
                }).unwrap();
            } else {
                await removeAffiliateProduct({
                    affiliateId,
                    productId,
                }).unwrap();
            }

            // Синхронізуємо з сервером
            await refetchAffiliateProducts();

        } catch (error) {
            console.error(
                "Не вдалося змінити продукт:",
                error,
            );

            // =========================
            // ROLLBACK
            // =========================

            setEnabledProducts((prev) => {
                const next = new Set(prev);

                if (previousState) {
                    next.add(productId);
                } else {
                    next.delete(productId);
                }

                return next;
            });
        } finally {
            setUpdatingProductId(null);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (isLoading || isAffiliateProductsLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4">
                <Spinner className="size-5" />
            </main>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (isError) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4">
                <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold">
                        Не вдалося завантажити товари
                    </h1>

                    <Button
                        className="mt-5"
                        onClick={() => refetch()}
                    >
                        Спробувати ще раз
                    </Button>
                </section>
            </main>
        );
    }

    // =========================
    // PAGE
    // =========================

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">

            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <Button
                        variant="ghost"
                        className="mb-5 px-0"
                        onClick={() =>
                            navigate(
                                `/dashboard/companies/${companyId}/affiliates/${affiliateId}`
                            )
                        }
                    >
                        <ArrowLeft />
                        Назад до філії
                    </Button>

                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Категорія товарів
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Товари категорії
                    </h1>

                </div>

            </div>

            {/* PRODUCTS */}
            {products.length === 0 ? (

                <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">

                    <ShoppingBag className="mx-auto mb-3 size-8" />

                    У цій категорії ще немає товарів.

                </div>

            ) : (

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {products.map((product) => (

                        <div
                            key={product.id}
                            className="relative"
                        >

                            <AffiliateProductCard
                                product={product}
                                onToggle={(checked) =>
                                    handleProductChange(
                                        product.id,
                                        checked
                                    )
                                }
                                isEnabled={enabledProducts.has(
                                    product.id
                                )}
                                isUpdating={updatingProductId === product.id}
                            />

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
};

export default CategoryProductsDashboard;