import type { IAffiliate } from "@/types/company/affiliate/IAffiliate.ts";
import { Mail, Phone } from "lucide-react";

type AffiliateCardProps = {
    affiliate: IAffiliate;
};

const AffiliateCard = ({ affiliate }: AffiliateCardProps) => {
    return (
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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
    );
};

export default AffiliateCard;
