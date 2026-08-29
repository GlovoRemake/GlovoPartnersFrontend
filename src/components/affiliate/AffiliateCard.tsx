import type { IAffiliate } from "@/types/company/affiliate/IAffiliate.ts";
import {Mail, Phone, Pen, UserStar} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useForm} from "react-hook-form";
import type {IUpdateAffiliate} from "@/types/company/affiliate/IUpdateAffiliate.ts";
import {useUpdateMutation as useUpdateAffiliateMutation} from "@/services/apiAffiliate.ts";
import {useRef} from "react";
import type {DialogRootActions} from "@base-ui/react";

type AffiliateCardProps = {
    affiliate: IAffiliate;
};
const AffiliateCard = ({ affiliate }: AffiliateCardProps) => {
    const modalRef = useRef<DialogRootActions>(null);

    const [updateAffiliateRequest, {isLoading: isUpdating}] = useUpdateAffiliateMutation();

    const { register: registerAffiliate, handleSubmit: handleAffiliateSubmit, reset: resetAffiliate, formState: { errors: affiliateErrors } } = useForm<IUpdateAffiliate>(
        {
            values: {
                phone: affiliate.phone,
                email: affiliate.email
            }
        }
    );

    const updateAffiliate = async (data: IUpdateAffiliate) => {
        try {
            await updateAffiliateRequest({
                affiliateId: affiliate.id,
                body: data
            }).unwrap();

            modalRef.current?.close();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog onOpenChangeComplete={() => resetAffiliate()} actionsRef={modalRef}>
            <DialogTrigger render={
                <article className="rounded-2xl border border-border bg-card p-5 shadow-sm cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Філія</p>
                            <h3 className="mt-1 text-lg font-semibold">Філія #{affiliate.id}</h3>
                        </div>
                        <Phone className="size-5 text-primary" />
                    </div>
                    <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Phone className="size-4 shrink-0" />{affiliate.phone}</div>
                        <div className="flex items-center gap-2"><Mail className="size-4 shrink-0" /><span className="break-all">{affiliate.email}</span></div>
                    </div>
                </article>
            } />
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className={"mt-1"}>
                    <DialogTitle>Філія #{affiliate.id}</DialogTitle>
                    <DialogDescription>Можете відредагувати деяку інформацію або перейти в керування філії</DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleAffiliateSubmit(updateAffiliate)} noValidate>
                    <div className="space-y-2"><label htmlFor="affiliate-phone" className="text-sm font-medium">Телефон</label><Input id="affiliate-phone" type="tel" {...registerAffiliate("phone", { required: "Вкажіть телефон" })} />{affiliateErrors.phone && <p className="text-sm text-destructive">{affiliateErrors.phone.message}</p>}</div>
                    <div className="space-y-2"><label htmlFor="affiliate-email" className="text-sm font-medium">Email</label><Input id="affiliate-email" type="email" {...registerAffiliate("email", { required: "Вкажіть email" })} />{affiliateErrors.email && <p className="text-sm text-destructive">{affiliateErrors.email.message}</p>}</div>
                    <div className={"flex justify-end gap-2 w-full col-span-2"}>
                        <Button type="button" variant={"secondary"} className="cursor-pointer" disabled={isUpdating}><UserStar /> Керування філією</Button>
                        <Button type="submit" className="cursor-pointer" disabled={isUpdating}>{isUpdating ? <Spinner /> : <Pen />}{isUpdating ? "Збереження..." : "Зберегти"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AffiliateCard;
