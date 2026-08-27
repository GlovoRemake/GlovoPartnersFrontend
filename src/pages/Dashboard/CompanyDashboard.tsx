import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetCompanyQuery } from "@/services/apiCompany.ts";
import { useAddMutation, useDeleteMutation, useEditMutation, useGetAllQuery, useReorderMutation } from "@/services/apiCompanyCategory.ts";
import { ArrowLeft, Building2, Check, CheckCircle2, GripVertical, Pencil, Plus, Save, Trash2, UtensilsCrossed, Warehouse, X } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

type CompanySection = "info" | "branches" | "dishes";

type CategoryForm = {
    name: string;
};

const CompanyDashboard = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { data: company, isLoading, isError } = useGetCompanyQuery(companyId ?? "", { skip: !companyId });
    const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError, refetch: refetchCategories } = useGetAllQuery(companyId ?? "", { skip: !companyId });
    const [addCategoryRequest, { isLoading: isAddingCategory, isError: isAddCategoryError }] = useAddMutation();
    const [editCategoryRequest, { isLoading: isEditingCategory, isError: isEditCategoryError }] = useEditMutation();
    const [deleteCategoryRequest, { isLoading: isDeletingCategory, isError: isDeleteCategoryError }] = useDeleteMutation();
    const [reorderCategoryRequest, { isLoading: isReordering, isError: isReorderError }] = useReorderMutation();
    const [activeSection, setActiveSection] = useState<CompanySection>("info");
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [orderedCategories, setOrderedCategories] = useState<typeof categories>([]);
    const [draggedCategoryId, setDraggedCategoryId] = useState<number | null>(null);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryForm>();
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        formState: { errors: editErrors },
    } = useForm<CategoryForm>();
    const navigate = useNavigate();
    const categories = categoriesData ?? [];

    useEffect(() => {
        if (!hasOrderChanges) {
            setOrderedCategories([...(categoriesData ?? [])].sort((first, second) => first.order - second.order));
        }
    }, [categoriesData, hasOrderChanges]);

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Spinner className="size-5" />
                    Завантаження компанії...
                </div>
            </main>
        );
    }

    if (isError || !company) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4 py-8 sm:px-6">
                <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold tracking-tight">Не вдалося завантажити компанію</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Компанію не знайдено або доступ до неї відсутній.</p>
                    <Button className="mt-6" onClick={() => navigate("/dashboard/companies")}>До списку компаній</Button>
                </section>
            </main>
        );
    }

    const addCategory = async ({ name }: CategoryForm) => {
        const normalizedName = name.trim();
        if (!normalizedName || !companyId || categories.some((category) => category.name.toLowerCase() === normalizedName.toLowerCase())) return;

        try {
            await addCategoryRequest({ companyId, name: normalizedName }).unwrap();
            reset();
            await refetchCategories();
        } catch {
            return;
        }
    };

    const deleteCategory = async (categoryId: number, companyId: string) => {
        setDeletingCategoryId(categoryId);
        try {
            await deleteCategoryRequest({ idCategory: categoryId, companyId }).unwrap();
            await refetchCategories();
        } catch {
            return;
        } finally {
            setDeletingCategoryId(null);
        }
    };

    const startEditingCategory = (categoryId: number, name: string) => {
        setEditingCategoryId(categoryId);
        resetEdit({ name });
    };

    const cancelEditingCategory = () => {
        setEditingCategoryId(null);
        resetEdit();
    };

    const editCategory = async ({ name }: CategoryForm) => {
        const normalizedName = name.trim();
        if (!normalizedName || !companyId || editingCategoryId === null) return;

        try {
            await editCategoryRequest({ idCategory: editingCategoryId, name: normalizedName, companyId }).unwrap();
            cancelEditingCategory();
            await refetchCategories();
        } catch {
            return;
        }
    };

    const handleDragStart = (event: DragEvent<HTMLLIElement>, categoryId: number) => {
        setDraggedCategoryId(categoryId);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(categoryId));
    };

    const handleDrop = (event: DragEvent<HTMLLIElement>, targetCategoryId: number) => {
        event.preventDefault();
        const sourceCategoryId = draggedCategoryId ?? Number(event.dataTransfer.getData("text/plain"));
        if (!sourceCategoryId || sourceCategoryId === targetCategoryId) return;

        setOrderedCategories((currentCategories) => {
            const sourceIndex = currentCategories.findIndex((category) => category.id === sourceCategoryId);
            const targetIndex = currentCategories.findIndex((category) => category.id === targetCategoryId);
            if (sourceIndex === -1 || targetIndex === -1) return currentCategories;

            const nextCategories = [...currentCategories];
            const [movedCategory] = nextCategories.splice(sourceIndex, 1);
            nextCategories.splice(targetIndex, 0, movedCategory);
            return nextCategories;
        });
        setHasOrderChanges(true);
        setDraggedCategoryId(null);
    };

    const saveCategoryOrder = async () => {
        if (!companyId || !hasOrderChanges) return;

        try {
            await reorderCategoryRequest({
                companyId,
                categoryIds: orderedCategories.map((category) => category.id),
            }).unwrap();
            setHasOrderChanges(false);
            await refetchCategories();
        } catch {
            return;
        }
    };

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">
            <Button variant="ghost" className="mb-8 px-0 p-2.5" onClick={() => navigate("/dashboard/companies")}>
                <ArrowLeft />
                Назад до компаній
            </Button>

            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Керування компанією</p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{company.name}</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">{company.description}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800">
                    <CheckCircle2 className="size-4" />
                    Схвалено
                </span>
            </div>

            <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3" aria-label="Розділи компанії">
                <Button variant={activeSection === "info" ? "default" : "ghost"} onClick={() => setActiveSection("info")}>
                    <Building2 />
                    Інформація про компанію
                </Button>
                <Button variant={activeSection === "branches" ? "default" : "ghost"} onClick={() => setActiveSection("branches")}>
                    <Warehouse />
                    Філії компанії
                </Button>
                <Button variant={activeSection === "dishes" ? "default" : "ghost"} onClick={() => setActiveSection("dishes")}>
                    <UtensilsCrossed />
                    Страви компанії
                </Button>
            </nav>

            {activeSection === "info" && (
                <section className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/15"><Building2 className="size-6" /></div>
                    <h2 className="text-xl font-semibold">Інформація про компанію</h2>
                    <dl className="mt-6 divide-y divide-border">
                        <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-sm text-muted-foreground">Назва</dt><dd className="font-medium">{company.name}</dd></div>
                        <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-sm text-muted-foreground">Опис</dt><dd className="text-sm leading-6">{company.description}</dd></div>
                        <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-sm text-muted-foreground">ID компанії</dt><dd className="font-mono text-sm">{company.companyId ?? company.id}</dd></div>
                    </dl>
                </section>
            )}

            {activeSection === "branches" && (
                <section className="max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <Warehouse className="mx-auto size-10 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">Філії компанії</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Інформація про філії стане доступною після підключення відповідного API.</p>
                </section>
            )}

            {activeSection === "dishes" && (
                <section className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15"><UtensilsCrossed className="size-6" /></div>
                        <div><h2 className="text-xl font-semibold">Страви компанії</h2><p className="mt-1 text-sm text-muted-foreground">Створіть категорії, щоб організувати товари компанії.</p></div>
                    </div>
                    <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit(addCategory)} noValidate>
                        <div className="flex-1">
                            <Input
                                placeholder="Наприклад, Піца"
                                aria-label="Назва категорії"
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", {
                                    required: "Вкажіть назву категорії",
                                    validate: (value) => value.trim().length > 0 || "Вкажіть назву категорії",
                                })}
                            />
                            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <Button type="submit" disabled={isAddingCategory}>
                            {isAddingCategory ? <Spinner /> : <Plus />}
                            {isAddingCategory ? "Створення..." : "Створити категорію"}
                        </Button>
                    </form>
                    {isAddCategoryError && <p className="mt-3 text-sm text-destructive">Не вдалося створити категорію. Спробуйте ще раз.</p>}
                    {isCategoriesLoading ? (
                        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-muted/40 p-6 text-sm text-muted-foreground"><Spinner />Завантаження категорій...</div>
                    ) : isCategoriesError ? (
                        <div className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Не вдалося завантажити категорії. <button type="button" className="font-medium underline" onClick={() => refetchCategories()}>Спробувати ще раз</button></div>
                    ) : orderedCategories.length > 0 ? (
                        <ul className="mt-6 grid grid-cols-1 gap-3">
                            {orderedCategories.map((category) => (
                                <li
                                    key={category.id}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, category.id)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={(event) => handleDrop(event, category.id)}
                                    onDragEnd={() => setDraggedCategoryId(null)}
                                    className={`flex cursor-grab items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 active:cursor-grabbing ${draggedCategoryId === category.id ? "opacity-50" : ""}`}
                                >
                                    {editingCategoryId === category.id ? (
                                        <form className="flex min-w-0 flex-1 items-start gap-2" onSubmit={handleEditSubmit(editCategory)} noValidate>
                                            <div className="min-w-0 flex-1">
                                                <Input
                                                    autoFocus
                                                    aria-label={`Нова назва категорії ${category.name}`}
                                                    aria-invalid={editErrors.name ? "true" : "false"}
                                                    {...registerEdit("name", {
                                                        required: "Вкажіть назву категорії",
                                                        validate: (value) => value.trim().length > 0 || "Вкажіть назву категорії",
                                                    })}
                                                />
                                                {editErrors.name && <p className="mt-1 text-sm text-destructive">{editErrors.name.message}</p>}
                                            </div>
                                            <Button type="submit" size="icon-sm" className="cursor-pointer" aria-label="Зберегти назву категорії" title="Зберегти" disabled={isEditingCategory}>
                                                {isEditingCategory ? <Spinner /> : <Check />}
                                            </Button>
                                            <Button type="button" variant="outline" className="cursor-pointer" size="icon-sm" aria-label="Скасувати редагування" title="Скасувати" onClick={cancelEditingCategory} disabled={isEditingCategory}>
                                                <X />
                                            </Button>
                                        </form>
                                    ) : (
                                        <button
                                            type="button"
                                            className="flex min-w-0 items-center gap-2 text-left font-medium cursor-pointer hover:underline"
                                            onClick={() => navigate(`/dashboard/companies/${companyId}/categories/${category.id}`)}
                                        >
                                            <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                                            {category.name}
                                        </button>
                                    )}
                                    {editingCategoryId !== category.id && <div className="flex shrink-0 gap-2">
                                        <Button type="button" variant="outline" className="cursor-pointer" size="icon-sm" aria-label={`Редагувати категорію ${category.name}`} title={`Редагувати категорію ${category.name}`} disabled={isDeletingCategory || isEditingCategory} onClick={() => startEditingCategory(category.id, category.name)}>
                                            <Pencil />
                                        </Button>
                                        <Button type="button" variant="destructive" className="cursor-pointer" size="icon-sm" aria-label={`Видалити категорію ${category.name}`} title={`Видалити категорію ${category.name}`} disabled={isDeletingCategory || isEditingCategory} onClick={() => deleteCategory(category.id, companyId ?? "")}>
                                            {deletingCategoryId === category.id ? <Spinner /> : <Trash2 />}
                                        </Button>
                                    </div>}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="mt-6 rounded-xl bg-muted/40 p-6 text-center text-sm text-muted-foreground">Категорій ще немає.</p>}
                    {orderedCategories.length > 1 && (
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Button type="button" onClick={saveCategoryOrder} disabled={!hasOrderChanges || isReordering}>
                                {isReordering ? <Spinner /> : <Save />}
                                {isReordering ? "Збереження..." : "Зберегти порядок"}
                            </Button>
                            {hasOrderChanges && <span className="text-sm text-muted-foreground">Є незбережені зміни</span>}
                        </div>
                    )}
                    {isReorderError && <p className="mt-3 text-sm text-destructive">Не вдалося зберегти порядок категорій. Спробуйте ще раз.</p>}
                    {isEditCategoryError && <p className="mt-3 text-sm text-destructive">Не вдалося оновити категорію. Спробуйте ще раз.</p>}
                    {isDeleteCategoryError && <p className="mt-3 text-sm text-destructive">Не вдалося видалити категорію. Спробуйте ще раз.</p>}
                </section>
            )}
        </main>
    );
};

export default CompanyDashboard;
