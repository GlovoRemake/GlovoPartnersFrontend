import type { IProduct } from "@/types/product/IProduct.ts";
import APP_ENV from "@/utils/env.ts";
import {Candy, Pencil, Trash2} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

import {useGetQuery as useGetAdditionals} from "@/services/apiProductAdditional.ts";
import CreateProductAdditionalModal from "@/components/moduls/CreateProductAdditionalModal.tsx";
import UpdateProductAdditionalRow from "../moduls/UpdateProductAdditionalRow";

type ProductCardProps = {
    product: IProduct;
    onEdit: (product: IProduct) => void;
    onDelete: (productId: number) => void;
    isDeleting?: boolean;
    companyId: string;
};

const ProductCard = ({ product, onEdit, onDelete, isDeleting = false, companyId }: ProductCardProps) => {
    const {data: additionals, isLoading} = useGetAdditionals({
        productId: product.id,
        companyId: companyId
    });

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
                    <Dialog>
                        <DialogTrigger render={
                            <Button type="button" className="cursor-pointer w-fit px-2 flex gap-1" variant="outline" size="icon-sm" aria-label={`Додатки`} title="Додатки">
                                <Candy /> Додатки
                            </Button>
                        } />
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader className={"mt-1"}>
                                <DialogTitle>Додатки товару {product.name}</DialogTitle>
                                <DialogDescription>Відредагуйте додатки які необхідно</DialogDescription>
                            </DialogHeader>

                            {isLoading ? (
                                <>
                                    <div className="p-4 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                                        <Spinner /> Завантаження додатків
                                    </div>
                                </>
                            ) : (
                                <>
                                    {additionals?.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                                            <p>Товар ще немає додатків</p>

                                            <CreateProductAdditionalModal companyId={companyId} productId={product.id}/>
                                        </div>
                                    ) : (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Назва</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {additionals?.map((additional) => (
                                                        <UpdateProductAdditionalRow
                                                            key={additional.id}
                                                            additional={additional}
                                                            companyId={companyId ?? ""}
                                                            additionalId={additional.id}
                                                        />
                                                    ))}
                                                </TableBody>
                                            </Table>

                                            <div className={"flex w-full justify-end"}>
                                                <CreateProductAdditionalModal companyId={companyId} productId={product.id}/>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Button type="button" className="cursor-pointer" variant="outline" size="icon-sm" aria-label={`Редагувати ${product.name}`} title="Редагувати" onClick={() => onEdit(product)} disabled={isDeleting}>
                        <Pencil />
                    </Button>
                    <Button type="button" variant="destructive" className="cursor-pointer" size="icon-sm" aria-label={`Видалити ${product.name}`} title="Видалити" onClick={() => onDelete(product.id)} disabled={isDeleting}>
                        {isDeleting ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Trash2 />}
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
