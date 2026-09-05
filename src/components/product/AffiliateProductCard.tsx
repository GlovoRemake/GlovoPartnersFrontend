import type { IProduct } from "@/types/product/IProduct.ts";
import APP_ENV from "@/utils/env.ts";
import { Switch } from "@/components/ui/switch.tsx";

type ProductCardProps = {
    product: IProduct;
    isEnabled: boolean;
    onToggle: (checked: boolean) => void;
    isUpdating?: boolean;
};

const ProductCard = ({
                         product,
                         isEnabled,
                         onToggle,
                         isUpdating = false,
                     }: ProductCardProps) => {
    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="aspect-video bg-muted">
                {product.imagePath && (
                    <img
                        src={`${APP_ENV.API_IMAGE_LARGE_URL}${product.imagePath}`}
                        alt={product.name}
                        className="size-full object-cover"
                    />
                )}
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold">
                        {product.name}
                    </h2>

                    <span className="font-medium">
                        {product.price.toFixed(2)} грн
                    </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                    {product.description}
                </p>

                <div className="mt-5 flex justify-end">
                    <Switch
                        disabled={isUpdating}
                        checked={isEnabled}
                        onCheckedChange={onToggle}
                    />
                </div>
            </div>
        </article>
    );
};

export default ProductCard;