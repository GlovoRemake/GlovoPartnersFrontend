import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import ProductCard from "@/components/product/ProductCard.tsx";
import { useGetQuery, useAddMutation, useDeleteMutation, useUpdateMutation } from "@/services/apiCompanyProduct.ts";
import { WeightType } from "@/enums/WeightType.ts";
import type { ICreateProduct } from "@/types/product/ICreateProduct.ts";
import type { IProduct } from "@/types/product/IProduct.ts";
import {ArrowLeft, ImageIcon, Pencil, Plus, ShoppingBag} from "lucide-react";
import {useEffect, useState} from "react";
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
import APP_ENV from "@/utils/env.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue} from "@/components/ui/select";
import {SelectTrigger} from "@/components/ui/select.tsx";

type ProductForm = Omit<ICreateProduct, "image" | "price" | "categoryId" | "companyId" | "weight" | "kcal" | "weightType"> & {
    image?: FileList;
    price: string;
    weight: string;
    kcal: string;
    weightType: string;
};

const CategoryProductsDashboard = () => {
    const { companyId, categoryId } = useParams<{ companyId: string; categoryId: string }>();
    const parsedCategoryId = Number(categoryId);
    const { data: products = [], isLoading, isError, refetch } = useGetQuery(
        { companyId: companyId ?? "", categoryId: parsedCategoryId },
        { skip: !companyId || !categoryId || Number.isNaN(parsedCategoryId) },
    );
    const [addProduct, { isLoading: isAdding }] = useAddMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateMutation();
    const [deleteProduct, { isError: isDeleteError }] = useDeleteMutation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors }, setValues, setValue, watch } = useForm<ProductForm>();

    const image = watch("image");
    const [imagePreview, setImagePreview] = useState<string | null>(
        editingProduct?.imagePath ? `${APP_ENV.API_IMAGE_EXTRA_LARGE_URL}${editingProduct?.imagePath}` : null
    );

    useEffect(() => {
        if (!image?.[0]) {
            setImagePreview(editingProduct?.imagePath ? `${APP_ENV.API_IMAGE_EXTRA_LARGE_URL}${editingProduct?.imagePath}` : null);
            return;
        }

        const url = URL.createObjectURL(image[0]);
        setImagePreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image, editingProduct]);



    const onSubmit = async (form: ProductForm) => {
        if (!companyId || Number.isNaN(parsedCategoryId) || (!editingProduct && !form.image?.[0])) return;
        try {
            const productData = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                categoryId: parsedCategoryId,
                companyId,
                ...(form.weight ? { weight: Number(form.weight) } : {}),
                ...(form.kcal ? { kcal: Number(form.kcal) } : {}),
                ...(form.weightType ? { weightType: Number(form.weightType) as WeightType } : {}),
            };
            if (editingProduct) {
                await updateProduct({ ...productData, productId: editingProduct.id, image: form.image?.[0] ?? null }).unwrap();
            } else {
                await addProduct({ ...productData, image: form.image![0] }).unwrap();
            }
            reset();
            setEditingProduct(null);
            setIsFormOpen(false);
            await refetch();
        } catch {
            return;
        }
    };

    const startEditingProduct = (product: IProduct) => {
        setEditingProduct(product);
        setIsFormOpen(true);
        setValues({
            name: product.name,
            description: product.description,
            price: String(product.price),
            weight: product.weight === undefined ? "" : String(product.weight),
            kcal: product.kcal === undefined ? "" : String(product.kcal),
            weightType: product.weightType === undefined ? "" : String(product.weightType),
        });
    };

    const toggleProductForm = () => {
        if (isFormOpen) {
            reset();
            setEditingProduct(null);
            setIsFormOpen(false);
        } else {
            setIsFormOpen(true);
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!companyId) return;
        setDeletingProductId(productId);
        try {
            await deleteProduct({ companyId, productId }).unwrap();
            await refetch();
        } catch {
            return;
        } finally {
            setDeletingProductId(null);
        }
    };

    if (isLoading) {
        return <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4"><Spinner className="size-5" /></main>;
    }

    if (isError) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-300 items-center justify-center px-4">
                <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold">Не вдалося завантажити товари</h1>
                    <Button className="mt-5" onClick={() => refetch()}>Спробувати ще раз</Button>
                </section>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-300 px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Button variant="ghost" className="mb-5 px-0" onClick={() => navigate(`/dashboard/companies/${companyId}`)}><ArrowLeft />Назад до компанії</Button>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Категорія товарів</p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Товари категорії</h1>
                </div>


                <Dialog open={isFormOpen} onOpenChange={toggleProductForm}>
                    <DialogTrigger render={<Button type="button" className="w-full sm:w-fit"><Plus /> Додати продукт</Button>} />
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader className={"mt-1"}>
                            <DialogTitle>{editingProduct ? "Редагування" : "Створення"} товару</DialogTitle>
                            <DialogDescription>Заповніть необхідні {editingProduct ? "які потрібно змінити" : "для стоворення товару"}</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="space-y-2"><label htmlFor="product-name" className="text-sm font-medium">Назва</label><Input id="product-name" {...register("name", { required: "Вкажіть назву" })} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
                            <div className="space-y-2"><label htmlFor="product-price" className="text-sm font-medium">Ціна</label><Input id="product-price" type="number" step="0.01" min="0" {...register("price", { required: "Вкажіть ціну", min: { value: 0, message: "Ціна не може бути від’ємною" } })} />{errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}</div>
                            <div className="space-y-2 col-span-2"><label htmlFor="product-description" className="text-sm font-medium">Опис</label><Textarea id="product-description" className="min-h-24" {...register("description", { required: "Вкажіть опис" })} />{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}</div>
                            <div className="space-y-2 col-span-2">
                                <label htmlFor="product-image" className="text-sm font-medium">
                                    Зображення
                                </label>

                                <div className="relative overflow-hidden rounded-2xl border bg-muted/20">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Прев'ю зображення"
                                                className="h-48 w-full object-cover"
                                            />

                                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12">
                                                <span className="truncate text-sm font-medium text-white">
                                                    {image?.[0]?.name ?? "Поточне зображення"}
                                                </span>

                                                <label
                                                    htmlFor="product-image"
                                                    className="shrink-0 cursor-pointer rounded-xl bg-white/90 px-3 py-1.5 text-sm font-medium text-black transition hover:bg-white"
                                                >
                                                    Змінити
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="product-image"
                                            className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 transition hover:border-primary/50 hover:bg-muted/30"
                                        >
                                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                                                <ImageIcon className="size-5 text-primary" />
                                            </div>

                                            <div className="text-center">
                                                <p className="text-sm font-medium">Додайте зображення</p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG або WEBP
                                                </p>
                                            </div>
                                        </label>
                                    )}

                                    <Input
                                        id="product-image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register("image", {
                                            required: editingProduct ? false : "Додайте зображення",
                                        })}
                                    />
                                </div>

                                {errors.image && (
                                    <p className="text-sm text-destructive">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2"><label htmlFor="product-kcal" className="text-sm font-medium">Калорійність, ккал</label><Input id="product-kcal" type="number" min="0" {...register("kcal")} /></div>
                            <div className="space-y-2"><label htmlFor="product-weight" className="text-sm font-medium">Вага / об’єм</label><Input id="product-weight" type="number" min="0" {...register("weight")} /></div>
                            <div className="space-y-2"><label htmlFor="product-weight-type" className="text-sm font-medium">Тип ваги</label>
                                <Select
                                    value={watch("weightType") !== undefined && watch("weightType") !== "null"
                                        ? String(watch("weightType"))
                                        : ""}
                                    onValueChange={(value) =>
                                        setValue(
                                            "weightType",
                                            value === "" ? "" : value ?? ""
                                        )
                                    }
                                    items={[
                                        { label: "Не вказано", value: "" },
                                        { label: "Грами", value: String(WeightType.GRAMS) },
                                        { label: "Мілілітри", value: String(WeightType.MILLILITERS) },
                                    ]}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Тип ваги</SelectLabel>
                                            <SelectItem value="">
                                                Не вказано
                                            </SelectItem>
                                            <SelectItem value={String(WeightType.GRAMS)}>
                                                Грами
                                            </SelectItem>
                                            <SelectItem value={String(WeightType.MILLILITERS)}>
                                                Мілілітри
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className={"flex gap-1 col-span-2 justify-end"}>
                                <Button type="button" variant={"secondary"} className="sm:col-span-2 sm:w-fit cursor-pointer" disabled={isAdding || isUpdating} onClick={toggleProductForm}>Скасувати</Button>
                                <Button type="submit" className="sm:col-span-2 sm:w-fit cursor-pointer" disabled={isAdding || isUpdating}>{isAdding || isUpdating ? <Spinner /> : editingProduct ? <Pencil /> : <Plus />}{isAdding || isUpdating ? "Збереження..." : editingProduct ? "Зберегти зміни" : "Додати продукт"}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isDeleteError && <p className="mb-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Не вдалося видалити продукт. Спробуйте ще раз.</p>}
            {products.length === 0 ? <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground"><ShoppingBag className="mx-auto mb-3 size-8" />У цій категорії ще немає товарів.</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard companyId={companyId ?? ""} key={product.id} product={product} onEdit={startEditingProduct} onDelete={handleDeleteProduct} isDeleting={deletingProductId === product.id} />)}</div>}
        </main>
    );
};

export default CategoryProductsDashboard;
