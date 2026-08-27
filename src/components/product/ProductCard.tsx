import type { IProduct } from "@/types/product/IProduct.ts";
import APP_ENV from "@/utils/env.ts";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type ProductCardProps = {
    product: IProduct;
    onEdit: (product: IProduct) => void;
    onDelete: (productId: number) => void;
    isDeleting?: boolean;
};

const ProductCard = ({ product, onEdit, onDelete, isDeleting = false }: ProductCardProps) => {
    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="aspect-video bg-muted">
                {product.imagePath && (
                    <img src={`${APP_ENV.API_IMAGE_LARGE_URL}${product.imagePath}`} alt={product.name} className="size-full object-cover" />
                )}
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold">{product.name}</h2>
                    <span className="font-medium">{product.price.toFixed(2)} грн</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-5 flex justify-end gap-2">
                    <Button type="button" variant="outline" size="icon-sm" aria-label={`Редагувати ${product.name}`} title="Редагувати" onClick={() => onEdit(product)} disabled={isDeleting}>
                        <Pencil />
                    </Button>
                    <Button type="button" variant="destructive" size="icon-sm" aria-label={`Видалити ${product.name}`} title="Видалити" onClick={() => onDelete(product.id)} disabled={isDeleting}>
                        {isDeleting ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Trash2 />}
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
