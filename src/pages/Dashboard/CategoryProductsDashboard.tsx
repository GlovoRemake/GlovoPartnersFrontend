import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import ProductCard from "@/components/product/ProductCard.tsx";
import { useGetQuery, useAddMutation, useDeleteMutation, useUpdateMutation } from "@/services/apiCompanyProduct.ts";
import { WeightType } from "@/enums/WeightType.ts";
import type { ICreateProduct } from "@/types/product/ICreateProduct.ts";
import type { IProduct } from "@/types/product/IProduct.ts";
import { ArrowLeft, ImagePlus, Pencil, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

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
    const [addProduct, { isLoading: isAdding, isError: isAddError }] = useAddMutation();
    const [updateProduct, { isLoading: isUpdating, isError: isUpdateError }] = useUpdateMutation();
    const [deleteProduct, { isError: isDeleteError }] = useDeleteMutation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();

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
        reset({
            name: product.name,
            description: product.description,
            price: String(product.price),
            weight: product.weight === undefined ? "" : String(product.weight),
            kcal: product.kcal === undefined ? "" : String(product.kcal),
            weightType: product.weightType === undefined ? "" : String(product.weightType),
        });
    };

    const closeProductForm = () => {
        reset();
        setEditingProduct(null);
        setIsFormOpen(false);
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
                <Button className="cursor-pointer" onClick={() => (isFormOpen ? closeProductForm() : setIsFormOpen(true))}>
                    {isFormOpen ? <X /> : <Plus />}
                    {isFormOpen ? "Скасувати" : "Додати продукт"}
                </Button>
            </div>

            {isFormOpen && (
                <section className="mb-6 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-3">{editingProduct ? <Pencil className="size-5" /> : <ImagePlus className="size-5" />}<h2 className="text-xl font-semibold">{editingProduct ? "Редагування продукту" : "Новий продукт"}</h2></div>
                    {isAddError && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Не вдалося додати продукт.</p>}
                    {isUpdateError && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Не вдалося оновити продукт.</p>}
                    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="space-y-2"><label htmlFor="product-name" className="text-sm font-medium">Назва</label><Input id="product-name" {...register("name", { required: "Вкажіть назву" })} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
                        <div className="space-y-2"><label htmlFor="product-price" className="text-sm font-medium">Ціна</label><Input id="product-price" type="number" step="0.01" min="0" {...register("price", { required: "Вкажіть ціну", min: { value: 0, message: "Ціна не може бути від’ємною" } })} />{errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}</div>
                        <div className="space-y-2 sm:col-span-2"><label htmlFor="product-description" className="text-sm font-medium">Опис</label><Textarea id="product-description" className="min-h-24" {...register("description", { required: "Вкажіть опис" })} />{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}</div>
                        <div className="space-y-2"><label htmlFor="product-image" className="text-sm font-medium">Зображення{editingProduct ? " (необов’язково)" : ""}</label><Input id="product-image" type="file" accept="image/*" {...register("image", { required: editingProduct ? false : "Додайте зображення" })} />{errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}</div>
                        <div className="space-y-2"><label htmlFor="product-kcal" className="text-sm font-medium">Калорійність, ккал</label><Input id="product-kcal" type="number" min="0" {...register("kcal")} /></div>
                        <div className="space-y-2"><label htmlFor="product-weight" className="text-sm font-medium">Вага / об’єм</label><Input id="product-weight" type="number" min="0" {...register("weight")} /></div>
                        <div className="space-y-2"><label htmlFor="product-weight-type" className="text-sm font-medium">Тип ваги</label><select id="product-weight-type" className="h-8 w-full rounded-2xl border border-transparent bg-input/50 px-2.5 text-sm" {...register("weightType")}><option value="">Не вказано</option><option value={WeightType.GRAMS}>Грами</option><option value={WeightType.MILLILITERS}>Мілілітри</option></select></div>
                        <Button type="submit" className="sm:col-span-2 sm:w-fit cursor-pointer" disabled={isAdding || isUpdating}>{isAdding || isUpdating ? <Spinner /> : editingProduct ? <Pencil /> : <Plus />}{isAdding || isUpdating ? "Збереження..." : editingProduct ? "Зберегти зміни" : "Додати продукт"}</Button>
                    </form>
                </section>
            )}

            {isDeleteError && <p className="mb-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Не вдалося видалити продукт. Спробуйте ще раз.</p>}
            {products.length === 0 ? <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground"><ShoppingBag className="mx-auto mb-3 size-8" />У цій категорії ще немає товарів.</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} onEdit={startEditingProduct} onDelete={handleDeleteProduct} isDeleting={deletingProductId === product.id} />)}</div>}
        </main>
    );
};

export default CategoryProductsDashboard;
