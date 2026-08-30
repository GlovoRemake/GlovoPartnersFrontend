import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useDeleteBannerMutation, useDeleteIconMutation, useGetCompanyQuery, useUpdateCompanyMutation } from "@/services/apiCompany.ts";
import AffiliateCard from "@/components/affiliate/AffiliateCard.tsx";
import { useGetAllQuery as useGetAffiliatesQuery, useAddMutation as useAddAffiliateMutation } from "@/services/apiAffiliate.ts";
import type { ICreateAffiliate } from "@/types/company/affiliate/ICreateAffiliate.ts";
import { useAddMutation, useDeleteMutation, useEditMutation, useGetAllQuery, useReorderMutation } from "@/services/apiCompanyCategory.ts";
import { ArrowLeft, Building2, Check, CheckCircle2, GripVertical, ImageIcon, Pencil, Plus, Save, Trash2, UtensilsCrossed, Warehouse, X } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import APP_ENV from "@/utils/env.ts";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

type CompanySection = "info" | "branches" | "dishes";

type CategoryForm = {
    name: string;
};

type CompanyEditForm = {
    name: string;
    description: string;
    icon?: FileList;
    banner?: FileList;
};

type AffiliateForm = Omit<ICreateAffiliate, "companyId" | "location"> & ICreateAffiliate["location"];

const CompanyDashboard = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { data: company, isLoading, isError, refetch: refetchCompany } = useGetCompanyQuery(companyId ?? "", { skip: !companyId });
    const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError, refetch: refetchCategories } = useGetAllQuery(companyId ?? "", { skip: !companyId });

    const [page, setPage] = useState<number>(1)
    const { data: affiliates, isLoading: isAffiliatesLoading, isError: isAffiliatesError, refetch: refetchAffiliates } =
        useGetAffiliatesQuery({ companyId: companyId ?? "", pageNumber: page, pageSize: 20 }, { skip: !companyId });

    const [addAffiliateRequest, { isLoading: isAddingAffiliate, isError: isAddAffiliateError }] = useAddAffiliateMutation();
    const [addCategoryRequest, { isLoading: isAddingCategory, isError: isAddCategoryError }] = useAddMutation();
    const [editCategoryRequest, { isLoading: isEditingCategory, isError: isEditCategoryError }] = useEditMutation();
    const [deleteCategoryRequest, { isLoading: isDeletingCategory, isError: isDeleteCategoryError }] = useDeleteMutation();
    const [reorderCategoryRequest, { isLoading: isReordering, isError: isReorderError }] = useReorderMutation();
    const [updateCompanyRequest, { isLoading: isUpdatingCompany, isError: isUpdateCompanyError }] = useUpdateCompanyMutation();
    const [deleteIconRequest, { isLoading: isDeletingIcon, isError: isDeleteIconError }] = useDeleteIconMutation();
    const [deleteBannerRequest, { isLoading: isDeletingBanner, isError: isDeleteBannerError }] = useDeleteBannerMutation();
    const [activeSection, setActiveSection] = useState<CompanySection>("info");
    const [isCompanyEditDialogOpen, setIsCompanyEditDialogOpen] = useState(false);
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
        register: registerCompany,
        handleSubmit: handleCompanySubmit,
        reset: resetCompanyForm,
        resetField: resetCompanyField,
        watch: watchCompanyForm,
        formState: { errors: companyErrors },
    } = useForm<CompanyEditForm>();
    const { register: registerAffiliate, handleSubmit: handleAffiliateSubmit, reset: resetAffiliate, formState: { errors: affiliateErrors }, reset: resetAffiliateForm } = useForm<AffiliateForm>();
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        formState: { errors: editErrors },
    } = useForm<CategoryForm>();
    const navigate = useNavigate();
    const categories = categoriesData ?? [];
    const companyIcon = watchCompanyForm("icon");
    const companyBanner = watchCompanyForm("banner");
    const [companyIconPreview, setCompanyIconPreview] = useState<string | null>(null);
    const [companyBannerPreview, setCompanyBannerPreview] = useState<string | null>(null);
    const [companyIconRemoved, setCompanyIconRemoved] = useState(false);
    const [companyBannerRemoved, setCompanyBannerRemoved] = useState(false);

    useEffect(() => {
        if (!hasOrderChanges) {
            setOrderedCategories([...(categoriesData ?? [])].sort((first, second) => first.order - second.order));
        }
    }, [categoriesData, hasOrderChanges]);

    useEffect(() => {
        if (companyIcon?.[0]) {
            setCompanyIconRemoved(false);
            const nextUrl = URL.createObjectURL(companyIcon[0]);
            setCompanyIconPreview(nextUrl);

            return () => URL.revokeObjectURL(nextUrl);
        }

        if (companyIconRemoved) {
            setCompanyIconPreview(null);
            return;
        }

        setCompanyIconPreview(company?.iconPath ? `${APP_ENV.API_IMAGE_LARGE_URL}${company.iconPath}` : null);
    }, [company?.iconPath, companyIcon, companyIconRemoved]);

    useEffect(() => {
        if (companyBanner?.[0]) {
            setCompanyBannerRemoved(false);
            const nextUrl = URL.createObjectURL(companyBanner[0]);
            setCompanyBannerPreview(nextUrl);

            return () => URL.revokeObjectURL(nextUrl);
        }

        if (companyBannerRemoved) {
            setCompanyBannerPreview(null);
            return;
        }

        setCompanyBannerPreview(company?.bannerPath ? `${APP_ENV.API_IMAGE_LARGE_URL}${company.bannerPath}` : null);
    }, [company?.bannerPath, companyBanner, companyBannerRemoved]);

    useEffect(() => {
        if (company && isCompanyEditDialogOpen) {
            resetCompanyForm({
                name: company.name,
                description: company.description,
            });
            setCompanyIconRemoved(false);
            setCompanyBannerRemoved(false);
        }
    }, [company, isCompanyEditDialogOpen, resetCompanyForm]);

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

    const addAffiliate = async (form: AffiliateForm) => {
        if (!companyId) return;
        try {
            await addAffiliateRequest({
                companyId,
                phone: form.phone.trim(),
                email: form.email.trim(),
                location: {
                    location: form.location.trim(),
                    regionId: Number(form.regionId),
                    address: form.address.trim(),
                    postalIndex: form.postalIndex.trim(),
                },
            }).unwrap();
            resetAffiliate();
            await refetchAffiliates();
        } catch {
            return;
        }
    };

    const submitCompanyEdit = async (form: CompanyEditForm) => {
        if (!companyId) return;

        try {
            const hasNewIcon = Boolean(form.icon && form.icon.length > 0);
            const hasNewBanner = Boolean(form.banner && form.banner.length > 0);

            if (companyIconRemoved && !hasNewIcon) {
                await deleteIconRequest(companyId).unwrap();
            }

            if (companyBannerRemoved && !hasNewBanner) {
                await deleteBannerRequest(companyId).unwrap();
            }

            const nextIcon = companyIconRemoved || (form.icon && form.icon.length === 0) ? null : form.icon?.[0] ?? null;
            const nextBanner = companyBannerRemoved || (form.banner && form.banner.length === 0) ? null : form.banner?.[0] ?? null;

            await updateCompanyRequest({
                id: companyId,
                name: form.name.trim(),
                description: form.description.trim(),
                icon: nextIcon,
                banner: nextBanner,
            }).unwrap();

            setIsCompanyEditDialogOpen(false);
            resetCompanyForm({
                name: form.name.trim(),
                description: form.description.trim(),
            });
            setCompanyIconRemoved(false);
            setCompanyBannerRemoved(false);
            await refetchCompany();
        } catch {
            return;
        }
    };

    const deleteCompanyIcon = () => {
        setCompanyIconRemoved(true);
        resetCompanyField("icon");
    };

    const deleteCompanyBanner = () => {
        setCompanyBannerRemoved(true);
        resetCompanyField("banner");
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
                <section className="max-w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15"><Building2 className="size-6" /></div>
                        <Dialog open={isCompanyEditDialogOpen} onOpenChange={(open) => {
                            setIsCompanyEditDialogOpen(open);
                            if (!open) {
                                resetCompanyForm({
                                    name: company.name,
                                    description: company.description,
                                });
                                resetCompanyField("icon");
                                resetCompanyField("banner");
                                setCompanyIconRemoved(false);
                                setCompanyBannerRemoved(false);
                                setCompanyIconPreview(company.iconPath ? `${APP_ENV.API_IMAGE_LARGE_URL}${company.iconPath}` : null);
                                setCompanyBannerPreview(company.bannerPath ? `${APP_ENV.API_IMAGE_LARGE_URL}${company.bannerPath}` : null);
                            }
                        }}>
                            <DialogTrigger render={<Button type="button" variant="outline" className="shrink-0"><Pencil /> Редагувати</Button>} />
                            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                                <DialogHeader className="mt-1">
                                    <DialogTitle>Редагування компанії</DialogTitle>
                                    <DialogDescription>Оновіть основну інформацію про компанію та завантажте нові зображення.</DialogDescription>
                                </DialogHeader>
                                <form className="grid gap-4" onSubmit={handleCompanySubmit(submitCompanyEdit)} noValidate>
                                    <div className="space-y-2">
                                        <label htmlFor="company-name" className="text-sm font-medium">Назва компанії</label>
                                        <Input id="company-name" {...registerCompany("name", { required: "Вкажіть назву компанії" })} />
                                        {companyErrors.name && <p className="text-sm text-destructive">{companyErrors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="company-description" className="text-sm font-medium">Опис</label>
                                        <Textarea id="company-description" className="min-h-28" {...registerCompany("description", { required: "Вкажіть опис компанії" })} />
                                        {companyErrors.description && <p className="text-sm text-destructive">{companyErrors.description.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="company-icon" className="text-sm font-medium">Іконка компанії</label>
                                        <div className="relative overflow-hidden rounded-2xl border bg-muted/20 max-h-45">
                                            {companyIconPreview ? (
                                                <div className="relative">
                                                    <img src={companyIconPreview} alt="Прев'ю іконки компанії" className="aspect-square w-40 h-full object-contain mx-auto" />
                                                    <div className="absolute inset-x-0 top-0 flex items-center justify-end p-2">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon-sm"
                                                            className="cursor-pointer shadow-sm"
                                                            aria-label="Видалити вибрану іконку"
                                                            title="Видалити вибрану іконку"
                                                            onClick={deleteCompanyIcon}
                                                            disabled={isDeletingIcon}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12">
                                                        <span className="truncate text-sm font-medium text-white">{companyIcon?.[0]?.name ?? "Поточна іконка"}</span>
                                                        <label htmlFor="company-icon" className="shrink-0 cursor-pointer rounded-xl bg-white/90 px-3 py-1.5 text-sm font-medium text-black transition hover:bg-white">
                                                            Змінити
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label htmlFor="company-icon" className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 transition hover:border-primary/50 hover:bg-muted/30">
                                                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                                                        <ImageIcon className="size-5 text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">Додайте іконку</p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG або WEBP</p>
                                                    </div>
                                                </label>
                                            )}
                                            <Input id="company-icon" type="file" accept="image/*" className="hidden" {...registerCompany("icon")} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="company-banner" className="text-sm font-medium">Банер компанії</label>
                                        <div className="relative overflow-hidden rounded-2xl border bg-muted/20">
                                            {companyBannerPreview ? (
                                                <div className="relative">
                                                    <img src={companyBannerPreview} alt="Прев'ю банера компанії" className="h-40 w-full object-cover" />
                                                    <div className="absolute inset-x-0 top-0 flex items-center justify-end p-2">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon-sm"
                                                            className="cursor-pointer shadow-sm"
                                                            aria-label="Видалити вибраний банер"
                                                            title="Видалити вибраний банер"
                                                            onClick={deleteCompanyBanner}
                                                            disabled={isDeletingBanner}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12">
                                                        <span className="truncate text-sm font-medium text-white">{companyBanner?.[0]?.name ?? "Поточний банер"}</span>
                                                        <label htmlFor="company-banner" className="shrink-0 cursor-pointer rounded-xl bg-white/90 px-3 py-1.5 text-sm font-medium text-black transition hover:bg-white">
                                                            Змінити
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label htmlFor="company-banner" className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 transition hover:border-primary/50 hover:bg-muted/30">
                                                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                                                        <ImageIcon className="size-5 text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">Додайте банер</p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG або WEBP</p>
                                                    </div>
                                                </label>
                                            )}
                                            <Input id="company-banner" type="file" accept="image/*" className="hidden" {...registerCompany("banner")} />
                                        </div>
                                    </div>

                                    {isUpdateCompanyError && <p className="text-sm text-destructive">Не вдалося оновити інформацію про компанію.</p>}
                                    {isDeleteIconError && <p className="text-sm text-destructive">Не вдалося видалити іконку компанії.</p>}
                                    {isDeleteBannerError && <p className="text-sm text-destructive">Не вдалося видалити банер компанії.</p>}

                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsCompanyEditDialogOpen(false)}>Скасувати</Button>
                                        <Button type="submit" disabled={isUpdatingCompany}>
                                            {isUpdatingCompany ? <Spinner /> : <Save />}
                                            {isUpdatingCompany ? "Збереження..." : "Зберегти"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <h2 className="text-xl font-semibold">Інформація про компанію</h2>

                    <div className="mt-6 space-y-4">
                        <div className="relative overflow-hidden rounded-[28px] border border-border bg-muted/30">
                            {company.bannerPath ? (
                                <img
                                    src={`${APP_ENV.API_IMAGE_LARGE_URL}${company.bannerPath}`}
                                    alt={`${company.name} banner`}
                                    className="h-40 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-40 w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                                    Немає банера
                                </div>
                            )}

                            <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-[22px] bg-background p-3 shadow-sm">
                                {company.iconPath ? (
                                    <img
                                        src={`${APP_ENV.API_IMAGE_LARGE_URL}${company.iconPath}`}
                                        alt={`${company.name} icon`}
                                        className="aspect-square h-20 w-20 p-2 object-contain"
                                    />
                                ) : (
                                    <div className="flex aspect-square h-20 w-20 items-center justify-center rounded-[18px] bg-muted text-[10px] text-muted-foreground">
                                        icon
                                    </div>
                                )}
                            </div>
                        </div>

                        <dl className="divide-y divide-border rounded-2xl bg-muted/20">
                            <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-sm text-muted-foreground">Назва</dt><dd className="font-medium">{company.name}</dd></div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-sm text-muted-foreground">Опис</dt><dd className="text-sm leading-6">{company.description}</dd></div>
                            <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-sm text-muted-foreground">ID компанії</dt><dd className="font-mono text-sm">{company.companyId ?? company.id}</dd></div>
                        </dl>
                    </div>
                </section>
            )}

            {activeSection === "branches" && (
                <section className="max-w-full rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 sm:size-12">
                                <Warehouse className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg font-semibold sm:text-xl">Філії компанії</h2>
                                <p className="text-sm text-muted-foreground">Додайте та переглядайте філії компанії.</p>
                            </div>
                        </span>

                        <Dialog onOpenChangeComplete={() => resetAffiliateForm()}>
                            <DialogTrigger render={<Button type="button" className="w-full sm:w-fit"><Plus /> Додати філію</Button>} />
                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                <DialogHeader className={"mt-1"}>
                                    <DialogTitle>Створення нової філії</DialogTitle>
                                    <DialogDescription> Введіть всі необхідні данні для того щоб створити нову філію </DialogDescription>
                                </DialogHeader>
                                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleAffiliateSubmit(addAffiliate)} noValidate>
                                    <div className="space-y-2"><label htmlFor="affiliate-phone" className="text-sm font-medium">Телефон</label><Input id="affiliate-phone" type="tel" {...registerAffiliate("phone", { required: "Вкажіть телефон" })} />{affiliateErrors.phone && <p className="text-sm text-destructive">{affiliateErrors.phone.message}</p>}</div>
                                    <div className="space-y-2"><label htmlFor="affiliate-email" className="text-sm font-medium">Email</label><Input id="affiliate-email" type="email" {...registerAffiliate("email", { required: "Вкажіть email" })} />{affiliateErrors.email && <p className="text-sm text-destructive">{affiliateErrors.email.message}</p>}</div>
                                    <div className="space-y-2"><label htmlFor="affiliate-location" className="text-sm font-medium">Населений пункт</label><Input id="affiliate-location" {...registerAffiliate("location", { required: "Вкажіть населений пункт" })} />{affiliateErrors.location && <p className="text-sm text-destructive">{affiliateErrors.location.message}</p>}</div>
                                    <div className="space-y-2"><label htmlFor="affiliate-region" className="text-sm font-medium">ID регіону</label><Input id="affiliate-region" type="number" min="0" {...registerAffiliate("regionId", { required: "Вкажіть ID регіону", min: { value: 0, message: "ID регіону не може бути від’ємним" } })} />{affiliateErrors.regionId && <p className="text-sm text-destructive">{affiliateErrors.regionId.message}</p>}</div>
                                    <div className="space-y-2 sm:col-span-2"><label htmlFor="affiliate-address" className="text-sm font-medium">Адреса</label><Input id="affiliate-address" {...registerAffiliate("address", { required: "Вкажіть адресу" })} />{affiliateErrors.address && <p className="text-sm text-destructive">{affiliateErrors.address.message}</p>}</div>
                                    <div className="space-y-2"><label htmlFor="affiliate-postal-index" className="text-sm font-medium">Поштовий індекс</label><Input id="affiliate-postal-index" {...registerAffiliate("postalIndex", { required: "Вкажіть поштовий індекс" })} />{affiliateErrors.postalIndex && <p className="text-sm text-destructive">{affiliateErrors.postalIndex.message}</p>}</div>
                                    <Button type="submit" className="sm:col-span-2 sm:w-fit ml-auto" disabled={isAddingAffiliate}>{isAddingAffiliate ? <Spinner /> : <Plus />}{isAddingAffiliate ? "Додавання..." : "Додати філію"}</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {isAddAffiliateError && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Не вдалося додати філію.</p>}

                    {isAffiliatesLoading ?
                        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-muted/40 p-5 text-sm text-muted-foreground">
                            <Spinner />Завантаження філій...
                        </div>
                        : isAffiliatesError ?
                            <p className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Не вдалося завантажити філії.</p>
                            : (affiliates?.affiliates.length ?? 0) > 0 ?
                                <div className={"flex flex-col gap-5 mt-5"}>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {affiliates?.affiliates.map((affiliate) => <AffiliateCard key={affiliate.id} affiliate={affiliate} />)}
                                    </div>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious text="Назад" onClick={() => setPage(page != 1 ? page - 1 : page)}/>
                                            </PaginationItem>

                                            {Array.from({ length: affiliates?.totalPages ?? 0 }, (_, i) => (
                                                <PaginationItem key={i + 1}>
                                                    <PaginationLink onClick={() => setPage(i+1)} isActive={page == i + 1}>
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext text="Вперед" onClick={() => setPage(page < (affiliates?.totalPages ?? 1000) ? page + 1 : page)}/>
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                                : <p className="mt-5 rounded-xl bg-muted/40 p-5 text-center text-sm text-muted-foreground">Філій ще немає.</p>}
                </section>
            )}

            {activeSection === "dishes" && (
                <section className="max-w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
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

                                        <AlertDialog>
                                            <AlertDialogTrigger
                                                render={
                                                    <Button type="button" variant="destructive" className="cursor-pointer" size="icon-sm" aria-label={`Видалити категорію ${category.name}`} title={`Видалити категорію ${category.name}`} disabled={isDeletingCategory || isEditingCategory}>
                                                        {deletingCategoryId === category.id ? <Spinner /> : <Trash2 />}
                                                    </Button>
                                                }
                                            />
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                                        <Trash2 />
                                                    </AlertDialogMedia>
                                                    <AlertDialogTitle>Видалити категорію {'"'}{category.name}{'"'}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Цю дію неможливо скасувати, категорія видаляється разом із всіма її товарами!
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteCategory(category.id, companyId ?? "")} variant="destructive">{deletingCategoryId === category.id ? <Spinner /> : "Видалити"}</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
